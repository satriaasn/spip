<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trx_spip_assessment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('opd_id')->constrained('ref_opd')->onDelete('restrict');
            $table->foreignId('indicator_id')->constrained('ref_indicators')->onDelete('restrict');
            $table->foreignId('pohon_kinerja_id')->nullable()->constrained('mst_pohon_kinerja')->onDelete('set null');
            $table->integer('fiscal_year');
            $table->string('target_objective', 10)->nullable(); // 'T1', 'T2', 'T3', 'T4' (used for KK3.1-3.4)
            
            // Phase 1: OPD Entry
            $table->char('grade_self_opd', 1)->nullable(); // 'A', 'B', 'C', 'D', 'E'
            $table->string('aoi_cluster', 255)->nullable(); // Area of Improvement Cluster
            $table->text('aoi_description')->nullable(); // Detail of AoI
            $table->string('cause_cluster', 255)->nullable(); // Cause Cluster (Man, Method, Money, Material, Machine)
            $table->text('cause_description')->nullable(); // Cause details
            $table->text('evidence_url')->nullable(); // Mandatory URL link
            $table->text('notes_opd')->nullable();
            $table->timestamp('opd_submitted_at')->nullable();
            
            // Phase 2: Bappeda Verification
            $table->char('grade_bappeda_verified', 1)->nullable();
            $table->text('notes_bappeda')->nullable();
            $table->timestamp('bappeda_verified_at')->nullable();
            
            // Phase 3: Inspektorat QA Auditor Final Score
            $table->char('grade_final_inspektorat', 1)->nullable();
            $table->text('notes_inspektorat')->nullable();
            $table->timestamp('inspektorat_audited_at')->nullable();
            
            // Status and Update
            $table->string('status_flow', 40)->default('OPD_DRAFT'); // 'OPD_DRAFT', 'BAPPEDA_PROCESS', 'INSPEKTORAT_QA', 'FINAL_LOCKED'
            $table->timestamps();
            
            // Composite index for quick queries (making sure target_objective is handled for null values by including it or using unique combinations)
            $table->unique(['opd_id', 'indicator_id', 'fiscal_year', 'target_objective'], 'idx_opd_ind_year_obj');
            $table->index(['status_flow', 'fiscal_year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trx_spip_assessment');
    }
};
