<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PohonKinerja extends Model
{
    protected $table = 'mst_pohon_kinerja';

    protected $fillable = [
        'parent_id',
        'fiscal_year',
        'level_type',
        'opd_id',
        'title_objective',
        'indicator_name',
        'target_value',
        'unit_of_measurement',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(PohonKinerja::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(PohonKinerja::class, 'parent_id');
    }

    public function opd(): BelongsTo
    {
        return $this->belongsTo(Opd::class, 'opd_id');
    }

    public function assessments(): HasMany
    {
        return $this->hasMany(SpipAssessment::class, 'pohon_kinerja_id');
    }
}
