<?php

use App\Models\Opd;
use App\Models\SubElement;
use App\Models\Indicator;
use App\Models\SpipAssessment;
use App\Models\AuditScoreLog;
use Livewire\Component;

new class extends Component
{
    public int $fiscalYear = 2026;
    public string $subElementCode = '1.1';
    public string $targetObjective = 'T1';
    public ?int $selectedOpdId = null;

    public array $formStates = []; // keyed by assessment_id
    public array $successMessages = []; // keyed by assessment_id
    public array $errorMessages = []; // keyed by assessment_id

    public function mount()
    {
        // Enforce role protection
        $user = auth()->user();
        if (!$user || $user->isOpd()) {
            abort(403, 'Unauthorized access to Score Verification Portal.');
        }

        // Default to first active OPD
        $firstOpd = Opd::where('code_opd', '!=', 'OPD_PEMDA')->first();
        $this->selectedOpdId = $firstOpd ? $firstOpd->id : null;

        $this->loadAssessments();
    }

    public function updatedSubElementCode()
    {
        $this->loadAssessments();
    }

    public function updatedTargetObjective()
    {
        $this->loadAssessments();
    }

    public function updatedSelectedOpdId()
    {
        $this->loadAssessments();
    }

    public function loadAssessments()
    {
        $this->formStates = [];
        $this->successMessages = [];
        $this->errorMessages = [];

        if (!$this->selectedOpdId) return;

        $subElement = SubElement::where('code', $this->subElementCode)->first();
        if (!$subElement) return;

        $indicators = Indicator::where('sub_element_id', $subElement->id)->get();
        $isSubElementKk3 = str_starts_with($this->subElementCode, '1.') || 
                           str_starts_with($this->subElementCode, '2.') || 
                           str_starts_with($this->subElementCode, '3.') || 
                           str_starts_with($this->subElementCode, '4.') || 
                           str_starts_with($this->subElementCode, '5.');

        $obj = $isSubElementKk3 ? $this->targetObjective : null;

        foreach ($indicators as $ind) {
            // Find or create assessment to ensure verifiers can adjust even if OPD hasn't filled it out
            $assess = SpipAssessment::firstOrCreate(
                [
                    'opd_id' => $this->selectedOpdId,
                    'indicator_id' => $ind->id,
                    'fiscal_year' => $this->fiscalYear,
                    'target_objective' => $obj,
                ],
                [
                    'status_flow' => 'OPD_DRAFT'
                ]
            );

            $this->formStates[$assess->id] = [
                'grade_self' => $assess->grade_self_opd ?? '',
                'grade_bappeda' => $assess->grade_bappeda_verified ?? '',
                'grade_inspektorat' => $assess->grade_final_inspektorat ?? '',
                'notes_bappeda' => $assess->notes_bappeda ?? '',
                'notes_inspektorat' => $assess->notes_inspektorat ?? '',
                'justification_notes' => '',
                'status_flow' => $assess->status_flow
            ];
        }
    }

    public function saveAdjustment(int $assessmentId)
    {
        $this->successMessages = [];
        $this->errorMessages = [];

        $user = auth()->user();
        $state = $this->formStates[$assessmentId];
        $assessment = SpipAssessment::findOrFail($assessmentId);

        // State check: cannot edit if locked
        if ($assessment->status_flow === 'FINAL_LOCKED') {
            $this->errorMessages[$assessmentId] = 'Kertas kerja untuk periode ini sudah dikunci (FINAL_LOCKED).';
            return;
        }

        // Justification verification
        $justification = trim($state['justification_notes']);
        if (empty($justification)) {
            $this->errorMessages[$assessmentId] = 'Catatan pertanggungjawaban (justifikasi) wajib diisi untuk melakukan penyesuaian nilai.';
            return;
        }

        $oldVal = null;
        $newVal = null;
        $colModified = '';

        if ($user->isBappeda() || $user->isAdmin()) {
            // Bappeda adjust
            $oldVal = $assessment->grade_bappeda_verified;
            $newVal = $state['grade_bappeda'] ?: null;
            $colModified = 'grade_bappeda_verified';

            $assessment->update([
                'grade_bappeda_verified' => $newVal,
                'notes_bappeda' => $state['notes_bappeda'] ?: null,
                'bappeda_verified_at' => now(),
                'status_flow' => 'BAPPEDA_PROCESS'
            ]);
        }

        if ($user->isInspektorat() || $user->isAdmin()) {
            // Inspektorat QA adjust
            $oldVal = $assessment->grade_final_inspektorat;
            $newVal = $state['grade_inspektorat'] ?: null;
            $colModified = 'grade_final_inspektorat';

            $assessment->update([
                'grade_final_inspektorat' => $newVal,
                'notes_inspektorat' => $state['notes_inspektorat'] ?: null,
                'inspektorat_audited_at' => now(),
                'status_flow' => 'INSPEKTORAT_QA'
            ]);
        }

        // Save to Immutable Audit Logs
        AuditScoreLog::create([
            'assessment_id' => $assessmentId,
            'changed_by_user_id' => $user->id,
            'user_role' => $user->role,
            'column_modified' => $colModified,
            'old_value' => $oldVal,
            'new_value' => $newVal,
            'justification_notes' => $justification
        ]);

        $this->successMessages[$assessmentId] = 'Penyesuaian nilai berhasil disimpan & dicatat di audit log.';
        $this->formStates[$assessmentId]['justification_notes'] = ''; // clear justification
        
        $this->loadAssessments();
    }

    public function lockAssessmentPeriod()
    {
        // Enforce Inspektorat / Admin only
        if (!auth()->user()->isInspektorat() && !auth()->user()->isAdmin()) {
            session()->flash('global_error', 'Hanya Inspektorat atau Admin yang dapat mengunci periode.');
            return;
        }

        $subElement = SubElement::where('code', $this->subElementCode)->first();
        if (!$subElement) return;

        $indicators = Indicator::where('sub_element_id', $subElement->id)->get();
        $isSubElementKk3 = str_starts_with($this->subElementCode, '1.') || 
                           str_starts_with($this->subElementCode, '2.') || 
                           str_starts_with($this->subElementCode, '3.') || 
                           str_starts_with($this->subElementCode, '4.') || 
                           str_starts_with($this->subElementCode, '5.');

        $obj = $isSubElementKk3 ? $this->targetObjective : null;

        SpipAssessment::where('opd_id', $this->selectedOpdId)
            ->where('fiscal_year', $this->fiscalYear)
            ->whereIn('indicator_id', $indicators->pluck('id'))
            ->where('target_objective', $obj)
            ->update([
                'status_flow' => 'FINAL_LOCKED'
            ]);

        $this->loadAssessments();
        session()->flash('global_success', 'Seluruh penilaian unsur ini berhasil dikunci permanen (FINAL_LOCKED).');
    }
};
?>

