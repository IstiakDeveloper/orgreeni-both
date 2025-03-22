<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Get the user's cart or create one if it doesn't exist
     */
    private function getOrCreateCart()
    {
        if (auth()->check()) {
            // Get or create the user's cart
            $cart = Cart::firstOrCreate(
                ['user_id' => auth()->id()],
                ['total_amount' => 0]
            );
        } else {
            // Get or create a cart for the guest using session ID
            $sessionId = session()->getId();

            $cart = Cart::firstOrCreate(
                ['session_id' => $sessionId],
                ['total_amount' => 0]
            );
        }

        return $cart;
    }

    /**
     * Display the shopping cart page
     */
    public function showCart()
    {
        $cart = $this->getOrCreateCart();
        $cart->load(['items.product.images' => function ($query) {
            $query->where('is_primary', true);
        }]);

        // Get applied coupon if any
        $couponCode = session('coupon_code');
        $coupon = null;
        $discountAmount = 0;

        if ($couponCode) {
            $coupon = Coupon::where('code', $couponCode)->first();
            if ($coupon && $coupon->isValid($cart->total_amount)) {
                $discountAmount = $coupon->calculateDiscount($cart->total_amount);
            } else {
                // Clear invalid coupon
                session()->forget('coupon_code');
            }
        }

        return Inertia::render('Shop/Cart', [
            'cart' => $cart,
            'coupon' => $coupon,
            'discountAmount' => $discountAmount,
        ]);
    }

    /**
     * Add a product to the cart
     */
    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Check if product is active
        if (!$product->is_active) {
            return response()->json([
                'message' => 'This product is not available.'
            ], 400);
        }

        // Check if quantity is available in stock
        if ($product->stock < $request->quantity) {
            return response()->json([
                'message' => 'The requested quantity is not available in stock.'
            ], 400);
        }

        $cart = $this->getOrCreateCart();

        // Check if product already exists in cart
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            // Update quantity
            $newQuantity = $cartItem->quantity + $request->quantity;

            // Check if new quantity is available in stock
            if ($product->stock < $newQuantity) {
                return response()->json([
                    'message' => 'The requested quantity is not available in stock.'
                ], 400);
            }

            $cartItem->update([
                'quantity' => $newQuantity,
                // Use special price if available, otherwise use regular price
                'price' => $product->special_price ?? $product->price,
            ]);
        } else {
            // Create new cart item
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $request->quantity,
                'price' => $product->special_price ?? $product->price,
            ]);
        }

        // Update cart total
        $cart->updateTotal();

        return response()->json([
            'message' => 'Product added to cart successfully',
            'cart_count' => $cart->items->sum('quantity')
        ]);
    }

    /**
     * Update cart item quantity
     */
    public function updateCartItem(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = $this->getOrCreateCart();

        // Check if cart item belongs to the current cart
        if ($cartItem->cart_id != $cart->id) {
            return response()->json([
                'message' => 'Unauthorized action.'
            ], 403);
        }

        $product = $cartItem->product;

        // Check if quantity is available in stock
        if ($product->stock < $request->quantity) {
            return response()->json([
                'message' => 'The requested quantity is not available in stock.'
            ], 400);
        }

        $cartItem->update([
            'quantity' => $request->quantity,
        ]);

        // Update cart total
        $cart->updateTotal();

        return response()->json([
            'message' => 'Cart updated successfully',
            'cart_item' => $cartItem->fresh(),
            'cart_total' => $cart->total_amount,
        ]);
    }

    /**
     * Remove item from cart
     */
    public function removeCartItem(CartItem $cartItem)
    {
        $cart = $this->getOrCreateCart();

        // Check if cart item belongs to the current cart
        if ($cartItem->cart_id != $cart->id) {
            return response()->json([
                'message' => 'Unauthorized action.'
            ], 403);
        }

        $cartItem->delete();

        // Update cart total
        $cart->updateTotal();

        return response()->json([
            'message' => 'Item removed from cart',
            'cart_total' => $cart->total_amount,
            'cart_count' => $cart->items->sum('quantity')
        ]);
    }

    /**
     * Clear the entire cart
     */
    public function clearCart()
    {
        $cart = $this->getOrCreateCart();

        // Delete all cart items
        CartItem::where('cart_id', $cart->id)->delete();

        // Update cart total
        $cart->updateTotal();

        // Clear any applied coupon
        session()->forget('coupon_code');

        return response()->json([
            'message' => 'Cart cleared successfully'
        ]);
    }

    /**
     * Apply coupon to cart
     */
    public function applyCoupon(Request $request)
    {
        $request->validate([
            'coupon_code' => 'required|string|exists:coupons,code',
        ]);

        $cart = $this->getOrCreateCart();

        if ($cart->total_amount <= 0) {
            return response()->json([
                'message' => 'Cannot apply coupon to an empty cart.'
            ], 400);
        }

        $coupon = Coupon::where('code', $request->coupon_code)->first();

        if (!$coupon->isValid($cart->total_amount)) {
            return response()->json([
                'message' => 'This coupon is not valid or has expired.'
            ], 400);
        }

        // Store coupon code in session
        session(['coupon_code' => $request->coupon_code]);

        $discountAmount = $coupon->calculateDiscount($cart->total_amount);

        return response()->json([
            'message' => 'Coupon applied successfully',
            'discount_amount' => $discountAmount,
            'coupon' => $coupon
        ]);
    }

    /**
     * Remove coupon from cart
     */
    public function removeCoupon()
    {
        session()->forget('coupon_code');

        return response()->json([
            'message' => 'Coupon removed successfully'
        ]);
    }

    /**
     * Get cart count for header
     */
    public function getCartCount()
    {
        $cart = $this->getOrCreateCart();

        return response()->json([
            'count' => $cart->items->sum('quantity')
        ]);
    }
}
