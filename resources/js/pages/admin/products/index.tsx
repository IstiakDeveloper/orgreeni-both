import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  PlusCircle,
  Search,
  Package,
  AlertTriangle,
  Tag,
  Eye,
  DollarSign,
  ShoppingBag,
  Layers
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface ProductImage {
  id: number;
  product_id: number;
  image: string;
  is_primary: boolean;
  order: number;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  special_price: number | null;
  unit: string;
  stock: number;
  sku: string;
  category_id: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
  };
  images: ProductImage[];
}

interface ProductIndexProps {
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
}

const Index: React.FC<ProductIndexProps> = ({ products }) => {
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('admin.products.index'), { search }, { preserveState: true });
  };

  const confirmDelete = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    if (productToDelete) {
      router.delete(route('admin.products.destroy', productToDelete.id));
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setProductToDelete(null);
    setShowDeleteModal(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <AdminLayout title="Products">
      <Head title="Products" />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Products</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the products in your store, including their name, price, stock, and status.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              href={route('admin.products.create')}
              className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <form onSubmit={handleSearch} className="max-w-lg mb-4">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                className="block w-full rounded-md border-0 py-2 pl-10 pr-16 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6"
                placeholder="Search products by name, SKU or description..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 px-3 flex items-center bg-emerald-600 text-white rounded-r-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-700"
              >
                Search
              </button>
            </div>
          </form>

          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stock</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {products.data.length > 0 ? (
                  products.data.map((product) => {
                    const primaryImage = product.images.find(img => img.is_primary);

                    return (
                      <tr key={product.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <div className="flex items-center">
                            {primaryImage ? (
                              <img
                                src={`/storage/${primaryImage.image}`}
                                alt={product.name}
                                className="h-12 w-12 mr-3 rounded-md object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 mr-3 rounded-md bg-gray-100 flex items-center justify-center">
                                <Package className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-gray-500 text-xs">SKU: {product.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-1 text-emerald-500" />
                            {product.category.name}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{formatPrice(product.price)}</span>
                            {product.special_price && (
                              <span className="text-xs text-red-600">Sale: {formatPrice(product.special_price)}</span>
                            )}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <div className="flex items-center">
                            <ShoppingBag className="h-4 w-4 mr-1 text-gray-500" />
                            <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {product.stock} {product.unit}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <div className="flex flex-col">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              product.is_active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {product.is_active ? 'Active' : 'Inactive'}
                            </span>
                            {product.is_featured && (
                              <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-amber-100 text-amber-800 mt-1">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <Link
                              href={route('admin.products.show', product.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View"
                            >
                              <Eye className="h-5 w-5" />
                            </Link>
                            <Link
                              href={route('admin.products.edit', product.id)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Edit"
                            >
                              <Edit className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => confirmDelete(product)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-3 py-4 text-sm text-gray-500 text-center">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {products.last_page > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
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
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl sm:max-w-md sm:w-full p-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Delete Product</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete the product "{productToDelete?.name}"? This action cannot be undone and will remove all associated images.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Index;
