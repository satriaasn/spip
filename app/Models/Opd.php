<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Opd extends Model
{
    protected $table = 'ref_opd';

    protected $fillable = [
        'code_opd',
        'name_opd',
        'alias_opd',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'opd_id');
    }

    public function assessments(): HasMany
    {
        return $this->hasMany(SpipAssessment::class, 'opd_id');
    }

    public function pohonKinerjas(): HasMany
    {
        return $this->hasMany(PohonKinerja::class, 'opd_id');
    }
}
