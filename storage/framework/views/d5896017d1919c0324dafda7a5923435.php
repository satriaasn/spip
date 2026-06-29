<?php
use Livewire\Component;
use App\Models\SubElement;
use App\Models\Indicator;
use App\Models\SpipAssessment;
use App\Models\Opd;
?>

<div class="space-y-6">
    <!-- Filter Panel -->
    <div class="bg-slate-900/40 border border-slate-800/40 p-6 rounded-3xl backdrop-blur-md grid grid-cols-1 md:grid-cols-3 gap-6 items-end shadow-xl">
        <!-- Sub-element filter -->
        <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Unsur / Sub-Unsur SPIP</label>
            <select wire:model.live="subElementCode" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::openLoop(); ?><?php endif; ?><?php $__currentLoopData = App\Models\SubElement::where('type', 'SPIP')->get(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $sub): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::startLoopIteration(); ?><?php endif; ?>
                    <option value="<?php echo e($sub->code); ?>"><?php echo e($sub->code); ?> - <?php echo e($sub->name); ?></option>
                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::endLoop(); ?><?php endif; ?><?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::closeLoop(); ?><?php endif; ?>
            </select>
        </div>

        <!-- Target Objective (Visible only for internal control elements) -->
        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(str_starts_with($subElementCode, '1.') || str_starts_with($subElementCode, '2.') || str_starts_with($subElementCode, '3.') || str_starts_with($subElementCode, '4.') || str_starts_with($subElementCode, '5.')): ?>
            <div>
                <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tujuan Pengujian (Objective)</label>
                <select wire:model.live="targetObjective" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
                    <option value="T1">T1 - Efektivitas & Efisiensi Pencapaian Tujuan</option>
                    <option value="T2">T2 - Keandalan Pelaporan Keuangan</option>
                    <option value="T3">T3 - Pengamanan Aset Negara/Daerah</option>
                    <option value="T4">T4 - Ketaatan pada Peraturan Perundang-undangan</option>
                </select>
            </div>
        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>

        <!-- Submit to Bappeda -->
        <div class="flex justify-end">
            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($isSubmitted): ?>
                <span class="px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl flex items-center space-x-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    <span>Telah Dikirim & Dikunci</span>
                </span>
            <?php else: ?>
                <button onclick="confirm('Kirim kertas kerja ini ke Bappeda? Setelah dikirim, Anda tidak dapat mengubah data kembali.') || event.stopImmediatePropagation()" wire:click="submitToBappeda" class="w-full md:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    <span>Kirim ke Bappeda</span>
                </button>
            <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
        </div>
    </div>

    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(session()->has('global_success')): ?>
        <div class="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 rounded-2xl">
            <?php echo e(session('global_success')); ?>

        </div>
    <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>

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
                    <?php
                        $sub = App\Models\SubElement::where('code', $subElementCode)->first();
                        $indicators = $sub ? App\Models\Indicator::where('sub_element_id', $sub->id)->get() : collect();
                    ?>

                    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($indicators->isEmpty()): ?>
                        <tr>
                            <td colspan="5" class="py-12 text-center text-slate-500">Tidak ada indikator untuk unsur ini.</td>
                        </tr>
                    <?php else: ?>
                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::openLoop(); ?><?php endif; ?><?php $__currentLoopData = $indicators; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $index => $ind): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::startLoopIteration(); ?><?php endif; ?>
                            <tr class="hover:bg-slate-900/20 transition-all duration-300 align-top">
                                <!-- Number -->
                                <td class="py-4 px-4 text-center font-bold text-slate-400"><?php echo e($ind->indicator_number); ?></td>
                                
                                <!-- Description -->
                                <td class="py-4 px-4 text-slate-200 font-medium leading-relaxed">
                                    <?php echo e($ind->indicator_name); ?>

                                </td>
                                
                                <!-- Criteria mapping -->
                                <td class="py-4 px-4 space-y-2.5">
                                    <div class="bg-slate-950/40 border border-slate-800/30 rounded-xl p-3.5 space-y-2">
                                        <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Panduan Kriteria Penilaian:</span>
                                        <div class="space-y-1.5 text-[11px] text-slate-400 leading-relaxed">
                                            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::openLoop(); ?><?php endif; ?><?php $__currentLoopData = $ind->grades; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $g): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::startLoopIteration(); ?><?php endif; ?>
                                                <div class="flex items-start space-x-2">
                                                    <span class="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-bold text-[9px] text-slate-300"><?php echo e($g->grade); ?></span>
                                                    <span><?php echo e($g->criteria); ?></span>
                                                </div>
                                            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::endLoop(); ?><?php endif; ?><?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::closeLoop(); ?><?php endif; ?>
                                        </div>
                                    </div>
                                </td>
                                
                                <!-- Form Inputs -->
                                <td class="py-4 px-4 space-y-3">
                                    <!-- Grade Choice -->
                                    <div>
                                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Grade</label>
                                        <select wire:model.live="formStates.<?php echo e($ind->id); ?>.grade" <?php if($isSubmitted): echo 'disabled'; endif; ?> class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500">
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
                                        <select wire:model="formStates.<?php echo e($ind->id); ?>.cause_cluster" <?php if($isSubmitted): echo 'disabled'; endif; ?> class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500">
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
                                        <input type="text" wire:model="formStates.<?php echo e($ind->id); ?>.evidence_url" <?php if($isSubmitted): echo 'disabled'; endif; ?> placeholder="https://drive.google.com/..." class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-500">
                                    </div>

                                    <!-- Explanation Notes -->
                                    <div>
                                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Catatan Penjelasan</label>
                                        <textarea wire:model="formStates.<?php echo e($ind->id); ?>.notes_opd" <?php if($isSubmitted): echo 'disabled'; endif; ?> rows="2" placeholder="Uraian bukti atau tindak lanjut..." class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-500"></textarea>
                                    </div>

                                    <!-- Error / Success Indicators -->
                                    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(isset($errorMessages[$ind->id])): ?>
                                        <span class="text-rose-400 text-[10px] font-semibold block leading-tight mt-1"><?php echo e($errorMessages[$ind->id]); ?></span>
                                    <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                                    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(isset($successMessages[$ind->id])): ?>
                                        <span class="text-emerald-400 text-[10px] font-semibold block leading-tight mt-1"><?php echo e($successMessages[$ind->id]); ?></span>
                                    <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                                </td>
                                
                                <!-- Save Action -->
                                <td class="py-4 px-4 text-center">
                                    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(!$isSubmitted): ?>
                                        <button wire:click="saveRow(<?php echo e($ind->id); ?>)" class="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-[10px] font-bold transition-all duration-300 cursor-pointer shadow-md shadow-brand-500/10">
                                            Simpan
                                        </button>
                                    <?php else: ?>
                                        <span class="text-[10px] text-slate-500 font-semibold block mt-2">Locked</span>
                                    <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                                </td>
                            </tr>
                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::endLoop(); ?><?php endif; ?><?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::closeLoop(); ?><?php endif; ?>
                    <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div><?php /**PATH D:\PROGRAM CODING\spip\spip\storage\framework\views/livewire/views/bd1a8555.blade.php ENDPATH**/ ?>