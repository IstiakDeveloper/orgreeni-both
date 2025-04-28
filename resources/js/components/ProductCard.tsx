import React from 'react';
import { Link } from '@inertiajs/react';
import { Minus, Plus, ShoppingBag, AlertTriangle } from 'lucide-react';

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        slug: string;
        price: number;
        special_price: number | null;
        unit: string;
        stock: number;
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
    };
    storeSettings: {
        store_name: string;
        currency_symbol: string;
    };
    onAddToCart: (productId: number) => void;
    onRemoveFromCart: (productId: number) => void;
    cartQuantity: number;
    isLoading?: boolean;
    isHighlighted?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    storeSettings,
    onAddToCart,
    onRemoveFromCart,
    cartQuantity = 0,
    isLoading = false,
    isHighlighted = false
}) => {
    // প্রাইমারি ইমেজ বা প্রথম ইমেজ বা প্লেসহোল্ডার নির্ধারণ
    const productImage = product.images && product.images.length > 0
        ? product.images.find(img => img.is_primary)?.image || product.images[0].image
        : null;

    // বিশেষ মূল্য থাকলে ছাড়ের শতাংশ গণনা
    const discountPercentage = product.special_price
        ? Math.round(((product.price - product.special_price) / product.price) * 100)
        : 0;

    return (
        <div
            className={`
                bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border
                ${isHighlighted ? 'border-green-500 transform scale-[1.01] shadow-md' : 'border-gray-100'}
                flex flex-col h-full
            `}
            aria-label={`পণ্য: ${product.name}`}
        >
            {/* পণ্যের ছবি ও লিংক */}
            <Link
                href={`/product/${product.slug}`}
                className="relative block overflow-hidden rounded-t-lg"
            >
                <div className="aspect-square p-2 sm:p-3 bg-gray-50 flex items-center justify-center">
                    <img
                        src={productImage ? `/storage/${productImage}` : '/assets/product-placeholder.png'}
                        alt={product.name}
                        className="max-h-full object-contain transition-all duration-300 hover:scale-105"
                        loading="lazy"
                    />
                </div>

                {/* ছাড়ের ট্যাগ - শুধুমাত্র বিশেষ মূল্য থাকলে দেখানো হবে */}
                {product.special_price && (
                    <span className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white text-[10px] sm:text-xs px-1 py-0.5 rounded-sm font-medium">
                        {discountPercentage}% ছাড়
                    </span>
                )}

                {/* কম স্টকের সতর্কতা */}
                {product.stock <= 5 && product.stock > 0 && (
                    <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-orange-500 text-white flex items-center px-1 py-0.5 rounded-sm text-[9px] sm:text-xs">
                        <AlertTriangle className="w-3 h-3 mr-0.5" />
                        মাত্র {product.stock}টি বাকি
                    </div>
                )}
            </Link>

            {/* পণ্যের তথ্য */}
            <div className="p-2 sm:p-3 flex-grow flex flex-col justify-between">
                <div>
                    {/* ক্যাটাগরি লিংক */}
                    <Link
                        href={`/category/${product.category.slug}`}
                        className="text-[10px] sm:text-xs text-gray-500 hover:text-green-600 transition-colors"
                    >
                        {product.category.name}
                    </Link>

                    {/* পণ্যের নাম */}
                    <Link
                        href={`/product/${product.slug}`}
                        className="block mt-1 mb-2 font-medium text-gray-800 text-sm sm:text-base line-clamp-2 hover:text-green-600 transition-colors"
                    >
                        {product.name}
                    </Link>
                </div>

                <div>
                    {/* মূল্য প্রদর্শন */}
                    <div className="flex items-baseline mb-2">
                        {/* বর্তমান মূল্য (বিশেষ মূল্য থাকলে, অন্যথায় নিয়মিত মূল্য) */}
                        <span className="text-base sm:text-lg font-bold text-green-600">
                            {storeSettings.currency_symbol}{(product.special_price || product.price).toFixed(2)}
                        </span>

                        {/* একক */}
                        <span className="text-[10px] sm:text-xs text-gray-500 ml-1">/{product.unit}</span>

                        {/* আসল মূল্য (বিশেষ মূল্য থাকলে কাটা দাগ সহ দেখানো হয়) */}
                        {product.special_price && (
                            <span className="text-xs sm:text-sm text-gray-500 line-through ml-2">
                                {storeSettings.currency_symbol}{product.price.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* কার্টে যোগ করার নিয়ন্ত্রণ */}
                    <div className="flex items-center justify-between">
                        {cartQuantity === 0 ? (
                            <button
                                onClick={() => onAddToCart(product.id)}
                                disabled={isLoading || product.stock <= 0}
                                className={`
                                    w-full py-1.5 px-2 sm:py-2 rounded-md text-xs sm:text-sm font-medium
                                    flex items-center justify-center transition-colors
                                    ${isLoading ? 'bg-gray-300 cursor-not-allowed' :
                                        product.stock <= 0 ?
                                            'bg-gray-300 cursor-not-allowed' :
                                            'bg-green-500 hover:bg-green-600 text-white'
                                    }
                                `}
                                aria-label={`${product.name} কার্টে যোগ করুন`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        লোড হচ্ছে...
                                    </span>
                                ) : product.stock <= 0 ? (
                                    "স্টকে নেই"
                                ) : (
                                    <>
                                        <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                                        কার্টে যোগ করুন
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="flex items-center w-full rounded-md border border-gray-200">
                                <button
                                    onClick={() => onRemoveFromCart(product.id)}
                                    disabled={isLoading}
                                    className={`
                                        px-2 py-1 sm:py-1.5 text-gray-700 hover:bg-gray-100 rounded-l-md transition-colors
                                        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                    aria-label={`${product.name} এর পরিমাণ কমান`}
                                >
                                    <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </button>
                                <div className="flex-1 text-center text-sm sm:text-base font-medium py-1">
                                    {isLoading ? (
                                        <span className="inline-block h-4 w-4">
                                            <svg className="animate-spin h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </span>
                                    ) : (
                                        cartQuantity
                                    )}
                                </div>
                                <button
                                    onClick={() => onAddToCart(product.id)}
                                    disabled={isLoading || cartQuantity >= product.stock}
                                    className={`
                                        px-2 py-1 sm:py-1.5 text-gray-700 hover:bg-gray-100 rounded-r-md transition-colors
                                        ${isLoading || cartQuantity >= product.stock ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                    aria-label={`${product.name} এর পরিমাণ বাড়ান`}
                                >
                                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
