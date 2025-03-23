<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'special_price',
        'unit',
        'stock',
        'sku',
        'category_id',
        'is_featured',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'special_price' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Ensure special_price is properly cast when accessed
     */
    public function getSpecialPriceAttribute($value)
    {
        return $value !== null ? (float)$value : null;
    }

    /**
     * Ensure price is always a float
     */
    public function getPriceAttribute($value)
    {
        return (float)$value;
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function wishlist()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function getMainImageAttribute()
    {
        $primaryImage = $this->images()->where('is_primary', true)->first();
        return $primaryImage ? $primaryImage->image : 'default-product.jpg';
    }

    /**
     * Using ID as the route key name
     */
    public function getRouteKeyName()
    {
        return 'id';
    }

    public function getFinalPriceAttribute()
    {
        return $this->special_price ?? $this->price;
    }

    public function getDiscountPercentageAttribute()
    {
        if ($this->special_price && $this->price > 0) {
            return round(100 - (($this->special_price / $this->price) * 100));
        }
        return 0;
    }
}
