<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IndicatorGrade extends Model
{
    protected $table = 'ref_indicator_grades';

    protected $fillable = [
        'indicator_id',
        'grade',
        'criteria',
        'explanation',
        'testing_method',
    ];

    public function indicator(): BelongsTo
    {
        return $this->belongsTo(Indicator::class, 'indicator_id');
    }
}
