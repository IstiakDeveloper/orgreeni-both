<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',
        'total_amount',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    public function updateTotal()
    {
        // Recalculate to avoid any cached values
        $this->load('items');
        $this->total_amount = $this->items->sum(function ($item) {
            return (float) $item->price * (int) $item->quantity;
        });
        $this->save();

        return $this;
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

}
