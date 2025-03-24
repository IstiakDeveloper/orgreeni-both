import React, { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ShopLayout from '@/layouts/ShopLayout';
import ProductCard from '@/components/ProductCard';
import {
    ChevronRight,
    Filter,
    SortDesc,
    Search as SearchIcon
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
    category: {
        id: number;
        name: string;
        slug: string;
    };
    images: ProductImage[];
}

// Sorting and Filtering Types
type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

const SearchResultsPage: React.FC = () => {
    // Extract props from Inertia page
    const {
        products: initialProducts,
        query,
        relatedProducts
    } = usePage().props;

    // Get app settings from shared data
    const { appSettings } = usePage().props;

    // State for product interactions
    const [highlightedProduct, setHighlightedProduct] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});

    // Sorting and filtering states
    const [sortOption, setSortOption] = useState<SortOption>('relevance');
    const [filterOptions, setFilterOptions] = useState({
        minPrice: 0,
        maxPrice: Infinity,
        inStock: false,
        categories: [] as number[]
    });

    // Cart context
    const { addToCart, removeFromCart, items } = useCart();

    // Extract unique categories from products
    const availableCategories = useMemo(() => {
        const categories = initialProducts.data.map(product => product.category);
        return [...new Map(categories.map(cat => [cat.id, cat])).values()];
    }, [initialProducts.data]);

    // Memoized and filtered products
    const filteredAndSortedProducts = useMemo(() => {
        let processedProducts = initialProducts.data;

        // Filter by price and stock
        processedProducts = processedProducts.filter(product =>
            product.price >= filterOptions.minPrice &&
            product.price <= filterOptions.maxPrice &&
            (!filterOptions.inStock || product.stock > 0) &&
            (filterOptions.categories.length === 0 ||
                filterOptions.categories.includes(product.category.id))
        );

        // Sort products
        switch (sortOption) {
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
            default: // relevance (default order)
                break;
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

    return (
        <ShopLayout>
            <Head
                title={`Search Results for "${query}" - ${appSettings.store_name}`}
                description={`Search results for ${query} in ${appSettings.store_name}`}
            />

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Link href="/" className="hover:text-green-600">Home</Link>
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <span className="text-gray-800 font-medium">Search Results</span>
                </div>

                {/* Search Header */}
                <div className="flex flex-col md:flex-row justify-between mb-6">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Search Results for "{query}"
                        </h1>
                        <p className="text-gray-600 text-sm">
                            {filteredAndSortedProducts.length} products found
                        </p>
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
                                <option value="relevance">Relevance</option>
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
                                    {/* Price Range Filter */}
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

                                    {/* In Stock Filter */}
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

                                    {/* Category Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                                        <div className="space-y-1">
                                            {availableCategories.map(category => (
                                                <label key={category.id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="mr-2"
                                                        checked={filterOptions.categories.includes(category.id)}
                                                        onChange={(e) => setFilterOptions(prev => {
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
                                                        })}
                                                    />
                                                    <span>{category.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div>
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
                            <div className="mb-4 flex justify-center">
                                <SearchIcon size={64} className="text-gray-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-700 mb-2">No Results Found</h2>
                            <p className="text-gray-600 mb-4">
                                We couldn't find any products matching "{query}"
                            </p>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">Try:</p>
                                <ul className="text-sm text-gray-500 space-y-1">
                                    <li>Checking your spelling</li>
                                    <li>Using more general terms</li>
                                    <li>Browsing categories</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Related Products Carousel */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                You Might Also Like
                            </h2>
                            <Link
                                href="/products"
                                className="text-green-600 hover:text-green-700 flex items-center text-sm"
                            >
                                View All
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                        </div>

                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={20}
                            slidesPerView={2}
                            navigation
                            pagination={{ clickable: true }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 3,
                                    spaceBetween: 20,
                                },
                                768: {
                                    slidesPerView: 4,
                                    spaceBetween: 30,
                                },
                                1024: {
                                    slidesPerView: 5,
                                    spaceBetween: 30,
                                },
                            }}
                            className="related-products-swiper"
                        >
                            {relatedProducts.map((product) => (
                                <SwiperSlide key={product.id}>
                                    <ProductCard
                                        product={product}
                                        storeSettings={appSettings}
                                        onAddToCart={handleAddToCart}
                                        onRemoveFromCart={handleRemoveFromCart}
                                        cartQuantity={getCartQuantity(product.id)}
                                        isLoading={isProductLoading(product.id)}
                                        isHighlighted={highlightedProduct === product.id}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>
        </ShopLayout>
    );
};

export default SearchResultsPage;
