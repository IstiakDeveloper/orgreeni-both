<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Area extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'city',
        'is_serviceable',
        'delivery_charge',
    ];

    protected $casts = [
        'is_serviceable' => 'boolean',
        'delivery_charge' => 'decimal:2',
    ];
}
