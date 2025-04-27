<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\Coupon;
use App\Models\Area;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index()
    {
        // If not logged in, redirect to login
        if (!Auth::check()) {
            return redirect()->route('login', [
                'redirect' => route('checkout.index')
            ]);
        }

        $user = Auth::user();

        // Get or create cart
        $cart = Cart::where(function ($query) {
            if (auth()->check()) {
                $query->where('user_id', auth()->id());
            } else {
                $query->where('session_id', session()->getId());
            }
        })->first();

        // If no cart found, create one
        if (!$cart) {
            $cart = Cart::create([
                'user_id' => Auth::id(),
                'session_id' => session()->getId(),
                'total_amount' => 0
            ]);
        }

        // Load cart items with product details
        $cart->load(['items.product.images']);

        // Transform cart items for frontend (if any)
        $formattedItems = [];
        $subtotal = 0;
        $itemCount = 0;

        foreach ($cart->items as $item) {
            $product = $item->product;
            $price = $product->special_price ?? $product->price;
            $itemTotal = $price * $item->quantity;
            $subtotal += $itemTotal;
            $itemCount += $item->quantity;

            // Get the product image
            $image = null;
            if ($product->images && $product->images->isNotEmpty()) {
                $primaryImage = $product->images->where('is_primary', true)->first();
                $image = $primaryImage ? $primaryImage->image : $product->images->first()->image;
            }

            $formattedItems[$product->id] = [
                'id' => $product->id,
                'product_id' => $product->id,
                'name' => $product->name,
                'price' => (float)$product->price,
                'special_price' => $product->special_price ? (float)$product->special_price : null,
                'image' => $image,
                'unit' => $product->unit,
                'stock' => (int)$product->stock,
                'quantity' => (int)$item->quantity
            ];
        }

        // Define available payment methods
        $paymentMethods = [
            ['id' => 'cash_on_delivery', 'name' => 'Cash on Delivery'],
            ['id' => 'online_payment', 'name' => 'Online Payment']
        ];

        // Define delivery options
        $deliveryOptions = [
            ['id' => 'standard', 'name' => 'Standard Delivery (3-5 days)', 'cost' => 49],
            ['id' => 'express', 'name' => 'Express Delivery (1-2 days)', 'cost' => 99]
        ];

        // Apply coupon discount if any
        $couponCode = session('coupon_code');
        $coupon = null;
        $discountAmount = 0;

        if ($couponCode) {
            $coupon = Coupon::where('code', $couponCode)->first();
            if ($coupon && $coupon->isValid($subtotal)) {
                $discountAmount = $coupon->calculateDiscount($subtotal);
            } else {
                // Clear invalid coupon
                session()->forget('coupon_code');
            }
        }

        // Return Inertia view with data
        return Inertia::render('checkout/index', [
            'cartFromServer' => [
                'items' => $formattedItems,
                'total' => (float)$subtotal,
                'count' => $itemCount
            ],
            'discountAmount' => $discountAmount,
            'coupon' => $coupon,
            'paymentMethods' => $paymentMethods,
            'deliveryOptions' => $deliveryOptions,
            'user' => $user
        ]);
    }
}
