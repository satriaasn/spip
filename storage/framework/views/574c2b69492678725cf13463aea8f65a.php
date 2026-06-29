<?php
use Livewire\Component;
use App\Models\PohonKinerja;
use App\Models\Opd;
?>

<div class="space-y-6">
    <div class="flex justify-between items-center bg-slate-900/40 border border-slate-800/40 p-6 rounded-3xl backdrop-blur-md">
        <div>
            <h3 class="text-lg font-bold text-slate-200">Cascade Pohon Kinerja</h3>
            <p class="text-xs text-slate-400">Penyusunan sasaran strategis, program, kegiatan, dan sub-kegiatan daerah</p>
        </div>
        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(auth()->user()->isAdmin() || auth()->user()->isBappeda()): ?>
            <button wire:click="showCreateForm(null, 'PEMDA')" class="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold transition-all duration-300 flex items-center space-x-2 cursor-pointer shadow-lg shadow-brand-500/20">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                <span>Sasaran Pemda Baru</span>
            </button>
        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
    </div>

    <!-- Create/Edit Modal (Simplified overlay card) -->
    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($isCreating): ?>
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
                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::openLoop(); ?><?php endif; ?><?php $__currentLoopData = Opd::all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $opd): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::startLoopIteration(); ?><?php endif; ?>
                            <option value="<?php echo e($opd->id); ?>"><?php echo e($opd->name_opd); ?></option>
                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::endLoop(); ?><?php endif; ?><?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::closeLoop(); ?><?php endif; ?>
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
    <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>

    <!-- Hierarchical Tree View Rendering -->
    <div class="bg-slate-900/40 border border-slate-800/40 rounded-3xl p-6 shadow-xl space-y-4">
        <?php
            $rootNodes = App\Models\PohonKinerja::whereNull('parent_id')->where('fiscal_year', $fiscalYear)->get();
        ?>

        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($rootNodes->isEmpty()): ?>
            <div class="text-center py-12 text-slate-500 text-sm">
                Tidak ada data simpul utama (PEMDA). Hubungi Admin atau Bappeda untuk memasukkan data.
            </div>
        <?php else: ?>
            <div class="space-y-4">
                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::openLoop(); ?><?php endif; ?><?php $__currentLoopData = $rootNodes; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $node): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::startLoopIteration(); ?><?php endif; ?>
                    <!-- Recursive Tree component wrapper -->
                    <div class="bg-slate-950/40 border border-slate-800/30 rounded-2xl p-4 space-y-3">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider">PEMDA</span>
                                <h5 class="text-xs font-bold text-slate-200"><?php echo e($node->title_objective); ?></h5>
                            </div>
                            <div class="flex items-center space-x-2 text-[10px] text-slate-400">
                                <span>Indikator: <strong class="text-slate-200"><?php echo e($node->indicator_name); ?></strong></span>
                                <span>Target: <strong class="text-slate-200"><?php echo e($node->target_value); ?> <?php echo e($node->unit_of_measurement); ?></strong></span>
                                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(auth()->user()->isAdmin() || auth()->user()->isBappeda()): ?>
                                    <button wire:click="showCreateForm(<?php echo e($node->id); ?>, 'OPD')" class="p-1 text-brand-400 hover:text-brand-300 rounded cursor-pointer" title="Tambah Sasaran OPD">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                    </button>
                                    <button onclick="confirm('Hapus simpul ini dan seluruh keturunannya?') || event.stopImmediatePropagation()" wire:click="deleteNode(<?php echo e($node->id); ?>)" class="p-1 text-rose-400 hover:text-rose-300 rounded cursor-pointer" title="Hapus">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                            </div>
                        </div>

                        <!-- Level 1: OPD Goals -->
                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($node->children->isNotEmpty()): ?>
                            <div class="pl-6 border-l border-slate-800 space-y-3 mt-2">
                                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::openLoop(); ?><?php endif; ?><?php $__currentLoopData = $node->children; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $childOpd): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::startLoopIteration(); ?><?php endif; ?>
                                    <div class="bg-slate-900/30 border border-slate-800/20 rounded-xl p-3.5 space-y-2">
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center space-x-2">
                                                <span class="px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[9px] font-bold uppercase tracking-wider">OPD</span>
                                                <span class="text-[10px] text-slate-400 font-semibold uppercase">[<?php echo e($childOpd->opd->alias_opd ?? 'N/A'); ?>]</span>
                                                <h6 class="text-xs font-bold text-slate-200"><?php echo e($childOpd->title_objective); ?></h6>
                                            </div>
                                            <div class="flex items-center space-x-2 text-[10px] text-slate-400">
                                                <span>Target: <strong class="text-slate-200"><?php echo e($childOpd->target_value); ?> <?php echo e($childOpd->unit_of_measurement); ?></strong></span>
                                                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(auth()->user()->isAdmin() || auth()->user()->isBappeda()): ?>
                                                    <button wire:click="showCreateForm(<?php echo e($childOpd->id); ?>, 'PROGRAM')" class="p-0.5 text-brand-400 hover:text-brand-300 rounded cursor-pointer" title="Tambah Program">
                                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                                    </button>
                                                    <button onclick="confirm('Hapus?') || event.stopImmediatePropagation()" wire:click="deleteNode(<?php echo e($childOpd->id); ?>)" class="p-0.5 text-rose-400 hover:text-rose-300 rounded cursor-pointer">
                                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                    </button>
                                                <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                                            </div>
                                        </div>

                                        <!-- Level 2: Program -->
                                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($childOpd->children->isNotEmpty()): ?>
                                            <div class="pl-4 border-l border-slate-800 space-y-2 mt-2">
                                                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::openLoop(); ?><?php endif; ?><?php $__currentLoopData = $childOpd->children; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $childProgram): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::startLoopIteration(); ?><?php endif; ?>
                                                    <div class="flex items-center justify-between text-xs py-1.5 px-3 bg-slate-950/20 border border-slate-800/10 rounded-lg">
                                                        <div class="flex items-center space-x-2">
                                                            <span class="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-bold uppercase tracking-wider">PROGRAM</span>
                                                            <span class="text-slate-300 font-medium"><?php echo e($childProgram->title_objective); ?></span>
                                                        </div>
                                                        <div class="flex items-center space-x-2 text-[10px] text-slate-400">
                                                            <span>Target: <strong class="text-slate-200"><?php echo e($childProgram->target_value); ?> <?php echo e($childProgram->unit_of_measurement); ?></strong></span>
                                                            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(auth()->user()->isAdmin() || auth()->user()->isBappeda()): ?>
                                                                <button wire:click="showCreateForm(<?php echo e($childProgram->id); ?>, 'KEGIATAN')" class="p-0.5 text-brand-400 hover:text-brand-300 rounded cursor-pointer" title="Tambah Kegiatan">
                                                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                                                </button>
                                                                <button onclick="confirm('Hapus?') || event.stopImmediatePropagation()" wire:click="deleteNode(<?php echo e($childProgram->id); ?>)" class="p-0.5 text-rose-400 hover:text-rose-300 rounded cursor-pointer">
                                                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                                </button>
                                                            <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                                                        </div>
                                                    </div>

                                                    <!-- Level 3: Kegiatan -->
                                                    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($childProgram->children->isNotEmpty()): ?>
                                                        <div class="pl-4 border-l border-slate-800 space-y-1.5 mt-1.5">
                                                            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::openLoop(); ?><?php endif; ?><?php $__currentLoopData = $childProgram->children; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $childKegiatan): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::startLoopIteration(); ?><?php endif; ?>
                                                                <div class="flex items-center justify-between text-xs py-1 px-2.5 bg-slate-950/40 rounded-md">
                                                                    <div class="flex items-center space-x-2">
                                                                        <span class="px-1 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[8px] font-bold uppercase tracking-wider">KEGIATAN</span>
                                                                        <span class="text-slate-300"><?php echo e($childKegiatan->title_objective); ?></span>
                                                                    </div>
                                                                    <div class="flex items-center space-x-1.5 text-[9px] text-slate-400">
                                                                        <span>Target: <strong class="text-slate-200"><?php echo e($childKegiatan->target_value); ?></strong></span>
                                                                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(auth()->user()->isAdmin() || auth()->user()->isBappeda()): ?>
                                                                            <button wire:click="showCreateForm(<?php echo e($childKegiatan->id); ?>, 'SUB_KEGIATAN')" class="p-0.5 text-brand-400 hover:text-brand-300 rounded cursor-pointer" title="Tambah Sub Kegiatan">
                                                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                                                                            </button>
                                                                            <button onclick="confirm('Hapus?') || event.stopImmediatePropagation()" wire:click="deleteNode(<?php echo e($childKegiatan->id); ?>)" class="p-0.5 text-rose-400 hover:text-rose-300 rounded cursor-pointer">
                                                                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                                            </button>
                                                                        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                                                                    </div>
                                                                </div>

                                                                <!-- Level 4: Sub-Kegiatan -->
                                                                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($childKegiatan->children->isNotEmpty()): ?>
                                                                    <div class="pl-4 border-l border-slate-800 space-y-1 mt-1">
                                                                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::openLoop(); ?><?php endif; ?><?php $__currentLoopData = $childKegiatan->children; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $childSub): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::startLoopIteration(); ?><?php endif; ?>
                                                                            <div class="flex items-center justify-between text-[11px] py-1 px-2.5 bg-slate-950/60 rounded">
                                                                                <div class="flex items-center space-x-1.5">
                                                                                    <span class="px-1 py-0.5 rounded bg-slate-800 text-slate-400 text-[7px] font-bold uppercase tracking-wider">SUB-KEG</span>
                                                                                    <span class="text-slate-400"><?php echo e($childSub->title_objective); ?></span>
                                                                                </div>
                                                                                <div class="flex items-center space-x-1.5 text-[9px] text-slate-400">
                                                                                    <span>Target: <strong class="text-slate-300"><?php echo e($childSub->target_value); ?></strong></span>
                                                                                    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(auth()->user()->isAdmin() || auth()->user()->isBappeda()): ?>
                                                                                        <button onclick="confirm('Hapus?') || event.stopImmediatePropagation()" wire:click="deleteNode(<?php echo e($childSub->id); ?>)" class="p-0.5 text-rose-400 hover:text-rose-300 rounded cursor-pointer">
                                                                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                                                        </button>
                                                                                    <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                                                                                </div>
                                                                            </div>
                                                                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::endLoop(); ?><?php endif; ?><?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::closeLoop(); ?><?php endif; ?>
                                                                    </div>
                                                                <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>

                                                            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::endLoop(); ?><?php endif; ?><?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::closeLoop(); ?><?php endif; ?>
                                                        </div>
                                                    <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>

                                                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::endLoop(); ?><?php endif; ?><?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::closeLoop(); ?><?php endif; ?>
                                            </div>
                                        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>

                                    </div>
                                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::endLoop(); ?><?php endif; ?><?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::closeLoop(); ?><?php endif; ?>
                            </div>
                        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>

                    </div>
                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::endLoop(); ?><?php endif; ?><?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::closeLoop(); ?><?php endif; ?>
            </div>
        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
    </div>
</div><?php /**PATH D:\PROGRAM CODING\spip\spip\storage\framework\views/livewire/views/085efe27.blade.php ENDPATH**/ ?>