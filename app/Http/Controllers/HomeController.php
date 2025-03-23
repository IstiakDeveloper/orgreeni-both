<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page
     */
    public function index()
    {
        // Get featured categories (main categories only)
        $categories = Category::where('is_active', true)
            ->whereNull('parent_id')
            ->orderBy('order')
            ->with(['products' => function ($query) {
                $query->where('is_active', true)
                      ->with('images')
                      ->take(10);
            }])
            ->take(10)
            ->get();

        // Get featured products
        $featuredProducts = Product::where('is_active', true)
            ->where('is_featured', true)
            ->with('category')
            ->with(['images' => function ($query) {
                $query->where('is_primary', true);
            }])
            ->take(12)
            ->get();

        // Get active banners
        $banners = Banner::where('is_active', true)
            ->orderBy('order')
            ->get();

        // Get latest products
        $newArrivals = Product::where('is_active', true)
            ->with('category')
            ->with(['images' => function ($query) {
                $query->where('is_primary', true);
            }])
            ->latest()
            ->take(10)
            ->get();

        // Get store settings
        $storeSettings = [
            'store_name' => Setting::get('store_name', 'My Grocery Store'),
            'currency_symbol' => Setting::get('currency_symbol', '$'),
        ];

        return Inertia::render('shop/home', [
            'categories' => $categories,
            'featuredProducts' => $featuredProducts,
            'banners' => $banners,
            'newArrivals' => $newArrivals,
            'storeSettings' => $storeSettings,
        ]);
    }

    /**
     * Display products by category
     */
    public function category($slug)
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Get all subcategories if any
        $subcategories = Category::where('parent_id', $category->id)
            ->where('is_active', true)
            ->get();

        // Get all products in this category
        $products = Product::where('category_id', $category->id)
            ->where('is_active', true)
            ->with('category')
            ->with(['images' => function ($query) {
                $query->where('is_primary', true);
            }])
            ->paginate(24);

        $storeSettings = [
            'store_name' => Setting::get('store_name', 'My Grocery Store'),
            'currency_symbol' => Setting::get('currency_symbol', '$'),
        ];

        return Inertia::render('shop/category', [
            'category' => $category,
            'subcategories' => $subcategories,
            'products' => $products,
            'storeSettings' => $storeSettings,
        ]);
    }

    /**
     * Display product details
     */
    public function product($slug)
    {
        $product = Product::where('slug', $slug)
            ->where('is_active', true)
            ->with('category')
            ->with('images')
            ->firstOrFail();

        // Get related products
        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->with(['images' => function ($query) {
                $query->where('is_primary', true);
            }])
            ->take(8)
            ->get();

        $storeSettings = [
            'store_name' => Setting::get('store_name', 'My Grocery Store'),
            'currency_symbol' => Setting::get('currency_symbol', '$'),
        ];

        return Inertia::render('shop/product', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'storeSettings' => $storeSettings,
        ]);
    }

    /**
     * Search products
     */
    public function search(Request $request)
    {
        $query = $request->input('q');

        $products = Product::where('name', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->where('is_active', true)
            ->with('category')
            ->with(['images' => function ($q) {
                $q->where('is_primary', true);
            }])
            ->paginate(24);

        $storeSettings = [
            'store_name' => Setting::get('store_name', 'My Grocery Store'),
            'currency_symbol' => Setting::get('currency_symbol', '$'),
        ];

        return Inertia::render('shop/search', [
            'products' => $products,
            'query' => $query,
            'storeSettings' => $storeSettings,
        ]);
    }
}
