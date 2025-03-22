<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'total_amount',
        'delivery_charge',
        'discount_amount',
        'payment_method',
        'payment_status',
        'order_status',
        'delivered_at',
        'address',
        'city',
        'area',
        'phone',
        'notes',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'delivery_charge' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'delivered_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public static function boot()
    {
        parent::boot();

        self::creating(function ($model) {
            $model->order_number = 'ORD-' . strtoupper(uniqid());
        });
    }
}
