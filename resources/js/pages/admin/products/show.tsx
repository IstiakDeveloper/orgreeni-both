import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  Calendar,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Hash,
  Tag,
  AlignLeft,
  ExternalLink,
  FileImage,
  DollarSign,
  Star,
  Box,
  Truck,
  BarChart,
  ChevronsLeft,
  ChevronsRight,
  ArrowRight
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface ProductImage {
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
  category: Category;
  images: ProductImage[];
}

interface ProductShowProps {
  product: Product;
}

const Show: React.FC<ProductShowProps> = ({ product }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(
    product.images.findIndex(img => img.is_primary) !== -1
      ? product.images.findIndex(img => img.is_primary)
      : 0
  );

  const confirmDelete = () => {
    setShowDeleteModal(true);
  };

  const handleDelete = () => {
    router.delete(route('admin.products.destroy', product.id));
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const nextImage = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex((currentImageIndex + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images.length > 1) {
      setCurrentImageIndex(
        currentImageIndex === 0 ? product.images.length - 1 : currentImageIndex - 1
      );
    }
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <AdminLayout title={`Product: ${product.name}`}>
      <Head title={`Product: ${product.name}`} />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <Link
            href={route('admin.products.index')}
            className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>

          <div className="flex space-x-2">
            <Link
              href={route('admin.products.edit', product.id)}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Link>
            <button
              onClick={confirmDelete}
              className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Product Images */}
          <div className="md:col-span-1">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <FileImage className="h-5 w-5 mr-2 text-emerald-600" />
                  Images
                </h3>
                <span className="text-sm text-gray-500">
                  {product.images.length} {product.images.length === 1 ? 'image' : 'images'}
                </span>
              </div>

              {product.images.length > 0 ? (
                <div>
                  <div className="relative">
                    <img
                      src={`/storage/${product.images[currentImageIndex].image}`}
                      alt={product.name}
                      className="w-full h-64 object-contain bg-gray-50 p-4"
                    />

                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow hover:bg-gray-100 focus:outline-none"
                        >
                          <ChevronsLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow hover:bg-gray-100 focus:outline-none"
                        >
                          <ChevronsRight className="h-5 w-5 text-gray-600" />
                        </button>
                      </>
                    )}
                    {product.images[currentImageIndex].is_primary && (
                      <div className="absolute top-2 left-2 bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-emerald-500" />
                        Primary
                      </div>
                    )}
                  </div>

                  {product.images.length > 1 && (
                    <div className="p-4 grid grid-cols-5 gap-2">
                      {product.images.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => selectImage(index)}
                          className={`h-12 w-full border rounded-md overflow-hidden ${
                            index === currentImageIndex ? 'ring-2 ring-emerald-500' : ''
                          }`}
                        >
                          <img
                            src={`/storage/${image.image}`}
                            alt={`${product.name} - Image ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center">
                  <div className="inline-block p-3 bg-gray-100 rounded-full mb-2">
                    <FileImage className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No images available</p>
                </div>
              )}
            </div>

            {/* View on Store */}
            <div className="mt-4">
              <Link
                href=""
                target="_blank"
                className="block w-full text-center bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <span className="flex items-center justify-center">
                  <Eye className="h-4 w-4 mr-1" />
                  View on Store
                  <ExternalLink className="h-4 w-4 ml-1" />
                </span>
              </Link>
            </div>
          </div>

          {/* Product Details */}
          <div className="md:col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Product Details</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Detailed information about this product.</p>
                </div>
                <div className="flex space-x-2">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    product.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {product.is_featured && (
                    <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-amber-100 text-amber-800">
                    Featured
                  </span>
                )}
              </div>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Package className="h-5 w-5 mr-1 text-emerald-600" />
                    Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 font-medium">
                    {product.name}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <BarChart className="h-5 w-5 mr-1 text-emerald-600" />
                    SKU
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {product.sku}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Tag className="h-5 w-5 mr-1 text-emerald-600" />
                    Category
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <Link
                      href={route('admin.categories.show', product.category.id)}
                      className="text-emerald-600 hover:text-emerald-500"
                    >
                      {product.category.name}
                    </Link>
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <DollarSign className="h-5 w-5 mr-1 text-emerald-600" />
                    Price
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <div className="font-bold">{formatPrice(product.price)}</div>
                    {product.special_price && (
                      <div className="text-red-600 mt-1">
                        Sale Price: {formatPrice(product.special_price)}
                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                          {Math.round(((product.price - product.special_price) / product.price) * 100)}% Off
                        </span>
                      </div>
                    )}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Truck className="h-5 w-5 mr-1 text-emerald-600" />
                    Stock
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock} {product.unit}{product.stock !== 1 ? 's' : ''}
                    </span>
                    {product.stock === 0 && (
                      <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                        Out of Stock
                      </span>
                    )}
                    {product.stock > 0 && product.stock < 5 && (
                      <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                        Low Stock
                      </span>
                    )}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Box className="h-5 w-5 mr-1 text-emerald-600" />
                    Unit
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {product.unit.charAt(0).toUpperCase() + product.unit.slice(1)}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <AlignLeft className="h-5 w-5 mr-1 text-emerald-600" />
                    Description
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {product.description || <span className="text-gray-400 italic">No description provided</span>}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="h-5 w-5 mr-1 text-emerald-600" />
                    Created
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {formatDate(product.created_at)}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Clock className="h-5 w-5 mr-1 text-emerald-600" />
                    Last Updated
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    {formatDate(product.updated_at)}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Eye className="h-5 w-5 mr-1 text-emerald-600" />
                    Status
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center">
                        {product.is_active ? (
                          <CheckCircle className="h-5 w-5 mr-1 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 mr-1 text-red-600" />
                        )}
                        <span>{product.is_active ? 'Active' : 'Inactive'}</span>
                        {!product.is_active && (
                          <span className="ml-2 text-xs text-gray-500">Not visible to customers</span>
                        )}
                      </div>
                      <div className="flex items-center">
                        {product.is_featured ? (
                          <Star className="h-5 w-5 mr-1 text-amber-500" />
                        ) : (
                          <Star className="h-5 w-5 mr-1 text-gray-400" />
                        )}
                        <span>{product.is_featured ? 'Featured' : 'Not Featured'}</span>
                        {product.is_featured && (
                          <span className="ml-2 text-xs text-gray-500">Displayed on homepage</span>
                        )}
                      </div>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row sm:justify-end sm:space-x-4">
        <Link
          href=""
          target="_blank"
          className="inline-flex justify-center items-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mb-2 sm:mb-0"
        >
          <Eye className="h-4 w-4 mr-1" />
          View on Store
          <ExternalLink className="h-4 w-4 ml-1" />
        </Link>
        <Link
          href={route('admin.products.edit', product.id)}
          className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit Product
        </Link>
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
                    Are you sure you want to delete the product "{product.name}"? This action cannot be undone and will remove all associated images.
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
    </div>
  </AdminLayout>
);
};

export default Show;
