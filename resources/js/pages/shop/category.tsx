import React, { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ShopLayout from '@/layouts/ShopLayout';
import ProductCard from '@/components/ProductCard';
import {
    ChevronRight,
    Filter,
    SortDesc,
    ChevronLeft,
    ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

// Interfaces
interface ProductImage {
    id: number;
    image: string;
    is_primary: boolean;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    special_price: number | null;
    unit: string;
    stock: number;
    sku: string;
    description: string | null;
    is_active: boolean;
    images: ProductImage[];
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    parent_id?: number | null;
    is_active: boolean;
    order?: number;
    children?: Category[];
    products?: Product[];
}

interface AppSettings {
    store_name: string;
    currency: string;
    currency_symbol: string;
    meta_title: string;
    meta_description: string;
}

// Sorting and Filtering Types
type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

const CategoryPage: React.FC = () => {
    // Extract props from Inertia page
    const {
        category,
        products: initialProducts,
        related_categories
    } = usePage().props;

    // Get app settings from shared data
    const { appSettings } = usePage().props;

    // State for product interactions
    const [highlightedProduct, setHighlightedProduct] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});

    // Sorting and filtering states
    const [sortOption, setSortOption] = useState<SortOption>('newest');
    const [filterOptions, setFilterOptions] = useState({
        minPrice: 0,
        maxPrice: Infinity,
        inStock: false
    });

    // Cart context
    const { addToCart, removeFromCart, items } = useCart();

    // Memoized and filtered products
    const filteredAndSortedProducts = useMemo(() => {
        let processedProducts = initialProducts.data;

        // Filter by price and stock
        processedProducts = processedProducts.filter(product =>
            product.price >= filterOptions.minPrice &&
            product.price <= filterOptions.maxPrice &&
            (!filterOptions.inStock || product.stock > 0)
        );

        // Sort products
        switch(sortOption) {
            case 'price_asc':
                processedProducts.sort((a, b) => (a.special_price || a.price) - (b.special_price || b.price));
                break;
            case 'price_desc':
                processedProducts.sort((a, b) => (b.special_price || b.price) - (a.special_price || a.price));
                break;
            case 'name_asc':
                processedProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name_desc':
                processedProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default: // newest
                processedProducts.sort((a, b) => b.id - a.id);
        }

        return processedProducts;
    }, [initialProducts.data, sortOption, filterOptions]);

    // Helper functions
    const getCartQuantity = (productId: number) => {
        return items[productId]?.quantity || 0;
    };

    const handleAddToCart = (productId: number) => {
        const product = initialProducts.data.find(p => p.id === productId);
        if (!product) return;

        setIsLoading(prev => ({ ...prev, [productId]: true }));
        setHighlightedProduct(productId);

        const success = addToCart(product, 1);

        setTimeout(() => {
            setIsLoading(prev => ({ ...prev, [productId]: false }));
            setTimeout(() => setHighlightedProduct(null), 1000);
        }, 300);
    };

    const handleRemoveFromCart = (productId: number) => {
        setIsLoading(prev => ({ ...prev, [productId]: true }));
        removeFromCart(productId, 1);
        setTimeout(() => setIsLoading(prev => ({ ...prev, [productId]: false })), 300);
    };

    const isProductLoading = (productId: number) => {
        return isLoading[productId] || false;
    };

    // Render
    return (
        <ShopLayout>
            <Head
                title={`${category.name} - ${appSettings.store_name}`}
                description={`${category.description || appSettings.meta_description}`}
            />

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Link href="/" className="hover:text-green-600">Home</Link>
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <span className="text-gray-800 font-medium">{category.name}</span>
                </div>

                {/* Category Header */}
                <div className="flex flex-col md:flex-row justify-between mb-6">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">{category.name}</h1>
                        {category.description && (
                            <p className="text-gray-600 text-sm">{category.description}</p>
                        )}
                    </div>

                    {/* Sorting and Filtering */}
                    <div className="flex items-center space-x-3">
                        {/* Sort Dropdown */}
                        <div className="relative">
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value as SortOption)}
                                className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm"
                            >
                                <option value="newest">Newest</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="name_asc">Name: A to Z</option>
                                <option value="name_desc">Name: Z to A</option>
                            </select>
                            <SortDesc className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                        </div>

                        {/* Filter Button */}
                        <div className="relative group">
                            <button className="flex items-center bg-white border border-gray-200 px-3 py-2 rounded hover:bg-gray-50">
                                <Filter className="h-4 w-4 mr-2 text-gray-600" />
                                <span className="text-sm text-gray-700">Filter</span>
                            </button>
                            {/* Dropdown Filter */}
                            <div className="hidden group-hover:block absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 z-10">
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="number"
                                                placeholder="Min"
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
                                                placeholder="Max"
                                                className="w-full border rounded px-2 py-1"
                                                value={filterOptions.maxPrice === Infinity ? '' : filterOptions.maxPrice}
                                                onChange={(e) => setFilterOptions(prev => ({
                                                    ...prev,
                                                    maxPrice: Number(e.target.value) || Infinity
                                                }))}
                                            />
                                        </div>
                                    </div>
                                    <div>
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        {filteredAndSortedProducts.length} Products in {category.name}
                    </h2>

                    {filteredAndSortedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {filteredAndSortedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    storeSettings={appSettings}
                                    onAddToCart={handleAddToCart}
                                    onRemoveFromCart={handleRemoveFromCart}
                                    cartQuantity={getCartQuantity(product.id)}
                                    isLoading={isProductLoading(product.id)}
                                    isHighlighted={highlightedProduct === product.id}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-white rounded-lg shadow">
                            <div className="mb-4">
                                <img
                                    src="/assets/empty-category.png"
                                    alt="No Products"
                                    className="mx-auto h-32 opacity-60"
                                />
                            </div>
                            <p className="text-gray-600">No products found in this category</p>
                        </div>
                    )}
                </div>
            </div>
        </ShopLayout>
    );
};

export default CategoryPage;
