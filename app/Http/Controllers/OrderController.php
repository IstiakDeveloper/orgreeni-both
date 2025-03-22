<?php

namespace App\Http\Controllers;

use App\Models\Area;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders in admin panel.
     */
    public function index()
    {
        $orders = Order::with('user')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders
        ]);
    }

    /**
     * Display the specified order in admin panel.
     */
    public function show(Order $order)
    {
        $order->load(['user', 'items.product.images' => function ($query) {
            $query->where('is_primary', true);
        }]);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order
        ]);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'order_status' => 'required|string|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'required|string|in:pending,paid,failed',
        ]);

        $order->update([
            'order_status' => $request->order_status,
            'payment_status' => $request->payment_status,
            'delivered_at' => $request->order_status === 'delivered' ? now() : $order->delivered_at,
        ]);

        return back()->with('success', 'Order status updated successfully.');
    }

    /**
     * Show checkout page
     */
    public function checkout()
    {
        // Redirect to cart if it's empty
        $cart = Cart::where(function ($query) {
            if (auth()->check()) {
                $query->where('user_id', auth()->id());
            } else {
                $query->where('session_id', session()->getId());
            }
        })->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart')->with('error', 'Your cart is empty.');
        }

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

        // Get serviceable areas
        $areas = Area::where('is_serviceable', true)
            ->orderBy('city')
            ->orderBy('name')
            ->get();

        return Inertia::render('Shop/Checkout', [
            'cart' => $cart,
            'coupon' => $coupon,
            'discountAmount' => $discountAmount,
            'areas' => $areas,
            'user' => auth()->user(),
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
        ]);

        // Check if the cart is not empty
        $cart = Cart::where(function ($query) {
            if (auth()->check()) {
                $query->where('user_id', auth()->id());
            } else {
                $query->where('session_id', session()->getId());
            }
        })->first();

        if (!$cart || $cart->items->isEmpty()) {
            return back()->with('error', 'Your cart is empty.');
        }

        $cart->load('items.product');

        // Check if all products are still available and in stock
        foreach ($cart->items as $item) {
            $product = $item->product;

            if (!$product->is_active) {
                return back()->with('error', "Product '{$product->name}' is no longer available.");
            }

            if ($product->stock < $item->quantity) {
                return back()->with('error', "Only {$product->stock} units of '{$product->name}' are available.");
            }
        }

        // Calculate total amount
        $totalAmount = $cart->total_amount;

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

        $deliveryCharge = $areaInfo ? $areaInfo->delivery_charge : 0;

        // Create order using database transaction
        try {
            DB::beginTransaction();

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
            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'subtotal' => $item->subtotal,
                ]);

                // Decrease product stock
                $item->product->decrement('stock', $item->quantity);
            }

            // Clear the cart
            $cart->items()->delete();
            $cart->updateTotal();

            // Clear coupon
            session()->forget('coupon_code');

            DB::commit();

            return redirect()->route('order.confirmation', ['order' => $order->id]);

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'An error occurred while placing your order. Please try again.');
        }
    }

    /**
     * Show order confirmation page
     */
    public function orderConfirmation(Order $order)
    {
        // Security check: make sure the order belongs to the authenticated user if logged in
        if (auth()->check() && $order->user_id !== auth()->id()) {
            abort(403);
        }

        // Allow guests to view their order confirmation immediately after placing an order
        $order->load(['items.product.images' => function ($query) {
            $query->where('is_primary', true);
        }]);

        return Inertia::render('Shop/OrderConfirmation', [
            'order' => $order
        ]);
    }

    /**
     * Display list of user orders
     */
    public function userOrders()
    {
        $orders = Order::where('user_id', auth()->id())
            ->latest()
            ->paginate(10);

        return Inertia::render('User/Orders', [
            'orders' => $orders
        ]);
    }

    /**
     * Display user order details
     */
    public function userOrderDetails(Order $order)
    {
        // Security check: make sure the order belongs to the authenticated user
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load(['items.product.images' => function ($query) {
            $query->where('is_primary', true);
        }]);

        return Inertia::render('User/OrderDetails', [
            'order' => $order
        ]);
    }
}
