<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Area;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the user's orders
     */
    public function index()
    {
        $user = Auth::user();

        $orders = Order::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

    /**
     * Display order details
     */
    public function show($id)
    {
        $user = Auth::user();

        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->with('orderItems.product')
            ->firstOrFail();

        return Inertia::render('Orders/Show', [
            'order' => $order,
            'success' => session('success')
        ]);
    }

    /**
     * Show order confirmation page
     */
    public function confirmation(Order $order)
    {
        // Make sure the order belongs to the authenticated user
        if (auth()->check() && $order->user_id !== auth()->id()) {
            abort(403);
        }

        // Load order details
        $order->load('orderItems.product');

        return Inertia::render('shop/order-confirmation', [
            'order' => $order
        ]);
    }

    /**
     * Place an order
     */
    public function placeOrder(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'area' => 'required|string',
            'payment_method' => 'required|string|in:cash_on_delivery,online_payment',
            'notes' => 'nullable|string',
            'cart_items' => 'nullable|array',
            'cart_items.*.product_id' => 'required|integer|exists:products,id',
            'cart_items.*.quantity' => 'required|integer|min:1',
            'cart_items.*.price' => 'nullable|numeric',
        ]);

        // Check if we have cart items from frontend or backend
        $hasCartItems = false;
        $cartItems = [];

        // First try to get cart from database
        $cart = Cart::where(function ($query) {
            if (auth()->check()) {
                $query->where('user_id', auth()->id());
            } else {
                $query->where('session_id', session()->getId());
            }
        })->first();

        if ($cart && $cart->items->isNotEmpty()) {
            $hasCartItems = true;
            $cart->load('items.product');
            $cartItems = $cart->items;
        } elseif ($request->has('cart_items') && !empty($request->cart_items)) {
            // If no database cart or it's empty, use the frontend cart items
            $hasCartItems = true;

            // Create temporary cart in memory with items from request
            $cart = new Cart();

            foreach ($request->cart_items as $item) {
                $product = Product::find($item['product_id']);

                if (!$product || !$product->is_active) {
                    return back()->with('error', 'One or more products are no longer available.');
                }

                if ($product->stock < $item['quantity']) {
                    return back()->with('error', "Only {$product->stock} units of '{$product->name}' are available.");
                }

                // Create a cart item (not saved to database)
                $cartItem = new \stdClass();
                $cartItem->product_id = $product->id;
                $cartItem->quantity = $item['quantity'];
                $cartItem->price = isset($item['price']) ? $item['price'] : ($product->special_price ?? $product->price);
                $cartItem->subtotal = $cartItem->price * $cartItem->quantity;
                $cartItem->product = $product;

                $cartItems[] = $cartItem;
            }
        }

        if (!$hasCartItems) {
            return back()->with('error', 'Your cart is empty.');
        }

        // Calculate total amount
        $totalAmount = 0;
        foreach ($cartItems as $item) {
            $totalAmount += ($item->price * $item->quantity);
        }

        // Apply coupon discount if any
        $couponCode = session('coupon_code');
        $discountAmount = 0;

        if ($couponCode) {
            $coupon = Coupon::where('code', $couponCode)->first();
            if ($coupon && $coupon->isValid($totalAmount)) {
                $discountAmount = $coupon->calculateDiscount($totalAmount);

                // Increment coupon usage
                $coupon->increment('used_count');
            }
        }

        // Calculate delivery charge based on area
        $areaInfo = Area::where('name', $request->area)
            ->where('city', $request->city)
            ->first();

        $deliveryCharge = $areaInfo ? $areaInfo->delivery_charge : 49; // Default to 49 if area not found

        // Create order using database transaction
        try {
            DB::beginTransaction();

            // Update user information if logged in
            if (auth()->check()) {
                auth()->user()->update([
                    'address' => $request->address,
                    'city' => $request->city,
                    'area' => $request->area,
                ]);
            }

            // Create the order
            $order = Order::create([
                'user_id' => auth()->check() ? auth()->id() : null,
                'total_amount' => $totalAmount - $discountAmount + $deliveryCharge,
                'delivery_charge' => $deliveryCharge,
                'discount_amount' => $discountAmount,
                'payment_method' => $request->payment_method,
                'payment_status' => 'pending',
                'order_status' => 'pending',
                'address' => $request->address,
                'city' => $request->city,
                'area' => $request->area,
                'phone' => $request->phone,
                'notes' => $request->notes,
            ]);

            // Create order items and update product stock
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'subtotal' => $item->price * $item->quantity,
                ]);

                // Decrease product stock
                $item->product->decrement('stock', $item->quantity);
            }

            // Clear the cart if it's a database cart
            if ($cart && isset($cart->id)) {
                $cart->items()->delete();
                $cart->updateTotal();
            }

            // Clear coupon
            session()->forget('coupon_code');

            DB::commit();

            return redirect()->route('order.confirmation', ['order' => $order->id])
                ->with('success', 'অর্ডার সফলভাবে প্লেস করা হয়েছে!');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Order placement error: ' . $e->getMessage());
            return back()->with('error', 'An error occurred while placing your order: ' . $e->getMessage());
        }
    }
}
