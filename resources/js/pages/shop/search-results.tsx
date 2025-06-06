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

// Swiper ইম্পোর্ট
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// ইন্টারফেস
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

// সর্টিং এবং ফিল্টারিং টাইপস
type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

const SearchResultsPage: React.FC = () => {
    // ইনার্শিয়া পেজ থেকে প্রপস নেওয়া হচ্ছে
    const {
        products: initialProducts,
        query,
        relatedProducts
    } = usePage().props;

    // শেয়ার্ড ডাটা থেকে অ্যাপ সেটিংস নেওয়া হচ্ছে
    const { appSettings } = usePage().props;

    // পণ্য ইন্টারঅ্যাকশনের জন্য স্টেট
    const [highlightedProduct, setHighlightedProduct] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});

    // সর্টিং এবং ফিল্টারিং স্টেট
    const [sortOption, setSortOption] = useState<SortOption>('relevance');
    const [filterOptions, setFilterOptions] = useState({
        minPrice: 0,
        maxPrice: Infinity,
        inStock: false,
        categories: [] as number[]
    });

    // কার্ট কনটেক্সট
    const { addToCart, removeFromCart, items } = useCart();

    // পণ্য থেকে অনন্য ক্যাটাগরি বের করা হচ্ছে
    const availableCategories = useMemo(() => {
        const categories = initialProducts.data.map(product => product.category);
        return [...new Map(categories.map(cat => [cat.id, cat])).values()];
    }, [initialProducts.data]);

    // মেমোরাইজড এবং ফিল্টার করা পণ্য
    const filteredAndSortedProducts = useMemo(() => {
        let processedProducts = initialProducts.data;

        // মূল্য এবং স্টক অনুযায়ী ফিল্টার
        processedProducts = processedProducts.filter(product =>
            product.price >= filterOptions.minPrice &&
            product.price <= filterOptions.maxPrice &&
            (!filterOptions.inStock || product.stock > 0) &&
            (filterOptions.categories.length === 0 ||
                filterOptions.categories.includes(product.category.id))
        );

        // পণ্য সর্ট করা
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
            default: // প্রাসঙ্গিকতা (ডিফল্ট অর্ডার)
                break;
        }

        return processedProducts;
    }, [initialProducts.data, sortOption, filterOptions]);

    // হেল্পার ফাংশন
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
                title={`"${query}" এর জন্য সার্চ ফলাফল - ${appSettings.store_name}`}
                description={`${appSettings.store_name} এ ${query} এর জন্য সার্চ ফলাফল`}
            />

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* ব্রেডক্রাম্ব */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Link href="/" className="hover:text-green-600">হোম</Link>
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <span className="text-gray-800 font-medium">সার্চ ফলাফল</span>
                </div>

                {/* সার্চ হেডার */}
                <div className="flex flex-col md:flex-row justify-between mb-6">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            "{query}" এর জন্য সার্চ ফলাফল
                        </h1>
                        <p className="text-gray-600 text-sm">
                            {filteredAndSortedProducts.length}টি পণ্য পাওয়া গেছে
                        </p>
                    </div>

                    {/* সর্টিং এবং ফিল্টারিং */}
                    <div className="flex items-center space-x-3">
                        {/* সর্ট ড্রপডাউন */}
                        <div className="relative">
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value as SortOption)}
                                className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm"
                            >
                                <option value="relevance">প্রাসঙ্গিকতা</option>
                                <option value="price_asc">মূল্য: কম থেকে বেশি</option>
                                <option value="price_desc">মূল্য: বেশি থেকে কম</option>
                                <option value="name_asc">নাম: A থেকে Z</option>
                                <option value="name_desc">নাম: Z থেকে A</option>
                            </select>
                            <SortDesc className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                        </div>

                        {/* ফিল্টার বাটন */}
                        <div className="relative group">
                            <button className="flex items-center bg-white border border-gray-200 px-3 py-2 rounded hover:bg-gray-50">
                                <Filter className="h-4 w-4 mr-2 text-gray-600" />
                                <span className="text-sm text-gray-700">ফিল্টার</span>
                            </button>
                            {/* ড্রপডাউন ফিল্টার */}
                            <div className="hidden group-hover:block absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-4 z-10">
                                <div className="space-y-3">
                                    {/* মূল্য সীমা ফিল্টার */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">মূল্য সীমা</label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="number"
                                                placeholder="সর্বনিম্ন"
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
                                                placeholder="সর্বোচ্চ"
                                                className="w-full border rounded px-2 py-1"
                                                value={filterOptions.maxPrice === Infinity ? '' : filterOptions.maxPrice}
                                                onChange={(e) => setFilterOptions(prev => ({
                                                    ...prev,
                                                    maxPrice: Number(e.target.value) || Infinity
                                                }))}
                                            />
                                        </div>
                                    </div>

                                    {/* স্টক ফিল্টার */}
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
                                            <span>শুধুমাত্র স্টকে আছে এমন</span>
                                        </label>
                                    </div>

                                    {/* ক্যাটাগরি ফিল্টার */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ক্যাটাগরি</label>
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

                {/* পণ্য গ্রিড */}
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
                            <h2 className="text-xl font-bold text-gray-700 mb-2">কোন ফলাফল পাওয়া যায়নি</h2>
                            <p className="text-gray-600 mb-4">
                                আমরা "{query}" এর সাথে মিলে যায় এমন কোন পণ্য খুঁজে পাইনি
                            </p>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">চেষ্টা করুন:</p>
                                <ul className="text-sm text-gray-500 space-y-1">
                                    <li>আপনার বানান পরীক্ষা করুন</li>
                                    <li>আরও সাধারণ শব্দ ব্যবহার করুন</li>
                                    <li>ক্যাটাগরি ব্রাউজ করুন</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* সম্পর্কিত পণ্য ক্যারোসেল */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">
                                আপনার পছন্দ হতে পারে
                            </h2>
                            <Link
                                href="/products"
                                className="text-green-600 hover:text-green-700 flex items-center text-sm"
                            >
                                সব দেখুন
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
