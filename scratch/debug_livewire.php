<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$finder = app('livewire.finder');

$names = [
    'pages.⚡login',
    'pages.login',
    'pages::⚡login',
    'pages::login',
    '⚡login',
    'login'
];

foreach ($names as $name) {
    try {
        $singlePath = $finder->resolveSingleFileComponentPath($name);
        $multiPath = $finder->resolveMultiFileComponentPath($name);
        $normName = $finder->normalizeName($name);
        echo "Name: $name\n";
        echo "  Normalized: $normName\n";
        echo "  Single File Path: " . ($singlePath ?: 'NOT FOUND') . "\n";
        echo "  Multi File Path: " . ($multiPath ?: 'NOT FOUND') . "\n";
        
        // Try resolving class
        // (Removed undefined method call)
    } catch (\Exception $e) {
        echo "Name: $name - ERROR: " . $e->getMessage() . "\n";
    }
    echo "\n";
}
