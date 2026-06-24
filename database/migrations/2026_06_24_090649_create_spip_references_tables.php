<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Reference: Sub-elements of SPIP / MRI / IEPK
        Schema::create('ref_sub_elements', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique();
            $table->string('name', 255);
            $table->string('type', 20); // 'SPIP', 'MRI', 'IEPK'
            $table->timestamps();
        });

        // 2. Reference: Checklist Indicators per Sub-element
        Schema::create('ref_indicators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sub_element_id')->constrained('ref_sub_elements')->onDelete('cascade');
            $table->integer('indicator_number');
            $table->text('indicator_name');
            $table->timestamps();
            
            $table->unique(['sub_element_id', 'indicator_number']);
        });

        // 3. Reference: Criteria mapping for each Grade A-E per Indicator
        Schema::create('ref_indicator_grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('indicator_id')->constrained('ref_indicators')->onDelete('cascade');
            $table->char('grade', 1); // 'A', 'B', 'C', 'D', 'E'
            $table->text('criteria');
            $table->text('explanation')->nullable();
            $table->text('testing_method')->nullable();
            $table->timestamps();
            
            $table->unique(['indicator_id', 'grade']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ref_indicator_grades');
        Schema::dropIfExists('ref_indicators');
        Schema::dropIfExists('ref_sub_elements');
    }
};
