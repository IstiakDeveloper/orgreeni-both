import React, { useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { CheckCircle, Truck, Home, ShoppingBag, Phone } from 'lucide-react';
import ShopLayout from '@/layouts/ShopLayout';

interface OrderItem {
    id: number;
    product_id: number;
    quantity: number;
    price: number;
    subtotal: number;
    product: {
        name: string;
        unit: string;
    };
}

interface Order {
    id: number;
    order_number?: string;
    created_at: string;
    total_amount: number;
    delivery_charge: number;
    discount_amount: number;
    payment_method: string;
    payment_status: string;
    order_status: string;
    address: string;
    city: string;
    area: string;
    phone: string;
    notes?: string;
    orderItems: OrderItem[];
}

interface OrderConfirmationProps {
    order: Order;
    success?: string;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order, success }) => {
    const { clearCart } = useCart();

    // Clear cart when the order confirmation page is shown
    useEffect(() => {
        clearCart();
    }, []);

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Payment method display name
    const getPaymentMethodName = (method: string) => {
        const methods: { [key: string]: string } = {
            'cash_on_delivery': 'Cash on Delivery',
            'online_payment': 'Online Payment'
        };
        return methods[method] || method;
    };

    // Order status badge class
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <ShopLayout>
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                {success && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-700">
                        {success}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-green-600 p-6 text-white text-center">
                        <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
                        <p className="text-lg">Thank you for your purchase</p>
                        {order.order_number && (
                            <p className="mt-2 text-sm">Order #{order.order_number}</p>
                        )}
                    </div>

                    {/* Order Info */}
                    <div className="p-6">
                        <div className="mb-6 text-center">
                            <div className="text-gray-600 text-sm mb-1">Order Placed</div>
                            <div className="font-medium">{formatDate(order.created_at)}</div>
                            <div className="mt-2">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.order_status)}`}>
                                    {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <h2 className="font-bold text-xl mb-4">Order Details</h2>

                            <div className="space-y-4">
                                {/* Delivery Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-start">
                                        <Home className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-medium">Delivery Address</h3>
                                            <p className="text-gray-600 text-sm">{order.address}</p>
                                            <p className="text-gray-600 text-sm">{order.area}, {order.city}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-start">
                                        <Phone className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-medium">Contact Number</h3>
                                            <p className="text-gray-600 text-sm">{order.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-start">
                                        <Truck className="w-5 h-5 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-medium">Payment Method</h3>
                                            <p className="text-gray-600 text-sm">{getPaymentMethodName(order.payment_method)}</p>
                                            <p className="text-gray-600 text-sm">Payment Status: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="border-t border-gray-200 mt-6 pt-6">
                            <h2 className="font-bold text-xl mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                {order.orderItems?.map(item => (
                                    <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                                        <div className="flex items-center">
                                            <div className="ml-3">
                                                <h4 className="font-medium text-sm">{item.product.name}</h4>
                                                <p className="text-gray-500 text-xs">Quantity: {item.quantity} {item.product.unit}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">৳{item.subtotal.toFixed(0)}</p>
                                            <p className="text-gray-500 text-xs">৳{item.price.toFixed(0)} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Total */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between mb-2 text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>
                                        ৳{(
                                            (Number(order.total_amount) - Number(order.delivery_charge)) + Number(order.discount_amount)
                                        ).toFixed(0)}
                                    </span>

                                </div>
                                {order.discount_amount > 0 && (
                                    <div className="flex justify-between mb-2 text-sm">
                                        <span className="text-gray-600">Discount</span>
                                        <span className="text-green-600">-৳{order.discount_amount.toFixed(0)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between mb-2 text-sm">
                                    <span className="text-gray-600">Delivery</span>
                                    <span>৳{Number(order.delivery_charge ?? 0).toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between font-medium text-base pt-2 border-t border-gray-200 mt-2">
                                    <span>Total</span>
                                    <span>৳{Number(order.total_amount ?? 0).toFixed(0)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <a
                                href="/orders"
                                className="w-full sm:w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded text-center"
                            >
                                View All Orders
                            </a>
                            <a
                                href="/"
                                className="w-full sm:w-1/2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded text-center"
                            >
                                Continue Shopping
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
};

export default OrderConfirmation;
