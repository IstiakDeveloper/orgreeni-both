import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Filter, Grid3X3, List, SortAsc, SortDesc, Tag } from 'lucide-react';
import ShopLayout from '@/layouts/ShopLayout';

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  stock: number;
  is_active: boolean;
  images: {
    id: number;
    product_id: number;
    path: string;
    is_primary: boolean;
  }[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parent_id: number | null;
  is_active: boolean;
  products: {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };
  parent?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  children?: {
    id: number;
    name: string;
    slug: string;
    image: string | null;
  }[];
}

interface CategoryViewProps {
  category: Category;
}

const CategoryView: React.FC<CategoryViewProps> = ({ category }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<'default' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'>('default');

  // Function to get product image URL
  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return `/storage/${product.images[0].path}`;
    }
    return '/images/placeholder-product.jpg';
  };

  // Function to format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  // Function to calculate discount percentage
  const calculateDiscount = (price: number, salePrice: number) => {
    if (!salePrice || salePrice >= price) return null;
    const discount = ((price - salePrice) / price) * 100;
    return Math.round(discount);
  };

  return (
    <ShopLayout>
      <Head title={category.name} />

      {/* Hero Section */}
      <div className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-1">
              <nav className="flex mb-4" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-1 text-sm text-gray-500">
                  <li>
                    <Link href={route('home')} className="hover:text-gray-700">Home</Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mx-1" />
                    <Link href={route('shop')} className="hover:text-gray-700">Shop</Link>
                  </li>
                  {category.parent && (
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 mx-1" />
                      <Link
                        href={route('shop.category', category.parent.slug)}
                        className="hover:text-gray-700"
                      >
                        {category.parent.name}
                      </Link>
                    </li>
                  )}
                  <li className="flex items-center">
                    <ChevronRight className="h-4 w-4 mx-1" />
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </li>
                </ol>
              </nav>

              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{category.name}</h1>

              {category.description && (
                <p className="mt-2 text-gray-600 max-w-3xl">{category.description}</p>
              )}
            </div>

            {category.image && (
              <div className="mt-6 md:mt-0 md:ml-8">
                <img
                  src={`/storage/${category.image}`}
                  alt={category.name}
                  className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subcategories (if any) */}
      {category.children && category.children.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Subcategories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.children.map((child) => (
              <Link
                key={child.id}
                href={route('shop.category', child.slug)}
                className="group"
              >
                <div className="border border-gray-200 rounded-lg p-4 transition duration-150 ease-in-out hover:shadow-md hover:border-emerald-300 flex flex-col items-center">
                  {child.image ? (
                    <img
                      src={`/storage/${child.image}`}
                      alt={child.name}
                      className="w-16 h-16 object-cover rounded-md mb-2"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-emerald-100 flex items-center justify-center rounded-md mb-2">
                      <Tag className="h-8 w-8 text-emerald-600" />
                    </div>
                  )}
                  <span className="text-center font-medium text-gray-900 group-hover:text-emerald-600">
                    {child.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Products</h2>
            <p className="text-sm text-gray-500">
              {category.products.total} {category.products.total === 1 ? 'product' : 'products'} found
            </p>
          </div>

          <div className="flex space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>

              {showFilters && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Sort by</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="sort"
                        value="default"
                        checked={sortOrder === 'default'}
                        onChange={() => setSortOrder('default')}
                        className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Default</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="sort"
                        value="price_asc"
                        checked={sortOrder === 'price_asc'}
                        onChange={() => setSortOrder('price_asc')}
                        className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Price: Low to High</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="sort"
                        value="price_desc"
                        checked={sortOrder === 'price_desc'}
                        onChange={() => setSortOrder('price_desc')}
                        className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Price: High to Low</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="sort"
                        value="name_asc"
                        checked={sortOrder === 'name_asc'}
                        onChange={() => setSortOrder('name_asc')}
                        className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Name: A to Z</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="sort"
                        value="name_desc"
                        checked={sortOrder === 'name_desc'}
                        onChange={() => setSortOrder('name_desc')}
                        className="h-4 w-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Name: Z to A</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                  viewMode === 'grid'
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } focus:z-10 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                  viewMode === 'list'
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } focus:z-10 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products List/Grid */}
        {category.products.data.length === 0 ? (
          <div className="py-12 text-center">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <Tag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
            <p className="text-gray-500">There are no products in this category yet.</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {category.products.data.map((product) => (
                  <div key={product.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <Link href={route('shop.product', product.slug)}>
                      <div className="w-full h-48 bg-gray-200 overflow-hidden">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        {product.sale_price && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            -{calculateDiscount(product.price, product.sale_price)}%
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-emerald-600">
                          {product.name}
                        </h3>
                        <div className="flex justify-between items-center">
                          <div>
                            {product.sale_price ? (
                              <div className="flex items-center">
                                <span className="text-emerald-600 font-semibold mr-2">
                                  {formatPrice(product.sale_price)}
                                </span>
                                <span className="text-gray-400 text-sm line-through">
                                  {formatPrice(product.price)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-emerald-600 font-semibold">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </div>
                          {product.stock > 0 ? (
                            <span className="text-xs text-green-800 bg-green-100 px-2 py-1 rounded-full">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-xs text-red-800 bg-red-100 px-2 py-1 rounded-full">
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                    <div className="p-4 pt-0">
                      <button
                        className="w-full mt-2 bg-emerald-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                        disabled={product.stock <= 0}
                        onClick={() => {
                          // Add to cart functionality
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {category.products.data.map((product) => (
                  <div key={product.id} className="flex flex-col sm:flex-row bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <Link
                      href={route('shop.product', product.slug)}
                      className="sm:w-48 md:w-56 lg:w-64"
                    >
                      <div className="w-full h-48 sm:h-full bg-gray-200 overflow-hidden relative">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                        {product.sale_price && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            -{calculateDiscount(product.price, product.sale_price)}%
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1 p-4 flex flex-col">
                      <div className="flex-1">
                        <Link
                          href={route('shop.product', product.slug)}
                          className="hover:text-emerald-600"
                        >
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                          {product.description || 'No description available.'}
                        </p>
                        <div className="flex items-center mb-4">
                          {product.sale_price ? (
                            <div className="flex items-center">
                              <span className="text-emerald-600 font-semibold text-lg mr-2">
                                {formatPrice(product.sale_price)}
                              </span>
                              <span className="text-gray-400 text-sm line-through">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-emerald-600 font-semibold text-lg">
                              {formatPrice(product.price)}
                            </span>
                          )}
                          <div className="ml-auto">
                            {product.stock > 0 ? (
                              <span className="text-xs text-green-800 bg-green-100 px-2 py-1 rounded-full">
                                In Stock
                              </span>
                            ) : (
                              <span className="text-xs text-red-800 bg-red-100 px-2 py-1 rounded-full">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-0">
                        <button
                          className="w-full sm:w-auto bg-emerald-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                          disabled={product.stock <= 0}
                          onClick={() => {
                            // Add to cart functionality
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {category.products.last_page > 1 && (
          <div className="mt-8 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <Link
                href={category.products.links[0].url || '#'}
                className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                  !category.products.links[0].url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
                preserveScroll
              >
                Previous
              </Link>
              <Link
                href={category.products.links[category.products.links.length - 1].url || '#'}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                  !category.products.links[category.products.links.length - 1].url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
                preserveScroll
              >
                Next
              </Link>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(category.products.current_page - 1) * category.products.per_page + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(category.products.current_page * category.products.per_page, category.products.total)}
                  </span>{' '}
                  of <span className="font-medium">{category.products.total}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  {category.products.links.map((link, index) => {
                    // Skip prev/next links as we'll handle them separately
                    if (index === 0 || index === category.products.links.length - 1) {
                      return null;
                    }

                    return (
                      <Link
                        key={index}
                        href={link.url || '#'}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          link.active
                            ? 'z-10 bg-emerald-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                        preserveScroll
                        dangerouslySetInnerHTML={{ __html: link.label }}
                      />
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </ShopLayout>
  );
};

export default CategoryView;
