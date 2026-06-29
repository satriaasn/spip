<?php
include 'vendor/autoload.php';
$app = include 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$aliases = array_keys(app(\Livewire\LivewireManager::class)->getAliases());
echo "Registered Livewire Components:\n";
print_r($aliases);
