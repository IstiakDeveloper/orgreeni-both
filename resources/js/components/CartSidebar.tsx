import React, { useEffect, useRef } from 'react';
import { ShoppingCart, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const CartSidebar = () => {
    const {
        items,
        count,
        total,
        isCartOpen,
        toggleCart,
        updateQuantity,
        removeFromCart
    } = useCart();

    const countRef = useRef(null);
    const { lastAddedProductId } = useCart();

    // Animation for count changes
    useEffect(() => {
        if (countRef.current) {
            countRef.current.classList.add('animate-pulse');

            setTimeout(() => {
                if (countRef.current) {
                    countRef.current.classList.remove('animate-pulse');
                }
            }, 1000);
        }
    }, [count]);

    return (
        <>
            {/* Cart Toggle Button */}
            {!isCartOpen && (
                <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40">
                    <button
                        onClick={toggleCart}
                        className="bg-green-600 text-white py-3 px-4 rounded-lg shadow-lg flex flex-col items-center hover:bg-green-700 transition-colors"
                    >
                        <div className="relative">
                            <ShoppingCart className="h-6 w-6" />
                            {count > 0 && (
                                <span
                                    ref={countRef}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300"
                                >
                                    {count}
                                </span>
                            )}
                        </div>
                        {count > 0 && (
                            <>
                                <div className="text-sm mt-1">{count} ITEM</div>
                                <div className="font-bold">৳{total.toFixed(0)}</div>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Persistent Cart Sidebar */}
            <div
                className={`fixed bottom-0 right-0 h-[90vh] w-80 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-green-600 text-white">
                    <div className="flex items-center">
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        <span className="font-medium">
                            {Object.keys(items).length > 0
                                ? `${Object.keys(items).length} PRODUCTS IN CART`
                                : 'YOUR CART'}
                        </span>
                    </div>
                    <button
                        onClick={toggleCart}
                        className="p-2 hover:bg-green-700 rounded-full"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="overflow-y-auto flex-grow">
                    {count === 0 ? (
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                            <div className="bg-gray-100 rounded-full p-6 mb-4">
                                <ShoppingCart size={40} className="text-gray-400" />
                            </div>
                            <p className="text-gray-500">Your cart is empty</p>
                        </div>
                    ) : (
                        <div>
                            {Object.values(items).map((item) => (
                                <div
                                    key={item.id}
                                    className={`p-3 border-b border-gray-100 transition-all duration-300
                                    ${item.stock <= 5 ? 'bg-orange-50 hover:bg-orange-100' : 'hover:bg-gray-50'}
                                    ${lastAddedProductId === item.id ? 'bg-green-50 border-green-200 animate-pulse' : ''}`}
                                >
                                    <div className="flex">
                                        {/* Product Image */}
                                        <div className="w-16 h-16 flex-shrink-0 relative">
                                            <img
                                                src={item.image ? `/storage/${item.image}` : '/assets/product-placeholder.png'}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded"
                                            />
                                            {item.stock <= 5 && (
                                                <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] px-1 rounded">
                                                    Low Stock
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="ml-3 flex-1">
                                            <div className="flex justify-between">
                                                <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                                                    {item.name}
                                                    {item.stock <= 5 && (
                                                        <span className="ml-2 text-orange-500 text-xs">
                                                            (Only {item.stock} left!)
                                                        </span>
                                                    )}
                                                </h3>
                                                <button
                                                    onClick={() => removeFromCart(item.product_id)}
                                                    className="text-gray-400 hover:text-red-500 ml-1 flex-shrink-0"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>

                                            <div className="mt-1">
                                                <p className="text-xs text-gray-500">
                                                    ৳{item.special_price || item.price}/{item.unit}
                                                    {item.special_price && (
                                                        <span className="ml-2 bg-green-100 text-green-700 text-[10px] px-1 rounded">
                                                            SPECIAL PRICE
                                                        </span>
                                                    )}
                                                </p>
                                            </div>

                                            <div className="mt-1 flex justify-between items-end">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center border border-gray-200 rounded-sm inline-block">
                                                    <button
                                                        onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                                                        className="px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-2 py-0.5 text-xs border-x border-gray-200 min-w-[20px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                        className={`px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-100
                                                            ${item.quantity >= item.stock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        disabled={item.quantity >= item.stock}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="font-medium text-sm flex items-center">
                                                    <span>
                                                        ৳{((item.special_price || item.price) * item.quantity).toFixed(0)}
                                                    </span>
                                                    {item.special_price && item.special_price < item.price && (
                                                        <span className="ml-2 bg-green-100 text-green-700 text-[10px] px-1 rounded">
                                                            {Math.round(((item.price - item.special_price) / item.price) * 100)}% OFF
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Coupon */}
                <div className="border-t border-gray-200 p-3 bg-gray-50">
                    <button className="flex items-center justify-center w-full text-gray-700 py-2 hover:bg-gray-100 rounded text-sm">
                        <span className="mr-2">⭐</span>
                        <span>Have a special code?</span>
                    </button>
                </div>

                {/* Cart Summary */}
                {count > 0 && (
                    <div className="border-t border-gray-200 p-3 bg-gray-50">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Subtotal</span>
                            <span>৳{total.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Delivery</span>
                            <span>৳{total >= 400 ? 39 : 49}</span>
                        </div>
                        <div className="flex justify-between font-medium text-base pt-2 border-t border-gray-200 mt-2">
                            <span>Total</span>
                            <span>৳{(total + (total >= 400 ? 39 : 49)).toFixed(0)}</span>
                        </div>
                    </div>
                )}

                {/* Checkout Button */}
                {count > 0 && (
                    <div className="p-3 border-t border-gray-200">
                        <button
                            onClick={() => {
                                // Sync with server before redirecting to checkout
                                // syncCart().then(() => {
                                //   window.location.href = '/checkout';
                                // });
                                window.location.href = '/checkout';
                            }}
                            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded text-sm"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
