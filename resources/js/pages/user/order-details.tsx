import React from 'react';
import { Link } from '@inertiajs/react';
import { ShoppingBag, Home, Phone, Calendar, Truck, CreditCard, ArrowLeft, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import ShopLayout from '@/Layouts/ShopLayout';

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  product: {
    id: number;
    name: string;
    slug: string;
    unit: string;
    images: Array<{
      id: number;
      product_id: number;
      path: string;
      is_primary: boolean;
    }>;
  };
}

interface Order {
  id: number;
  order_number: string;
  user_id: number;
  created_at: string;
  updated_at: string;
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
  notes: string | null;
  items: OrderItem[];
}

interface UserOrderDetailsProps {
  order: Order;
}

const UserOrderDetails: React.FC<UserOrderDetailsProps> = ({ order }) => {
  // Format date
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

  // Get payment method display name
  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'cash_on_delivery':
        return 'Cash on Delivery';
      case 'online_payment':
        return 'Online Payment';
      default:
        return method;
    }
  };

  // Order status badge with appropriate colors and icons
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            Completed
          </div>
        );
      case 'processing':
        return (
          <div className="flex items-center text-blue-700 bg-blue-100 px-3 py-1 rounded-full text-sm">
            <Truck className="w-4 h-4 mr-1" />
            Processing
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full text-sm">
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex items-center text-red-700 bg-red-100 px-3 py-1 rounded-full text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            Cancelled
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-sm">
            {status}
          </div>
        );
    }
  };

  return (
    <ShopLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold flex items-center">
            <ShoppingBag className="mr-2" size={24} />
            Order #{order.order_number}
          </h1>
          <Link
            href="/orders"
            className="flex items-center text-sm text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Orders
          </Link>
        </div>

        {/* Order Status and Date */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              {getStatusBadge(order.order_status)}
              <div className="mt-2 text-sm text-gray-500">
                <Calendar className="inline-block w-4 h-4 mr-1 align-text-bottom" />
                {formatDate(order.created_at)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">৳{Number(order.total_amount).toFixed(0)}</div>
              <div className="text-sm text-gray-500">
                Payment Status: <span className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="bg-green-600 text-white px-4 py-3">
                <h2 className="font-medium">Order Items</h2>
              </div>
              <div className="p-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start py-4 border-b border-gray-100 last:border-0">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={item.product.images && item.product.images[0] ? `/storage/${item.product.images[0].path}` : '/assets/product-placeholder.png'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-medium text-gray-900 hover:text-green-600"
                      >
                        {item.product.name}
                      </Link>
                      <div className="flex justify-between mt-1">
                        <div className="text-sm text-gray-500">
                          {item.quantity} x ৳{Number(item.price).toFixed(0)}/{item.product.unit}
                        </div>
                        <div className="font-medium">৳{Number(item.subtotal).toFixed(0)}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Order Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Subtotal</span>
                    <span>৳{Number(order.total_amount - order.delivery_charge + order.discount_amount).toFixed(0)}</span>
                  </div>
                  {order.discount_amount > 0 && (
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-green-600">-৳{Number(order.discount_amount).toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span>৳{Number(order.delivery_charge).toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-base pt-2 border-t border-gray-200 mt-2">
                    <span>Total</span>
                    <span>৳{Number(order.total_amount).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="bg-green-600 text-white px-4 py-3">
                <h2 className="font-medium">Delivery Information</h2>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex items-start mb-2">
                    <Home className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Delivery Address</div>
                      <div className="text-gray-500 text-sm">{order.address}</div>
                      <div className="text-gray-500 text-sm">{order.area}, {order.city}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-start mb-2">
                    <Phone className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Contact Number</div>
                      <div className="text-gray-500 text-sm">{order.phone}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-start mb-2">
                    <CreditCard className="w-5 h-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Payment Method</div>
                      <div className="text-gray-500 text-sm">{getPaymentMethodName(order.payment_method)}</div>
                    </div>
                  </div>
                </div>

                {order.notes && (
                  <div className="mb-4">
                    <div className="font-medium text-sm mb-1">Order Notes</div>
                    <div className="text-gray-500 text-sm p-2 bg-gray-50 rounded">{order.notes}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Need Help Section */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-green-600 text-white px-4 py-3">
                <h2 className="font-medium">Need Help?</h2>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  If you have any questions or issues with your order, please contact our customer support.
                </p>
                <Link
                  href="/contact"
                  className="inline-block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-medium text-sm"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};

export default UserOrderDetails;
