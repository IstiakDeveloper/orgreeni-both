<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

        // Ensure cart exists
        $cart = Cart::firstOrCreate(
            ['user_id' => $user->id],
            ['total_amount' => 0]
        );

        // Load cart items
        $cart->load('cartItems.product.images');

        // If no cart items, redirect
        if ($cart->cartItems->isEmpty()) {
            return redirect()->route('home')->with('error', 'Your cart is empty. Please add items to cart first.');
        }

        // Rest of the existing code remains the same
        $paymentMethods = [
            ['id' => 'cash_on_delivery', 'name' => 'Cash on Delivery'],
            ['id' => 'bkash', 'name' => 'bKash'],
            ['id' => 'nagad', 'name' => 'Nagad'],
            ['id' => 'card', 'name' => 'Credit/Debit Card']
        ];

        $deliveryOptions = [
            ['id' => 'standard', 'name' => 'Standard Delivery (3-5 days)', 'cost' => 49],
            ['id' => 'express', 'name' => 'Express Delivery (1-2 days)', 'cost' => 99]
        ];

        return Inertia::render('checkout/index', [
            'cart' => $cart,
            'defaultAddress' => $user->addresses()->where('is_default', true)->first(),
            'paymentMethods' => $paymentMethods,
            'deliveryOptions' => $deliveryOptions,
            'user' => $user
        ]);
    }

    public function processOrder(Request $request)
    {
        // Validate request
        $validatedData = $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'payment_method' => 'required|in:cash_on_delivery,bkash,nagad,card',
            'delivery_option' => 'required|in:standard,express',
            'notes' => 'nullable|string|max:500'
        ]);

        // Start transaction
        \DB::beginTransaction();

        try {
            // Get user's cart
            $cart = Cart::where('user_id', Auth::id())
                ->with('cartItems.product')
                ->firstOrFail();

            // Calculate total
            $subtotal = $cart->cartItems->sum(function ($item) {
                return ($item->product->special_price ?? $item->product->price) * $item->quantity;
            });

            // Determine delivery cost
            $deliveryCost = $validatedData['delivery_option'] === 'express' ? 99 : 49;
            $total = $subtotal + $deliveryCost;

            // Create order
            $order = Order::create([
                'user_id' => Auth::id(),
                'address_id' => $validatedData['address_id'],
                'payment_method' => $validatedData['payment_method'],
                'delivery_option' => $validatedData['delivery_option'],
                'subtotal' => $subtotal,
                'delivery_cost' => $deliveryCost,
                'total' => $total,
                'status' => 'pending',
                'notes' => $validatedData['notes'] ?? null
            ]);

            // Create order items
            foreach ($cart->cartItems as $cartItem) {
                $order->orderItems()->create([
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->special_price ?? $cartItem->product->price
                ]);

                // Reduce product stock
                $cartItem->product->decrement('stock', $cartItem->quantity);
            }

            // Clear the cart
            $cart->cartItems()->delete();

            \DB::commit();

            // Redirect to order confirmation
            return redirect()->route('orders.show', $order->id)
                ->with('success', 'Order placed successfully!');

        } catch (\Exception $e) {
            \DB::rollBack();
            return back()->with('error', 'Failed to place order. Please try again.');
        }
    }
}
