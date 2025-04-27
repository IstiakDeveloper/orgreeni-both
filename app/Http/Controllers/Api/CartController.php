<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    /**
     * Get the current user's cart
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        // Get or create cart
        $cart = Cart::with(['cartItems.product.images'])
            ->firstOrCreate(
                ['user_id' => $user->id],
                ['total_amount' => 0]
            );

        // Calculate cart total
        $totalAmount = $cart->cartItems->sum(function ($item) {
            return ($item->product->special_price ?? $item->product->price) * $item->quantity;
        });

        // Update cart total if it has changed
        if ($cart->total_amount != $totalAmount) {
            $cart->total_amount = $totalAmount;
            $cart->save();
        }

        // Transform data for frontend
        $cartItems = $cart->cartItems->map(function ($item) {
            $product = $item->product;

            return [
                'id' => $item->id,
                'product_id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'special_price' => $product->special_price,
                'unit' => $product->unit,
                'stock' => $product->stock,
                'quantity' => $item->quantity,
                'image' => $product->images->first() ? $product->images->first()->path : null,
            ];
        });

        return response()->json([
            'cartItems' => $cartItems,
            'totalAmount' => $totalAmount,
            'itemCount' => $cart->cartItems->sum('quantity')
        ]);
    }

    /**
     * Sync the cart with the frontend state
     */
    public function sync(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        $validatedData = $request->validate([
            'items' => 'present|array',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            // Get or create cart
            $cart = Cart::firstOrCreate(
                ['user_id' => $user->id],
                ['total_amount' => 0]
            );

            // Clear existing cart items
            CartItem::where('cart_id', $cart->id)->delete();

            // Add new cart items and validate stock
            $totalAmount = 0;

            foreach ($validatedData['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                // Ensure quantity doesn't exceed stock
                $quantity = min($item['quantity'], $product->stock);

                if ($quantity > 0) {
                    // Create cart item
                    CartItem::create([
                        'cart_id' => $cart->id,
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                    ]);

                    // Add to total
                    $price = $product->special_price ?? $product->price;
                    $totalAmount += $price * $quantity;
                }
            }

            // Update cart total
            $cart->total_amount = $totalAmount;
            $cart->save();

            DB::commit();

            return response()->json([
                'message' => 'Cart synchronized successfully',
                'totalAmount' => $totalAmount,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to sync cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add a product to the cart
     */
    public function addItem(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        $validatedData = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            // Get product and check stock
            $product = Product::findOrFail($validatedData['product_id']);

            if ($product->stock < $validatedData['quantity']) {
                return response()->json([
                    'message' => 'Not enough stock available',
                ], 422);
            }

            // Get or create cart
            $cart = Cart::firstOrCreate(
                ['user_id' => $user->id],
                ['total_amount' => 0]
            );

            // Check if product already in cart
            $cartItem = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $validatedData['product_id'])
                ->first();

            if ($cartItem) {
                // Update quantity
                $newQuantity = $cartItem->quantity + $validatedData['quantity'];

                // Check if new quantity exceeds stock
                if ($newQuantity > $product->stock) {
                    return response()->json([
                        'message' => 'Cannot add more of this product (stock limit reached)',
                    ], 422);
                }

                $cartItem->quantity = $newQuantity;
                $cartItem->save();
            } else {
                // Create new cart item
                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $validatedData['product_id'],
                    'quantity' => $validatedData['quantity'],
                ]);
            }

            // Recalculate cart total
            $totalAmount = CartItem::where('cart_id', $cart->id)
                ->join('products', 'cart_items.product_id', '=', 'products.id')
                ->selectRaw('SUM(COALESCE(products.special_price, products.price) * cart_items.quantity) as total')
                ->value('total');

            $cart->total_amount = $totalAmount;
            $cart->save();

            DB::commit();

            return response()->json([
                'message' => 'Product added to cart',
                'totalAmount' => $totalAmount,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to add product to cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove a product from the cart
     */
    public function removeItem(Request $request, $productId)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        $quantity = $request->input('quantity');

        DB::beginTransaction();

        try {
            // Get cart
            $cart = Cart::where('user_id', $user->id)->first();

            if (!$cart) {
                return response()->json([
                    'message' => 'Cart not found',
                ], 404);
            }

            // Find cart item
            $cartItem = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $productId)
                ->first();

            if (!$cartItem) {
                return response()->json([
                    'message' => 'Product not found in cart',
                ], 404);
            }

            // Remove specific quantity or entire item
            if ($quantity && $quantity < $cartItem->quantity) {
                $cartItem->quantity -= $quantity;
                $cartItem->save();
            } else {
                $cartItem->delete();
            }

            // Recalculate cart total
            $totalAmount = CartItem::where('cart_id', $cart->id)
                ->join('products', 'cart_items.product_id', '=', 'products.id')
                ->selectRaw('SUM(COALESCE(products.special_price, products.price) * cart_items.quantity) as total')
                ->value('total') ?? 0;

            $cart->total_amount = $totalAmount;
            $cart->save();

            DB::commit();

            return response()->json([
                'message' => 'Product removed from cart',
                'totalAmount' => $totalAmount,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to remove product from cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear the cart
     */
    public function clear()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'User not authenticated',
            ], 401);
        }

        DB::beginTransaction();

        try {
            // Get cart
            $cart = Cart::where('user_id', $user->id)->first();

            if ($cart) {
                // Delete all cart items
                CartItem::where('cart_id', $cart->id)->delete();

                // Reset cart total
                $cart->total_amount = 0;
                $cart->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Cart cleared successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to clear cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
