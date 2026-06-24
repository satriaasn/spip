<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubElement extends Model
{
    protected $table = 'ref_sub_elements';

    protected $fillable = [
        'code',
        'name',
        'type',
    ];

    public function indicators(): HasMany
    {
        return $this->hasMany(Indicator::class, 'sub_element_id');
    }
}
