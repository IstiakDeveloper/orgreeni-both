import React, { useState } from 'react';
import { Zap, X, Minus, Plus } from 'lucide-react';

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

interface ProductCardProps {
    product: Product;
    storeSettings: any;
    onAddToCart: (productId: number) => void;
    onRemoveFromCart: (productId: number) => void;
    cartQuantity: number;
    isLoading: boolean;
    isHighlighted?: boolean; // New prop for highlighting
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    storeSettings,
    onAddToCart,
    onRemoveFromCart,
    cartQuantity,
    isLoading,
    isHighlighted = false // Default to false
}) => {
    const [showModal, setShowModal] = useState(false);

    // Get product primary image
    const getProductImage = () => {
        const primaryImage = product.images.find(img => img.is_primary);
        return primaryImage ? `/storage/${primaryImage.image}` : '/assets/placeholder.png';
    };

    // Format price
    const formatPrice = (price: number) => {
        return `${storeSettings.currency_symbol}${price.toFixed(0)}`;
    };

    // Calculate discount percentage
    const discountPercentage = product.special_price
        ? Math.round((1 - product.special_price / product.price) * 100)
        : 0;

    // Calculate the original price if special price exists
    const hasDiscount = product.special_price !== null;
    const originalPrice = hasDiscount ? product.price : null;

    return (
        <>
            <div className={`bg-white rounded-lg shadow overflow-hidden transition-all duration-300 ${isHighlighted ? 'ring-2 ring-green-500 shadow-lg scale-105' : ''
                }`}>
                {/* Product Image - Clickable to add to cart */}
                <div className="relative">
                    <div
                        className="aspect-square overflow-hidden cursor-pointer"
                        onClick={() => onAddToCart(product.id)}
                    >
                        <img
                            src={getProductImage()}
                            alt={product.name}
                            className="w-full h-full object-contain p-2"
                        />
                    </div>

                    {/* Semi-transparent overlay with quantity controls when in cart */}
                    {cartQuantity > 0 && (
                        <div
                            className="absolute inset-0 flex flex-col items-center justify-center text-white"
                            style={{ backgroundColor: 'rgba(22, 101, 52, 0.8)' }} // green-800 with 40% opacity
                        >
                            <div
                                className="text-xl font-bold mb-2"
                                style={{ textShadow: '0px 0px 2px rgba(0, 0, 0, 0.8)' }}
                            >
                                {formatPrice(product.special_price || product.price)}
                            </div>

                            <div className="flex items-center justify-center">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveFromCart(product.id);
                                    }}
                                    className="border-2 border-white rounded-full w-8 h-8 flex items-center justify-center text-white mr-3"
                                    style={{ backgroundColor: 'rgba(22, 101, 52, 0.6)' }} // green-800 with 60% opacity
                                >
                                    <Minus className="h-4 w-4" />
                                </button>

                                <span
                                    className="text-3xl font-bold text-yellow-400 mx-3"
                                    style={{ textShadow: '0px 0px 2px rgba(0, 0, 0, 0.8)' }}
                                >
                                    {cartQuantity}
                                </span>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddToCart(product.id);
                                    }}
                                    className="border-2 border-white rounded-full w-8 h-8 flex items-center justify-center text-white ml-3"
                                    style={{ backgroundColor: 'rgba(22, 101, 52, 0.6)' }} // green-800 with 60% opacity
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>

                            <div
                                className="mt-3 text-lg font-medium"
                                style={{ textShadow: '0px 0px 2px rgba(0, 0, 0, 0.8)' }}
                            >
                                in bag
                            </div>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-3">
                    <h3 className="text-gray-800 text-sm font-medium mb-1 line-clamp-2 min-h-[2.5rem]">
                        {product.name} {product.unit && `(± ${product.unit})`}
                    </h3>

                    <div className="text-xs text-gray-500 mb-2">{product.unit}</div>

                    <div className="flex items-end">
                        <div className="font-bold text-green-700 text-lg">{formatPrice(product.special_price || product.price)}</div>

                        {hasDiscount && (
                            <div className="ml-2 text-xs text-gray-500 line-through">
                                {formatPrice(originalPrice!)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Details Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowModal(true);
                    }}
                    className="w-full text-center py-2 border-t border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                >
                    Details&gt;
                </button>

                {/* Add to Bag or Quantity Control */}
                {cartQuantity > 0 ? (
                    <div className="flex items-center w-full">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFromCart(product.id);
                            }}
                            className="py-2 px-3 bg-green-700 text-white text-center hover:bg-green-800 transition-colors border border-white border-opacity-20"
                        >
                            –
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(product.id);
                            }}
                            className="py-2 px-4 bg-green-700 text-white flex-1 text-center font-medium border-t border-b border-white border-opacity-20">
                            {cartQuantity} in bag
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(product.id);
                            }}
                            className="py-2 px-3 bg-green-700 text-white text-center hover:bg-green-800 transition-colors border border-white border-opacity-20"
                        >
                            +
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product.id);
                        }}
                        disabled={isLoading}
                        className={`w-full bg-green-100 hover:bg-green-200 text-green-600 py-2 flex items-center justify-center text-sm font-medium transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </span>
                        ) : (
                            <>
                                <Zap className="h-4 w-4 mr-1" />
                                Add to bag
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Product Details Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowModal(false);
                        }
                    }}
                >
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                        {/* Close button at top right */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div className="flex flex-col md:flex-row p-6">
                            {/* Product Image - Left Side */}
                            <div className="md:w-2/5 mb-6 md:mb-0 flex items-center justify-center">
                                <img
                                    src={getProductImage()}
                                    alt={product.name}
                                    className="w-full h-auto object-contain max-h-80"
                                />
                            </div>

                            {/* Product Details - Right Side */}
                            <div className="md:w-3/5 md:pl-8">
                                {/* Product Title */}
                                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{product.name}</h2>

                                {/* Product Unit */}
                                <p className="text-gray-500 mb-4">{product.unit}</p>

                                {/* Product Price */}
                                <div className="flex items-center mb-6">
                                    <div className="flex items-baseline">
                                        <span className="text-3xl font-bold text-gray-800">৳{product.special_price || product.price}</span>
                                        {product.special_price && (
                                            <span className="text-sm text-gray-500 line-through ml-2">MRP: ৳{product.price}</span>
                                        )}
                                    </div>

                                    {product.special_price && (
                                        <div className="ml-auto">
                                            <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-md font-medium">
                                                {discountPercentage}% OFF
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Add to Cart Controls */}
                                {cartQuantity > 0 ? (
                                    <div className="flex items-center border border-gray-300 rounded-md mb-6 w-full max-w-xs">
                                        <button
                                            onClick={() => onRemoveFromCart(product.id)}
                                            className="p-3 text-gray-600 hover:text-gray-800"
                                        >
                                            <Minus className="h-5 w-5" />
                                        </button>
                                        <div className="flex-1 text-center py-2">
                                            <span className="text-lg">{cartQuantity}</span>
                                            <span className="text-gray-500 block text-sm">in bag</span>
                                        </div>
                                        <button
                                            onClick={() => onAddToCart(product.id)}
                                            className="p-3 text-gray-600 hover:text-gray-800"
                                        >
                                            <Plus className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => onAddToCart(product.id)}
                                        className="bg-red-400 hover:bg-red-500 text-white py-3 px-8 rounded-md font-medium text-lg transition-colors mb-6"
                                    >
                                        Buy Now
                                    </button>
                                )}

                                <hr className="border-gray-200 mb-6" />

                                {/* Origin Info with Flag */}
                                <div className="bg-gray-50 p-4 rounded-md mb-6">
                                    <div className="flex items-center mb-2">
                                        <span className="font-medium text-gray-700">Product of Bangladesh</span>
                                        <span className="ml-2">🇧🇩</span>
                                    </div>

                                    {/* Product Details */}
                                    <div className="text-gray-600 text-sm">
                                        <p className="mb-2">{product.quantity_info || `${product.min_quantity || 3}-${product.max_quantity || 4}pcs`}</p>
                                        <p className="mb-2">Every 1 kg of the product will contain {product.min_quantity || 3}-{product.max_quantity || 4}pcs of {product.name}.</p>
                                        <div dangerouslySetInnerHTML={{ __html: product.description || `${product.name} is rich in nutrients and vitamins.` }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductCard;