<div class="space-y-6">
    <!-- Filter Grid -->
    <div class="bg-slate-900/40 border border-slate-800/40 p-6 rounded-3xl backdrop-blur-md grid grid-cols-1 md:grid-cols-4 gap-6 items-end shadow-xl">
        <!-- OPD Selector -->
        <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Departemen (OPD)</label>
            <select wire:model.live="selectedOpdId" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
                @foreach(App\Models\Opd::where('code_opd', '!=', 'OPD_PEMDA')->get() as $opd)
                    <option value="{{ $opd->id }}">{{ $opd->name_opd }}</option>
                @endforeach
            </select>
        </div>

        <!-- Sub-element filter -->
        <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Unsur / Sub-Unsur SPIP</label>
            <select wire:model.live="subElementCode" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
                @foreach(App\Models\SubElement::where('type', 'SPIP')->get() as $sub)
                    <option value="{{ $sub->code }}">{{ $sub->code }} - {{ $sub->name }}</option>
                @endforeach
            </select>
        </div>

        <!-- Target Objective -->
        @if(str_starts_with($subElementCode, '1.') || str_starts_with($subElementCode, '2.') || str_starts_with($subElementCode, '3.') || str_starts_with($subElementCode, '4.') || str_starts_with($subElementCode, '5.'))
            <div>
                <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tujuan Pengujian (Objective)</label>
                <select wire:model.live="targetObjective" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="T1">T1 - Efektivitas & Efisiensi Pencapaian Tujuan</option>
                    <option value="T2">T2 - Keandalan Pelaporan Keuangan</option>
                    <option value="T3">T3 - Pengamanan Aset Negara/Daerah</option>
                    <option value="T4">T4 - Ketaatan pada Peraturan Perundang-undangan</option>
                </select>
            </div>
        @endif

        <!-- Action / Lock Period -->
        <div class="flex justify-end">
            @if(auth()->user()->isInspektorat() || auth()->user()->isAdmin())
                <button onclick="confirm('Kunci permanen seluruh penilaian unsur ini untuk OPD terpilih? Data tidak akan bisa diubah kembali.') || event.stopImmediatePropagation()" wire:click="lockAssessmentPeriod" class="w-full md:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-rose-500/20">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    <span>Kunci Kertas Kerja</span>
                </button>
            @endif
        </div>
    </div>

    @if(session()->has('global_success'))
        <div class="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 rounded-2xl">
            {{ session('global_success') }}
        </div>
    @endif
    @if(session()->has('global_error'))
        <div class="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs px-4 py-3 rounded-2xl">
            {{ session('global_error') }}
        </div>
    @endif

    <!-- Score Verification Portal Grid -->
    <div class="bg-slate-900/40 border border-slate-800/40 rounded-3xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse min-w-[1200px]">
                <thead>
                    <tr class="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold sticky top-0">
                        <th class="py-4 px-4 w-12 text-center">No</th>
                        <th class="py-4 px-4 w-1/4">Parameter Pengujian</th>
                        <th class="py-4 px-4">Penilaian Mandiri (OPD)</th>
                        <th class="py-4 px-4">Verifikasi (Bappeda)</th>
                        <th class="py-4 px-4">Penilaian Final (Inspektorat)</th>
                        <th class="py-4 px-4 w-16 text-center">Deviasi</th>
                        <th class="py-4 px-4 w-28 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/40">
                    @php
                        $sub = App\Models\SubElement::where('code', $subElementCode)->first();
                        $indicators = $sub ? App\Models\Indicator::where('sub_element_id', $sub->id)->get() : collect();
                        $isSubElementKk3 = str_starts_with($subElementCode, '1.') || 
                                           str_starts_with($subElementCode, '2.') || 
                                           str_starts_with($subElementCode, '3.') || 
                                           str_starts_with($subElementCode, '4.') || 
                                           str_starts_with($subElementCode, '5.');
                        $obj = $isSubElementKk3 ? $targetObjective : null;
                    @endphp

                    @if($indicators->isEmpty())
                        <tr>
                            <td colspan="7" class="py-12 text-center text-slate-500">Tidak ada indikator untuk unsur ini.</td>
                        </tr>
                    @else
                        @foreach($indicators as $ind)
                            @php
                                $assess = App\Models\SpipAssessment::where('opd_id', $selectedOpdId)
                                    ->where('indicator_id', $ind->id)
                                    ->where('fiscal_year', $fiscalYear)
                                    ->where('target_objective', $obj)
                                    ->first();
                                $assessId = $assess ? $assess->id : 0;
                            @endphp
                            
                            @if($assessId && isset($formStates[$assessId]))
                                <tr class="hover:bg-slate-900/20 transition-all duration-300 align-top">
                                    <!-- No -->
                                    <td class="py-4 px-4 text-center font-bold text-slate-400">{{ $ind->indicator_number }}</td>
                                    
                                    <!-- Parameter Description -->
                                    <td class="py-4 px-4 text-slate-200 font-medium leading-relaxed">
                                        {{ $ind->indicator_name }}
                                        <div class="mt-2 text-[10px] text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/30">
                                            <strong>Bukti Link OPD:</strong>
                                            @if($assess->evidence_url)
                                                <a href="{{ $assess->evidence_url }}" target="_blank" class="text-brand-400 hover:underline block break-all mt-0.5">{{ $assess->evidence_url }}</a>
                                            @else
                                                <span class="text-slate-500 italic block mt-0.5">Tidak ada bukti diupload</span>
                                            @endif
                                        </div>
                                    </td>
                                    
                                    <!-- 1. Score Self OPD (Read only) -->
                                    <td class="py-4 px-4 space-y-2">
                                        <span class="px-2.5 py-1 rounded bg-slate-800 border border-slate-700/60 font-bold text-slate-300 text-xs">
                                            Grade {{ $formStates[$assessId]['grade_self'] ?: '-' }}
                                        </span>
                                        <div class="text-[10px] text-slate-400 leading-relaxed bg-slate-950/20 p-2 rounded-lg mt-1.5">
                                            <strong>Keterangan OPD:</strong> {{ $assess->notes_opd ?: 'Tidak ada catatan' }}
                                        </div>
                                    </td>
                                    
                                    <!-- 2. Score Verified Bappeda -->
                                    <td class="py-4 px-4 space-y-2">
                                        <select wire:model="formStates.{{ $assessId }}.grade_bappeda" @disabled(!auth()->user()->isBappeda() && !auth()->user()->isAdmin() || $formStates[$assessId]['status_flow'] === 'FINAL_LOCKED') class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500">
                                            <option value="">-- VERIFIED --</option>
                                            <option value="A">Grade A</option>
                                            <option value="B">Grade B</option>
                                            <option value="C">Grade C</option>
                                            <option value="D">Grade D</option>
                                            <option value="E">Grade E</option>
                                        </select>
                                        <textarea wire:model="formStates.{{ $assessId }}.notes_bappeda" @disabled(!auth()->user()->isBappeda() && !auth()->user()->isAdmin() || $formStates[$assessId]['status_flow'] === 'FINAL_LOCKED') rows="2" placeholder="Uraian verifikasi..." class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-[10px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 mt-1.5"></textarea>
                                    </td>
                                    
                                    <!-- 3. Score Final Inspektorat -->
                                    <td class="py-4 px-4 space-y-2">
                                        <select wire:model="formStates.{{ $assessId }}.grade_inspektorat" @disabled(!auth()->user()->isInspektorat() && !auth()->user()->isAdmin() || $formStates[$assessId]['status_flow'] === 'FINAL_LOCKED') class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500">
                                            <option value="">-- FINAL QA --</option>
                                            <option value="A">Grade A</option>
                                            <option value="B">Grade B</option>
                                            <option value="C">Grade C</option>
                                            <option value="D">Grade D</option>
                                            <option value="E">Grade E</option>
                                        </select>
                                        <textarea wire:model="formStates.{{ $assessId }}.notes_inspektorat" @disabled(!auth()->user()->isInspektorat() && !auth()->user()->isAdmin() || $formStates[$assessId]['status_flow'] === 'FINAL_LOCKED') rows="2" placeholder="Uraian QA audit..." class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-[10px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 mt-1.5"></textarea>
                                    </td>
                                    
                                    <!-- Deviation -->
                                    <td class="py-4 px-4 text-center">
                                        @php
                                            $selfScore = App\Models\SpipAssessment::gradeToScore($formStates[$assessId]['grade_self']);
                                            $final = $formStates[$assessId]['grade_inspektorat'] ?: ($formStates[$assessId]['grade_bappeda'] ?: $formStates[$assessId]['grade_self']);
                                            $finalScore = App\Models\SpipAssessment::gradeToScore($final);
                                            $dev = $finalScore - $selfScore;
                                        @endphp
                                        <span class="px-2 py-1 rounded font-bold text-xs {{ $dev < 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : ($dev > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400') }}">
                                            {{ $dev > 0 ? '+' : '' }}{{ $dev }}
                                        </span>
                                    </td>
                                    
                                    <!-- Justification & Save -->
                                    <td class="py-4 px-4 space-y-2">
                                        @if($formStates[$assessId]['status_flow'] !== 'FINAL_LOCKED')
                                            <!-- Justification input -->
                                            <input type="text" wire:model="formStates.{{ $assessId }}.justification_notes" placeholder="Catatan audit log..." class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[9px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500">
                                            
                                            <button wire:click="saveAdjustment({{ $assessId }})" class="w-full px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-[10px] font-bold transition-all duration-300 cursor-pointer shadow-md shadow-brand-500/10">
                                                Simpan
                                            </button>
                                        @else
                                            <span class="text-[10px] text-slate-500 font-semibold block text-center mt-4">Locked</span>
                                        @endif

                                        @if(isset($errorMessages[$assessId]))
                                            <span class="text-rose-400 text-[9px] font-semibold block leading-tight mt-1">{{ $errorMessages[$assessId] }}</span>
                                        @endif
                                        @if(isset($successMessages[$assessId]))
                                            <span class="text-emerald-400 text-[9px] font-semibold block leading-tight mt-1">{{ $successMessages[$assessId] }}</span>
                                        @endif
                                    </td>
                                </tr>
                            @endif
                        @endforeach
                    @endif
                </tbody>
            </table>
        </div>
    </div>
</div>