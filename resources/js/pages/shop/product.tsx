import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import ShopLayout from '@/layouts/ShopLayout';
import { ChevronRight, Minus, Plus, ShoppingCart, Heart, Share2, Star, StarHalf, TruckIcon, PackageCheck, Shield, CheckCircle, XCircle } from 'lucide-react';

interface ProductImage {
    id: number;
    image: string;
    is_primary: boolean;
    order: number;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    special_price: number | null;
    unit: string;
    stock: number;
    sku: string;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    is_featured: boolean;
    images: ProductImage[];
}

interface ProductProps {
    product: Product;
    relatedProducts: Product[];
    storeSettings: {
        store_name: string;
        currency_symbol: string;
    };
}

const Product: React.FC<ProductProps> = ({ product, relatedProducts, storeSettings }) => {
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [inWishlist, setInWishlist] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    // পরিমাণ বাড়ানো
    const incrementQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(prev => prev + 1);
        }
    };

    // পরিমাণ কমানো
    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    // পছন্দের তালিকা টগল
    const toggleWishlist = () => {
        setInWishlist(prev => !prev);
    };

    // মূল্য ফরম্যাট করা
    const formatPrice = (price: number) => {
        return `৳${price.toFixed(2)}`;
    };

    // পণ্যের প্রাইমারি ছবি পাওয়া
    const getProductImage = (prod: Product) => {
        const primaryImage = prod.images.find(img => img.is_primary);
        return primaryImage ? `/storage/${primaryImage.image}` : '/assets/placeholder.png';
    };

    // ছাড়ের শতাংশ গণনা
    const discountPercentage = product.special_price
        ? Math.round((1 - product.special_price / product.price) * 100)
        : 0;

    // রেটিং - (আসল অ্যাপে রিভিউ থেকে আসবে)
    const rating = 4.5;
    const reviewCount = 24;

    // পণ্য শেয়ার করা
    const shareProduct = () => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href,
            })
            .catch(console.error);
        }
    };

    return (
        <ShopLayout>
            <Head title={`${product.name} - ${storeSettings.store_name}`} />

            <div className="container mx-auto px-4 py-6">
                {/* ব্রেডক্রাম্ব */}
                <div className="flex items-center text-sm mb-4 flex-wrap bg-gray-50 p-2 rounded-lg">
                    <Link href="/" className="text-gray-500 hover:text-green-600">হোম</Link>
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                    <Link
                        href={`/category/${product.category.slug}`}
                        className="text-gray-500 hover:text-green-600"
                    >
                        {product.category.name}
                    </Link>
                    <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                    <span className="text-green-600 font-medium truncate max-w-[200px]">{product.name}</span>
                </div>

                {/* পণ্যের বিস্তারিত */}
                <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* পণ্যের ছবি */}
                        <div className="lg:w-2/5">
                            <div className="relative mb-4 border border-gray-200 rounded-lg overflow-hidden bg-white p-2">
                                <img
                                    src={`/storage/${product.images[activeImage]?.image || product.images[0]?.image}`}
                                    alt={product.name}
                                    className="w-full h-72 md:h-96 object-contain"
                                />

                                {/* ছাড় ব্যাজ */}
                                {product.special_price && (
                                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                        {discountPercentage}% ছাড়
                                    </div>
                                )}
                            </div>

                            {/* থাম্বনেইল ছবি - মোবাইল অপ্টিমাইজড */}
                            {product.images.length > 1 && (
                                <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2">
                                    {product.images.map((image, index) => (
                                        <button
                                            key={image.id}
                                            onClick={() => setActiveImage(index)}
                                            className={`border rounded-md overflow-hidden h-16 w-16 flex-shrink-0 ${
                                                activeImage === index ? 'border-green-500 ring-2 ring-green-300' : 'border-gray-200'
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${image.image}`}
                                                alt={`${product.name} - ছবি ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* পণ্যের তথ্য */}
                        <div className="lg:w-3/5">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>

                            {/* রেটিং */}
                            <div className="flex items-center mb-3">
                                <div className="flex text-yellow-400">
                                    {[...Array(Math.floor(rating))].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-current" />
                                    ))}
                                    {rating % 1 !== 0 && <StarHalf className="h-4 w-4 fill-current" />}
                                </div>
                                <span className="text-gray-500 text-sm ml-2">{rating} ({reviewCount} রিভিউ)</span>
                            </div>

                            {/* মূল্য */}
                            <div className="p-3 bg-gray-50 rounded-lg mb-4">
                                {product.special_price ? (
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-2xl font-bold text-green-700">
                                            {formatPrice(product.special_price)}
                                        </span>
                                        <span className="text-lg text-gray-500 line-through">
                                            {formatPrice(product.price)}
                                        </span>
                                        <span className="bg-red-500 text-white text-sm px-2 py-1 rounded">
                                            {discountPercentage}% ছাড়
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-2xl font-bold text-green-700">
                                        {formatPrice(product.price)}
                                    </span>
                                )}
                                <p className="text-gray-500 text-sm mt-1">প্রতি {product.unit} মূল্য</p>
                            </div>

                            {/* স্টক স্ট্যাটাস */}
                            <div className="mb-4 flex flex-col md:flex-row gap-3 md:items-center">
                                <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                                    <span className="text-gray-700 mr-2">উপলব্ধতা:</span>
                                    {product.stock > 0 ? (
                                        <span className="text-green-600 font-medium flex items-center">
                                            <CheckCircle className="h-4 w-4 mr-1" /> স্টকে আছে
                                            {product.stock < 5 && (
                                                <span className="ml-1 text-amber-600">
                                                    (মাত্র {product.stock}টি বাকি)
                                                </span>
                                            )}
                                        </span>
                                    ) : (
                                        <span className="text-red-600 font-medium flex items-center">
                                            <XCircle className="h-4 w-4 mr-1" /> স্টকে নেই
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                                    <span className="text-gray-700 mr-2">পণ্য কোড:</span>
                                    <span className="text-gray-600">{product.sku}</span>
                                </div>
                            </div>

                            {/* বিবরণ - সংক্ষিপ্ত */}
                            {product.description && (
                                <div className="mb-4 bg-gray-50 p-3 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">সংক্ষিপ্ত বিবরণ</h3>
                                    <div className="text-gray-600 prose-sm max-h-20 overflow-hidden relative">
                                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent"></div>
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('description')}
                                        className="text-green-600 hover:text-green-700 text-sm mt-1"
                                    >
                                        আরও পড়ুন
                                    </button>
                                </div>
                            )}

                            {/* কার্টে যোগ করুন */}
                            <div className="mb-4">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="flex border border-gray-300 rounded-md w-full sm:w-36">
                                        <button
                                            onClick={decrementQuantity}
                                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-l-md"
                                        >
                                            <Minus className="h-5 w-5" />
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            min={1}
                                            max={product.stock}
                                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                                            className="w-full text-center border-none focus:ring-0"
                                            readOnly
                                        />
                                        <button
                                            onClick={incrementQuantity}
                                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-r-md"
                                        >
                                            <Plus className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <button
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium flex items-center justify-center transition-colors"
                                        disabled={product.stock <= 0}
                                    >
                                        <ShoppingCart className="h-5 w-5 mr-2" />
                                        কার্টে যোগ করুন
                                    </button>

                                    <button
                                        onClick={toggleWishlist}
                                        className="px-4 py-3 border border-gray-300 hover:border-red-500 rounded-md transition-colors"
                                        aria-label="পছন্দের তালিকায় যোগ করুন"
                                    >
                                        <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                                    </button>

                                    <button
                                        onClick={shareProduct}
                                        className="px-4 py-3 border border-gray-300 hover:border-blue-500 rounded-md transition-colors"
                                        aria-label="শেয়ার করুন"
                                    >
                                        <Share2 className="h-5 w-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* ডেলিভারি তথ্য */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                                        <TruckIcon className="h-7 w-7 text-blue-600 mr-3 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium">ফ্রি ডেলিভারি</h4>
                                            <p className="text-sm text-gray-600">{formatPrice(1000)}+ অর্ডারে</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                                        <PackageCheck className="h-7 w-7 text-green-600 mr-3 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium">মানের গ্যারান্টি</h4>
                                            <p className="text-sm text-gray-600">তাজা ও প্রিমিয়াম পণ্য</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                                        <Shield className="h-7 w-7 text-purple-600 mr-3 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium">নিরাপদ পেমেন্ট</h4>
                                            <p className="text-sm text-gray-600">১০০% নিরাপদ চেকআউট</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* পণ্য ট্যাব - বিবরণ, রিভিউ, ইত্যাদি */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('description')}
                                className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'description'
                                    ? 'text-green-600 border-b-2 border-green-600'
                                    : 'text-gray-600 hover:text-green-600'}`}
                            >
                                বিবরণ
                            </button>
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'reviews'
                                    ? 'text-green-600 border-b-2 border-green-600'
                                    : 'text-gray-600 hover:text-green-600'}`}
                            >
                                রিভিউ ({reviewCount})
                            </button>
                            <button
                                onClick={() => setActiveTab('shipping')}
                                className={`px-4 py-3 font-medium whitespace-nowrap ${activeTab === 'shipping'
                                    ? 'text-green-600 border-b-2 border-green-600'
                                    : 'text-gray-600 hover:text-green-600'}`}
                            >
                                শিপিং ও রিটার্ন
                            </button>
                        </div>
                    </div>

                    <div className="p-4 md:p-6">
                        {activeTab === 'description' && (
                            <>
                                {product.description ? (
                                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
                                ) : (
                                    <p className="text-gray-500">এই পণ্যের জন্য কোন বিবরণ নেই।</p>
                                )}
                            </>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="text-center py-8">
                                <Star className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                                <h3 className="text-lg font-medium mb-3">এই পণ্যের রিভিউ</h3>
                                <p className="text-gray-500 mb-4">এখনো কোন রিভিউ নেই। প্রথম রিভিউ দিন!</p>
                                <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                                    রিভিউ লিখুন
                                </button>
                            </div>
                        )}

                        {activeTab === 'shipping' && (
                            <div>
                                <h3 className="text-lg font-medium mb-3">শিপিং নীতি</h3>
                                <p className="mb-4">ঢাকার ভিতরে ২৪ ঘন্টার মধ্যে ডেলিভারি করা হয়। ঢাকার বাইরে ৪৮ ঘণ্টার মধ্যে ডেলিভারি করা হয়।</p>

                                <h3 className="text-lg font-medium mb-3 mt-6">রিটার্ন নীতি</h3>
                                <p>পণ্য গ্রহণের সময় পণ্য পরীক্ষা করে নিন। কোন সমস্যা থাকলে তখনই জানান। ডেলিভারি ম্যানের উপস্থিতিতে পণ্য খুলে দেখুন।</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* সম্পর্কিত পণ্য */}
                {relatedProducts.length > 0 && (
                    <div className="mb-6 bg-white rounded-lg shadow-md p-4 md:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">সম্পর্কিত পণ্য</h2>
                            <Link href="/products" className="text-green-600 hover:text-green-700 text-sm">
                                আরও দেখুন <ChevronRight className="inline h-4 w-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                            {relatedProducts.map((relatedProduct) => (
                                <div key={relatedProduct.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md">
                                    <Link href={`/product/${relatedProduct.slug}`} className="block relative">
                                        <div className="aspect-square overflow-hidden">
                                            <img
                                                src={getProductImage(relatedProduct)}
                                                alt={relatedProduct.name}
                                                className="w-full h-full object-cover transition-transform hover:scale-105"
                                            />
                                        </div>
                                        {relatedProduct.special_price && (
                                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                                {Math.round((1 - relatedProduct.special_price / relatedProduct.price) * 100)}% ছাড়
                                            </div>
                                        )}
                                    </Link>

                                    <div className="p-3">
                                        <Link href={`/product/${relatedProduct.slug}`} className="block">
                                            <h3 className="font-medium text-gray-800 mb-1 line-clamp-2 min-h-[2.5rem] text-sm">{relatedProduct.name}</h3>
                                            <p className="text-xs text-gray-500 mb-2">{relatedProduct.unit}</p>
                                        </Link>

                                        <div className="flex justify-between items-center">
                                            <div>
                                                {relatedProduct.special_price ? (
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-green-700">{formatPrice(relatedProduct.special_price)}</span>
                                                        <span className="text-xs text-gray-500 line-through">{formatPrice(relatedProduct.price)}</span>
                                                    </div>
                                                ) : (
                                                    <span className="font-semibold text-green-700">{formatPrice(relatedProduct.price)}</span>
                                                )}
                                            </div>

                                            <button
                                                className="p-2 text-green-700 hover:bg-green-50 border border-green-700 rounded"
                                                aria-label="কার্টে যোগ করুন"
                                            >
                                                <ShoppingCart className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* সম্প্রতি দেখা */}
                <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">সম্প্রতি দেখা হয়েছে</h2>
                        <Link href="/products" className="text-green-600 hover:text-green-700 text-sm">
                            আরও দেখুন <ChevronRight className="inline h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                        {relatedProducts.slice(0, 6).map((relatedProduct) => (
                            <div key={`recent-${relatedProduct.id}`} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
                                <Link href={`/product/${relatedProduct.slug}`} className="block">
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={getProductImage(relatedProduct)}
                                            alt={relatedProduct.name}
                                            className="w-full h-full object-cover transition-transform hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-2">
                                        <h3 className="font-medium text-sm text-gray-800 truncate">{relatedProduct.name}</h3>
                                        <p className="text-xs text-green-700">{formatPrice(relatedProduct.special_price || relatedProduct.price)}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
};

export default Product;
