import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { router } from '@inertiajs/react';
import { ShoppingBag, CreditCard } from 'lucide-react';
import ShopLayout from '@/Layouts/ShopLayout';
import { bangladeshDistricts, bangladeshThanas, getDeliveryCost } from '@/types/bangladeshLocations';

interface User {
    id: number;
    name: string;
    phone: string;
    address: string | null;
    city: string | null;
    area: string | null;
}

interface PaymentMethod {
    id: string;
    name: string;
}

const Checkout: React.FC<{
    cartFromServer?: {
        items: any;
        total: number;
        count: number;
    };
    paymentMethods: PaymentMethod[];
    user: User;
}> = ({
    cartFromServer,
    paymentMethods,
    user
}) => {
    // Get cart data from context
    const { items, count, total, syncCart } = useCart();

    // Form state with sensible defaults
    const [formData, setFormData] = useState({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        district: user.city || 'Dhaka',
        area: user.area || '',
        payment_method: 'cash_on_delivery',
        notes: ''
    });

    // For loading thanas based on selected district
    const [thanas, setThanas] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Update thanas when district changes
    useEffect(() => {
        if (bangladeshThanas[formData.district]) {
            setThanas(bangladeshThanas[formData.district]);
            // Clear selected area when district changes
            setFormData(prev => ({
                ...prev,
                area: ''
            }));
        } else {
            setThanas([]);
        }
    }, [formData.district]);

    // Force sync cart with backend when component mounts
    useEffect(() => {
        syncCart();

        // If no items in cart, redirect to home
        if (count === 0 && !Object.keys(items).length) {
            if (!cartFromServer || !Object.keys(cartFromServer.items).length) {
                const timer = setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, []);

    // Calculate delivery cost
    const deliveryCost = getDeliveryCost(formData.district, formData.area);
    const displayTotal = Object.keys(items).length > 0 ? total : (cartFromServer ? cartFromServer.total : 0);
    const orderTotal = displayTotal + deliveryCost;

    // Determine which cart data to use
    const displayItems = Object.keys(items).length > 0 ? items :
        (cartFromServer && Object.keys(cartFromServer.items).length > 0 ? cartFromServer.items : {});
    const displayCount = Object.keys(items).length > 0 ? count : (cartFromServer ? cartFromServer.count : 0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'নাম আবশ্যক';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'ফোন নম্বর আবশ্যক';
        } else if (!/^01[3-9]\d{8}$/.test(formData.phone.trim())) {
            newErrors.phone = 'সঠিক বাংলাদেশী ফোন নম্বর দিন';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'ঠিকানা আবশ্যক';
        }

        if (!formData.district) {
            newErrors.district = 'জেলা আবশ্যক';
        }

        if (!formData.area) {
            newErrors.area = 'এলাকা/থানা আবশ্যক';
        }

        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setIsSubmitting(true);

        // Create cart_items data to send to the server
        const cartItems = Object.values(Object.keys(items).length > 0 ? items :
            (cartFromServer && cartFromServer.items ? cartFromServer.items : {}))
            .map((item: any) => ({
                product_id: item.product_id || item.id,
                quantity: item.quantity,
                price: item.special_price || item.price
            }));

        // Make sure we actually have items
        if (cartItems.length === 0) {
            setErrors({ general: 'আপনার কার্টে কোনো পণ্য নেই। আগে পণ্য যোগ করুন।' });
            setIsSubmitting(false);
            return;
        }

        // Include cart items in the form data
        const formDataWithItems = {
            ...formData,
            cart_items: cartItems,
            delivery_charge: deliveryCost
        };

        // Submit the order using Inertia
        router.post('/place-order', formDataWithItems, {
            onSuccess: () => {
                // Will be redirected by the controller
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setErrors(errors as { [key: string]: string });
            },
        });
    };

    return (
        <ShopLayout>
            <div className="container mx-auto py-6 px-4">
                <h1 className="text-xl font-bold mb-4 flex items-center">
                    <ShoppingBag className="mr-2" size={20} />
                    অর্ডার করুন
                </h1>

                {displayCount === 0 ? (
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <p className="text-gray-500 mb-4">আপনার কার্টে কোনো পণ্য নেই</p>
                        <a href="/" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            শপিং করুন
                        </a>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-4">
                        {/* Order Summary - Small view */}
                        <div className="mb-6 bg-green-50 p-3 rounded">
                            <h2 className="font-medium mb-3 flex items-center text-green-700">
                                <ShoppingBag className="mr-2" size={18} />
                                আপনার অর্ডার ({displayCount}টি পণ্য)
                            </h2>

                            <div className="space-y-2">
                                {Object.values(displayItems).map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm border-b pb-2">
                                        <div className="flex items-center">
                                            <img
                                                src={item.image ? `/storage/${item.image}` : '/assets/product-placeholder.png'}
                                                alt={item.name}
                                                className="w-8 h-8 object-cover rounded mr-2"
                                            />
                                            <span>{item.name} ({item.quantity}x)</span>
                                        </div>
                                        <span className="font-medium">৳{((item.special_price || item.price) * item.quantity).toFixed(0)}</span>
                                    </div>
                                ))}

                                <div className="flex justify-between text-sm pt-1">
                                    <span>মোট পণ্যের দাম:</span>
                                    <span>৳{displayTotal.toFixed(0)}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span>ডেলিভারি চার্জ:</span>
                                    <span>৳{deliveryCost}</span>
                                </div>

                                <div className="flex justify-between font-bold text-green-700 pt-1 border-t">
                                    <span>সর্বমোট:</span>
                                    <span>৳{orderTotal.toFixed(0)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Combined Form */}
                        <form onSubmit={handleSubmit}>
                            <h3 className="font-medium mb-3">ডেলিভারি তথ্য</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm mb-1">
                                        পুরো নাম *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                        placeholder="আপনার নাম"
                                    />
                                    {errors.name && <p className="mt-1 text-red-500 text-xs">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-sm mb-1">
                                        ফোন নম্বর *
                                    </label>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                        placeholder="০১৭১২৩৪৫৬৭৮"
                                    />
                                    {errors.phone && <p className="mt-1 text-red-500 text-xs">{errors.phone}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="district" className="block text-sm mb-1">
                                        জেলা *
                                    </label>
                                    <select
                                        id="district"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                    >
                                        <option value="">জেলা নির্বাচন করুন</option>
                                        {bangladeshDistricts.map(district => (
                                            <option key={district} value={district}>{district}</option>
                                        ))}
                                    </select>
                                    {errors.district && <p className="mt-1 text-red-500 text-xs">{errors.district}</p>}
                                </div>

                                <div>
                                    <label htmlFor="area" className="block text-sm mb-1">
                                        এলাকা/থানা *
                                    </label>
                                    {thanas.length > 0 ? (
                                        <select
                                            id="area"
                                            name="area"
                                            value={formData.area}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                        >
                                            <option value="">এলাকা/থানা নির্বাচন করুন</option>
                                            {thanas.map(thana => (
                                                <option key={thana} value={thana}>{thana}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            id="area"
                                            name="area"
                                            value={formData.area}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                            placeholder="আপনার এলাকা/থানা"
                                        />
                                    )}
                                    {errors.area && <p className="mt-1 text-red-500 text-xs">{errors.area}</p>}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="address" className="block text-sm mb-1">
                                    বিস্তারিত ঠিকানা *
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                    placeholder="বাসা/ফ্লাট নং, রোড, লান্ডমার্ক"
                                    rows={2}
                                />
                                {errors.address && <p className="mt-1 text-red-500 text-xs">{errors.address}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 flex items-center">
                                    <CreditCard className="mr-1" size={16} />
                                    পেমেন্ট পদ্ধতি
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {paymentMethods.map((method) => (
                                        <div key={method.id} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="payment_method"
                                                id={`payment-${method.id}`}
                                                value={method.id}
                                                className="mr-1"
                                                checked={formData.payment_method === method.id}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor={`payment-${method.id}`} className="text-sm">
                                                {method.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="notes" className="block text-sm mb-1">
                                    বিশেষ নির্দেশনা (ঐচ্ছিক)
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows={2}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                    placeholder="ডেলিভারির জন্য বিশেষ নির্দেশনা (যদি থাকে)"
                                    value={formData.notes}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            {errors.general && (
                                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
                                    {errors.general}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 rounded font-medium text-white ${
                                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {isSubmitting ? 'প্রক্রিয়া চলছে...' : `৳${orderTotal.toFixed(0)} - অর্ডার করুন`}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </ShopLayout>
    );
};

export default Checkout;
