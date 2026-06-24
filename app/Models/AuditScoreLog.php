<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditScoreLog extends Model
{
    protected $table = 'audit_score_logs';

    public $timestamps = false; // Custom created_at timestamp in migration

    protected $fillable = [
        'assessment_id',
        'changed_by_user_id',
        'user_role',
        'column_modified',
        'old_value',
        'new_value',
        'justification_notes',
    ];

    public function assessment(): BelongsTo
    {
        return $this->belongsTo(SpipAssessment::class, 'assessment_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by_user_id');
    }
}
