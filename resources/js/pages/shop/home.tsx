import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ShopLayout from '@/layouts/ShopLayout';
import { ChevronRight, ShoppingBag, Clock, Percent, CheckCircle, ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';

// ইন্টারফেস ডেফিনিশন
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
    category: {
        id: number;
        name: string;
        slug: string;
    };
    images: ProductImage[];
}

interface Category {
    id: number;
    name: string;
    slug: string;
    image: string | null;
}

interface Banner {
    id: number;
    title: string;
    image: string;
    link: string | null;
}

interface HomeProps {
    categories: Category[];
    featuredProducts: Product[];
    banners: Banner[];
    newArrivals: Product[];
    storeSettings: {
        store_name: string;
        currency_symbol: string;
    };
}

const Home: React.FC<HomeProps> = ({ categories, featuredProducts, banners, newArrivals, storeSettings }) => {
    // স্টেট ও কনটেক্সট সেটাপ
    const [highlightedProduct, setHighlightedProduct] = useState<number | null>(null);
    const { appSettings, flash } = usePage().props as any;
    const settings = appSettings || storeSettings;
    const { addToCart, removeFromCart, items, count } = useCart();
    const [isLoading, setIsLoading] = React.useState<{ [key: number]: boolean }>({});

    // কার্ট হেল্পার ফাংশন
    const getCartQuantity = (productId: number) => {
        return items[productId]?.quantity || 0;
    };

    // কার্ট অ্যাকশন হ্যান্ডলার
    const handleAddToCart = (productId: number) => {
        const product = [...featuredProducts, ...newArrivals].find(p => p.id === productId);
        if (!product) {
            console.error(`Product with ID ${productId} not found`);
            return;
        }

        setIsLoading(prev => ({ ...prev, [productId]: true }));
        setHighlightedProduct(productId);

        const success = addToCart(product, 1);

        setTimeout(() => {
            setIsLoading(prev => ({ ...prev, [productId]: false }));
            setTimeout(() => {
                setHighlightedProduct(null);
            }, 1000);
        }, 300);
    };

    const handleRemoveFromCart = (productId: number) => {
        setIsLoading(prev => ({ ...prev, [productId]: true }));
        removeFromCart(productId, 1);
        setTimeout(() => {
            setIsLoading(prev => ({ ...prev, [productId]: false }));
        }, 300);
    };

    const isProductLoading = (productId: number) => {
        return isLoading[productId] || false;
    };

    return (
        <ShopLayout>
            <Head title={`${settings.store_name} - তাজা খাবার সরাসরি হোম ডেলিভারি`} />

            <div id="main-content" className="mx-auto transition-all duration-300" style={{ fontFamily: "'Segoe UI', Helvetica, 'Droid Sans', Arial, 'lucida grande', tahoma, verdana, arial, sans-serif" }}>
                {/* হিরো ব্যানার সেকশন */}
                <div className="relative">
                    {banners.length > 0 && (
                        <div className="relative">
                            <img
                                src={`/storage/${banners[0].image}`}
                                alt={banners[0].title}
                                className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                                <div className="text-white ml-4 md:ml-8 lg:ml-16 max-w-lg">
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 leading-tight">
                                        তাজা খাবার সরাসরি বাসায়
                                    </h1>
                                    <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-3 md:mb-6 max-w-xs sm:max-w-sm md:max-w-lg">
                                        আমাদের তাজা ও মানসম্পন্ন পণ্য সংগ্রহ করুন সরাসরি আপনার বাসায়
                                    </p>
                                    <Link
                                        href="/products"
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-md font-medium text-sm md:text-lg transition-colors inline-block"
                                    >
                                        শপিং করুন
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* মূল কনটেন্ট */}
                <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                    {/* সুবিধাসমূহ সেকশন */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 sm:mb-8 md:mb-10">
                        <div className="bg-green-500 py-2 md:py-3">
                            <h2 className="text-lg md:text-xl font-bold text-white text-center">আমাদের সুবিধাসমূহ</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-y md:divide-y-0 divide-x divide-gray-200">
                            <div className="p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row items-center text-center sm:text-left">
                                <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 mb-2 sm:mb-0 sm:mr-3 md:mr-4 bg-green-100 rounded-full flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                                </div>
                                <div>
                                    <span className="text-base md:text-lg font-bold text-green-600 block sm:inline">১৫,০০০+ পণ্য</span>
                                    <p className="text-gray-600 text-xs sm:text-sm mt-1">বিস্তৃত পণ্য বাছাই</p>
                                </div>
                            </div>

                            <div className="p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row items-center text-center sm:text-left">
                                <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 mb-2 sm:mb-0 sm:mr-3 md:mr-4 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                                </div>
                                <div>
                                    <span className="text-base md:text-lg font-bold text-green-600 block sm:inline">ক্যাশ অন ডেলিভারি</span>
                                    <p className="text-gray-600 text-xs sm:text-sm mt-1">হাতে পেয়ে মূল্য পরিশোধ</p>
                                </div>
                            </div>

                            <div className="p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row items-center text-center sm:text-left">
                                <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 mb-2 sm:mb-0 sm:mr-3 md:mr-4 bg-green-100 rounded-full flex items-center justify-center">
                                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                                </div>
                                <div>
                                    <span className="text-base md:text-lg font-bold text-green-600 block sm:inline">১ ঘন্টার ডেলিভারি</span>
                                    <p className="text-gray-600 text-xs sm:text-sm mt-1">দ্রুত পরিষেবা</p>
                                </div>
                            </div>

                            <div className="p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row items-center text-center sm:text-left">
                                <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 mb-2 sm:mb-0 sm:mr-3 md:mr-4 bg-green-100 rounded-full flex items-center justify-center">
                                    <Percent className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                                </div>
                                <div>
                                    <span className="text-base md:text-lg font-bold text-green-600 block sm:inline">নিয়মিত অফার</span>
                                    <p className="text-gray-600 text-xs sm:text-sm mt-1">সাশ্রয়ী মূল্যে কেনাকাটা</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ক্যাটাগরি সেকশন */}
                    <div className="mb-6 sm:mb-8 md:mb-12">
                        <div className="flex items-center justify-between mb-3 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">ক্যাটাগরি</h2>
                            <Link href="/categories" className="text-green-600 hover:text-green-700 flex items-center text-xs sm:text-sm font-medium bg-green-50 px-2 sm:px-4 py-1 sm:py-2 rounded-md">
                                সব দেখুন
                                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-4">
                            {categories.slice(0, 6).map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/category/${category.slug}`}
                                    className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
                                >
                                    <div className="aspect-square p-2 sm:p-4 flex items-center justify-center bg-gray-50 group-hover:bg-green-50 transition-colors">
                                        <img
                                            src={category.image ? `/storage/${category.image}` : '/assets/category-placeholder.png'}
                                            alt={category.name}
                                            className="w-3/4 h-3/4 object-contain"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-2 sm:p-3 text-center border-t border-gray-100 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                        <h3 className="font-medium text-xs sm:text-sm truncate">{category.name}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* জনপ্রিয় পণ্যসমূহ */}
                    <div className="mb-6 sm:mb-8 md:mb-12">
                        <div className="flex items-center justify-between mb-3 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">জনপ্রিয় পণ্যসমূহ</h2>
                            <Link href="/products/featured" className="text-green-600 hover:text-green-700 flex items-center text-xs sm:text-sm font-medium bg-green-50 px-2 sm:px-4 py-1 sm:py-2 rounded-md">
                                সব দেখুন
                                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    storeSettings={settings}
                                    onAddToCart={handleAddToCart}
                                    onRemoveFromCart={handleRemoveFromCart}
                                    cartQuantity={getCartQuantity(product.id)}
                                    isLoading={isProductLoading(product.id)}
                                    isHighlighted={highlightedProduct === product.id}
                                />
                            ))}
                        </div>
                    </div>

                    {/* অ্যাপ ডাউনলোড সেকশন */}
                    <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl shadow-md mb-6 sm:mb-8 md:mb-12 overflow-hidden">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-4">আমাদের অ্যাপ ডাউনলোড করুন</h2>
                                <p className="text-green-50 text-sm sm:text-base mb-3 sm:mb-6">যেকোনো সময়, যেকোনো স্থান থেকে অর্ডার করুন আমাদের মোবাইল অ্যাপের মাধ্যমে। পান বিশেষ অফার ও ডিসকাউন্ট।</p>
                                <div className="flex flex-wrap gap-2 sm:gap-4">
                                    <a href="#" className="inline-block transition-transform hover:scale-105">
                                        <img src="/assets/app-store-badge.png" alt="অ্যাপ স্টোর থেকে ডাউনলোড করুন" className="h-8 sm:h-10 md:h-12" />
                                    </a>
                                    <a href="#" className="inline-block transition-transform hover:scale-105">
                                        <img src="/assets/google-play-badge.png" alt="গুগল প্লে থেকে ডাউনলোড করুন" className="h-8 sm:h-10 md:h-12" />
                                    </a>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 p-4 flex justify-center">
                                <img
                                    src="/assets/app-mockup.png"
                                    alt="মোবাইল অ্যাপ"
                                    className="max-w-[200px] sm:max-w-xs transform -rotate-6 shadow-xl rounded-xl"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </div>

                    {/* শুধু মোবাইলে দেখা যাবে এমন ক্যাটাগরি */}
                    <div className="sm:hidden mb-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-3">দ্রুত কেনাকাটা</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {categories.slice(0, 4).map((category) => (
                                <Link
                                    key={`quick-${category.id}`}
                                    href={`/category/${category.slug}`}
                                    className="flex items-center bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:border-green-200"
                                >
                                    {category.image ? (
                                        <img
                                            src={`/storage/${category.image}`}
                                            alt={category.name}
                                            className="w-10 h-10 object-contain mr-3"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-green-500">🛒</span>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-sm font-medium">{category.name}</span>
                                        <div className="text-green-500 text-xs flex items-center">
                                            কেনাকাটা করুন
                                            <ArrowRight className="w-3 h-3 ml-1" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ফুটার */}
            <footer className="bg-white shadow-md border-t border-gray-200 pt-8 sm:pt-12 pb-6">
                <div className="max-w-7xl mx-auto px-4">
                    {/* মোবাইল ফুটার অ্যাকোর্ডিয়ন */}
                    <div className="md:hidden mb-8">
                        <details className="group mb-3 border-b border-gray-200 pb-3">
                            <summary className="flex justify-between items-center cursor-pointer list-none">
                                <h3 className="text-base font-semibold text-gray-800">গ্রাহক সেবা</h3>
                                <span className="transition group-open:rotate-180">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </summary>
                            <ul className="mt-3 space-y-3 px-2">
                                <li><Link href="/contact" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>যোগাযোগ করুন</Link></li>
                                <li><Link href="/faq" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>সাধারণ জিজ্ঞাসা</Link></li>
                                <li><Link href="/page/shipping-policy" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>ডেলিভারি নীতি</Link></li>
                                <li><Link href="/page/return-policy" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>ফেরত নীতি</Link></li>
                            </ul>
                        </details>

                        <details className="group mb-3 border-b border-gray-200 pb-3">
                            <summary className="flex justify-between items-center cursor-pointer list-none">
                                <h3 className="text-base font-semibold text-gray-800">আমাদের সম্পর্কে</h3>
                                <span className="transition group-open:rotate-180">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </summary>
                            <ul className="mt-3 space-y-3 px-2">
                                <li><Link href="/page/about-us" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>আমাদের গল্প</Link></li>
                                <li><Link href="/blog" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>ব্লগ</Link></li>
                                <li><Link href="/careers" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>ক্যারিয়ার</Link></li>
                                <li><Link href="/page/privacy-policy" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>গোপনীয়তা নীতি</Link></li>
                            </ul>
                        </details>

                        <details className="group mb-3 border-b border-gray-200 pb-3">
                            <summary className="flex justify-between items-center cursor-pointer list-none">
                                <h3 className="text-base font-semibold text-gray-800">ব্যবসায়িক সুযোগ</h3>
                                <span className="transition group-open:rotate-180">
                                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </summary>
                            <ul className="mt-3 space-y-3 px-2">
                                <li><Link href="/corporate" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>কর্পোরেট অর্ডার</Link></li>
                                <li><Link href="/wholesale" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>পাইকারি ক্রয়</Link></li>
                                <li><Link href="/partnership" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>পার্টনারশিপ</Link></li>
                            </ul>
                        </details>
                    </div>

                    {/* ডেস্কটপ ফুটার লেআউট */}
                    <div className="hidden md:grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">গ্রাহক সেবা</h3>
                            <ul className="space-y-3">
                                <li><Link href="/contact" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>যোগাযোগ করুন</Link></li>
                                <li><Link href="/faq" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>সাধারণ জিজ্ঞাসা</Link></li>
                                <li><Link href="/page/shipping-policy" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>ডেলিভারি তথ্য</Link></li>
                                <li><Link href="/page/return-policy" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>ফেরত ও রিফান্ড</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">আমাদের সম্পর্কে</h3>
                            <ul className="space-y-3">
                                <li><Link href="/page/about-us" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>আমাদের গল্প</Link></li>
                                <li><Link href="/blog" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>ব্লগ</Link></li>
                                <li><Link href="/careers" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>ক্যারিয়ার</Link></li>
                                <li><Link href="/page/privacy-policy" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>গোপনীয়তা নীতি</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">ব্যবসায়িক সুযোগ</h3>
                            <ul className="space-y-3">
                                <li><Link href="/corporate" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>কর্পোরেট অর্ডার</Link></li>
                                <li><Link href="/wholesale" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>পাইকারি ক্রয়</Link></li>
                                <li><Link href="/partnership" className="text-gray-600 hover:text-green-500 flex items-center"><span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>পার্টনারশিপ</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">আমাদের সাথে যোগাযোগ</h3>
                            <div className="flex space-x-4 mb-6">
                                <a href="#" className="bg-gray-100 hover:bg-green-100 p-2 rounded-full text-gray-600 hover:text-green-600 transition-colors">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </a>
                                <a href="#" className="bg-gray-100 hover:bg-green-100 p-2 rounded-full text-gray-600 hover:text-green-600 transition-colors">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                                </a>
                                <a href="#" className="bg-gray-100 hover:bg-green-100 p-2 rounded-full text-gray-600 hover:text-green-600 transition-colors">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" /></svg>
                                </a>
                                <a href="#" className="bg-gray-100 hover:bg-green-100 p-2 rounded-full text-gray-600 hover:text-green-600 transition-colors">
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.957 0 1.739.81 1.739 1.8 0 .722-.42 1.35-1.025 1.614a2.91 2.91 0 0 1 .085.685c0 2.493-2.796 4.51-6.24 4.51-3.445 0-6.24-2.017-6.24-4.51 0-.234.28-.465.074-.691a1.79 1.79 0 0 1-1.025-1.608c0-.99.782-1.8 1.74-1.8.48 0 .904.183 1.21.49 1.188-.852 2.834-1.412 4.648-1.486l.895-4.19a.757.757 0 0 1 .372-.53.78.78 0 0 1 .656-.04l2.882.584a1.248 1.248 0 0 1 1.059-.607z" /></svg>
                                </a>
                            </div>

                            <h4 className="font-semibold mb-4">পেমেন্ট পদ্ধতি</h4>
                            <div className="flex flex-wrap gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <img src="/assets/visa.png" alt="ভিসা" className="h-8" loading="lazy" />
                                <img src="/assets/mastercard.png" alt="মাস্টারকার্ড" className="h-8" loading="lazy" />
                                <img src="/assets/bkash.png" alt="বিকাশ" className="h-8" loading="lazy" />
                                <img src="/assets/nagad.png" alt="নগদ" className="h-8" loading="lazy" />
                            </div>
                        </div>
                    </div>

                    {/* মোবাইলে সোশ্যাল ও পেমেন্ট */}
                    <div className="md:hidden mb-6">
                        <h3 className="text-base font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2">আমাদের সাথে যোগাযোগ</h3>
                        <div className="flex space-x-4 mb-4 justify-center">
                            <a href="#" className="bg-gray-100 hover:bg-green-100 p-2 rounded-full text-gray-600 hover:text-green-600 transition-colors">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </a>
                            <a href="#" className="bg-gray-100 hover:bg-green-100 p-2 rounded-full text-gray-600 hover:text-green-600 transition-colors">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
                            </a>
                            <a href="#" className="bg-gray-100 hover:bg-green-100 p-2 rounded-full text-gray-600 hover:text-green-600 transition-colors">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" /></svg>
                            </a>
                            <a href="#" className="bg-gray-100 hover:bg-green-100 p-2 rounded-full text-gray-600 hover:text-green-600 transition-colors">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.957 0 1.739.81 1.739 1.8 0 .722-.42 1.35-1.025 1.614a2.91 2.91 0 0 1 .085.685c0 2.493-2.796 4.51-6.24 4.51-3.445 0-6.24-2.017-6.24-4.51 0-.234.28-.465.074-.691a1.79 1.79 0 0 1-1.025-1.608c0-.99.782-1.8 1.74-1.8.48 0 .904.183 1.21.49 1.188-.852 2.834-1.412 4.648-1.486l.895-4.19a.757.757 0 0 1 .372-.53.78.78 0 0 1 .656-.04l2.882.584a1.248 1.248 0 0 1 1.059-.607z" /></svg>
                            </a>
                        </div>

                        <h4 className="font-semibold mb-2 text-center">পেমেন্ট পদ্ধতি</h4>
                        <div className="flex flex-wrap gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100 justify-center">
                            <img src="/assets/visa.png" alt="ভিসা" className="h-6 sm:h-8" loading="lazy" />
                            <img src="/assets/mastercard.png" alt="মাস্টারকার্ড" className="h-6 sm:h-8" loading="lazy" />
                            <img src="/assets/bkash.png" alt="বিকাশ" className="h-6 sm:h-8" loading="lazy" />
                            <img src="/assets/nagad.png" alt="নগদ" className="h-6 sm:h-8" loading="lazy" />
                        </div>
                    </div>

                    <div className="mt-6 md:mt-10 pt-4 md:pt-6 border-t border-gray-200 text-center">
                        <p className="text-gray-600 text-xs sm:text-sm">© {new Date().getFullYear()} {settings?.store_name}। সর্বসত্ব সংরক্ষিত।</p>
                    </div>
                </div>
            </footer>
        </ShopLayout>
    );
};

export default Home;
