import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, Search, Heart, Tag, Menu, X } from 'lucide-react';

interface ShopLayoutProps {
  children: React.ReactNode;
}

const ShopLayout: React.FC<ShopLayoutProps> = ({ children }) => {
  const { auth, appSettings, cartItemsCount, categories } = usePage().props as any;
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(cartItemsCount || 0);
  const [cartTotal, setCartTotal] = useState(0);

  // Update cart count whenever cartItemsCount prop changes
  useEffect(() => {
    setCartCount(cartItemsCount || 0);
    // In a real app, you would fetch the cart total from the server
    setCartTotal(810); // Example hardcoded value
  }, [cartItemsCount]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header with logo, search, and login */}
      <header className="bg-green-500 py-3 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-white mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src={appSettings?.logo ? `/storage/${appSettings.logo}` : '/assets/logo.png'}
              alt={appSettings?.store_name}
              className="h-10 mr-2"
            />
            <span className="text-xl font-bold text-white hidden md:inline">{appSettings?.store_name}</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-3xl mx-3 md:mx-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for products (e.g. eggs, milk, potato)"
                className="w-full py-2 px-4 pr-10 rounded border-none focus:outline-none focus:ring-0 text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* Location & Language - Simplified */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-white">
              <span className="bg-white text-green-500 px-2 py-1 rounded text-sm font-medium">EN</span>
              <span className="ml-1 bg-white text-green-500 px-2 py-1 rounded text-sm font-medium">বাং</span>
            </div>

            {/* Login button or user dropdown */}
            <Link
              href={auth?.user ? "/dashboard" : "/login"}
              className="bg-white text-green-500 px-4 py-2 rounded hover:bg-gray-100 font-medium"
            >
              {auth?.user ? auth.user.name.split(' ')[0] : 'Login'}
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Categories */}
        <aside className={`bg-white w-64 shadow-md flex-shrink-0 overflow-y-auto ${isMobileMenuOpen ? 'fixed inset-0 z-40 md:relative' : 'hidden md:block'}`}>
          {/* Grocery tab on top */}
          <div className="bg-green-500 text-white text-center py-3 font-medium">
            <div className="flex flex-col items-center">
              <img src="/assets/grocery-icon.png" alt="Grocery" className="h-6 w-6 mb-1" />
              <span>Grocery</span>
            </div>
          </div>

          {/* Special categories */}
          <div className="px-2 py-3">
            <Link href="/offers" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
              <Tag className="h-5 w-5 mr-3 text-red-500" />
              <span>Offers</span>
              <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">45</span>
            </Link>

            <Link href="/favorites" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
              <Heart className="h-5 w-5 mr-3 text-red-500" />
              <span>Favorites</span>
            </Link>
          </div>

          {/* Main Categories */}
          <div className="border-t border-gray-200 pt-2">
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="flex items-center p-2 text-gray-700 hover:bg-gray-100"
              >
                {category.image ? (
                  <img
                    src={`/storage/${category.image}`}
                    alt={category.name}
                    className="h-6 w-6 mr-3 object-contain"
                  />
                ) : (
                  <div className="h-6 w-6 mr-3 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs">🛒</span>
                  </div>
                )}
                <span>{category.name}</span>
              </Link>
            ))}
          </div>

          {/* Help section */}
          <div className="mt-auto border-t border-gray-200 py-2 sticky bottom-0 bg-white">
            <Link href="/help" className="flex items-center p-2 text-gray-700 hover:bg-gray-100">
              <span className="mr-2">❓</span>
              <span>Help</span>
            </Link>
            <Link href="/file-complaint" className="flex items-center p-2 text-gray-700 hover:bg-gray-100">
              <span className="mr-2">💬</span>
              <span>File a complaint</span>
            </Link>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          {children}
        </main>
      </div>

      {/* Cart floating button */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40">
        <Link
          href="/cart"
          className="bg-green-600 text-white py-3 px-4 rounded-lg shadow-lg flex flex-col items-center hover:bg-green-700 transition-colors"
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          {cartCount > 0 && (
            <>
              <div className="text-sm mt-1">{cartCount} ITEM</div>
              <div className="font-bold">{appSettings?.currency_symbol || '৳'}{cartTotal}</div>
            </>
          )}
        </Link>
      </div>

      {/* Live chat button - Fixed at bottom right */}
      <div className="fixed bottom-4 right-4 z-40">
        <button className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ShopLayout;
