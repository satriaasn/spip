<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return Auth::check() ? redirect('/dashboard') : redirect('/login');
});

Route::get('/login', function () {
    if (Auth::check()) {
        return redirect('/dashboard');
    }
    return view('login');
})->name('login');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    });

    Route::get('/pohon-kinerja', function () {
        if (!auth()->user()->isAdmin() && !auth()->user()->isBappeda()) {
            abort(403, 'Akses ditolak. Hanya Admin dan Bappeda yang dapat mengakses halaman ini.');
        }
        return view('pohon-kinerja');
    });

    Route::get('/assessment-grid', function () {
        if (!auth()->user()->isOpd() && !auth()->user()->isAdmin()) {
            abort(403, 'Akses ditolak. Hanya Operator OPD dan Admin yang dapat mengakses halaman ini.');
        }
        return view('assessment-grid');
    });

    Route::get('/score-adjustment', function () {
        if (auth()->user()->isOpd()) {
            abort(403, 'Akses ditolak. Operator OPD tidak diizinkan mengakses menu Verifikasi Nilai.');
        }
        return view('score-adjustment');
    });
});
