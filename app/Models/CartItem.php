<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
        'price',
        'subtotal',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public static function boot()
    {
        parent::boot();

        self::creating(function ($model) {
            $model->subtotal = $model->price * $model->quantity;
        });

        self::updating(function ($model) {
            $model->subtotal = $model->price * $model->quantity;
        });

        self::saved(function ($model) {
            $model->cart->updateTotal();
        });

        self::deleted(function ($model) {
            $model->cart->updateTotal();
        });
    }


}
