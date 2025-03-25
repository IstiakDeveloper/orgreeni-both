<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
        $cart->load([
            'items.product.images' => function ($query) {
                $query->where('is_primary', true);
            }
        ]);

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

        // Reset any previous stock values that might be cached
        $product = Product::select('id', 'name', 'price', 'special_price', 'stock', 'is_active')
            ->where('id', $request->product_id)
            ->firstOrFail();

        // Check if product is active
        if (!$product->is_active) {
            return back()->with('error', 'This product is not available.');
        }

        // Force these to be integers for comparison
        $productStock = (int) $product->stock;
        $requestQuantity = (int) $request->quantity;

        // Check if quantity is available in stock
        if ($productStock < $requestQuantity) {
            return back()->with('error', 'The requested quantity is not available in stock.');
        }

        $cart = $this->getOrCreateCart();

        // Check if product already exists in cart
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            // Update quantity
            $newQuantity = (int) $cartItem->quantity + $requestQuantity;

            // Check with proper type casting
            if ($productStock < $newQuantity) {
                return back()->with('error', 'The requested quantity is not available in stock.');
            }

            // Calculate price and subtotal explicitly
            $price = $product->special_price !== null ? (float) $product->special_price : (float) $product->price;
            $subtotal = $price * $newQuantity;

            try {
                $cartItem->update([
                    'quantity' => $newQuantity,
                    'price' => $price,
                    'subtotal' => $subtotal
                ]);
            } catch (\Exception $e) {
                return back()->with('error', 'Error updating cart.');
            }
        } else {
            // Create new cart item with explicit subtotal calculation
            $price = $product->special_price !== null ? (float) $product->special_price : (float) $product->price;
            $subtotal = $price * $requestQuantity;

            try {
                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'quantity' => $requestQuantity,
                    'price' => $price,
                    'subtotal' => $subtotal
                ]);
            } catch (\Exception $e) {
                return back()->with('error', 'Error adding to cart.');
            }
        }

        // Update cart total
        $cart->updateTotal();

        return back()->with('success', 'Product added to cart successfully');
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
            return back()->with('error', 'Unauthorized action.');
        }

        $product = Product::findOrFail($cartItem->product_id);

        // Force to integers for comparison
        $productStock = (int) $product->stock;
        $requestQuantity = (int) $request->quantity;

        // Check if quantity is available in stock
        if ($productStock < $requestQuantity) {
            return back()->with('error', 'The requested quantity is not available in stock.');
        }

        // Ensure price is stored
        $price = $product->special_price !== null ? (float) $product->special_price : (float) $product->price;
        $subtotal = $price * $requestQuantity;

        $cartItem->update([
            'quantity' => $requestQuantity,
            'price' => $price,
            'subtotal' => $subtotal
        ]);

        // Update cart total
        $cart->updateTotal();

        return back()->with('success', 'Cart updated successfully');
    }

    /**
     * Remove item from cart
     */
    public function removeCartItem(CartItem $cartItem)
    {
        $cart = $this->getOrCreateCart();

        // Check if cart item belongs to the current cart
        if ($cartItem->cart_id != $cart->id) {
            return back()->with('error', 'Unauthorized action.');
        }

        $cartItem->delete();

        // Update cart total
        $cart->updateTotal();

        return back()->with('success', 'Item removed from cart');
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

        return back()->with('success', 'Cart cleared successfully');
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
            return back()->with('error', 'Cannot apply coupon to an empty cart.');
        }

        $coupon = Coupon::where('code', $request->coupon_code)->first();

        if (!$coupon->isValid($cart->total_amount)) {
            return back()->with('error', 'This coupon is not valid or has expired.');
        }

        // Store coupon code in session
        session(['coupon_code' => $request->coupon_code]);

        return back()->with('success', 'Coupon applied successfully');
    }

    /**
     * Remove coupon from cart
     */
    public function removeCoupon()
    {
        session()->forget('coupon_code');

        return back()->with('success', 'Coupon removed successfully');
    }

    /**
     * Get cart count for header
     */
    public function getCartCount()
    {
        $cart = $this->getOrCreateCart();
        $count = $cart->items->sum('quantity');

        // For Inertia requests, use Inertia response
        if (request()->header('X-Inertia')) {
            return Inertia::render('partials/CartCount', [
                'count' => $count
            ]);
        }

        return response()->json([
            'count' => $count
        ]);
    }

    public function getCartItems()
    {
        $cart = $this->getOrCreateCart();

        $cart->load([
            'items.product.images' => function ($query) {
                $query->where('is_primary', true);
            }
        ]);

        return response()->json([
            'items' => $cart->items
        ]);
    }

    public function sync(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validatedItems = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        DB::beginTransaction();

        try {
            // Ensure cart exists for the user
            $cart = Cart::firstOrCreate(
                ['user_id' => Auth::id()],
                ['total_amount' => 0]
            );

            // Clear existing cart items
            $cart->cartItems()->delete();

            $totalAmount = 0;
            // Add new cart items
            foreach ($validatedItems['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                // Check stock availability
                if ($item['quantity'] > $product->stock) {
                    throw new \Exception("Insufficient stock for product {$product->name}");
                }

                $price = $product->special_price ?? $product->price;
                $subtotal = $price * $item['quantity'];

                // Create cart item
                $cart->cartItems()->create([
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $price,
                    'subtotal' => $subtotal
                ]);

                $totalAmount += $subtotal;
            }

            // Update cart total
            $cart->total_amount = $totalAmount;
            $cart->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Cart synced successfully',
                'cart' => $cart->load('cartItems')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Cart Sync Error', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'items' => $validatedItems['items']
            ]);

            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function restore()
    {
        if (!Auth::check()) {
            return response()->json(['items' => []], 200);
        }

        // Ensure cart exists
        $cart = Cart::firstOrCreate(
            ['user_id' => Auth::id()],
            ['total_amount' => 0]
        );

        // Load cart items with product details
        $cart->load([
            'cartItems.product' => function ($query) {
                $query->select('id', 'name', 'price', 'special_price', 'stock', 'unit');
            }
        ]);

        // Transform cart items
        $items = $cart->cartItems->mapWithKeys(function ($cartItem) {
            return [
                $cartItem->product_id => [
                    'id' => $cartItem->product_id,
                    'product_id' => $cartItem->product_id,
                    'name' => $cartItem->product->name,
                    'price' => $cartItem->product->price,
                    'special_price' => $cartItem->product->special_price,
                    'quantity' => $cartItem->quantity,
                    'unit' => $cartItem->product->unit,
                    'stock' => $cartItem->product->stock
                ]
            ];
        });

        return response()->json(['items' => $items]);
    }

}
