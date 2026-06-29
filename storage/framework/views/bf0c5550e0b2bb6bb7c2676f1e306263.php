<?php
use App\Models\Opd;
use App\Models\SubElement;
use App\Models\Indicator;
use App\Models\SpipAssessment;
use App\Models\AuditScoreLog;
use Livewire\Component;
?>

<div class="space-y-6">
    <!-- Filter Grid -->
    <div class="bg-slate-900/40 border border-slate-800/40 p-6 rounded-3xl backdrop-blur-md grid grid-cols-1 md:grid-cols-4 gap-6 items-end shadow-xl">
        <!-- OPD Selector -->
        <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Departemen (OPD)</label>
            <select wire:model.live="selectedOpdId" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::openLoop(); ?><?php endif; ?><?php $__currentLoopData = App\Models\Opd::where('code_opd', '!=', 'OPD_PEMDA')->get(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $opd): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::startLoopIteration(); ?><?php endif; ?>
                    <option value="<?php echo e($opd->id); ?>"><?php echo e($opd->name_opd); ?></option>
                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::endLoop(); ?><?php endif; ?><?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::closeLoop(); ?><?php endif; ?>
            </select>
        </div>

        <!-- Sub-element filter -->
        <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Unsur / Sub-Unsur SPIP</label>
            <select wire:model.live="subElementCode" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500">
                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::openLoop(); ?><?php endif; ?><?php $__currentLoopData = App\Models\SubElement::where('type', 'SPIP')->get(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $sub): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::startLoopIteration(); ?><?php endif; ?>
                    <option value="<?php echo e($sub->code); ?>"><?php echo e($sub->code); ?> - <?php echo e($sub->name); ?></option>
                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::endLoop(); ?><?php endif; ?><?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::closeLoop(); ?><?php endif; ?>
            </select>
        </div>

        <!-- Target Objective -->
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

        <!-- Action / Lock Period -->
        <div class="flex justify-end">
            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(auth()->user()->isInspektorat() || auth()->user()->isAdmin()): ?>
                <button onclick="confirm('Kunci permanen seluruh penilaian unsur ini untuk OPD terpilih? Data tidak akan bisa diubah kembali.') || event.stopImmediatePropagation()" wire:click="lockAssessmentPeriod" class="w-full md:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-rose-500/20">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    <span>Kunci Kertas Kerja</span>
                </button>
            <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
        </div>
    </div>

    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(session()->has('global_success')): ?>
        <div class="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-4 py-3 rounded-2xl">
            <?php echo e(session('global_success')); ?>

        </div>
    <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(session()->has('global_error')): ?>
        <div class="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs px-4 py-3 rounded-2xl">
            <?php echo e(session('global_error')); ?>

        </div>
    <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>

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
                    <?php
                        $sub = App\Models\SubElement::where('code', $subElementCode)->first();
                        $indicators = $sub ? App\Models\Indicator::where('sub_element_id', $sub->id)->get() : collect();
                        $isSubElementKk3 = str_starts_with($subElementCode, '1.') || 
                                           str_starts_with($subElementCode, '2.') || 
                                           str_starts_with($subElementCode, '3.') || 
                                           str_starts_with($subElementCode, '4.') || 
                                           str_starts_with($subElementCode, '5.');
                        $obj = $isSubElementKk3 ? $targetObjective : null;
                    ?>

                    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($indicators->isEmpty()): ?>
                        <tr>
                            <td colspan="7" class="py-12 text-center text-slate-500">Tidak ada indikator untuk unsur ini.</td>
                        </tr>
                    <?php else: ?>
                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::openLoop(); ?><?php endif; ?><?php $__currentLoopData = $indicators; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $ind): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::startLoopIteration(); ?><?php endif; ?>
                            <?php
                                $assess = App\Models\SpipAssessment::where('opd_id', $selectedOpdId)
                                    ->where('indicator_id', $ind->id)
                                    ->where('fiscal_year', $fiscalYear)
                                    ->where('target_objective', $obj)
                                    ->first();
                                $assessId = $assess ? $assess->id : 0;
                            ?>
                            
                            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($assessId && isset($formStates[$assessId])): ?>
                                <tr class="hover:bg-slate-900/20 transition-all duration-300 align-top">
                                    <!-- No -->
                                    <td class="py-4 px-4 text-center font-bold text-slate-400"><?php echo e($ind->indicator_number); ?></td>
                                    
                                    <!-- Parameter Description -->
                                    <td class="py-4 px-4 text-slate-200 font-medium leading-relaxed">
                                        <?php echo e($ind->indicator_name); ?>

                                        <div class="mt-2 text-[10px] text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/30">
                                            <strong>Bukti Link OPD:</strong>
                                            <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($assess->evidence_url): ?>
                                                <a href="<?php echo e($assess->evidence_url); ?>" target="_blank" class="text-brand-400 hover:underline block break-all mt-0.5"><?php echo e($assess->evidence_url); ?></a>
                                            <?php else: ?>
                                                <span class="text-slate-500 italic block mt-0.5">Tidak ada bukti diupload</span>
                                            <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                                        </div>
                                    </td>
                                    
                                    <!-- 1. Score Self OPD (Read only) -->
                                    <td class="py-4 px-4 space-y-2">
                                        <span class="px-2.5 py-1 rounded bg-slate-800 border border-slate-700/60 font-bold text-slate-300 text-xs">
                                            Grade <?php echo e($formStates[$assessId]['grade_self'] ?: '-'); ?>

                                        </span>
                                        <div class="text-[10px] text-slate-400 leading-relaxed bg-slate-950/20 p-2 rounded-lg mt-1.5">
                                            <strong>Keterangan OPD:</strong> <?php echo e($assess->notes_opd ?: 'Tidak ada catatan'); ?>

                                        </div>
                                    </td>
                                    
                                    <!-- 2. Score Verified Bappeda -->
                                    <td class="py-4 px-4 space-y-2">
                                        <select wire:model="formStates.<?php echo e($assessId); ?>.grade_bappeda" <?php if(!auth()->user()->isBappeda() && !auth()->user()->isAdmin() || $formStates[$assessId]['status_flow'] === 'FINAL_LOCKED'): echo 'disabled'; endif; ?> class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500">
                                            <option value="">-- VERIFIED --</option>
                                            <option value="A">Grade A</option>
                                            <option value="B">Grade B</option>
                                            <option value="C">Grade C</option>
                                            <option value="D">Grade D</option>
                                            <option value="E">Grade E</option>
                                        </select>
                                        <textarea wire:model="formStates.<?php echo e($assessId); ?>.notes_bappeda" <?php if(!auth()->user()->isBappeda() && !auth()->user()->isAdmin() || $formStates[$assessId]['status_flow'] === 'FINAL_LOCKED'): echo 'disabled'; endif; ?> rows="2" placeholder="Uraian verifikasi..." class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-[10px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 mt-1.5"></textarea>
                                    </td>
                                    
                                    <!-- 3. Score Final Inspektorat -->
                                    <td class="py-4 px-4 space-y-2">
                                        <select wire:model="formStates.<?php echo e($assessId); ?>.grade_inspektorat" <?php if(!auth()->user()->isInspektorat() && !auth()->user()->isAdmin() || $formStates[$assessId]['status_flow'] === 'FINAL_LOCKED'): echo 'disabled'; endif; ?> class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500">
                                            <option value="">-- FINAL QA --</option>
                                            <option value="A">Grade A</option>
                                            <option value="B">Grade B</option>
                                            <option value="C">Grade C</option>
                                            <option value="D">Grade D</option>
                                            <option value="E">Grade E</option>
                                        </select>
                                        <textarea wire:model="formStates.<?php echo e($assessId); ?>.notes_inspektorat" <?php if(!auth()->user()->isInspektorat() && !auth()->user()->isAdmin() || $formStates[$assessId]['status_flow'] === 'FINAL_LOCKED'): echo 'disabled'; endif; ?> rows="2" placeholder="Uraian QA audit..." class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-[10px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500 mt-1.5"></textarea>
                                    </td>
                                    
                                    <!-- Deviation -->
                                    <td class="py-4 px-4 text-center">
                                        <?php
                                            $selfScore = App\Models\SpipAssessment::gradeToScore($formStates[$assessId]['grade_self']);
                                            $final = $formStates[$assessId]['grade_inspektorat'] ?: ($formStates[$assessId]['grade_bappeda'] ?: $formStates[$assessId]['grade_self']);
                                            $finalScore = App\Models\SpipAssessment::gradeToScore($final);
                                            $dev = $finalScore - $selfScore;
                                        ?>
                                        <span class="px-2 py-1 rounded font-bold text-xs <?php echo e($dev < 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : ($dev > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400')); ?>">
                                            <?php echo e($dev > 0 ? '+' : ''); ?><?php echo e($dev); ?>

                                        </span>
                                    </td>
                                    
                                    <!-- Justification & Save -->
                                    <td class="py-4 px-4 space-y-2">
                                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($formStates[$assessId]['status_flow'] !== 'FINAL_LOCKED'): ?>
                                            <!-- Justification input -->
                                            <input type="text" wire:model="formStates.<?php echo e($assessId); ?>.justification_notes" placeholder="Catatan audit log..." class="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[9px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500">
                                            
                                            <button wire:click="saveAdjustment(<?php echo e($assessId); ?>)" class="w-full px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-[10px] font-bold transition-all duration-300 cursor-pointer shadow-md shadow-brand-500/10">
                                                Simpan
                                            </button>
                                        <?php else: ?>
                                            <span class="text-[10px] text-slate-500 font-semibold block text-center mt-4">Locked</span>
                                        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>

                                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(isset($errorMessages[$assessId])): ?>
                                            <span class="text-rose-400 text-[9px] font-semibold block leading-tight mt-1"><?php echo e($errorMessages[$assessId]); ?></span>
                                        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if(isset($successMessages[$assessId])): ?>
                                            <span class="text-emerald-400 text-[9px] font-semibold block leading-tight mt-1"><?php echo e($successMessages[$assessId]); ?></span>
                                        <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                                    </td>
                                </tr>
                            <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                        <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::endLoop(); ?><?php endif; ?><?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::closeLoop(); ?><?php endif; ?>
                    <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div><?php /**PATH D:\PROGRAM CODING\spip\spip\storage\framework\views/livewire/views/345c6264.blade.php ENDPATH**/ ?>