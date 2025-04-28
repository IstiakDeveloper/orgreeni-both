import React, { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ShopLayout from '@/layouts/ShopLayout';
import ProductCard from '@/components/ProductCard';
import {
    ChevronRight,
    Filter,
    X,
    ShoppingBag
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

const AllProductsPage: React.FC = () => {
    // Inertia পেজ থেকে প্রপস নেওয়া হচ্ছে
    const {
        products,
        categories,
        appSettings
    } = usePage().props;

    // কার্ট কনটেক্সট
    const { addToCart, removeFromCart, items } = useCart();

    // ফিল্টার স্টেট
    const [filterOptions, setFilterOptions] = useState({
        categories: [] as number[],
        minPrice: 0,
        maxPrice: Infinity,
        inStock: false
    });

    // ফিল্টার দেখানো/লুকানোর স্টেট
    const [showFilters, setShowFilters] = useState(false);

    // মেমোরাইজড সব ক্যাটাগরি আইডি ফিল্টারিং এর জন্য
    const allCategoryIds = useMemo(() => {
        const extractCategoryIds = (cats: any[]): number[] => {
            return cats.flatMap(cat =>
                [cat.id, ...(cat.children ? extractCategoryIds(cat.children) : [])]
            );
        };
        return extractCategoryIds(categories);
    }, [categories]);

    // ফিল্টার করা পণ্য
    const filteredProducts = useMemo(() => {
        return products.data.filter(product => {
            // ক্যাটাগরি ফিল্টার
            const categoryMatch = filterOptions.categories.length === 0 ||
                filterOptions.categories.includes(product.category.id);

            // মূল্য ফিল্টার
            const priceMatch = product.price >= filterOptions.minPrice &&
                product.price <= filterOptions.maxPrice;

            // স্টক ফিল্টার
            const stockMatch = !filterOptions.inStock || product.stock > 0;

            return categoryMatch && priceMatch && stockMatch;
        });
    }, [products.data, filterOptions]);

    // হেল্পার ফাংশন
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

    // সব ফিল্টার রিসেট করা
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
                title={`সকল পণ্য - ${appSettings.store_name}`}
                description={`${appSettings.store_name} এ সকল পণ্য দেখুন`}
            />

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* ব্রেডক্রাম্ব */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Link href="/" className="hover:text-green-600">হোম</Link>
                    <ChevronRight className="h-4 w-4 mx-2" />
                    <span className="text-gray-800 font-medium">সকল পণ্য</span>
                </div>

                {/* ফিল্টার অংশ - অপ্টিমাইজ করা ডিজাইন */}
                <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div className="flex items-center mb-3 sm:mb-0">
                            <ShoppingBag className="h-5 w-5 mr-2 text-green-600" />
                            <h1 className="text-xl font-bold text-gray-800">
                                সকল পণ্য
                                <span className="ml-2 text-sm text-gray-500">
                                    ({filteredProducts.length}টি পণ্য)
                                </span>
                            </h1>
                        </div>

                        {/* ফিল্টার ট্রিগার বাটন - মোবাইল এবং ডেস্কটপে ভিন্ন আচরণ করে */}
                        <div className="relative">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center bg-white border border-gray-200 px-3 py-2 rounded hover:bg-gray-50 hover:text-green-600 transition-colors"
                            >
                                <Filter className="h-4 w-4 mr-2 text-gray-600" />
                                <span className="text-sm">ফিল্টার করুন</span>
                            </button>

                            {/* ফিল্টার কন্টেন্ট - মোডাল স্টাইলে দেখানো */}
                            {showFilters && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center sm:justify-end sm:items-start sm:p-10 sm:absolute sm:inset-auto sm:mt-2 sm:right-0">
                                    <div className="bg-white w-11/12 sm:w-80 max-h-[90vh] sm:max-h-[80vh] sm:shadow-lg rounded-lg overflow-hidden z-10">
                                        <div className="flex items-center justify-between p-4 border-b">
                                            <h3 className="font-medium">ফিল্টার অপশন</h3>
                                            <button
                                                onClick={() => setShowFilters(false)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <div className="p-4 overflow-y-auto">
                                            {/* ক্যাটাগরি ফিল্টার */}
                                            <div className="mb-4">
                                                <h3 className="text-sm font-medium text-gray-700 mb-2">ক্যাটাগরি</h3>
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

                                            {/* মূল্য সীমা ফিল্টার */}
                                            <div className="mb-4">
                                                <h3 className="text-sm font-medium text-gray-700 mb-2">মূল্য সীমা</h3>
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
                                                    <span>শুধুমাত্র স্টকে আছে এমন</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* ফিল্টার অ্যাকশন বাটনগুলি */}
                                        <div className="flex justify-between p-4 border-t bg-gray-50">
                                            <button
                                                onClick={resetFilters}
                                                className="text-sm text-red-500 hover:bg-red-50 px-3 py-1 rounded"
                                            >
                                                সব ফিল্টার মুছুন
                                            </button>

                                            <button
                                                onClick={() => setShowFilters(false)}
                                                className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                                            >
                                                প্রয়োগ করুন
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* সক্রিয় ফিল্টার ট্যাগ */}
                    {(filterOptions.categories.length > 0 ||
                      filterOptions.minPrice > 0 ||
                      filterOptions.maxPrice !== Infinity ||
                      filterOptions.inStock) && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {filterOptions.categories.length > 0 && (
                                <div className="inline-flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                                    <span>ক্যাটাগরি</span>
                                    <button
                                        onClick={() => setFilterOptions(prev => ({ ...prev, categories: [] }))}
                                        className="ml-1 hover:text-red-500"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}

                            {filterOptions.minPrice > 0 && (
                                <div className="inline-flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                                    <span>সর্বনিম্ন: ৳{filterOptions.minPrice}</span>
                                    <button
                                        onClick={() => setFilterOptions(prev => ({ ...prev, minPrice: 0 }))}
                                        className="ml-1 hover:text-red-500"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}

                            {filterOptions.maxPrice !== Infinity && (
                                <div className="inline-flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                                    <span>সর্বোচ্চ: ৳{filterOptions.maxPrice}</span>
                                    <button
                                        onClick={() => setFilterOptions(prev => ({ ...prev, maxPrice: Infinity }))}
                                        className="ml-1 hover:text-red-500"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}

                            {filterOptions.inStock && (
                                <div className="inline-flex items-center bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs">
                                    <span>শুধুমাত্র স্টকে আছে</span>
                                    <button
                                        onClick={() => setFilterOptions(prev => ({ ...prev, inStock: false }))}
                                        className="ml-1 hover:text-red-500"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={resetFilters}
                                className="inline-flex items-center bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs font-medium"
                            >
                                সব মুছুন
                            </button>
                        </div>
                    )}
                </div>

                {/* পণ্য গ্রিড - অপ্টিমাইজড */}
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
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
                    ) : (
                        <div className="text-center py-10 bg-white rounded-lg">
                            <div className="mb-4 flex justify-center">
                                <Filter size={64} className="text-gray-300" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-700 mb-2">
                                কোন পণ্য পাওয়া যায়নি
                            </h2>
                            <p className="text-gray-600 mb-4">
                                আপনার বর্তমান ফিল্টার সেটিংস অনুযায়ী কোন পণ্য নেই
                            </p>
                            <button
                                onClick={resetFilters}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                ফিল্টার মুছুন
                            </button>
                        </div>
                    )}
                </div>

                {/* পেজিনেশন - অপ্টিমাইজড */}
                {products.last_page > 1 && (
                    <div className="flex justify-center items-center mt-8 space-x-2">
                        {products.current_page > 1 && (
                            <Link
                                href={`/products?page=${products.current_page - 1}`}
                                className="px-4 py-2 border rounded hover:bg-gray-100 text-sm"
                            >
                                আগের পেজ
                            </Link>
                        )}

                        {/* মোবাইলে শুধু বর্তমান, আগের আর পরের পেজ নাম্বার দেখাবে */}
                        <div className="hidden sm:flex space-x-2">
                            {[...Array(products.last_page)].map((_, index) => (
                                <Link
                                    key={index}
                                    href={`/products?page=${index + 1}`}
                                    className={`
                                        px-3 py-1 border rounded text-sm
                                        ${products.current_page === index + 1
                                            ? 'bg-green-500 text-white'
                                            : 'hover:bg-gray-100'}
                                    `}
                                >
                                    {index + 1}
                                </Link>
                            ))}
                        </div>

                        {/* মোবাইলে শুধু বর্তমান পেজ দেখাবে */}
                        <div className="sm:hidden text-sm px-3 py-1 border rounded bg-gray-50">
                            {products.current_page} / {products.last_page}
                        </div>

                        {products.current_page < products.last_page && (
                            <Link
                                href={`/products?page=${products.current_page + 1}`}
                                className="px-4 py-2 border rounded hover:bg-gray-100 text-sm"
                            >
                                পরের পেজ
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </ShopLayout>
    );
};

export default AllProductsPage;
