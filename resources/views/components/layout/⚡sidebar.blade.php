<?php

use Livewire\Component;

new class extends Component
{
    public function logout()
    {
        auth()->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();
        return $this->redirect('/login', navigate: true);
    }
};
?>

<aside class="w-64 bg-slate-950/80 border-r border-slate-800/40 backdrop-blur-lg flex flex-col justify-between h-screen p-6 select-none shrink-0 z-20">
    <div class="space-y-8">
        <!-- Logo -->
        <div class="flex items-center space-x-3 px-2">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <div>
                <h2 class="text-sm font-bold tracking-wider text-slate-100 uppercase">E-SPIP</h2>
                <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Terintegrasi</p>
            </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="space-y-1.5">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 block mb-2">Menu Utama</span>

            <a href="/dashboard" wire:navigate class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 {{ request()->is('dashboard') ? 'bg-brand-600/10 border border-brand-500/20 text-brand-400 shadow-sm' : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent' }}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path></svg>
                <span>Dashboard</span>
            </a>

            @if(auth()->user()->isAdmin() || auth()->user()->isBappeda())
            <a href="/pohon-kinerja" wire:navigate class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 {{ request()->is('pohon-kinerja') ? 'bg-brand-600/10 border border-brand-500/20 text-brand-400 shadow-sm' : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent' }}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                <span>Pohon Kinerja</span>
            </a>
            @endif

            @if(auth()->user()->isOpd() || auth()->user()->isAdmin())
            <a href="/assessment-grid" wire:navigate class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 {{ request()->is('assessment-grid') ? 'bg-brand-600/10 border border-brand-500/20 text-brand-400 shadow-sm' : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent' }}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                <span>Lembar Kerja Evaluasi</span>
            </a>
            @endif

            @if(auth()->user()->isBappeda() || auth()->user()->isInspektorat() || auth()->user()->isAdmin())
            <a href="/score-adjustment" wire:navigate class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 {{ request()->is('score-adjustment') ? 'bg-brand-600/10 border border-brand-500/20 text-brand-400 shadow-sm' : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 border border-transparent' }}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm9 0v-8a3 3 0 00-3-3h-1a3 3 0 00-3 3v8a3 3 0 003 3h1a3 3 0 003-3z"></path></svg>
                <span>Verifikasi Nilai QA</span>
            </a>
            @endif
        </nav>
    </div>

    <!-- User Section / Log Out -->
    <div class="space-y-4 pt-4 border-t border-slate-800/40">
        <button wire:click="logout" class="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-transparent transition-all duration-300 cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span>Keluar Sistem</span>
        </button>
    </div>
</aside>