<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display user's wishlist.
     */
    public function index()
    {
        $wishlist = Wishlist::with(['product.category', 'product.images' => function ($query) {
                $query->where('is_primary', true);
            }])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('User/Wishlist', [
            'wishlist' => $wishlist
        ]);
    }

    /**
     * Add a product to wishlist.
     */
    public function addToWishlist(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        // Check if product is already in wishlist
        $exists = Wishlist::where('user_id', auth()->id())
            ->where('product_id', $request->product_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Product is already in your wishlist.'
            ]);
        }

        // Add to wishlist
        Wishlist::create([
            'user_id' => auth()->id(),
            'product_id' => $request->product_id,
        ]);

        return response()->json([
            'message' => 'Product added to wishlist successfully.'
        ]);
    }

    /**
     * Remove a product from wishlist.
     */
    public function removeFromWishlist(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        Wishlist::where('user_id', auth()->id())
            ->where('product_id', $request->product_id)
            ->delete();

        return response()->json([
            'message' => 'Product removed from wishlist successfully.'
        ]);
    }

    /**
     * Check if a product is in wishlist.
     */
    public function checkWishlist(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $inWishlist = Wishlist::where('user_id', auth()->id())
            ->where('product_id', $request->product_id)
            ->exists();

        return response()->json([
            'in_wishlist' => $inWishlist
        ]);
    }

    /**
     * Move a product from wishlist to cart.
     */
    public function moveToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        // First get the product
        $product = Product::findOrFail($request->product_id);

        // Check if product is active
        if (!$product->is_active) {
            return response()->json([
                'message' => 'This product is not available.'
            ], 400);
        }

        // Check if product is in stock
        if ($product->stock <= 0) {
            return response()->json([
                'message' => 'This product is out of stock.'
            ], 400);
        }

        // Add to cart using the CartController
        app(CartController::class)->addToCart(new Request([
            'product_id' => $request->product_id,
            'quantity' => 1,
        ]));

        // Remove from wishlist
        Wishlist::where('user_id', auth()->id())
            ->where('product_id', $request->product_id)
            ->delete();

        return response()->json([
            'message' => 'Product moved to cart successfully.'
        ]);
    }
}
