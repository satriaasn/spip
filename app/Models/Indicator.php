<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Indicator extends Model
{
    protected $table = 'ref_indicators';

    protected $fillable = [
        'sub_element_id',
        'indicator_number',
        'indicator_name',
    ];

    public function subElement(): BelongsTo
    {
        return $this->belongsTo(SubElement::class, 'sub_element_id');
    }

    public function grades(): HasMany
    {
        return $this->hasMany(IndicatorGrade::class, 'indicator_id');
    }

    public function assessments(): HasMany
    {
        return $this->hasMany(SpipAssessment::class, 'indicator_id');
    }
}
