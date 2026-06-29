<!DOCTYPE html>
<html lang="<?php echo e(str_replace('_', '-', app()->getLocale())); ?>" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">

    <title><?php echo e($title ?? 'E-SPIP Terintegrasi'); ?></title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <!-- Styles -->
    <?php echo app('Illuminate\Foundation\Vite')(['resources/css/app.css', 'resources/js/app.js']); ?>
    <style>
        body {
            font-family: 'Outfit', sans-serif;
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.1);
        }
        ::-webkit-scrollbar-thumb {
            background: rgba(148, 163, 184, 0.3);
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: rgba(148, 163, 184, 0.5);
        }
    </style>
</head>
<body class="h-full bg-slate-950 text-slate-100 antialiased overflow-hidden">
    <div class="flex h-screen overflow-hidden">
        <!-- Sidebar -->
        <?php
$__split = function ($name, $params = []) {
    return [$name, $params];
};
[$__name, $__params] = $__split('layout.sidebar', []);

$__keyOuter = $__key ?? null;

$__key = null;
$__componentSlots = [];

$__key ??= \Livewire\Features\SupportCompiledWireKeys\SupportCompiledWireKeys::generateKey('lw-3351966160-0', $__key);

$__html = app('livewire')->mount($__name, $__params, $__key, $__componentSlots);

echo $__html;

unset($__html);
unset($__key);
$__key = $__keyOuter;
unset($__keyOuter);
unset($__name);
unset($__params);
unset($__componentSlots);
unset($__split);
?>

        <!-- Main Panel -->
        <div class="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
            <!-- Topbar (Optional profile or notification, here simplified) -->
            <header class="h-16 flex items-center justify-between px-8 border-b border-slate-800/40 bg-slate-950/40 backdrop-blur-md z-10">
                <div class="flex items-center space-x-4">
                    <h1 class="text-lg font-semibold tracking-wide text-slate-200">
                        <?php echo e($title ?? 'Dashboard'); ?>

                    </h1>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/40">
                        Fis. Year: <?php echo e(session('fiscal_year', date('Y'))); ?>

                    </span>
                    <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-brand-500/20">
                            <?php echo e(substr(auth()->user()->name ?? 'U', 0, 1)); ?>

                        </div>
                        <div class="hidden md:flex flex-col text-left">
                            <span class="text-xs font-semibold text-slate-200"><?php echo e(auth()->user()->name ?? 'Guest'); ?></span>
                            <span class="text-[10px] text-slate-400 uppercase tracking-wider"><?php echo e(auth()->user()->role ?? 'Public'); ?></span>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main View Content -->
            <main class="flex-1 p-6 md:p-8 overflow-y-auto">
                <div class="max-w-7xl mx-auto w-full space-y-6">
                    <?php echo e($slot); ?>

                </div>
            </main>
        </div>
    </div>
</body>
</html>
<?php /**PATH D:\PROGRAM CODING\spip\spip\resources\views/components/layouts/app.blade.php ENDPATH**/ ?>