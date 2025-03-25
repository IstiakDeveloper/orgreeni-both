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
            {/* Cart Toggle Button - Responsive positioning */}
            {!isCartOpen && (
                <div className="fixed z-40 md:right-6 md:top-1/2 md:transform md:-translate-y-1/2
                                bottom-4 right-4 sm:bottom-6 sm:right-6">
                    <button
                        onClick={toggleCart}
                        className="bg-green-600 text-white py-2 px-3 md:py-3 md:px-4 rounded-lg shadow-lg flex flex-col items-center hover:bg-green-700 transition-colors"
                        aria-label="Open shopping cart"
                    >
                        <div className="relative">
                            <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
                            {count > 0 && (
                                <span
                                    ref={countRef}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300"
                                    aria-label={`${count} items in cart`}
                                >
                                    {count}
                                </span>
                            )}
                        </div>
                        {count > 0 && (
                            <div className="hidden md:block">
                                <div className="text-sm mt-1">{count} ITEM{count !== 1 ? 'S' : ''}</div>
                                <div className="font-bold">৳{total.toFixed(0)}</div>
                            </div>
                        )}
                    </button>
                </div>
            )}

            {/* Overlay when cart is open on mobile */}
            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={toggleCart}
                    aria-hidden="true"
                ></div>
            )}

            {/* Responsive Cart Sidebar */}
            <div
                className={`fixed z-50 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col
                           md:bottom-0 md:right-0 md:h-[90vh] md:w-80
                           bottom-0 right-0 left-0 sm:left-auto sm:w-full sm:max-w-md h-[85vh] rounded-t-xl md:rounded-none
                           ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
                aria-hidden={!isCartOpen}
            >
                {/* Cart Header with drag handle for mobile */}
                <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-200 bg-green-600 text-white md:rounded-none rounded-t-xl">
                    {/* Mobile drag handle */}
                    <div className="w-12 h-1 bg-white/30 rounded absolute left-1/2 -translate-x-1/2 -top-3 md:hidden"></div>

                    <div className="flex items-center">
                        <ShoppingBag className="h-5 w-5 mr-2" />
                        <span className="font-medium text-sm md:text-base">
                            {Object.keys(items).length > 0
                                ? `${Object.keys(items).length} PRODUCT${Object.keys(items).length !== 1 ? 'S' : ''} IN CART`
                                : 'YOUR CART'}
                        </span>
                    </div>
                    <button
                        onClick={toggleCart}
                        className="p-2 hover:bg-green-700 rounded-full"
                        aria-label="Close cart"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Cart Items - Scrollable area */}
                <div className="overflow-y-auto flex-grow bg-white">
                    {count === 0 ? (
                        <div className="flex flex-col items-center justify-center p-6 text-center h-full">
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
                                        <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 relative">
                                            <img
                                                src={item.image ? `/storage/${item.image}` : '/assets/product-placeholder.png'}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded"
                                                loading="lazy"
                                            />
                                            {item.stock <= 5 && (
                                                <div className="absolute top-0 right-0 bg-orange-500 text-white text-[9px] md:text-[10px] px-1 rounded">
                                                    Low Stock
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="ml-2 md:ml-3 flex-1">
                                            <div className="flex justify-between">
                                                <h3 className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2">
                                                    {item.name}
                                                    {item.stock <= 5 && (
                                                        <span className="ml-1 text-orange-500 text-[10px] md:text-xs">
                                                            (Only {item.stock} left!)
                                                        </span>
                                                    )}
                                                </h3>
                                                <button
                                                    onClick={() => removeFromCart(item.product_id)}
                                                    className="text-gray-400 hover:text-red-500 ml-1 flex-shrink-0"
                                                    aria-label={`Remove ${item.name} from cart`}
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>

                                            <div className="mt-1">
                                                <p className="text-[10px] md:text-xs text-gray-500">
                                                    ৳{item.special_price || item.price}/{item.unit}
                                                    {item.special_price && (
                                                        <span className="ml-1 bg-green-100 text-green-700 text-[9px] md:text-[10px] px-1 rounded">
                                                            SPECIAL PRICE
                                                        </span>
                                                    )}
                                                </p>
                                            </div>

                                            <div className="mt-1 flex justify-between items-end">
                                                {/* Quantity Controls - Slightly larger touch targets for mobile */}
                                                <div className="flex items-center border border-gray-200 rounded-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                                                        className="px-2 py-1 md:py-0.5 text-xs text-gray-600 hover:bg-gray-100"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="px-2 py-1 md:py-0.5 text-xs border-x border-gray-200 min-w-[20px] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                        className={`px-2 py-1 md:py-0.5 text-xs text-gray-600 hover:bg-gray-100
                                                            ${item.quantity >= item.stock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        disabled={item.quantity >= item.stock}
                                                        aria-label="Increase quantity"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="font-medium text-xs md:text-sm flex items-center">
                                                    <span>
                                                        ৳{((item.special_price || item.price) * item.quantity).toFixed(0)}
                                                    </span>
                                                    {item.special_price && item.special_price < item.price && (
                                                        <span className="ml-1 bg-green-100 text-green-700 text-[9px] md:text-[10px] px-1 rounded">
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
                    <button
                        className="flex items-center justify-center w-full text-gray-700 py-2 hover:bg-gray-100 rounded text-xs md:text-sm"
                        aria-label="Enter coupon code"
                    >
                        <span className="mr-2">⭐</span>
                        <span>Have a special code?</span>
                    </button>
                </div>

                {/* Cart Summary */}
                {count > 0 && (
                    <div className="border-t border-gray-200 p-3 bg-gray-50">
                        <div className="flex justify-between text-xs md:text-sm mb-1">
                            <span className="text-gray-600">Subtotal</span>
                            <span>৳{total.toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-xs md:text-sm mb-1">
                            <span className="text-gray-600">Delivery</span>
                            <span>৳{total >= 400 ? 39 : 49}</span>
                        </div>
                        <div className="flex justify-between font-medium text-sm md:text-base pt-2 border-t border-gray-200 mt-2">
                            <span>Total</span>
                            <span>৳{(total + (total >= 400 ? 39 : 49)).toFixed(0)}</span>
                        </div>
                    </div>
                )}

                {/* Checkout Button - Larger for mobile */}
                {count > 0 && (
                    <div className="p-3 border-t border-gray-200 bg-white">
                        <button
                            onClick={() => {
                                // Sync with server before redirecting to checkout
                                // syncCart().then(() => {
                                //   window.location.href = '/checkout';
                                // });
                                window.location.href = '/checkout';
                            }}
                            className="w-full py-3 md:py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded text-sm"
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
