import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Users,
  FileText,
  Gift,
  MapPin,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Menu as MenuIcon,
  X
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

interface PageProps {
  auth: {
    admin: {
      name: string;
      role: string;
      email: string;
    } | null;
  };
  flash: {
    success: string | null;
    error: string | null;
  };
  storeSettings: {
    name: string;
    logo: string | null;
  };
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { auth, flash, storeSettings } = usePage<PageProps>().props;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: route('admin.dashboard'), icon: <LayoutDashboard size={20} /> },
    { name: 'Products', href: route('admin.products.index'), icon: <ShoppingBag size={20} /> },
    { name: 'Categories', href: route('admin.categories.index'), icon: <Tag size={20} /> },
    { name: 'Orders', href: route('admin.orders.index'), icon: <FileText size={20} /> },
    { name: 'Users', href: route('admin.users.index'), icon: <Users size={20} /> },
    { name: 'Banners', href: route('admin.banners.index'), icon: <Gift size={20} /> },
    { name: 'Areas', href: route('admin.areas.index'), icon: <MapPin size={20} /> },
    { name: 'Coupons', href: route('admin.coupons.index'), icon: <Gift size={20} /> },
    { name: 'Settings', href: route('admin.settings'), icon: <Settings size={20} /> },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-emerald-700">
          <div className="flex flex-col flex-grow">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-emerald-800">
              <Link href={route('admin.dashboard')} className="flex items-center">
                {storeSettings.logo ? (
                  <img className="h-8 w-auto" src={`/storage/${storeSettings.logo}`} alt="Logo" />
                ) : (
                  <h1 className="text-white font-bold text-xl">{storeSettings.name || 'Admin Panel'}</h1>
                )}
              </Link>
            </div>
            <div className="flex-grow flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="flex-1 px-2 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md
                      ${route().current(item.href)
                        ? 'bg-emerald-800 text-white'
                        : 'text-white hover:bg-emerald-600'}
                    `}
                  >
                    <div className="mr-3 text-white">{item.icon}</div>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-emerald-800 p-4">
              <Link
                href={route('admin.logout')}
                method="post"
                as="button"
                className="flex-shrink-0 w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-emerald-600"
              >
                <LogOut className="mr-3 h-5 w-5 text-white" />
                Log out
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleMobileMenu}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-emerald-700 z-50">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={toggleMobileMenu}
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  {storeSettings.logo ? (
                    <img className="h-8 w-auto" src={`/storage/${storeSettings.logo}`} alt="Logo" />
                  ) : (
                    <h1 className="text-white font-bold text-xl">{storeSettings.name || 'Admin Panel'}</h1>
                  )}
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                        group flex items-center px-2 py-2 text-base font-medium rounded-md
                        ${route().current(item.href)
                          ? 'bg-emerald-800 text-white'
                          : 'text-white hover:bg-emerald-600'}
                      `}
                      onClick={toggleMobileMenu}
                    >
                      <div className="mr-3 text-white">{item.icon}</div>
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-emerald-800 p-4">
                <Link
                  href={route('admin.logout')}
                  method="post"
                  as="button"
                  className="flex-shrink-0 w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-emerald-600"
                  onClick={toggleMobileMenu}
                >
                  <LogOut className="mr-3 h-5 w-5 text-white" />
                  Log out
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 md:hidden"
            onClick={toggleMobileMenu}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notification dropdown */}
              <div className="relative ml-3">
                <button
                  type="button"
                  className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" />
                </button>
                {notificationsOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    onBlur={() => setNotificationsOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-700">Notifications</p>
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-700">
                      <p>No new notifications</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      {auth.admin ? auth.admin.name.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <span className="ml-2 text-gray-700">{auth.admin ? auth.admin.name : 'Admin'}</span>
                    <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                  </button>
                </div>
                {profileDropdownOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    onBlur={() => setProfileDropdownOpen(false)}
                  >
                    <Link
                      href={route('admin.profile')}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href={route('admin.settings')}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <Link
                      href={route('admin.logout')}
                      method="post"
                      as="button"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Sign out
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {/* Flash Messages */}
          {(flash.success || flash.error) && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
              {flash.success && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{flash.success}</p>
                    </div>
                  </div>
                </div>
              )}

              {flash.error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{flash.error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
