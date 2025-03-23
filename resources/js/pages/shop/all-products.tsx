import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import ShopLayout from '@/layouts/ShopLayout';
import {
    ShoppingBag,
    Filter,
    SlidersHorizontal,
    X,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    ArrowRight
} from 'lucide-react';

interface Image {
    id: number;
    product_id: number;
    image: string;
    is_primary: boolean;
    order: number;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    is_active: boolean;
    parent_id: number | null;
    order: number;
    created_at: string;
    updated_at: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    special_price: number | null;
    stock: number;
    is_active: boolean;
    is_featured: boolean;
    category_id: number;
    created_at: string;
    updated_at: string;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    images: Image[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface ProductsData {
    data: Product[];
    links?: any;
    meta?: {
        current_page: number;
        from: number;
        last_page: number;
        links: PaginationLink[];
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

interface Filters {
    category?: string;
    sort?: string;
}

interface AllProductsProps {
    products: ProductsData;
    categories: Category[];
    filters?: Filters;
    appSettings?: {
        store_name: string;
        meta_title: string;
        meta_description: string;
        currency: string;
        currency_symbol: string;
    };
}

const AllProducts: React.FC<AllProductsProps> = ({ products, categories, filters = {}, appSettings = {} }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState<number | null>(null);

    const { data, setData, get } = useForm({
        category: filters.category || '',
        sort: filters.sort || 'newest'
    });

    // Sort options
    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
        { value: 'name_asc', label: 'Name: A to Z' },
        { value: 'name_desc', label: 'Name: Z to A' }
    ];

    // Function to format price in local currency format
    const formatPrice = (price: any) => {
        const numericPrice = Number(price);
        if (isNaN(numericPrice)) return `${appSettings?.currency_symbol || '$'}0.00`;
        return `${appSettings?.currency_symbol || '$'}${numericPrice.toFixed(2)}`;
    };

    // Apply filters
    const applyFilters = () => {
        // Make sure we have valid data before submitting
        const validData = {
            category: data.category || '',
            sort: data.sort || 'newest'
        };
        get(route('products', validData));
        if (isFilterOpen) {
            setIsFilterOpen(false);
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setData({
            category: '',
            sort: 'newest'
        });
        get(route('products', { category: '', sort: 'newest' }));
    };

    // Calculate discount percentage
    const calculateDiscount = (originalPrice: number, specialPrice: number) => {
        if (!originalPrice || !specialPrice) return 0;
        return Math.round(((originalPrice - specialPrice) / originalPrice) * 100);
    };

    // Handle sort change
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortValue = e.target.value;
        setData('sort', newSortValue);
        const params = { ...data, sort: newSortValue };
        get(route('products', params));
    };

    // Handle category filter change
    const handleCategoryChange = (categoryId: string) => {
        const newCategoryValue = categoryId === data.category ? '' : categoryId;
        setData('category', newCategoryValue);

        // Don't auto-apply on desktop to avoid too many requests
        if (window.innerWidth < 768) {
            get(route('products', { ...data, category: newCategoryValue }));
        }
    };

    // Handle add to cart
    const handleAddToCart = (productId: number, event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setIsAddingToCart(productId);

        // Send request to add item to cart
        const formData = new FormData();
        formData.append('product_id', productId.toString());
        formData.append('quantity', '1');

        fetch(route('cart.add'), {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Refresh the page to update cart count or use Inertia to handle this more smoothly
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error('Error adding to cart:', error);
            })
            .finally(() => {
                setIsAddingToCart(null);
            });
    };

    const storeName = appSettings?.store_name || 'Our Store';
    const totalProducts = products.meta?.total || 0;
    const currentPage = products.meta?.current_page || 1;
    const lastPage = products.meta?.last_page || 1;

    return (
        <ShopLayout>
            <Head>
                <title>All Products - {storeName}</title>
                <meta name="description" content={`Browse all products available at ${storeName}`} />
            </Head>

            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <Link href={route('home')} className="hover:text-emerald-600">
                            Home
                        </Link>
                        <ChevronRight className="h-4 w-4 mx-2" />
                        <span className="font-medium text-gray-800">All Products</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">All Products</h1>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Mobile Filter Button */}
                    <div className="md:hidden mb-4">
                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="flex items-center justify-center w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 bg-white shadow-sm hover:bg-gray-50"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Filter Products
                        </button>
                    </div>

                    {/* Mobile Filter Overlay */}
                    <div
                        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
                            isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                        onClick={() => setIsFilterOpen(false)}
                    ></div>

                    {/* Mobile Filter Sidebar */}
                    <div
                        className={`fixed top-0 right-0 w-3/4 h-full bg-white z-50 transition-transform duration-300 transform md:hidden overflow-y-auto ${
                            isFilterOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    >
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Filters</h3>
                            <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-4">
                            {/* Mobile Sort Options */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-800 mb-3">Sort By</h4>
                                <select
                                    value={data.sort}
                                    onChange={handleSortChange}
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Mobile Categories */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-800 mb-3">Categories</h4>
                                <div className="space-y-2">
                                    {categories.map(category => (
                                        <div key={category.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`category-${category.id}`}
                                                checked={data.category === String(category.id)}
                                                onChange={() => handleCategoryChange(String(category.id))}
                                                className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                            />
                                            <label htmlFor={`category-${category.id}`} className="ml-2 text-gray-700">
                                                {category.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Filter Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={applyFilters}
                                    className="flex-1 bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                >
                                    Apply Filters
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Filter Sidebar */}
                    <div className="hidden md:block w-1/4 max-w-xs">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 sticky top-24">
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                                    Filters
                                </h3>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-emerald-600 hover:text-emerald-700"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Desktop Sort Options */}
                            <div className="mb-6">
                                <h4 className="font-medium text-gray-800 mb-3">Sort By</h4>
                                <select
                                    value={data.sort}
                                    onChange={handleSortChange}
                                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Desktop Categories */}
                            <div>
                                <h4 className="font-medium text-gray-800 mb-3">Categories</h4>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {categories.map(category => (
                                        <div key={category.id} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`desktop-category-${category.id}`}
                                                checked={data.category === String(category.id)}
                                                onChange={() => handleCategoryChange(String(category.id))}
                                                className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                            />
                                            <label
                                                htmlFor={`desktop-category-${category.id}`}
                                                className="ml-2 text-gray-700 cursor-pointer"
                                            >
                                                {category.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Desktop Apply Button */}
                            <div className="mt-6">
                                <button
                                    onClick={applyFilters}
                                    className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products Container */}
                    <div className="w-full md:w-3/4">
                        {/* Product Count and Results Info */}
                        <div className="hidden md:flex justify-between items-center mb-6">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-medium">{products.meta?.from || 0}</span> to{' '}
                                <span className="font-medium">{products.meta?.to || 0}</span> of{' '}
                                <span className="font-medium">{totalProducts}</span> products
                            </div>

                            {/* Additional results information for desktop */}
                            {data.category && categories.find(c => c.id === parseInt(data.category)) && (
                                <div className="flex items-center bg-emerald-50 px-3 py-1 rounded-full text-sm">
                                    <span className="text-emerald-700">
                                        Category: {categories.find(c => c.id === parseInt(data.category))?.name}
                                    </span>
                                    <button
                                        onClick={() => {
                                            setData('category', '');
                                            get(route('products', { ...data, category: '' }));
                                        }}
                                        className="ml-2 text-emerald-500 hover:text-emerald-700"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* No Results Message */}
                        {products.data.length === 0 && (
                            <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-100">
                                <div className="flex justify-center mb-4">
                                    <ShoppingBag className="h-12 w-12 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">No products found</h3>
                                <p className="text-gray-600 mb-4">
                                    We couldn't find any products matching your current filters.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}

                        {/* Product Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.data.map(product => (
                                <Link
                                    key={product.id}
                                    href={route('product.details', { product: product.id })}
                                    className="bg-white border border-gray-100 rounded-lg overflow-hidden group hover:shadow-md transition-all flex flex-col h-full"
                                >
                                    <div className="relative pt-[100%] bg-gray-50">
                                        {/* Product Image */}
                                        {product.images && product.images.length > 0 ? (
                                            <img
                                                src={`/storage/${product.images[0]?.image || 'default-product.jpg'}`}
                                                alt={product.name}
                                                className="absolute inset-0 w-full h-full object-contain p-2"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <ShoppingBag className="h-10 w-10 text-gray-200" />
                                            </div>
                                        )}

                                        {/* Discount Label */}
                                        {product.special_price && product.special_price < product.price && (
                                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                                                {calculateDiscount(product.price, product.special_price)}% OFF
                                            </div>
                                        )}

                                        {/* Add to Cart Button */}
                                        <button
                                            onClick={e => product.stock > 0 && handleAddToCart(product.id, e)}
                                            disabled={product.stock === 0 || isAddingToCart === product.id}
                                            className="absolute bottom-2 right-2 p-2 rounded-full bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
                                            aria-label="Add to cart"
                                        >
                                            {isAddingToCart === product.id ? (
                                                <svg
                                                    className="animate-spin h-5 w-5"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                            ) : (
                                                <ShoppingBag className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-3 flex-grow flex flex-col">
                                        <span className="text-xs text-emerald-700 mb-1">{product.category?.name || 'Uncategorized'}</span>
                                        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
                                            {product.name}
                                        </h3>

                                        <div className="mt-auto">
                                            {/* Product Price */}
                                            <div className="flex items-end">
                                                {product.special_price ? (
                                                    <>
                                                        <div className="text-base font-bold text-emerald-700">
                                                            {formatPrice(product.special_price)}
                                                        </div>
                                                        <div className="ml-2 text-xs text-gray-500 line-through">
                                                            {formatPrice(product.price)}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-base font-bold text-emerald-700">
                                                        {formatPrice(product.price)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Stock Status */}
                                            {product.stock <= 0 && (
                                                <div className="mt-1 text-xs text-red-600 font-medium">Out of Stock</div>
                                            )}
                                            {product.stock > 0 && product.stock < 5 && (
                                                <div className="mt-1 text-xs text-amber-600 font-medium">Low Stock: {product.stock} left</div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {lastPage > 1 && (
                            <div className="flex justify-center mt-8">
                                <div className="flex items-center space-x-2">
                                    {/* Previous Page Button */}
                                    {currentPage > 1 && (
                                        <Link
                                            href={route('products', { ...filters, page: currentPage - 1 })}
                                            className="flex items-center justify-center h-10 w-10 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </Link>
                                    )}

                                    {/* Page Numbers */}
                                    {products.meta?.links && Array.isArray(products.meta.links) &&
                                     products.meta.links.slice(1, -1).map((link: PaginationLink, index: number) => (
                                        <Link
                                            key={index}
                                            href={link.url ? link.url : '#'}
                                            className={`flex items-center justify-center h-10 w-10 rounded-md ${
                                                link.active
                                                    ? 'bg-emerald-600 text-white border border-emerald-600'
                                                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}

                                    {/* Next Page Button */}
                                    {currentPage < lastPage && (
                                        <Link
                                            href={route('products', { ...filters, page: currentPage + 1 })}
                                            className="flex items-center justify-center h-10 w-10 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
};

export default AllProducts;
