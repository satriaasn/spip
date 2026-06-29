<?php
use Livewire\Component;
use Illuminate\Support\Facades\Auth;
?>

<div class="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Gradients -->
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

    <div class="sm:mx-auto sm:w-full sm:max-w-md z-10 space-y-6">
        <!-- Logo -->
        <div class="flex flex-col items-center">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-xl shadow-brand-500/30">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h2 class="mt-4 text-center text-3xl font-extrabold tracking-tight text-white">
                E-SPIP Terintegrasi
            </h2>
            <p class="mt-1 text-center text-sm text-slate-400 font-medium">
                Pemerintah Daerah Provinsi Lampung
            </p>
        </div>

        <!-- Card Container -->
        <div class="bg-slate-900/60 border border-slate-800/50 backdrop-blur-xl py-8 px-4 shadow-2xl rounded-3xl sm:px-10">
            <form wire:submit.prevent="login" class="space-y-6">
                <!-- Error Alert -->
                <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php if($errorMessage): ?>
                    <div class="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm px-4 py-3 rounded-xl flex items-center space-x-3">
                        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        <span><?php echo e($errorMessage); ?></span>
                    </div>
                <?php endif; ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>

                <!-- Email Address -->
                <div>
                    <label for="email" class="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Alamat Email
                    </label>
                    <div class="mt-1.5 relative rounded-xl shadow-sm">
                        <input wire:model="email" id="email" name="email" type="email" autocomplete="email" required class="block w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition-all duration-300">
                    </div>
                    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__errorArgs = ['email'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> <span class="text-rose-400 text-xs mt-1 block"><?php echo e($message); ?></span> <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                </div>

                <!-- Password -->
                <div>
                    <div class="flex justify-between items-center">
                        <label for="password" class="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Kata Sandi
                        </label>
                    </div>
                    <div class="mt-1.5 relative rounded-xl shadow-sm">
                        <input wire:model="password" id="password" name="password" type="password" autocomplete="current-password" required class="block w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm transition-all duration-300">
                    </div>
                    <?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if BLOCK]><![endif]--><?php endif; ?><?php $__errorArgs = ['password'];
$__bag = $errors->getBag($__errorArgs[1] ?? 'default');
if ($__bag->has($__errorArgs[0])) :
if (isset($message)) { $__messageOriginal = $message; }
$message = $__bag->first($__errorArgs[0]); ?> <span class="text-rose-400 text-xs mt-1 block"><?php echo e($message); ?></span> <?php unset($message);
if (isset($__messageOriginal)) { $message = $__messageOriginal; }
endif;
unset($__errorArgs, $__bag); ?><?php if(\Livewire\Mechanisms\ExtendBlade\ExtendBlade::isRenderingLivewireComponent()): ?><!--[if ENDBLOCK]><![endif]--><?php endif; ?>
                </div>

                <!-- Submit Button -->
                <div>
                    <button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 cursor-pointer shadow-brand-500/20 hover:shadow-brand-500/30 transition-all duration-300 transform hover:-translate-y-0.5">
                        <span wire:loading.remove>Masuk ke Akun</span>
                        <span wire:loading class="flex items-center space-x-2">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span>Memproses...</span>
                        </span>
                    </button>
                </div>
            </form>
            
            <!-- Quick Helper / Demo Credentials -->
            <div class="mt-6 border-t border-slate-800/40 pt-4 text-center">
                <p class="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-2">Kredensial Demo:</p>
                <div class="grid grid-cols-2 gap-2 text-[10px] text-slate-300">
                    <div class="bg-slate-950/40 p-2 rounded-lg border border-slate-800/20">
                        <span class="font-bold text-slate-400 block">ADMIN:</span>
                        admin@spip.test / password
                    </div>
                    <div class="bg-slate-950/40 p-2 rounded-lg border border-slate-800/20">
                        <span class="font-bold text-slate-400 block">OPD:</span>
                        opd@spip.test / password
                    </div>
                    <div class="bg-slate-950/40 p-2 rounded-lg border border-slate-800/20">
                        <span class="font-bold text-slate-400 block">BAPPEDA:</span>
                        bappeda@spip.test / password
                    </div>
                    <div class="bg-slate-950/40 p-2 rounded-lg border border-slate-800/20">
                        <span class="font-bold text-slate-400 block">INSPEKTORAT:</span>
                        inspektorat@spip.test / password
                    </div>
                </div>
            </div>
        </div>
    </div>
</div><?php /**PATH D:\PROGRAM CODING\spip\spip\storage\framework\views/livewire/views/18d8ba2b.blade.php ENDPATH**/ ?>