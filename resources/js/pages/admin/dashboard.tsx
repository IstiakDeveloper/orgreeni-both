import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import {
  ShoppingBag,
  Users,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Clock,
  Package,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface DashboardProps {
  stats: {
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
    todaySales: number;
    monthSales: number;
    yearSales: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
  };
  recentOrders: Array<{
    id: number;
    order_number: string;
    total_amount: number;
    created_at: string;
    order_status: string;
    payment_status: string;
    user: {
      name: string;
      phone: string;
    };
  }>;
}

interface PageProps {
  storeSettings: {
    currency_symbol: string;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ stats, recentOrders }) => {
  const { storeSettings } = usePage<PageProps>().props;

  const formatCurrency = (amount: number) => {
    return `${storeSettings.currency_symbol}${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout title="Dashboard">
      <Head title="Dashboard" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Sales Stats */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-emerald-100 rounded-md p-3">
              <CreditCard className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Today's Sales</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{formatCurrency(stats.todaySales)}</div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-emerald-700">Monthly: </span>
              <span className="font-medium text-gray-900">{formatCurrency(stats.monthSales)}</span>
            </div>
          </div>
        </div>

        {/* Product Stats */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{stats.totalProducts}</div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-blue-700">Active: </span>
              <span className="font-medium text-gray-900">{stats.activeProducts}</span>
              <span className="ml-2 font-medium text-red-700">Low Stock: </span>
              <span className="font-medium text-gray-900">{stats.lowStockProducts}</span>
            </div>
          </div>
        </div>

        {/* Order Stats */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{stats.pendingOrders}</div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-purple-700">Processing: </span>
              <span className="font-medium text-gray-900">{stats.processingOrders}</span>
              <span className="ml-2 font-medium text-green-700">Shipped: </span>
              <span className="font-medium text-gray-900">{stats.shippedOrders}</span>
            </div>
          </div>
        </div>

        {/* Growth Stats */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Out of Stock</dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">{stats.outOfStockProducts}</div>
                </dd>
              </dl>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-red-700">Low Stock: </span>
              <span className="font-medium text-gray-900">{stats.lowStockProducts}</span>
              <span className="ml-2 font-medium text-gray-700">Items</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
          <a
            href={route('admin.orders.index')}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
          >
            View all
          </a>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <li key={order.id}>
                  <a
                    href={route('admin.orders.show', order.id)}
                    className="block hover:bg-gray-50"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-emerald-600 truncate">
                            {order.order_number}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.order_status)}`}>
                              {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                            </p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.payment_status)}`}>
                            {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <Users className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                            {order.user.name} ({order.user.phone})
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          <p>
                            <time dateTime={order.created_at}>
                              {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
                            </time>
                          </p>
                          <p className="ml-4 font-medium text-gray-900">
                            {formatCurrency(order.total_amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              ))
            ) : (
              <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                No recent orders
              </li>
            )}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
