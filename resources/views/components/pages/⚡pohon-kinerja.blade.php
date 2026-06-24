<?php

use Livewire\Component;
use App\Models\PohonKinerja;
use App\Models\Opd;

new class extends Component
{
    public int $fiscalYear = 2026;
    public ?int $parentId = null;
    public string $levelType = 'PEMDA';
    public ?int $opdId = null;
    public string $titleObjective = '';
    public string $indicatorName = '';
    public string $targetValue = '';
    public string $unitOfMeasurement = '';
    
    public bool $isCreating = false;

    protected array $rules = [
        'fiscalYear' => 'required|integer',
        'levelType' => 'required|string',
        'titleObjective' => 'required|string',
        'indicatorName' => 'required|string',
        'targetValue' => 'required|string',
        'unitOfMeasurement' => 'required|string',
    ];

    public function mount()
    {
        // Default OPD to user's OPD if OPD operator
        if (auth()->user()->isOpd()) {
            $this->opdId = auth()->user()->opd_id;
            $this->levelType = 'OPD';
        }
    }

    public function showCreateForm(?int $parentId = null, ?string $suggestedLevel = null)
    {
        $this->parentId = $parentId;
        if ($suggestedLevel) {
            $this->levelType = $suggestedLevel;
        } else {
            $this->levelType = $parentId ? 'OPD' : 'PEMDA';
        }
        $this->titleObjective = '';
        $this->indicatorName = '';
        $this->targetValue = '';
        $this->unitOfMeasurement = '';
        $this->isCreating = true;
    }

    public function saveNode()
    {
        $this->validate();

        PohonKinerja::create([
            'parent_id' => $this->parentId,
            'fiscal_year' => $this->fiscalYear,
            'level_type' => $this->levelType,
            'opd_id' => $this->opdId,
            'title_objective' => $this->titleObjective,
            'indicator_name' => $this->indicatorName,
            'target_value' => $this->targetValue,
            'unit_of_measurement' => $this->unitOfMeasurement,
        ]);

        $this->isCreating = false;
        $this->dispatch('node-saved');
    }

    public function deleteNode(int $id)
    {
        PohonKinerja::destroy($id);
    }
};
?>

