import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Search, Heart, Tag, Menu, X, MapPin, ShoppingBag } from 'lucide-react';
import CartSidebar from '@/components/CartSidebar';
import SearchBar from '@/components/SearchBar';

interface ShopLayoutProps {
    children: React.ReactNode;
}

const ShopLayout: React.FC<ShopLayoutProps> = ({ children }) => {
    const { auth, appSettings, categories, flash } = usePage().props as any;
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    // Close mobile menu when resizing to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileMenuOpen]);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header with logo, search, and login - Responsive for mobile */}
            <header className="bg-green-500 py-2 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-2 md:px-4">
                    {/* Desktop header */}
                    <div className="hidden md:flex items-center justify-between">
                        {/* Mobile menu toggle */}
                        <button
                            className="text-white p-2 rounded-md hover:bg-green-600"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center mr-4">
                            <img
                                src={appSettings?.logo ? `/storage/${appSettings.logo}` : '/assets/logo.png'}
                                alt={appSettings?.store_name}
                                className="h-10 mr-2"
                            />
                            <span className="text-xl font-bold text-white">{appSettings?.store_name}</span>
                        </Link>

                        <SearchBar />

                        {/* Location dropdown - Chaldal style */}
                        <div className="flex items-center mx-4 text-white">
                            <MapPin size={20} className="mr-1" />
                            <span className="font-medium mr-1">Bangladesh</span>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {/* Language switcher - Chaldal style */}
                        <div className="flex items-center mr-4">
                            <div className="bg-white rounded-full text-sm font-medium overflow-hidden border border-gray-200">
                                <span className="px-3 py-1 inline-block text-gray-700">EN</span>
                                <span className="px-3 py-1 inline-block bg-green-500 text-white">বাং</span>
                            </div>
                        </div>

                        {/* Login button - Chaldal style */}
                        <Link
                            href={auth?.user ? "/dashboard" : "/login"}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                        >
                            {auth?.user ? auth.user.name.split(' ')[0] : 'Login'}
                        </Link>
                    </div>

                    {/* Mobile header */}
                    <div className="flex md:hidden items-center justify-between">
                        <div className="flex items-center">
                            {/* Mobile menu toggle */}
                            <button
                                className="text-white p-1.5 rounded-md hover:bg-green-600 mr-2"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                            >
                                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>

                            {/* Logo - smaller on mobile */}
                            <Link href="/" className="flex items-center">
                                <img
                                    src={appSettings?.logo ? `/storage/${appSettings.logo}` : '/assets/logo.png'}
                                    alt={appSettings?.store_name}
                                    className="h-8 mr-1"
                                />
                                <span className="text-base font-bold text-white">{appSettings?.store_name}</span>
                            </Link>
                        </div>

                        {/* Mobile action buttons */}
                        <div className="flex items-center">
                            {/* Search toggle */}
                            <button
                                className="text-white p-1.5 rounded-md hover:bg-green-600 mr-2"
                                onClick={() => setIsSearchVisible(!isSearchVisible)}
                                aria-label="Toggle search"
                            >
                                {isSearchVisible ? <X size={20} /> : <Search size={20} />}
                            </button>

                            {/* Login/Account */}
                            <Link
                                href={auth?.user ? "/dashboard" : "/login"}
                                className="text-white p-1.5 rounded-md hover:bg-green-600"
                                aria-label={auth?.user ? "Account" : "Login"}
                            >
                                <ShoppingBag size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Mobile search bar - conditionally visible */}
                    {isSearchVisible && (
                        <div className="mt-2 md:hidden">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for products..."
                                    className="w-full p-2 rounded-md text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                                    aria-label="Search"
                                >
                                    <Search size={18} />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </header>

            {/* Flash Messages - Improved styling */}
            {flash?.success && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-r mx-4 my-2">
                    <span className="block sm:inline">{flash.success}</span>
                </div>
            )}

            {flash?.error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r mx-4 my-2">
                    <span className="block sm:inline">{flash.error}</span>
                </div>
            )}

            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile menu overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-hidden="true"
                    ></div>
                )}

                {/* Left Sidebar - Categories - Responsive */}
                <aside
                    className={`
                    bg-white
                    md:w-64
                    w-3/4
                    max-w-xs
                    shadow-md
                    flex-shrink-0
                    fixed
                    top-14
                    md:top-16
                    bottom-0
                    left-0
                    z-40
                    overflow-y-auto
                    transform
                    transition-transform
                    duration-300
                    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    `}
                >
                    {/* Grocery Header - Sticky Top */}
                    <div className="sticky top-0 z-10 bg-green-500 text-white text-center py-3 font-medium">
                        <div className="flex flex-col items-center">
                            <img src="/assets/grocery-icon.png" alt="Grocery" className="h-6 w-6 mb-1" />
                            <span>Grocery</span>
                        </div>
                    </div>

                    {/* Mobile account section */}
                    <div className="md:hidden border-b border-gray-200 p-3">
                        {auth?.user ? (
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold mr-3">
                                    {auth.user.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-medium">{auth.user.name}</div>
                                    <div className="text-xs text-gray-500">{auth.user.email}</div>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="block w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-medium transition-colors text-center"
                            >
                                Login / Register
                            </Link>
                        )}
                    </div>

                    {/* Special Categories - Sticky Below Header */}
                    <div className="sticky top-[72px] bg-white z-[5] border-b px-2 py-3">
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

                    {/* Main Categories - Scrollable */}
                    <div className="pb-20">
                        <div className="border-t border-gray-200 pt-2">
                            {categories && categories.map((category: any) => (
                                <Link
                                    key={category.id}
                                    href={`/category/${category.slug}`}
                                    className="flex items-center p-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {category.image ? (
                                        <img
                                            src={`/storage/${category.image}`}
                                            alt={category.name}
                                            className="h-6 w-6 mr-3 object-contain"
                                            loading="lazy"
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
                    </div>

                    {/* Help Section - Sticky Bottom */}
                    <div className="fixed bottom-0 left-0 md:w-64 w-3/4 max-w-xs bg-white border-t border-gray-200 py-2 z-10">
                        <Link href="/help" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                            <span className="mr-2">❓</span>
                            <span>Help</span>
                        </Link>
                        <Link href="/file-complaint" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                            <span className="mr-2">💬</span>
                            <span>File a complaint</span>
                        </Link>
                    </div>
                </aside>

                {/* Main content area - Responsive padding */}
                <main
                    id="main-content"
                    className="flex-1 overflow-y-auto bg-gray-100 transition-all duration-300 w-full pt-2 pb-16 md:pt-4 md:pb-8 px-2 md:px-4 md:ml-64">
                    {children}
                </main>
            </div>

            {/* Cart Sidebar Component */}
            <CartSidebar />

            {/* Live chat button - Fixed at bottom right, adjust position for mobile */}
            <div className="fixed bottom-4 right-4 z-30 md:z-40 md:bottom-20 md:right-6">
                <button
                    className="bg-red-500 text-white p-2 md:p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    aria-label="Live chat"
                >
                    <svg className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            </div>

            {/* Mobile bottom navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
                <div className="flex justify-around px-2 py-2">
                    <Link href="/" className="flex flex-col items-center p-1 w-1/4">
                        <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path d="M9 22V12h6v10" />
                        </svg>
                        <span className="text-xs mt-1 text-gray-700">Home</span>
                    </Link>
                    <Link href="/categories" className="flex flex-col items-center p-1 w-1/4">
                        <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" />
                            <rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" />
                            <rect x="3" y="14" width="7" height="7" />
                        </svg>
                        <span className="text-xs mt-1 text-gray-700">Categories</span>
                    </Link>
                    <Link href="/offers" className="flex flex-col items-center p-1 w-1/4">
                        <Tag className="h-5 w-5 text-red-500" />
                        <span className="text-xs mt-1 text-gray-700">Offers</span>
                    </Link>
                    <Link href="/favorites" className="flex flex-col items-center p-1 w-1/4">
                        <Heart className="h-5 w-5 text-red-500" />
                        <span className="text-xs mt-1 text-gray-700">Favorites</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ShopLayout;
