import React, { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ShopLayout from '@/layouts/ShopLayout';
import ProductCard from '@/components/ProductCard';
import {
    ChevronRight,
    Filter,
    X
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

const AllProductsPage: React.FC = () => {
    // Extract props from Inertia page
    const {
        products,
        categories,
        appSettings
    } = usePage().props;

    // Cart context
    const { addToCart, removeFromCart, items } = useCart();

    // Filter states
    const [filterOptions, setFilterOptions] = useState({
        categories: [] as number[],
        minPrice: 0,
        maxPrice: Infinity,
        inStock: false
    });

    // Memoized list of all category IDs for filtering
    const allCategoryIds = useMemo(() => {
        const extractCategoryIds = (cats: any[]): number[] => {
            return cats.flatMap(cat =>
                [cat.id, ...(cat.children ? extractCategoryIds(cat.children) : [])]
            );
        };
        return extractCategoryIds(categories);
    }, [categories]);

    // Filtered products
    const filteredProducts = useMemo(() => {
        return products.data.filter(product => {
            // Category filter
            const categoryMatch = filterOptions.categories.length === 0 ||
                filterOptions.categories.includes(product.category.id);

            // Price filter
            const priceMatch = product.price >= filterOptions.minPrice &&
                product.price <= filterOptions.maxPrice;

            // Stock filter
            const stockMatch = !filterOptions.inStock || product.stock > 0;

            return categoryMatch && priceMatch && stockMatch;
        });
    }, [products.data, filterOptions]);

    // Helper functions
    const getCartQuantity = (productId: number) => {
        return items[productId]?.quantity || 0;
    };

    const handleAddToCart = (productId: number) => {
        const product = products.data.find(p => p.id === productId);
        if (!product) return;
        addToCart(product, 1);
    };

    const handleRemoveFromCart = (productId: number) => {
        removeFromCart(productId, 1);
    };

    // Reset all filters
    const resetFilters = () => {
        setFilterOptions({
            categories: [],
            minPrice: 0,
            maxPrice: Infinity,
            inStock: false
        });
    };

    return (
        <ShopLayout>
            <Head
                title={`All Products - ${appSettings.store_name}`}
                description={`Browse all products at ${appSettings.store_name}`}
            />

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Link href="/" className="hover:text-green-600">Home</Link>
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <span className="text-gray-800 font-medium">All Products</span>
                </div>

                {/* Filters Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800">
                            All Products
                            <span className="ml-2 text-sm text-gray-500">
                                ({filteredProducts.length} products)
                            </span>
                        </h1>

                        {/* Filter Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center bg-white border border-gray-200 px-3 py-2 rounded hover:bg-gray-50">
                                <Filter className="h-4 w-4 mr-2 text-gray-600" />
                                <span className="text-sm text-gray-700">Filter</span>
                            </button>

                            {/* Filter Dropdown Content */}
                            <div className="hidden group-hover:block absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg p-4 z-10">
                                {/* Category Filter */}
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                                    <div className="max-h-48 overflow-y-auto">
                                        {categories.map((category) => (
                                            <div key={category.id} className="mb-2">
                                                <label className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        checked={filterOptions.categories.includes(category.id)}
                                                        onChange={(e) => {
                                                            setFilterOptions(prev => {
                                                                const currentCategories = prev.categories;
                                                                if (e.target.checked) {
                                                                    return {
                                                                        ...prev,
                                                                        categories: [...currentCategories, category.id]
                                                                    };
                                                                } else {
                                                                    return {
                                                                        ...prev,
                                                                        categories: currentCategories.filter(id => id !== category.id)
                                                                    };
                                                                }
                                                            });
                                                        }}
                                                    />
                                                    <span>{category.name}</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Price Range Filter */}
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="number"
                                            placeholder="Min Price"
                                            className="w-full border rounded px-2 py-1"
                                            value={filterOptions.minPrice || ''}
                                            onChange={(e) => setFilterOptions(prev => ({
                                                ...prev,
                                                minPrice: Number(e.target.value) || 0
                                            }))}
                                        />
                                        <span>-</span>
                                        <input
                                            type="number"
                                            placeholder="Max Price"
                                            className="w-full border rounded px-2 py-1"
                                            value={filterOptions.maxPrice === Infinity ? '' : filterOptions.maxPrice}
                                            onChange={(e) => setFilterOptions(prev => ({
                                                ...prev,
                                                maxPrice: Number(e.target.value) || Infinity
                                            }))}
                                        />
                                    </div>
                                </div>

                                {/* In Stock Filter */}
                                <div className="mb-4">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            checked={filterOptions.inStock}
                                            onChange={(e) => setFilterOptions(prev => ({
                                                ...prev,
                                                inStock: e.target.checked
                                            }))}
                                        />
                                        <span>In Stock Only</span>
                                    </label>
                                </div>

                                {/* Filter Actions */}
                                <div className="flex justify-between">
                                    <button
                                        onClick={resetFilters}
                                        className="text-sm text-red-500 hover:bg-red-50 px-2 py-1 rounded"
                                    >
                                        Clear All Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            storeSettings={appSettings}
                            onAddToCart={handleAddToCart}
                            onRemoveFromCart={handleRemoveFromCart}
                            cartQuantity={getCartQuantity(product.id)}
                        />
                    ))}
                </div>

                {/* No Results State */}
                {filteredProducts.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-lg shadow mt-6">
                        <div className="mb-4 flex justify-center">
                            <Filter size={64} className="text-gray-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-700 mb-2">
                            No Products Found
                        </h2>
                        <p className="text-gray-600 mb-4">
                            No products match your current filter settings
                        </p>
                        <button
                            onClick={resetFilters}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {products.last_page > 1 && (
                    <div className="flex justify-center items-center mt-8 space-x-2">
                        {products.current_page > 1 && (
                            <Link
                                href={`/products?page=${products.current_page - 1}`}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                Previous
                            </Link>
                        )}

                        {[...Array(products.last_page)].map((_, index) => (
                            <Link
                                key={index}
                                href={`/products?page=${index + 1}`}
                                className={`
                                    px-4 py-2 border rounded
                                    ${products.current_page === index + 1
                                        ? 'bg-green-500 text-white'
                                        : 'hover:bg-gray-100'}
                                `}
                            >
                                {index + 1}
                            </Link>
                        ))}

                        {products.current_page < products.last_page && (
                            <Link
                                href={`/products?page=${products.current_page + 1}`}
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                                Next
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </ShopLayout>
    );
};

export default AllProductsPage;
