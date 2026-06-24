<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SpipAssessment extends Model
{
    protected $table = 'trx_spip_assessment';

    protected $fillable = [
        'opd_id',
        'indicator_id',
        'pohon_kinerja_id',
        'fiscal_year',
        'target_objective',
        
        // Phase 1
        'grade_self_opd',
        'aoi_cluster',
        'aoi_description',
        'cause_cluster',
        'cause_description',
        'evidence_url',
        'notes_opd',
        'opd_submitted_at',
        
        // Phase 2
        'grade_bappeda_verified',
        'notes_bappeda',
        'bappeda_verified_at',
        
        // Phase 3
        'grade_final_inspektorat',
        'notes_inspektorat',
        'inspektorat_audited_at',
        
        'status_flow',
    ];

    protected $casts = [
        'opd_submitted_at' => 'datetime',
        'bappeda_verified_at' => 'datetime',
        'inspektorat_audited_at' => 'datetime',
    ];

    public function opd(): BelongsTo
    {
        return $this->belongsTo(Opd::class, 'opd_id');
    }

    public function indicator(): BelongsTo
    {
        return $this->belongsTo(Indicator::class, 'indicator_id');
    }

    public function pohonKinerja(): BelongsTo
    {
        return $this->belongsTo(PohonKinerja::class, 'pohon_kinerja_id');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditScoreLog::class, 'assessment_id');
    }

    // Helper conversion from grade letter to score number
    public static function gradeToScore(?string $grade): float
    {
        if (!$grade) return 0.0;
        $map = [
            'A' => 5.0,
            'B' => 4.0,
            'C' => 3.0,
            'D' => 2.0,
            'E' => 1.0,
        ];
        return $map[strtoupper($grade)] ?? 0.0;
    }

    public function getSelfScoreAttribute(): float
    {
        return self::gradeToScore($this->grade_self_opd);
    }

    public function getVerifiedScoreAttribute(): float
    {
        return self::gradeToScore($this->grade_bappeda_verified);
    }

    public function getFinalScoreAttribute(): float
    {
        return self::gradeToScore($this->grade_final_inspektorat);
    }

    // Get live deviation (Final score - Self score)
    public function getDeviationAttribute(): float
    {
        $final = $this->grade_final_inspektorat ? $this->final_score : ($this->grade_bappeda_verified ? $this->verified_score : $this->self_score);
        return $final - $this->self_score;
    }
}
