<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_score_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('assessment_id')->constrained('trx_spip_assessment')->onDelete('cascade');
            $table->foreignId('changed_by_user_id')->constrained('users')->onDelete('cascade');
            $table->string('user_role', 50); // 'BAPPEDA', 'INSPEKTORAT'
            $table->string('column_modified', 100); // 'grade_bappeda_verified' or 'grade_final_inspektorat'
            $table->string('old_value', 10)->nullable();
            $table->string('new_value', 10)->nullable();
            $table->text('justification_notes');
            $table->timestamp('created_at')->default(DB::raw('CURRENT_TIMESTAMP'));
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_score_logs');
    }
};