<div class="space-y-6">
    <div class="flex justify-between items-center bg-slate-900/40 border border-slate-800/40 p-6 rounded-3xl backdrop-blur-md">
        <div>
            <h3 class="text-lg font-bold text-slate-200">Cascade Pohon Kinerja</h3>
            <p class="text-xs text-slate-400">Penyusunan sasaran strategis, program, kegiatan, dan sub-kegiatan daerah</p>
        </div>
        @if(auth()->user()->isAdmin() || auth()->user()->isBappeda())
            <button wire:click="showCreateForm(null, 'PEMDA')" class="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all duration-300 flex items-center space-x-2 cursor-pointer shadow-lg shadow-brand-500/20">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                <span>Sasaran Pemda Baru</span>
            </button>
        @endif
    </div>

    <!-- Create/Edit Modal (Simplified overlay card) -->
    @if($isCreating)
        <div class="bg-slate-900/80 border border-slate-800 p-6 rounded-3xl shadow-2xl space-y-4">
            <h4 class="text-sm font-bold text-slate-200 uppercase tracking-wider">Tambah Simpul Pohon Kinerja</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Level Type</label>
                    <select wire:model.live="levelType" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
                        <option value="PEMDA">Sasaran Pemda (Level 0)</option>
                        <option value="OPD">Sasaran OPD (Level 1)</option>
                        <option value="PROGRAM">Program (Level 2)</option>
                        <option value="KEGIATAN">Kegiatan (Level 3)</option>
                        <option value="SUB_KEGIATAN">Sub-Kegiatan (Level 4)</option>
                    </select>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">OPD Pengampu</label>
                    <select wire:model="opdId" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
                        <option value="">-- PILIH OPD --</option>
                        @foreach(Opd::all() as $opd)
                            <option value="{{ $opd->id }}">{{ $opd->name_opd }}</option>
                        @endforeach
                    </select>
                </div>
                <div class="md:col-span-2">
                    <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nama Sasaran / Uraian</label>
                    <input type="text" wire:model="titleObjective" placeholder="Uraian sasaran/program/kegiatan..." class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Indikator Kinerja</label>
                    <input type="text" wire:model="indicatorName" placeholder="Indikator kinerja sasaran..." class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Target</label>
                        <input type="text" wire:model="targetValue" placeholder="100..." class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Satuan</label>
                        <input type="text" wire:model="unitOfMeasurement" placeholder="%..." class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
                    </div>
                </div>
            </div>
            <div class="flex justify-end space-x-3 pt-2">
                <button wire:click="$set('isCreating', false)" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all duration-300 cursor-pointer">Batal</button>
                <button wire:click="saveNode" class="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-brand-500/20">Simpan Simpul</button>
            </div>
        </div>
    @endif

    <!-- Hierarchical Tree View Rendering -->
    <div class="bg-slate-900/40 border border-slate-800/40 rounded-3xl p-6 shadow-xl space-y-4">
        @php
            $rootNodes = App\Models\PohonKinerja::whereNull('parent_id')->where('fiscal_year', $fiscalYear)->get();
        @endphp

        @if($rootNodes->isEmpty())
            <div class="text-center py-12 text-slate-500 text-sm">
                Tidak ada data simpul utama (PEMDA). Hubungi Admin atau Bappeda untuk memasukkan data.
            </div>
        @else
            <div class="space-y-4">
                @foreach($rootNodes as $node)
                    <!-- Recursive Tree component wrapper -->
                    <div class="bg-slate-950/40 border border-slate-800/30 rounded-2xl p-4 space-y-3">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider">PEMDA</span>
                                <h5 class="text-xs font-bold text-slate-200">{{ $node->title_objective }}</h5>
                            </div>
                            <div class="flex items-center space-x-2 text-[10px] text-slate-400">
                                <span>Indikator: <strong class="text-slate-200">{{ $node->indicator_name }}</strong></span>
                                <span>Target: <strong class="text-slate-200">{{ $node->target_value }} {{ $node->unit_of_measurement }}</strong></span>
                                @if(auth()->user()->isAdmin() || auth()->user()->isBappeda())
                                    <button wire:click="showCreateForm({{ $node->id }}, 'OPD')" class="p-1 text-brand-400 hover:text-brand-300 rounded cursor-pointer" title="Tambah Sasaran OPD">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                    </button>
                                    <button onclick="confirm('Hapus simpul ini dan seluruh keturunannya?') || event.stopImmediatePropagation()" wire:click="deleteNode({{ $node->id }})" class="p-1 text-rose-400 hover:text-rose-300 rounded cursor-pointer" title="Hapus">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                @endif
                            </div>
                        </div>

                        <!-- Level 1: OPD Goals -->
                        @if($node->children->isNotEmpty())
                            <div class="pl-6 border-l border-slate-800 space-y-3 mt-2">
                                @foreach($node->children as $childOpd)
                                    <div class="bg-slate-900/30 border border-slate-800/20 rounded-xl p-3.5 space-y-2">
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center space-x-2">
                                                <span class="px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[9px] font-bold uppercase tracking-wider">OPD</span>
                                                <span class="text-[10px] text-slate-400 font-semibold uppercase">[{{ $childOpd->opd->alias_opd ?? 'N/A' }}]</span>
                                                <h6 class="text-xs font-bold text-slate-200">{{ $childOpd->title_objective }}</h6>
                                            </div>
                                            <div class="flex items-center space-x-2 text-[10px] text-slate-400">
                                                <span>Target: <strong class="text-slate-200">{{ $childOpd->target_value }} {{ $childOpd->unit_of_measurement }}</strong></span>
                                                @if(auth()->user()->isAdmin() || auth()->user()->isBappeda())
                                                    <button wire:click="showCreateForm({{ $childOpd->id }}, 'PROGRAM')" class="p-0.5 text-brand-400 hover:text-brand-300 rounded cursor-pointer" title="Tambah Program">
                                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                                    </button>
                                                    <button onclick="confirm('Hapus?') || event.stopImmediatePropagation()" wire:click="deleteNode({{ $childOpd->id }})" class="p-0.5 text-rose-400 hover:text-rose-300 rounded cursor-pointer">
                                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                @endif
                                            </div>
                                        </div>

                                        <!-- Level 2: Program -->
                                        @if($childOpd->children->isNotEmpty())
                                            <div class="pl-4 border-l border-slate-800 space-y-2 mt-2">
                                                @foreach($childOpd->children as $childProgram)
                                                    <div class="flex items-center justify-between text-xs py-1.5 px-3 bg-slate-950/20 border border-slate-800/10 rounded-lg">
                                                        <div class="flex items-center space-x-2">
                                                            <span class="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-bold uppercase tracking-wider">PROGRAM</span>
                                                            <span class="text-slate-300 font-medium">{{ $childProgram->title_objective }}</span>
                                                        </div>
                                                        <div class="flex items-center space-x-2 text-[10px] text-slate-400">
                                                            <span>Target: <strong class="text-slate-200">{{ $childProgram->target_value }} {{ $childProgram->unit_of_measurement }}</strong></span>
                                                            @if(auth()->user()->isAdmin() || auth()->user()->isBappeda())
                                                                <button wire:click="showCreateForm({{ $childProgram->id }}, 'KEGIATAN')" class="p-0.5 text-brand-400 hover:text-brand-300 rounded cursor-pointer" title="Tambah Kegiatan">
                                                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                                                </button>
                                                                <button onclick="confirm('Hapus?') || event.stopImmediatePropagation()" wire:click="deleteNode({{ $childProgram->id }})" class="p-0.5 text-rose-400 hover:text-rose-300 rounded cursor-pointer">
                                                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                                </button>
                                                            @endif
                                                        </div>
                                                    </div>

                                                    <!-- Level 3: Kegiatan -->
                                                    @if($childProgram->children->isNotEmpty())
                                                        <div class="pl-4 border-l border-slate-800 space-y-1.5 mt-1.5">
                                                            @foreach($childProgram->children as $childKegiatan)
                                                                <div class="flex items-center justify-between text-xs py-1 px-2.5 bg-slate-950/40 rounded-md">
                                                                    <div class="flex items-center space-x-2">
                                                                        <span class="px-1 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[8px] font-bold uppercase tracking-wider">KEGIATAN</span>
                                                                        <span class="text-slate-300">{{ $childKegiatan->title_objective }}</span>
                                                                    </div>
                                                                    <div class="flex items-center space-x-1.5 text-[9px] text-slate-400">
                                                                        <span>Target: <strong class="text-slate-200">{{ $childKegiatan->target_value }}</strong></span>
                                                                        @if(auth()->user()->isAdmin() || auth()->user()->isBappeda())
                                                                            <button wire:click="showCreateForm({{ $childKegiatan->id }}, 'SUB_KEGIATAN')" class="p-0.5 text-brand-400 hover:text-brand-300 rounded cursor-pointer" title="Tambah Sub Kegiatan">
                                                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                                                            </button>
                                                                            <button onclick="confirm('Hapus?') || event.stopImmediatePropagation()" wire:click="deleteNode({{ $childKegiatan->id }})" class="p-0.5 text-rose-400 hover:text-rose-300 rounded cursor-pointer">
                                                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                                            </button>
                                                                        @endif
                                                                    </div>
                                                                </div>

                                                                <!-- Level 4: Sub-Kegiatan -->
                                                                @if($childKegiatan->children->isNotEmpty())
                                                                    <div class="pl-4 border-l border-slate-800 space-y-1 mt-1">
                                                                        @foreach($childKegiatan->children as $childSub)
                                                                            <div class="flex items-center justify-between text-[11px] py-1 px-2.5 bg-slate-950/60 rounded">
                                                                                <div class="flex items-center space-x-1.5">
                                                                                    <span class="px-1 py-0.5 rounded bg-slate-800 text-slate-400 text-[7px] font-bold uppercase tracking-wider">SUB-KEG</span>
                                                                                    <span class="text-slate-400">{{ $childSub->title_objective }}</span>
                                                                                </div>
                                                                                <div class="flex items-center space-x-1.5 text-[9px] text-slate-400">
                                                                                    <span>Target: <strong class="text-slate-300">{{ $childSub->target_value }}</strong></span>
                                                                                    @if(auth()->user()->isAdmin() || auth()->user()->isBappeda())
                                                                                        <button onclick="confirm('Hapus?') || event.stopImmediatePropagation()" wire:click="deleteNode({{ $childSub->id }})" class="p-0.5 text-rose-400 hover:text-rose-300 rounded cursor-pointer">
                                                                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                                                        </button>
                                                                                    @endif
                                                                                </div>
                                                                            </div>
                                                                        @endforeach
                                                                    </div>
                                                                @endif

                                                            @endforeach
                                                        </div>
                                                    @endif

                                                @endforeach
                                            </div>
                                        @endif

                                    </div>
                                @endforeach
                            </div>
                        @endif

                    </div>
                @endforeach
            </div>
        @endif
    </div>
</div>