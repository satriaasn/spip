<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Support\Facades\Gate::define('admin', fn(\App\Models\User $user) => $user->isAdmin());
        \Illuminate\Support\Facades\Gate::define('opd', fn(\App\Models\User $user) => $user->isOpd());
        \Illuminate\Support\Facades\Gate::define('bappeda', fn(\App\Models\User $user) => $user->isBappeda());
        \Illuminate\Support\Facades\Gate::define('inspektorat', fn(\App\Models\User $user) => $user->isInspektorat());
    }
}
