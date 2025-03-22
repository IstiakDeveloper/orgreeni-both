<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index()
    {
        $products = Product::with(['category', 'images' => function ($query) {
                $query->where('is_primary', true);
            }])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'special_price' => 'nullable|numeric|min:0|lt:price',
            'unit' => 'required|string',
            'stock' => 'required|integer|min:0',
            'sku' => 'required|string|unique:products,sku',
            'category_id' => 'required|exists:categories,id',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'images' => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'primary_image' => 'required|integer|min:0',
        ]);

        $slug = Str::slug($request->name);

        // Check if slug already exists
        $count = Product::where('slug', $slug)->count();
        if ($count > 0) {
            $slug = $slug . '-' . ($count + 1);
        }

        $product = Product::create([
            'name' => $request->name,
            'slug' => $slug,
            'description' => $request->description,
            'price' => $request->price,
            'special_price' => $request->special_price,
            'unit' => $request->unit,
            'stock' => $request->stock,
            'sku' => $request->sku,
            'category_id' => $request->category_id,
            'is_featured' => $request->is_featured ?? false,
            'is_active' => $request->is_active ?? true,
        ]);

        // Handle images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $imagePath = $image->store('products', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image' => $imagePath,
                    'is_primary' => $index == $request->primary_image,
                    'order' => $index,
                ]);
            }
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product)
    {
        $product->load(['category', 'images']);

        return Inertia::render('Admin/Products/Show', [
            'product' => $product
        ]);
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product)
    {
        $categories = Category::where('is_active', true)
            ->orderBy('name')
            ->get();

        $product->load('images');

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'special_price' => 'nullable|numeric|min:0|lt:price',
            'unit' => 'required|string',
            'stock' => 'required|integer|min:0',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'category_id' => 'required|exists:categories,id',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
            'primary_image' => 'nullable|integer|min:0',
            'existing_images' => 'array',
            'remove_images' => 'array',
        ]);

        $product->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'special_price' => $request->special_price,
            'unit' => $request->unit,
            'stock' => $request->stock,
            'sku' => $request->sku,
            'category_id' => $request->category_id,
            'is_featured' => $request->is_featured ?? false,
            'is_active' => $request->is_active ?? true,
        ]);

        // Handle removing images
        if ($request->has('remove_images') && count($request->remove_images) > 0) {
            $imagesToRemove = ProductImage::where('product_id', $product->id)
                ->whereIn('id', $request->remove_images)
                ->get();

            foreach ($imagesToRemove as $image) {
                Storage::disk('public')->delete($image->image);
                $image->delete();
            }
        }

        // Update primary image
        if ($request->has('primary_image')) {
            // First, set all images as not primary
            ProductImage::where('product_id', $product->id)
                ->update(['is_primary' => false]);

            // Then, set the selected image as primary
            if (is_numeric($request->primary_image)) {
                ProductImage::where('product_id', $product->id)
                    ->where('id', $request->primary_image)
                    ->update(['is_primary' => true]);
            }
        }

        // Handle new images
        if ($request->hasFile('images')) {
            $lastOrder = ProductImage::where('product_id', $product->id)
                ->max('order') ?? -1;

            foreach ($request->file('images') as $index => $image) {
                $imagePath = $image->store('products', 'public');
                $order = $lastOrder + 1 + $index;

                $isPrimary = false;
                if ($request->has('primary_image') && $request->primary_image == 'new_' . $index) {
                    // First, set all images as not primary
                    ProductImage::where('product_id', $product->id)
                        ->update(['is_primary' => false]);

                    $isPrimary = true;
                }

                ProductImage::create([
                    'product_id' => $product->id,
                    'image' => $imagePath,
                    'is_primary' => $isPrimary,
                    'order' => $order,
                ]);
            }
        }

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(Product $product)
    {
        // Delete all product images
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image);
        }

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    /**
     * Get featured products for frontend
     */
    public function getFeaturedProducts()
    {
        $products = Product::with(['category', 'images' => function ($query) {
                $query->where('is_primary', true);
            }])
            ->where('is_active', true)
            ->where('is_featured', true)
            ->inRandomOrder()
            ->take(8)
            ->get();

        return response()->json($products);
    }

    /**
     * Get product details for frontend
     */
    public function getProductDetails(Product $product)
    {
        if (!$product->is_active) {
            abort(404);
        }

        $product->load(['category', 'images']);

        $relatedProducts = Product::with(['category', 'images' => function ($query) {
                $query->where('is_primary', true);
            }])
            ->where('is_active', true)
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->inRandomOrder()
            ->take(4)
            ->get();

        return Inertia::render('Shop/ProductDetails', [
            'product' => $product,
            'relatedProducts' => $relatedProducts
        ]);
    }

    /**
     * Search products
     */
    public function searchProducts(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:2',
        ]);

        $query = $request->query('query');

        $products = Product::with(['category', 'images' => function ($q) {
                $q->where('is_primary', true);
            }])
            ->where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%")
                  ->orWhere('sku', 'like', "%{$query}%");
            })
            ->paginate(20);

        return Inertia::render('Shop/SearchResults', [
            'products' => $products,
            'query' => $query,
        ]);
    }
}
