import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import ShopLayout from '@/layouts/ShopLayout';
import {
    MapPin,
    CreditCard,
    Truck,
    Info,
    ShoppingCart,
    Plus
} from 'lucide-react';

interface CartItem {
    id: number;
    product_id: number;
    quantity: number;
    product: {
        id: number;
        name: string;
        price: number;
        special_price?: number;
        images: { image: string }[];
    };
}

interface Address {
    id: number;
    street: string;
    city: string;
    phone: string;
}

const CheckoutPage: React.FC = () => {
    const {
        cart,
        defaultAddress,
        paymentMethods,
        deliveryOptions,
        user,
        errors
    } = usePage().props;

    const { data, setData, post, processing } = useForm({
        address_id: defaultAddress?.id || null,
        payment_method: '',
        delivery_option: 'standard',
        notes: ''
    });

    // Address selection modal state
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    // Calculate totals
    const subtotal = cart.cart_items.reduce((sum, item) =>
        sum + ((item.product.special_price || item.product.price) * item.quantity), 0
    );
    const deliveryCost = data.delivery_option === 'express' ? 99 : 49;
    const total = subtotal + deliveryCost;

    // Submit order
    const submitOrder = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout', {
            preserveScroll: true,
            onSuccess: () => {
                // Order placed successfully
            }
        });
    };

    return (
        <ShopLayout>
            <Head title="Checkout - Complete Your Order" />

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Order Details Column */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold flex items-center">
                                    <MapPin className="mr-2 text-green-600" />
                                    Shipping Address
                                </h2>
                                <button
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="text-green-600 hover:bg-green-50 px-2 py-1 rounded"
                                >
                                    Change Address
                                </button>
                            </div>

                            {defaultAddress ? (
                                <div>
                                    <p>{user.name}</p>
                                    <p>{defaultAddress.street}</p>
                                    <p>{defaultAddress.city}</p>
                                    <p>{defaultAddress.phone}</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-gray-500 mb-4">No default address selected</p>
                                    <button
                                        onClick={() => setIsAddressModalOpen(true)}
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    >
                                        Add Address
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold flex items-center mb-4">
                                <CreditCard className="mr-2 text-green-600" />
                                Payment Method
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {paymentMethods.map((method) => (
                                    <label
                                        key={method.id}
                                        className={`
                                            border rounded-lg p-4 cursor-pointer flex items-center
                                            ${data.payment_method === method.id
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:bg-gray-50'}
                                        `}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value={method.id}
                                            checked={data.payment_method === method.id}
                                            onChange={() => setData('payment_method', method.id)}
                                            className="mr-3"
                                        />
                                        {method.name}
                                    </label>
                                ))}
                            </div>
                            {errors.payment_method && (
                                <p className="text-red-500 text-sm mt-2">{errors.payment_method}</p>
                            )}
                        </div>

                        {/* Delivery Options */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold flex items-center mb-4">
                                <Truck className="mr-2 text-green-600" />
                                Delivery Options
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {deliveryOptions.map((option) => (
                                    <label
                                        key={option.id}
                                        className={`
                                            border rounded-lg p-4 cursor-pointer flex flex-col
                                            ${data.delivery_option === option.id
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:bg-gray-50'}
                                        `}
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="delivery_option"
                                                value={option.id}
                                                checked={data.delivery_option === option.id}
                                                onChange={() => setData('delivery_option', option.id)}
                                                className="mr-3"
                                            />
                                            {option.name}
                                        </div>
                                        <span className="text-sm text-gray-500 mt-1">
                                            ৳{option.cost} Delivery Fee
                                        </span>
                                    </label>
                                ))}
                            </div>
                            {errors.delivery_option && (
                                <p className="text-red-500 text-sm mt-2">{errors.delivery_option}</p>
                            )}
                        </div>

                        {/* Order Notes */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold flex items-center mb-4">
                                <Info className="mr-2 text-green-600" />
                                Additional Notes
                            </h2>
                            <textarea
                                placeholder="Add any special instructions for your order (optional)"
                                className="w-full border rounded p-3"
                                rows={4}
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Order Summary Column */}
                    <div>
                        <div className="bg-white rounded-lg shadow p-6 sticky top-20">
                            <h2 className="text-xl font-bold flex items-center mb-4">
                                <ShoppingCart className="mr-2 text-green-600" />
                                Order Summary
                            </h2>

                            {/* Cart Items */}
                            <div className="space-y-4 mb-6">
                                {cart.cart_items.map((item: CartItem) => (
                                    <div key={item.id} className="flex items-center">
                                        <img
                                            src={`/storage/${item.product.images[0]?.image}`}
                                            alt={item.product.name}
                                            className="w-16 h-16 object-cover rounded mr-4"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{item.product.name}</p>
                                            <p className="text-gray-500">
                                                ৳{item.product.special_price || item.product.price} x {item.quantity}
                                            </p>
                                        </div>
                                        <span className="font-medium">
                                            ৳{((item.product.special_price || item.product.price) * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Price Breakdown */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between mb-2">
                                    <span>Subtotal</span>
                                    <span>৳{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Delivery</span>
                                    <span>৳{deliveryCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2">
                                    <span>Total</span>
                                    <span>৳{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={submitOrder}
                                disabled={processing}
                                className={`
                                    w-full py-3 mt-6 rounded text-white font-medium
                                    ${processing
                                        ? 'bg-green-300 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700'}
                                `}
                            >
                                {processing ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
};

export default CheckoutPage;
