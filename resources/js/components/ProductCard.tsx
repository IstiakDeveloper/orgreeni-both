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
    storeSettings: {
        store_name: string;
        currency_symbol: string;
    };
    onAddToCart: (id: number) => void;
    onRemoveFromCart: (id: number) => void;
    cartQuantity: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    storeSettings,
    onAddToCart,
    onRemoveFromCart,
    cartQuantity = 0
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
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all">
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
                        className="w-full bg-green-100 hover:bg-green-200 text-green-600 py-2 flex items-center justify-center text-sm font-medium transition-colors"
                    >
                        <Zap className="h-4 w-4 mr-1" />
                        Add to bag
                    </button>
                )}
            </div>

            {/* Product Details Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex flex-col md:flex-row p-4">
                            <div className="md:w-1/3 mb-4 md:mb-0">
                                <img
                                    src={getProductImage()}
                                    alt={product.name}
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                            <div className="md:w-2/3 md:pl-6">
                                <div className="mb-4">
                                    <p className="text-sm text-gray-500">{product.unit}</p>
                                    <div className="flex items-end mt-2">
                                        <div className="mr-3">
                                            {product.special_price ? (
                                                <>
                                                    <span className="font-bold text-2xl text-green-700">{formatPrice(product.special_price)}</span>
                                                    <span className="text-sm text-gray-500 line-through ml-2">{formatPrice(product.price)}</span>
                                                </>
                                            ) : (
                                                <span className="font-bold text-2xl text-green-700">{formatPrice(product.price)}</span>
                                            )}
                                        </div>
                                        {product.special_price && (
                                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                {discountPercentage}% OFF
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    {product.description ? (
                                        <div dangerouslySetInnerHTML={{ __html: product.description }} className="text-gray-700 text-sm" />
                                    ) : (
                                        <p className="text-gray-500 text-sm">No description available for this product.</p>
                                    )}
                                </div>

                                {cartQuantity > 0 ? (
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => onRemoveFromCart(product.id)}
                                            className="bg-green-600 text-white px-4 py-2 rounded-l flex-1 text-center"
                                        >
                                            <Minus className="h-4 w-4 inline-block" />
                                        </button>
                                        <div className="bg-green-500 text-white px-4 py-2 flex-1 text-center">
                                            {cartQuantity} in bag
                                        </div>
                                        <button
                                            onClick={() => onAddToCart(product.id)}
                                            className="bg-green-600 text-white px-4 py-2 rounded-r flex-1 text-center"
                                        >
                                            <Plus className="h-4 w-4 inline-block" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            onAddToCart(product.id);
                                            setShowModal(false);
                                        }}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
                                    >
                                        <Zap className="h-4 w-4 inline-block mr-1" />
                                        Add to Bag
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductCard;
