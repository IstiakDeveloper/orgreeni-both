import React from 'react';
import { Link } from '@inertiajs/react';
import { ShoppingBag, ChevronRight, Calendar, AlertCircle, CheckCircle, Clock, Truck } from 'lucide-react';
import ShopLayout from '@/Layouts/ShopLayout';

interface Order {
  id: number;
  order_number: string;
  created_at: string;
  updated_at: string;
  total_amount: number;
  delivery_charge: number;
  discount_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
}

interface UserOrdersProps {
  orders: {
    data: Order[];
    links: any;
    meta: any;
  };
}

const UserOrders: React.FC<UserOrdersProps> = ({ orders }) => {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Order status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Truck className="w-3 h-3 mr-1" />
            Processing
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <ShopLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <ShoppingBag className="mr-2" size={24} />
          My Orders
        </h1>

        {orders.data.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag size={64} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-medium text-gray-700 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.data.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div className="mb-2 sm:mb-0">
                      <span className="text-sm text-gray-500">Order ID:</span>
                      <span className="ml-1 font-medium">{order.order_number}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="mb-2 sm:mb-0">
                      <div className="flex items-center">
                        {getStatusBadge(order.order_status)}
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        Payment: <span className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:items-end">
                      <div className="text-lg font-bold text-gray-900">৳{Number(order.total_amount).toFixed(0)}</div>
                      <div className="text-xs text-gray-500">
                        {order.discount_amount > 0 && <span>Discount: ৳{Number(order.discount_amount).toFixed(0)}</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="py-3 px-4 sm:px-6 bg-gray-50 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'Online Payment'}
                  </div>
                  <Link
                    href={`/user/orders/${order.id}`}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                  >
                    View Details
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {orders.meta && orders.meta.last_page > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow">
              {orders.links.map((link: any, i: number) => (
                <Link
                  key={i}
                  href={link.url || '#'}
                  className={`px-4 py-2 text-sm font-medium border ${
                    link.active
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  } ${!link.url && 'opacity-50 cursor-not-allowed'} ${
                    i === 0 ? 'rounded-l-md' : ''
                  } ${i === orders.links.length - 1 ? 'rounded-r-md' : ''}`}
                  preserveScroll
                >
                  {link.label.replace('&laquo;', '←').replace('&raquo;', '→')}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </ShopLayout>
  );
};

export default UserOrders;
