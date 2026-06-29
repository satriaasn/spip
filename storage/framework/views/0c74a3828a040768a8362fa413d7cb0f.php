<?php
use Livewire\Component;
use App\Services\SpipCalculator;
use App\Models\Opd;
use App\Models\SpipAssessment;
?>

<div class="space-y-6">
    <!-- Top Summary Index Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- SPIP Maturity Card -->
        <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950/20 border border-slate-800/40 rounded-3xl p-6 relative overflow-hidden shadow-xl shadow-black/10">
            <div class="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl"></div>
            <div class="flex justify-between items-start">
                <div>
                    <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Maturitas SPIP</span>
                    <h3 class="text-4xl font-black mt-2 text-slate-100 tracking-tight"><?php echo e(number_format($data['spip_maturity'] ?? 0, 3)); ?></h3>
                </div>
                <div class="p-3 bg-brand-500/10 border border-brand-500/20 rounded-2xl text-brand-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
            </div>
            <div class="mt-4 pt-4 border-t border-slate-800/30 flex items-center justify-between text-xs">
                <span class="text-slate-400 font-medium">Target Maturitas Pemda</span>
                <span class="text-brand-400 font-bold">Level 3 (3.000)</span>
            </div>
        </div>

        <!-- MRI Card -->
        <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20 border border-slate-800/40 rounded-3xl p-6 relative overflow-hidden shadow-xl shadow-black/10">
            <div class="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl"></div>
            <div class="flex justify-between items-start">
                <div>
                    <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Indeks Manajemen Risiko (MRI)</span>
                    <h3 class="text-4xl font-black mt-2 text-slate-100 tracking-tight"><?php echo e(number_format($data['mri_index'] ?? 0, 3)); ?></h3>
                </div>
                <div class="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
            </div>
            <div class="mt-4 pt-4 border-t border-slate-800/30 flex items-center justify-between text-xs">
                <span class="text-slate-400 font-medium">Kategori Kematangan</span>
                <span class="text-indigo-400 font-bold">
                    <?php echo e(($data['mri_index'] ?? 0) >= 3.0 ? 'Sangat Baik' : (($data['mri_index'] ?? 0) >= 2.0 ? 'Baik' : 'Kurang')); ?>

                </span>
            </div>
        </div>

        <!-- IEPK Card -->
        <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950/20 border border-slate-800/40 rounded-3xl p-6 relative overflow-hidden shadow-xl shadow-black/10">
            <div class="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl"></div>
            <div class="flex justify-between items-start">
                <div>
                    <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Indeks Efektivitas Pencegahan Korupsi</span>
                    <h3 class="text-4xl font-black mt-2 text-slate-100 tracking-tight"><?php echo e(number_format($data['iepk_index'] ?? 0, 3)); ?></h3>
                </div>
                <div class="p-3 bg-violet-500/10 border border-violet-500/20 rounded-2xl text-violet-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
            </div>
            <div class="mt-4 pt-4 border-t border-slate-800/30 flex items-center justify-between text-xs">
                <span class="text-slate-400 font-medium">Predikat Kinerja</span>
                <span class="text-violet-400 font-bold">Teruji</span>
            </div>
        </div>
    </div>

    <!-- Charts & Tables Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Radar Chart Card -->
        <div class="bg-slate-900/40 border border-slate-800/40 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
            <div>
                <h4 class="text-base font-bold text-slate-200 mb-1">Struktur & Proses Penyelenggaraan SPIP</h4>
                <p class="text-xs text-slate-400">Nilai Maturitas rata-rata berdasarkan 5 Unsur Penilaian Utama</p>
            </div>
            
            <div id="spipRadarChartContainer" 
                 data-lingkungan="<?php echo e($data['components']['lingkungan'] ?? 0); ?>"
                 data-risiko="<?php echo e($data['components']['risiko'] ?? 0); ?>"
                 data-kegiatan="<?php echo e($data['components']['kegiatan'] ?? 0); ?>"
                 data-infokom="<?php echo e($data['components']['infokom'] ?? 0); ?>"
                 data-pemantauan="<?php echo e($data['components']['pemantauan'] ?? 0); ?>"
                 class="relative w-full aspect-square flex items-center justify-center p-4">
                <canvas id="spipRadarChart" class="max-h-[300px]"></canvas>
            </div>

            <div class="grid grid-cols-5 gap-2 text-center text-[10px] text-slate-400 font-medium pt-4 border-t border-slate-800/20">
                <div>
                    <span class="block font-bold text-slate-200"><?php echo e(number_format($data['components']['lingkungan'] ?? 0, 2)); ?></span>
                    Lingkungan
                </div>
                <div>
                    <span class="block font-bold text-slate-200"><?php echo e(number_format($data['components']['risiko'] ?? 0, 2)); ?></span>
                    Risiko
                </div>
                <div>
                    <span class="block font-bold text-slate-200"><?php echo e(number_format($data['components']['kegiatan'] ?? 0, 2)); ?></span>
                    Kegiatan
                </div>
                <div>
                    <span class="block font-bold text-slate-200"><?php echo e(number_format($data['components']['infokom'] ?? 0, 2)); ?></span>
                    Infokom
                </div>
                <div>
                    <span class="block font-bold text-slate-200"><?php echo e(number_format($data['components']['pemantauan'] ?? 0, 2)); ?></span>
                    Pemantauan
                </div>
            </div>
        </div>

        <!-- Breakdown Table Card -->
        <div class="bg-slate-900/40 border border-slate-800/40 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
            <div>
                <h4 class="text-base font-bold text-slate-200 mb-1">Detail Rincian Pilar Indeks Evaluasi</h4>
                <p class="text-xs text-slate-400">Agregasi nilai dari komponen KKE dan Kertas Kerja regional</p>
            </div>

            <div class="space-y-4 my-6">
                <!-- Penetapan Tujuan -->
                <div class="bg-slate-950/40 border border-slate-800/30 rounded-2xl p-4 flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold">PT</div>
                        <div>
                            <span class="text-xs font-bold text-slate-300">Penetapan Tujuan (Weight 40%)</span>
                            <span class="block text-[10px] text-slate-400">Kualitas Sasaran Pemda & OPD</span>
                        </div>
                    </div>
                    <span class="text-sm font-bold text-slate-200"><?php echo e(number_format($data['components']['penetapan_tujuan'] ?? 0, 3)); ?></span>
                </div>

                <!-- Struktur & Proses -->
                <div class="bg-slate-950/40 border border-slate-800/30 rounded-2xl p-4 flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 text-xs font-bold">SP</div>
                        <div>
                            <span class="text-xs font-bold text-slate-300">Struktur & Proses (Weight 30%)</span>
                            <span class="block text-[10px] text-slate-400">Penerapan 25 sub-unsur internal control</span>
                        </div>
                    </div>
                    <span class="text-sm font-bold text-slate-200"><?php echo e(number_format($data['components']['struktur_proses'] ?? 0, 3)); ?></span>
                </div>

                <!-- Pencapaian Hasil -->
                <div class="bg-slate-950/40 border border-slate-800/30 rounded-2xl p-4 flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold">PH</div>
                        <div>
                            <span class="text-xs font-bold text-slate-300">Pencapaian Hasil (Weight 30%)</span>
                            <span class="block text-[10px] text-slate-400">Outcome, Output, Opini LK, Ketaatan, APIP</span>
                        </div>
                    </div>
                    <span class="text-sm font-bold text-slate-200"><?php echo e(number_format($data['components']['pencapaian_hasil'] ?? 0, 3)); ?></span>
                </div>
            </div>

            <div class="bg-slate-950/60 border border-slate-800/20 rounded-2xl p-4 flex items-center justify-between text-xs">
                <span class="text-slate-400">Status Pengiriman Kertas Kerja OPD:</span>
                <span class="font-bold text-slate-200"><?php echo e($submittedOpd); ?> dari <?php echo e($totalOpd); ?> OPD Terdata</span>
            </div>
        </div>
    </div>

    <!-- OPD Submission Progress List -->
    <div class="bg-slate-900/40 border border-slate-800/40 rounded-3xl p-6 shadow-xl">
        <div class="flex items-center justify-between mb-4">
            <div>
                <h4 class="text-base font-bold text-slate-200 mb-1">Status Progres Evaluasi Per Departemen</h4>
                <p class="text-xs text-slate-400">Status pengerjaan lembar kerja evaluasi masing-masing OPD</p>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
                <thead>
                    <tr class="border-b border-slate-800/60 text-slate-400 uppercase tracking-wider font-semibold">
                        <th class="py-3 px-4">Nama OPD</th>
                        <th class="py-3 px-4">Draft KKE</th>
                        <th class="py-3 px-4 text-center">Tingkat Penyelesaian</th>
                        <th class="py-3 px-4">Status Pengiriman</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/30">
                    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::openLoop(); ?><?php endif; ?><?php $__currentLoopData = App\Models\Opd::where('code_opd', '!=', 'OPD_PEMDA')->take(5)->get(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $opd): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::startLoopIteration(); ?><?php endif; ?>
                        <?php
                            $totalAssessments = App\Models\SpipAssessment::where('opd_id', $opd->id)->where('fiscal_year', $fiscalYear)->count();
                            $completedAssessments = App\Models\SpipAssessment::where('opd_id', $opd->id)->where('fiscal_year', $fiscalYear)->whereNotNull('grade_self_opd')->count();
                            $status = App\Models\SpipAssessment::where('opd_id', $opd->id)->where('fiscal_year', $fiscalYear)->first()->status_flow ?? 'OPD_DRAFT';
                            $percentage = $totalAssessments > 0 ? ($completedAssessments / $totalAssessments) * 100 : 0;
                        ?>
                        <tr class="hover:bg-slate-900/20 transition-all duration-300">
                            <td class="py-3.5 px-4 font-medium text-slate-200"><?php echo e($opd->name_opd); ?></td>
                            <td class="py-3.5 px-4 text-slate-400"><?php echo e($completedAssessments); ?> / 92 Checklist</td>
                            <td class="py-3.5 px-4">
                                <div class="flex items-center justify-center space-x-2">
                                    <div class="w-24 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700/20">
                                        <div class="bg-brand-500 h-full rounded-full" style="width: <?php echo e($percentage); ?>%"></div>
                                    </div>
                                    <span class="text-[10px] font-bold text-slate-300"><?php echo e(round($percentage)); ?>%</span>
                                </div>
                            </td>
                            <td class="py-3.5 px-4">
                                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($status === 'FINAL_LOCKED'): ?>
                                    <span class="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Final Locked</span>
                                <?php elseif($status === 'INSPEKTORAT_QA'): ?>
                                    <span class="px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-wider">QA Audited</span>
                                <?php elseif($status === 'BAPPEDA_PROCESS'): ?>
                                    <span class="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Verified</span>
                                <?php else: ?>
                                    <span class="px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/40 text-slate-400 text-[10px] font-bold uppercase tracking-wider">OPD Draft</span>
                                <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                            </td>
                        </tr>
                    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::endLoop(); ?><?php endif; ?><?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::closeLoop(); ?><?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Chart.js and Radar script init -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script><?php /**PATH D:\PROGRAM CODING\spip\spip\storage\framework\views/livewire/views/99baacb3.blade.php ENDPATH**/ ?>