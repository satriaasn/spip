<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mst_pohon_kinerja', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('mst_pohon_kinerja')->onDelete('cascade');
            $table->integer('fiscal_year');
            $table->string('level_type', 50); // 'PEMDA', 'OPD', 'PROGRAM', 'KEGIATAN', 'SUB_KEGIATAN'
            $table->foreignId('opd_id')->nullable()->constrained('ref_opd')->onDelete('cascade');
            $table->text('title_objective');
            $table->text('indicator_name');
            $table->string('target_value', 100);
            $table->string('unit_of_measurement', 50);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mst_pohon_kinerja');
    }
};
