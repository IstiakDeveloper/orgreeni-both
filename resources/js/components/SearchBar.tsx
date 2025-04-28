import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';

const SearchBar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // Effect to trigger search as user types
    useEffect(() => {
        // Only search if query is at least 2 characters
        if (searchQuery.trim().length >= 2) {
            // Debounce the search to prevent too many requests
            const timeoutId = setTimeout(() => {
                router.get('/search',
                    { q: searchQuery.trim() },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true
                    }
                );
            }, 500); // 500ms delay to reduce unnecessary requests

            // Clean up the timeout on component unmount or query change
            return () => clearTimeout(timeoutId);
        }
    }, [searchQuery]);

    return (
        <div className="relative flex-1 max-w-3xl">
            <div className="relative flex items-center bg-white rounded-md overflow-hidden">
                <input
                    type="text"
                    placeholder="পণ্য খুঁজুন (যেমন ডিম, দুধ, আলু)"
                    className="w-full py-2 px-4 border-none focus:outline-none text-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="px-2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                )}
                <div className="px-4 py-2 transition-colors">
                    <Search size={20} className="text-gray-500" />
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
