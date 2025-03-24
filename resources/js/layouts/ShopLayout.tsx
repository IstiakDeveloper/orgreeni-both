import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Search, Heart, Tag, Menu, X, MapPin } from 'lucide-react';
import CartSidebar from '@/components/CartSidebar';
import SearchBar from '@/components/SearchBar';


interface ShopLayoutProps {
    children: React.ReactNode;
}

const ShopLayout: React.FC<ShopLayoutProps> = ({ children }) => {
    const { auth, appSettings, categories, flash } = usePage().props as any;
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header with logo, search, and login - Chaldal style with green scheme */}
            <header className="bg-green-500 py-2 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* Mobile menu toggle */}
                    <button
                        className="text-white p-2 rounded-md hover:bg-green-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
                    <div className="hidden md:flex items-center mx-4 text-white">
                        <MapPin size={20} className="mr-1" />
                        <span className="font-medium mr-1">Bangladesh</span>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                    {/* Language switcher - Chaldal style */}
                    <div className="hidden md:flex items-center mr-4">
                        <div className="bg-white rounded-full text-sm font-medium overflow-hidden border border-gray-200">
                            <span className="px-3 py-1 inline-block text-gray-700">EN</span>
                            <span className="px-3 py-1 inline-block bg-green-500 text-white">বাং</span>
                        </div>
                    </div>

                    {/* Login button - Chaldal style */}
                    <Link
                        href={auth?.user ? "/dashboard" : "/login"}
                        className="hidden md:block bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
                    >
                        {auth?.user ? auth.user.name.split(' ')[0] : 'Login'}
                    </Link>
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

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Categories */}
                <aside
                    className={`
                    bg-white
                    w-64
                    shadow-md
                    flex-shrink-0
                    fixed
                    top-16
                    bottom-0
                    left-0
                    z-30
                    overflow-y-auto
                    ${isMobileMenuOpen ? 'block' : 'hidden md:block'}
                    `}
                >
                    {/* Grocery Header - Sticky Top */}
                    <div className="sticky top-0 z-10 bg-green-500 text-white text-center py-3 font-medium">
                        <div className="flex flex-col items-center">
                            <img src="/assets/grocery-icon.png" alt="Grocery" className="h-6 w-6 mb-1" />
                            <span>Grocery</span>
                        </div>
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
                    </div>

                    {/* Help Section - Sticky Bottom */}
                    <div className="fixed bottom-0 left-0 w-64 bg-white border-t border-gray-200 py-2 z-10">
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

                {/* Main content area */}
                <main
                    id="main-content"
                    className="md:ml-64 flex-1 overflow-y-auto bg-gray-100 transition-all duration-300 ml-0 w-full">
                    {children}
                </main>
            </div>

            {/* Cart Sidebar Component */}
            <CartSidebar />

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
