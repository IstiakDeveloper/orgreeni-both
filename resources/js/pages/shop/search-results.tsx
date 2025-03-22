import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Search,
  Grid3X3,
  List,
  Filter,
  SortAsc,
  SortDesc,
  ShoppingCart,
  Package
} from 'lucide-react';
import ShopLayout from '@/layouts/ShopLayout';

interface ProductImage {
  id: number;
  product_id: number;
  path: string;
  is_primary: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  stock: number;
  is_active: boolean;
  category: Category;
  images: ProductImage[];
}

interface SearchResultsProps {
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
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ products, query }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<'default' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'>('default');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const calculateDiscount = (price: number, salePrice: number) => {
    if (!salePrice || salePrice >= price) return null;
    const discount = ((price - salePrice) / price) * 100;
    return Math.round(discount);
  };

  const getProductImage = (product: Product) => {
    const primaryImage = product.images.find(img => img.is_primary);
    return primaryImage
      ? `/storage/${primaryImage.path}`
      : product.images.length > 0
        ? `/storage/${product.images[0].path}`
        : '/images/placeholder-product.jpg';
  };

  const sortProducts = (products: Product[]) => {
    let sortedProducts = [...products];

    switch (sortOrder) {
      case 'price_asc':
        sortedProducts.sort((a, b) => {
          const priceA = a.sale_price || a.price;
          const priceB = b.sale_price || b.price;
          return priceA - priceB;
        });
        break;
      case 'price_desc':
        sortedProducts.sort((a, b) => {
          const priceA = a.sale_price || a.price;
          const priceB = b.sale_price || b.price;
          return priceB - priceA;
        });
        break;
      case 'name_asc':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Keep default order
        break;
    }

    return sortedProducts;
  };

  const sortedProducts = sortProducts(products.data);

  return (
    <ShopLayout>
      <Head title={`Search Results: ${query}`} />

      <div className="bg-gray-50 py-8 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Results: "{query}"</h1>
          <p className="text-gray-600">
            {products.total} {products.total === 1 ? 'product' : 'products'} found
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div className="w-full md:w-auto">
            <form action={route('shop.search')} method="get">
              <div className="relative rounded-md shadow-sm max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="query"
                  className="block w-full rounded-md border-0 py-2 pl-10 pr-16 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                  placeholder="Search products..."
                  defaultValue={query}
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 px-3 flex items-center bg-emerald-600 text-white rounded-r-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-700"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="flex space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Sort
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
        {products.data.length === 0 ? (
          <div className="py-12 text-center">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
            <p className="text-gray-500">Try different search terms or browse our categories.</p>
            <Link
              href={route('shop')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
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
                        <p className="text-xs text-emerald-600 mb-1">
                          {product.category.name}
                        </p>
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
                      >
                        <ShoppingCart className="h-4 w-4 inline mr-1" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {sortedProducts.map((product) => (
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
                        <p className="text-xs text-emerald-600 mb-1">{product.category.name}</p>
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
                        >
                          <ShoppingCart className="h-4 w-4 inline mr-1" />
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
        {products.last_page > 1 && (
          <div className="mt-8 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <Link
                href={products.links[0].url || '#'}
                className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                  !products.links[0].url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
                preserveScroll
              >
                Previous
              </Link>
              <Link
                href={products.links[products.links.length - 1].url || '#'}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${
                  !products.links[products.links.length - 1].url ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
                preserveScroll
              >
                Next
              </Link>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(products.current_page - 1) * products.per_page + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(products.current_page * products.per_page, products.total)}
                  </span>{' '}
                  of <span className="font-medium">{products.total}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  {products.links.map((link, index) => {
                    // Skip prev/next links as we'll handle them separately
                    if (index === 0 || index === products.links.length - 1) {
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

export default SearchResults;
