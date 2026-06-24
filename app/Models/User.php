<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'role', 'opd_id'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function opd(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Opd::class, 'opd_id');
    }

    // Role helper checks
    public function isAdmin(): bool
    {
        return strtoupper($this->role) === 'ADMIN';
    }

    public function isOpd(): bool
    {
        return strtoupper($this->role) === 'OPD';
    }

    public function isBappeda(): bool
    {
        return strtoupper($this->role) === 'BAPPEDA';
    }

    public function isInspektorat(): bool
    {
        return strtoupper($this->role) === 'INSPEKTORAT';
    }
}
