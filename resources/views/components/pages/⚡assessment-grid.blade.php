<?php

use Livewire\Component;
use App\Models\SubElement;
use App\Models\Indicator;
use App\Models\SpipAssessment;
use App\Models\Opd;

new class extends Component
{
    public int $fiscalYear = 2026;
    public string $subElementCode = '1.1';
    public string $targetObjective = 'T1'; // Only used for KK3.1-3.4 (Struktur & Proses)
    public int $opdId = 0;

    public array $formStates = []; // keyed by indicator_id
    public array $successMessages = []; // keyed by indicator_id
    public array $errorMessages = []; // keyed by indicator_id
    
    public bool $isSubmitted = false;

    public function mount()
    {
        $user = auth()->user();
        if ($user->isOpd()) {
            $this->opdId = $user->opd_id ?? 0;
        } else {
            // Default to first OPD for Admin preview
            $firstOpd = Opd::where('code_opd', '!=', 'OPD_PEMDA')->first();
            $this->opdId = $firstOpd ? $firstOpd->id : 0;
        }

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

    public function loadAssessments()
    {
        $this->formStates = [];
        $this->successMessages = [];
        $this->errorMessages = [];

        // Fetch indicators for selected sub element
        $subElement = SubElement::where('code', $this->subElementCode)->first();
        if (!$subElement) return;

        $indicators = Indicator::where('sub_element_id', $subElement->id)->get();

        // Load existing assessments or initialize defaults
        $isSubElementKk3 = str_starts_with($this->subElementCode, '1.') || 
                           str_starts_with($this->subElementCode, '2.') || 
                           str_starts_with($this->subElementCode, '3.') || 
                           str_starts_with($this->subElementCode, '4.') || 
                           str_starts_with($this->subElementCode, '5.');

        $obj = $isSubElementKk3 ? $this->targetObjective : null;

        $existingAssessments = SpipAssessment::where('opd_id', $this->opdId)
            ->where('fiscal_year', $this->fiscalYear)
            ->whereIn('indicator_id', $indicators->pluck('id'))
            ->where('target_objective', $obj)
            ->get()
            ->keyBy('indicator_id');

        $this->isSubmitted = false;

        foreach ($indicators as $ind) {
            $assess = $existingAssessments->get($ind->id);
            
            if ($assess && $assess->status_flow !== 'OPD_DRAFT') {
                $this->isSubmitted = true;
            }

            $this->formStates[$ind->id] = [
                'grade' => $assess->grade_self_opd ?? '',
                'evidence_url' => $assess->evidence_url ?? '',
                'aoi_cluster' => $assess->aoi_cluster ?? '',
                'aoi_description' => $assess->aoi_description ?? '',
                'cause_cluster' => $assess->cause_cluster ?? '',
                'cause_description' => $assess->cause_description ?? '',
                'notes_opd' => $assess->notes_opd ?? '',
            ];
        }
    }

    public function saveRow(int $indicatorId)
    {
        $this->successMessages = [];
        $this->errorMessages = [];
        
        $state = $this->formStates[$indicatorId];
        $grade = $state['grade'];
        $evidenceUrl = trim($state['evidence_url']);

        // Mandatory URL Validation: A, B, C, D require a valid URL
        if (in_array(strtoupper($grade), ['A', 'B', 'C', 'D']) && empty($evidenceUrl)) {
            $this->errorMessages[$indicatorId] = 'Bukti URL wajib diisi jika nilai Grade positif (A, B, C, atau D).';
            return;
        }

        // Validate URL format if provided
        if (!empty($evidenceUrl) && !filter_var($evidenceUrl, FILTER_VALIDATE_URL)) {
            $this->errorMessages[$indicatorId] = 'Format bukti URL tidak valid (harus dimulai dengan http:// atau https://).';
            return;
        }

        $isSubElementKk3 = str_starts_with($this->subElementCode, '1.') || 
                           str_starts_with($this->subElementCode, '2.') || 
                           str_starts_with($this->subElementCode, '3.') || 
                           str_starts_with($this->subElementCode, '4.') || 
                           str_starts_with($this->subElementCode, '5.');

        $obj = $isSubElementKk3 ? $this->targetObjective : null;

        // Perform Update or Insert
        SpipAssessment::updateOrCreate(
            [
                'opd_id' => $this->opdId,
                'indicator_id' => $indicatorId,
                'fiscal_year' => $this->fiscalYear,
                'target_objective' => $obj,
            ],
            [
                'grade_self_opd' => $grade ?: null,
                'evidence_url' => $evidenceUrl ?: null,
                'aoi_cluster' => $state['aoi_cluster'] ?: null,
                'aoi_description' => $state['aoi_description'] ?: null,
                'cause_cluster' => $state['cause_cluster'] ?: null,
                'cause_description' => $state['cause_description'] ?: null,
                'notes_opd' => $state['notes_opd'] ?: null,
                'status_flow' => 'OPD_DRAFT'
            ]
        );

        $this->successMessages[$indicatorId] = 'Baris berhasil disimpan.';
    }

    public function submitToBappeda()
    {
        $subElement = SubElement::where('code', $this->subElementCode)->first();
        if (!$subElement) return;

        $indicators = Indicator::where('sub_element_id', $subElement->id)->get();
        $isSubElementKk3 = str_starts_with($this->subElementCode, '1.') || 
                           str_starts_with($this->subElementCode, '2.') || 
                           str_starts_with($this->subElementCode, '3.') || 
                           str_starts_with($this->subElementCode, '4.') || 
                           str_starts_with($this->subElementCode, '5.');

        $obj = $isSubElementKk3 ? $this->targetObjective : null;

        // Lock assessments by changing status to BAPPEDA_PROCESS
        SpipAssessment::where('opd_id', $this->opdId)
            ->where('fiscal_year', $this->fiscalYear)
            ->whereIn('indicator_id', $indicators->pluck('id'))
            ->where('target_objective', $obj)
            ->update([
                'status_flow' => 'BAPPEDA_PROCESS',
                'opd_submitted_at' => now()
            ]);

        $this->isSubmitted = true;
        $this->loadAssessments();
        session()->flash('global_success', 'Kertas kerja berhasil dikirim ke Bappeda dan dikunci dari penyuntingan.');
    }
};
?>

<div class="space-y-6">
    <!-- Filter Panel -->
    <div class="bg-slate-900/40 border border-slate-800/40 p-6 rounded-3xl backdrop-blur-md grid grid-cols-1 md:grid-cols-3 gap-6 items-end shadow-xl">
        <!-- Sub-element filter -->
        <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Unsur / Sub-Unsur SPIP</label>
            <select wire:model.live="subElementCode" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
                @foreach(App\Models\SubElement::where('type', 'SPIP')->get() as $sub)
                    <option value="{{ $sub->code }}">{{ $sub->code }} - {{ $sub->name }}</option>
                @endforeach
            </select>
        </div>

        <!-- Target Objective (Visible only for internal control elements) -->
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

        <!-- Submit to Bappeda -->
        <div class="flex justify-end">
            @if($isSubmitted)
                <span class="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    <span>Telah Dikirim & Dikunci</span>
                </span>
            @else
                <button onclick="confirm('Kirim kertas kerja ini ke Bappeda? Setelah dikirim, Anda tidak dapat mengubah data kembali.') || event.stopImmediatePropagation()" wire:click="submitToBappeda" class="w-full md:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    <span>Kirim ke Bappeda</span>
                </button>
            @endif
        </div>
    </div>

    @if(session()->has('global_success'))
        <div class="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 rounded-2xl">
            {{ session('global_success') }}
        </div>
    @endif

    <!-- Appraisal Matrix Grid -->
    <div class="bg-slate-900/40 border border-slate-800/40 rounded-3xl overflow-hidden shadow-xl">
        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse min-w-[1000px]">
                <thead>
                    <tr class="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold sticky top-0">
                        <th class="py-4 px-4 w-12 text-center">No</th>
                        <th class="py-4 px-4 w-1/4">Parameter Pengujian</th>
                        <th class="py-4 px-4 w-1/3">Kriteria Pemenuhan (Grade A-E)</th>
                        <th class="py-4 px-4 w-44">Lembar Penilaian Mandiri (Self OPD)</th>
                        <th class="py-4 px-4 w-28 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/40">
                    @php
                        $sub = App\Models\SubElement::where('code', $subElementCode)->first();
                        $indicators = $sub ? App\Models\Indicator::where('sub_element_id', $sub->id)->get() : collect();
                    @endphp

                    @if($indicators->isEmpty())
                        <tr>
                            <td colspan="5" class="py-12 text-center text-slate-500">Tidak ada indikator untuk unsur ini.</td>
                        </tr>
                    @else
                        @foreach($indicators as $index => $ind)
                            <tr class="hover:bg-slate-900/20 transition-all duration-300 align-top">
                                <!-- Number -->
                                <td class="py-4 px-4 text-center font-bold text-slate-400">{{ $ind->indicator_number }}</td>
                                
                                <!-- Description -->
                                <td class="py-4 px-4 text-slate-200 font-medium leading-relaxed">
                                    {{ $ind->indicator_name }}
                                </td>
                                
                                <!-- Criteria mapping -->
                                <td class="py-4 px-4 space-y-2.5">
                                    <div class="bg-slate-950/40 border border-slate-800/30 rounded-xl p-3.5 space-y-2">
                                        <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Panduan Kriteria Penilaian:</span>
                                        <div class="space-y-1.5 text-[11px] text-slate-400 leading-relaxed">
                                            @foreach($ind->grades as $g)
                                                <div class="flex items-start space-x-2">
                                                    <span class="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-bold text-[9px] text-slate-300">{{ $g->grade }}</span>
                                                    <span>{{ $g->criteria }}</span>
                                                </div>
                                            @endforeach
                                        </div>
                                    </div>
                                </td>
                                
                                <!-- Form Inputs -->
                                <td class="py-4 px-4 space-y-3">
                                    <!-- Grade Choice -->
                                    <div>
                                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Grade</label>
                                        <select wire:model.live="formStates.{{ $ind->id }}.grade" @disabled($isSubmitted) class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500">
                                            <option value="">-- NILAI --</option>
                                            <option value="A">A - Perbaikan Berkelanjutan</option>
                                            <option value="B">B - Terpantau & Dinamis</option>
                                            <option value="C">C - Sesuai Kebijakan/SOP</option>
                                            <option value="D">D - Kebijakan Dikomunikasikan</option>
                                            <option value="E">E - Kebijakan Terbatas</option>
                                        </select>
                                    </div>

                                    <!-- Cause Cluster -->
                                    <div>
                                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kluster Penyebab</label>
                                        <select wire:model="formStates.{{ $ind->id }}.cause_cluster" @disabled($isSubmitted) class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500">
                                            <option value="">-- PENYEBAB --</option>
                                            <option value="Man">Man (SDM)</option>
                                            <option value="Method">Method (Kebijakan/SOP)</option>
                                            <option value="Money">Money (Anggaran)</option>
                                            <option value="Material">Material (Sarana/Data)</option>
                                            <option value="Machine">Machine (Teknologi/Sistem)</option>
                                        </select>
                                    </div>

                                    <!-- Evidence URL -->
                                    <div>
                                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Bukti Link (URL)</label>
                                        <input type="text" wire:model="formStates.{{ $ind->id }}.evidence_url" @disabled($isSubmitted) placeholder="https://drive.google.com/..." class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-500">
                                    </div>

                                    <!-- Explanation Notes -->
                                    <div>
                                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Catatan Penjelasan</label>
                                        <textarea wire:model="formStates.{{ $ind->id }}.notes_opd" @disabled($isSubmitted) rows="2" placeholder="Uraian bukti atau tindak lanjut..." class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-500"></textarea>
                                    </div>

                                    <!-- Error / Success Indicators -->
                                    @if(isset($errorMessages[$ind->id]))
                                        <span class="text-rose-400 text-[10px] font-semibold block leading-tight mt-1">{{ $errorMessages[$ind->id] }}</span>
                                    @endif
                                    @if(isset($successMessages[$ind->id]))
                                        <span class="text-emerald-400 text-[10px] font-semibold block leading-tight mt-1">{{ $successMessages[$ind->id] }}</span>
                                    @endif
                                </td>
                                
                                <!-- Save Action -->
                                <td class="py-4 px-4 text-center">
                                    @if(!$isSubmitted)
                                        <button wire:click="saveRow({{ $ind->id }})" class="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-[10px] font-bold transition-all duration-300 cursor-pointer shadow-md shadow-brand-500/10">
                                            Simpan
                                        </button>
                                    @else
                                        <span class="text-[10px] text-slate-500 font-semibold block mt-2">Locked</span>
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    @endif
                </tbody>
            </table>
        </div>
    </div>
</div>