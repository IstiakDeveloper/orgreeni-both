<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the homepage.
     */
    public function index()
    {
        // Get active banners
        $banners = Banner::where('is_active', true)
            ->orderBy('order')
            ->get();

        // Get featured products
        $featuredProducts = Product::with(['category', 'images' => function ($query) {
                $query->where('is_primary', true);
            }])
            ->where('is_active', true)
            ->where('is_featured', true)
            ->inRandomOrder()
            ->take(8)
            ->get();

        // Get parent categories with their children
        $categories = Category::with(['children' => function ($query) {
                $query->where('is_active', true)
                    ->orderBy('order');
            }])
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('order')
            ->take(10)
            ->get();

        // Get new arrivals
        $newArrivals = Product::with(['category', 'images' => function ($query) {
                $query->where('is_primary', true);
            }])
            ->where('is_active', true)
            ->latest()
            ->take(8)
            ->get();

        return Inertia::render('Shop/Home', [
            'banners' => $banners,
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
            'newArrivals' => $newArrivals,
        ]);
    }

    /**
     * Display the all products page.
     */
    public function allProducts(Request $request)
    {
        $query = Product::with(['category', 'images' => function ($query) {
                $query->where('is_primary', true);
            }])
            ->where('is_active', true);

        // Apply filters if present
        if ($request->has('category')) {
            $category = Category::where('slug', $request->category)->first();
            if ($category) {
                $query->where('category_id', $category->id);
            }
        }

        if ($request->has('sort')) {
            switch ($request->sort) {
                case 'price_low':
                    $query->orderBy('special_price', 'asc')
                        ->orderBy('price', 'asc');
                    break;
                case 'price_high':
                    $query->orderBy('special_price', 'desc')
                        ->orderBy('price', 'desc');
                    break;
                case 'name_asc':
                    $query->orderBy('name', 'asc');
                    break;
                case 'name_desc':
                    $query->orderBy('name', 'desc');
                    break;
                case 'newest':
                    $query->latest();
                    break;
                default:
                    $query->latest();
            }
        } else {
            $query->latest();
        }

        $products = $query->paginate(24);

        // Get all categories for filter sidebar
        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Shop/AllProducts', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['category', 'sort']),
        ]);
    }

    /**
     * Display the admin dashboard.
     */
    public function adminDashboard()
    {
        // Get counts for dashboard widgets
        $totalProducts = Product::count();
        $activeProducts = Product::where('is_active', true)->count();
        $lowStockProducts = Product::where('stock', '<', 10)->count();
        $outOfStockProducts = Product::where('stock', 0)->count();

        // Get recent orders
        $recentOrders = \App\Models\Order::with('user')
            ->latest()
            ->take(10)
            ->get();

        // Get sales stats
        $today = now()->startOfDay();
        $thisMonth = now()->startOfMonth();
        $thisYear = now()->startOfYear();

        $todaySales = \App\Models\Order::where('created_at', '>=', $today)->sum('total_amount');
        $monthSales = \App\Models\Order::where('created_at', '>=', $thisMonth)->sum('total_amount');
        $yearSales = \App\Models\Order::where('created_at', '>=', $thisYear)->sum('total_amount');

        // Get order status counts
        $pendingOrders = \App\Models\Order::where('order_status', 'pending')->count();
        $processingOrders = \App\Models\Order::where('order_status', 'processing')->count();
        $shippedOrders = \App\Models\Order::where('order_status', 'shipped')->count();
        $deliveredOrders = \App\Models\Order::where('order_status', 'delivered')->count();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'activeProducts' => $activeProducts,
                'lowStockProducts' => $lowStockProducts,
                'outOfStockProducts' => $outOfStockProducts,
                'todaySales' => $todaySales,
                'monthSales' => $monthSales,
                'yearSales' => $yearSales,
                'pendingOrders' => $pendingOrders,
                'processingOrders' => $processingOrders,
                'shippedOrders' => $shippedOrders,
                'deliveredOrders' => $deliveredOrders,
            ],
            'recentOrders' => $recentOrders,
        ]);
    }
}
