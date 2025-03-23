import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import ShopLayout from '@/layouts/ShopLayout';
import { Plus, Minus, ShoppingCart, ChevronRight, Filter, SortAsc, SortDesc } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    special_price: number | null;
    unit: string;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    images: Array<{
        id: number;
        image: string;
        is_primary: boolean;
    }>;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
}

interface CategoryProps {
    category: Category;
    subcategories: Category[];
    products: {
        data: Product[];
        links: any;
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
    storeSettings: {
        store_name: string;
        currency_symbol: string;
    };
}

const Category: React.FC<CategoryProps> = ({ category, subcategories, products, storeSettings }) => {
    const [cartItems, setCartItems] = useState<{[key: number]: number}>({});
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [sortBy, setSortBy] = useState('');

    const addToCart = (productId: number) => {
        setCartItems(prev => ({
            ...prev,
            [productId]: (prev[productId] || 0) + 1
        }));
    };

    const removeFromCart = (productId: number) => {
        setCartItems(prev => {
            const newItems = { ...prev };
            if (newItems[productId] > 1) {
                newItems[productId] -= 1;
            } else {
                delete newItems[productId];
            }
            return newItems;
        });
    };

    // Function to get product primary image
    const getProductImage = (product: Product) => {
        const primaryImage = product.images.find(img => img.is_primary);
        return primaryImage ? `/storage/${primaryImage.image}` : '/assets/placeholder.png';
    };

    // Format price with currency symbol
    const formatPrice = (price: number) => {
        return `${storeSettings.currency_symbol}${price.toFixed(2)}`;
    };

    return (
        <ShopLayout>
            <Head title={`${category.name} - ${storeSettings.store_name}`} />

            <div className="container mx-auto px-4 py-6">
                {/* Breadcrumbs */}
                <div className="flex items-center text-sm mb-6">
                    <Link href="/" className="text-gray-500 hover:text-green-600">Home</Link>
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                    <span className="text-green-600 font-medium">{category.name}</span>
                </div>

                {/* Category Header */}
                <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {category.image && (
                            <div className="md:w-1/4">
                                <img
                                    src={`/storage/${category.image}`}
                                    alt={category.name}
                                    className="w-full h-auto rounded-lg"
                                />
                            </div>
                        )}
                        <div className="md:w-3/4">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{category.name}</h1>
                            {category.description && (
                                <p className="text-gray-600 mb-4">{category.description}</p>
                            )}
                            <div className="text-sm text-gray-500">
                                Showing {products.data.length} of {products.meta?.total} products
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subcategories if any */}
                {subcategories.length > 0 && (
                    <div className="bg-white rounded-lg p-6 mb-6 shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Subcategories</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {subcategories.map((subcat) => (
                                <Link
                                    key={subcat.id}
                                    href={`/category/${subcat.slug}`}
                                    className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center transition-colors"
                                >
                                    {subcat.image && (
                                        <img
                                            src={`/storage/${subcat.image}`}
                                            alt={subcat.name}
                                            className="w-16 h-16 object-cover mx-auto mb-2 rounded-full"
                                        />
                                    )}
                                    <span className="font-medium text-gray-800">{subcat.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Filters - Mobile Toggle */}
                    <div className="lg:hidden mb-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full bg-white shadow py-2 px-4 rounded-lg flex items-center justify-between"
                        >
                            <span className="font-medium">Filters</span>
                            <Filter className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Filters - Sidebar */}
                    <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Filters</h3>

                            {/* Price Range Filter */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-700 mb-3">Price Range</h4>
                                <div className="mb-4">
                                    <input
                                        type="range"
                                        min={0}
                                        max={5000}
                                        step={100}
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full accent-green-600"
                                    />
                                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                                        <span>{formatPrice(priceRange[0])}</span>
                                        <span>{formatPrice(priceRange[1])}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sort Options */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-700 mb-3">Sort By</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sort"
                                            checked={sortBy === 'price-asc'}
                                            onChange={() => setSortBy('price-asc')}
                                            className="accent-green-600"
                                        />
                                        <span className="text-gray-700">Price: Low to High</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sort"
                                            checked={sortBy === 'price-desc'}
                                            onChange={() => setSortBy('price-desc')}
                                            className="accent-green-600"
                                        />
                                        <span className="text-gray-700">Price: High to Low</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sort"
                                            checked={sortBy === 'newest'}
                                            onChange={() => setSortBy('newest')}
                                            className="accent-green-600"
                                        />
                                        <span className="text-gray-700">Newest First</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sort"
                                            checked={sortBy === 'popularity'}
                                            onChange={() => setSortBy('popularity')}
                                            className="accent-green-600"
                                        />
                                        <span className="text-gray-700">Popularity</span>
                                    </label>
                                </div>
                            </div>

                            {/* Apply Filters Button */}
                            <button
                                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="lg:w-3/4">
                        {products.data.length > 0 ? (
                            <>
                                {/* Mobile Sort Options */}
                                <div className="lg:hidden mb-4">
                                    <div className="bg-white rounded-lg shadow p-3 flex justify-between items-center">
                                        <span className="text-sm font-medium">Sort By:</span>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="text-sm border-none focus:ring-0"
                                        >
                                            <option value="">Relevance</option>
                                            <option value="price-asc">Price: Low to High</option>
                                            <option value="price-desc">Price: High to Low</option>
                                            <option value="newest">Newest First</option>
                                            <option value="popularity">Popularity</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Products Grid - Chaldal Style */}
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {products.data.map((product) => (
                                        <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md">
                                            <Link href={`/product/${product.slug}`} className="block relative">
                                                <div className="aspect-square overflow-hidden">
                                                    <img
                                                        src={getProductImage(product)}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover transition-transform hover:scale-105"
                                                    />
                                                </div>
                                                {product.special_price && (
                                                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                                        {Math.round((1 - product.special_price / product.price) * 100)}% OFF
                                                    </div>
                                                )}
                                            </Link>

                                            <div className="p-3">
                                                <Link href={`/product/${product.slug}`} className="block">
                                                    <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                                                    <p className="text-xs text-gray-500 mb-2">{product.unit}</p>
                                                </Link>

                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        {product.special_price ? (
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold text-green-700">{formatPrice(product.special_price)}</span>
                                                                <span className="text-xs text-gray-500 line-through">{formatPrice(product.price)}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="font-semibold text-green-700">{formatPrice(product.price)}</span>
                                                        )}
                                                    </div>

                                                    {cartItems[product.id] ? (
                                                        <div className="flex items-center border border-gray-300 rounded">
                                                            <button
                                                                onClick={() => removeFromCart(product.id)}
                                                                className="p-1 text-green-700 hover:bg-green-50"
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </button>
                                                            <span className="px-2 text-sm">{cartItems[product.id]}</span>
                                                            <button
                                                                onClick={() => addToCart(product.id)}
                                                                className="p-1 text-green-700 hover:bg-green-50"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => addToCart(product.id)}
                                                            className="p-2 text-green-700 hover:bg-green-50 border border-green-700 rounded"
                                                        >
                                                            <ShoppingCart className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {products.meta?.last_page > 1 && (
                                    <div className="mt-8 flex justify-center">
                                        <div className="flex space-x-1">
                                            {products.links.map((link: any, i: number) => (
                                                <Link
                                                    key={i}
                                                    href={link.url || '#'}
                                                    className={`px-4 py-2 rounded ${
                                                        link.active
                                                            ? 'bg-green-600 text-white'
                                                            : link.url
                                                                ? 'bg-white text-gray-700 hover:bg-green-50'
                                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">No Products Found</h3>
                                <p className="text-gray-600 mb-6">We couldn't find any products in this category that match your filters.</p>
                                <button
                                    onClick={() => {
                                        setPriceRange([0, 5000]);
                                        setSortBy('');
                                    }}
                                    className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
};

export default Category;
