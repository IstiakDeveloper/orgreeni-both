import React, { ChangeEvent, FormEventHandler, useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
  ArrowLeft,
  AlertCircle,
  Package,
  FileImage,
  Tag,
  AlignLeft,
  CheckCircle,
  DollarSign,
  Truck,
  Box,
  Star,
  X,
  Plus,
  BarChart,
  CircleCheck,
  Save,
  Trash2
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
  images: ProductImage[];
}

interface EditProductProps {
  product: Product;
  categories: Category[];
  errors: {
    name?: string;
    description?: string;
    price?: string;
    special_price?: string;
    unit?: string;
    stock?: string;
    sku?: string;
    category_id?: string;
    is_featured?: string;
    is_active?: string;
    images?: string;
    "images.*"?: string;
    primary_image?: string;
    existing_images?: string;
    remove_images?: string;
  };
}

const Edit: React.FC<EditProductProps> = ({ product, categories, errors }) => {
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>(product.images);
  const [imagesToRemove, setImagesToRemove] = useState<number[]>([]);
  const [primaryImageId, setPrimaryImageId] = useState<number | string>(
    existingImages.find(img => img.is_primary)?.id ||
    (existingImages.length > 0 ? existingImages[0].id : 'new_0')
  );

  const { data, setData, post, processing } = useForm({
    _method: 'PUT',
    name: product.name || '',
    description: product.description || '',
    price: product.price || 0,
    special_price: product.special_price || '',
    unit: product.unit || 'piece',
    stock: product.stock || 0,
    sku: product.sku || '',
    category_id: product.category_id || '',
    is_featured: product.is_featured || false,
    is_active: product.is_active || true,
    images: [] as File[],
    primary_image: existingImages.find(img => img.is_primary)?.id ||
      (existingImages.length > 0 ? existingImages[0].id : 'new_0'),
    existing_images: product.images.map(img => img.id),
    remove_images: [] as number[],
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append text fields
    formData.append('_method', 'PUT');
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('price', data.price.toString());
    formData.append('special_price', data.special_price ? data.special_price.toString() : '');
    formData.append('unit', data.unit);
    formData.append('stock', data.stock.toString());
    formData.append('sku', data.sku);
    formData.append('category_id', data.category_id.toString());
    formData.append('is_featured', data.is_featured ? '1' : '0');
    formData.append('is_active', data.is_active ? '1' : '0');

    // Append new images
    newImageFiles.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });

    // Append primary image info
    formData.append('primary_image', primaryImageId.toString());

    // Append existing images
    existingImages.forEach(img => {
      formData.append('existing_images[]', img.id.toString());
    });

    // Append images to remove
    imagesToRemove.forEach(id => {
      formData.append('remove_images[]', id.toString());
    });

    post(route('admin.products.update', product.id), formData);
  };

  const handleNewImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setNewImageFiles([...newImageFiles, ...newFiles]);

      // Generate preview URLs for new images
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setNewImagePreviews([...newImagePreviews, ...newPreviews]);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles(newImageFiles.filter((_, i) => i !== index));
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));

    // If removing the primary image, set first available image as primary
    if (primaryImageId === `new_${index}`) {
      if (existingImages.length > 0) {
        setPrimaryImageId(existingImages[0].id);
      } else if (newImageFiles.length > 1) {
        let newPrimaryIndex = 0;
        if (index === 0 && newImageFiles.length > 1) {
          newPrimaryIndex = 1;
        }
        setPrimaryImageId(`new_${newPrimaryIndex}`);
      }
    }
    // If removing an image before the primary, adjust the primary index
    else if (typeof primaryImageId === 'string' && primaryImageId.startsWith('new_')) {
      const currentIndex = parseInt(primaryImageId.split('_')[1]);
      if (index < currentIndex) {
        setPrimaryImageId(`new_${currentIndex - 1}`);
      }
    }
  };

  const markExistingImageForRemoval = (imageId: number) => {
    setExistingImages(existingImages.filter(img => img.id !== imageId));
    setImagesToRemove([...imagesToRemove, imageId]);

    // If removing the primary image, set first available image as primary
    if (primaryImageId === imageId) {
      const remainingImages = existingImages.filter(img => img.id !== imageId);

      if (remainingImages.length > 0) {
        setPrimaryImageId(remainingImages[0].id);
      } else if (newImageFiles.length > 0) {
        setPrimaryImageId('new_0');
      }
    }
  };

  const setPrimaryImage = (id: number | string) => {
    setPrimaryImageId(id);
    setData('primary_image', id);
  };

  return (
    <AdminLayout title={`Edit Product: ${product.name}`}>
      <Head title={`Edit Product: ${product.name}`} />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={route('admin.products.index')}
            className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>

        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Product</h3>
              <p className="mt-1 text-sm text-gray-600">
                Update your product information, pricing, inventory, and images.
              </p>
              <div className="mt-6">
                <div className="flex items-center">
                  <CircleCheck className="h-5 w-5 text-emerald-500" />
                  <span className="ml-2 text-sm text-gray-600">All fields marked with * are required</span>
                </div>
                <div className="flex items-center mt-2">
                  <CircleCheck className="h-5 w-5 text-emerald-500" />
                  <span className="ml-2 text-sm text-gray-600">Keep at least one product image</span>
                </div>
                <div className="flex items-center mt-2">
                  <CircleCheck className="h-5 w-5 text-emerald-500" />
                  <span className="ml-2 text-sm text-gray-600">Make sure to set a primary image</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 md:col-span-2 md:mt-0">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 flex items-center">
                      <Package className="h-4 w-4 mr-2 text-emerald-600" />
                      Basic Information
                    </h3>
                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      {/* Name */}
                      <div className="sm:col-span-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Package className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                              errors?.name ? 'ring-red-300' : 'ring-gray-300'
                            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                            placeholder="Enter product name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                          />
                        </div>
                        {errors?.name && (
                          <p className="mt-2 text-sm text-red-600" id="name-error">
                            <AlertCircle className="h-4 w-4 inline mr-1" />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* SKU */}
                      <div className="sm:col-span-2">
                        <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                          SKU <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BarChart className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <input
                            type="text"
                            id="sku"
                            name="sku"
                            required
                            className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                              errors?.sku ? 'ring-red-300' : 'ring-gray-300'
                            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                            placeholder="Product SKU"
                            value={data.sku}
                            onChange={(e) => setData('sku', e.target.value)}
                          />
                        </div>
                        {errors?.sku && (
                          <p className="mt-2 text-sm text-red-600" id="sku-error">
                            <AlertCircle className="h-4 w-4 inline mr-1" />
                            {errors.sku}
                          </p>
                        )}
                      </div>

                      {/* Category */}
                      <div className="sm:col-span-3">
                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Tag className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <select
                            id="category_id"
                            name="category_id"
                            required
                            className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                              errors?.category_id ? 'ring-red-300' : 'ring-gray-300'
                            } focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                            value={data.category_id}
                            onChange={(e) => setData('category_id', parseInt(e.target.value))}
                          >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors?.category_id && (
                          <p className="mt-2 text-sm text-red-600" id="category-error">
                            <AlertCircle className="h-4 w-4 inline mr-1" />
                            {errors.category_id}
                          </p>
                        )}
                      </div>

                      {/* Status */}
                      <div className="sm:col-span-3">
                        <div className="flex items-start">
                          <div className="flex h-6 items-center">
                            <input
                              id="is_active"
                              name="is_active"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                              checked={data.is_active}
                              onChange={(e) => setData('is_active', e.target.checked)}
                            />
                          </div>
                          <div className="ml-3 text-sm leading-6">
                            <label htmlFor="is_active" className="font-medium text-gray-900">
                              Active
                            </label>
                            <p className="text-gray-500">Make this product visible in the store.</p>
                          </div>
                        </div>

                        <div className="flex items-start mt-4">
                          <div className="flex h-6 items-center">
                            <input
                              id="is_featured"
                              name="is_featured"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                              checked={data.is_featured}
                              onChange={(e) => setData('is_featured', e.target.checked)}
                            />
                          </div>
                          <div className="ml-3 text-sm leading-6">
                            <label htmlFor="is_featured" className="font-medium text-gray-900">
                              Featured
                            </label>
                            <p className="text-gray-500">Show this product on the homepage featured section.</p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="sm:col-span-6">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 pt-2.5 flex items-start pointer-events-none">
                          <AlignLeft className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                              errors?.description ? 'ring-red-300' : 'ring-gray-300'
                            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                            placeholder="Enter product description (optional)"
                            value={data.description || ''}
                            onChange={(e) => setData('description', e.target.value)}
                          />
                        </div>
                        {errors?.description && (
                          <p className="mt-2 text-sm text-red-600" id="description-error">
                            <AlertCircle className="h-4 w-4 inline mr-1" />
                            {errors.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Inventory */}
                  <div className="pt-5 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-emerald-600" />
                      Pricing and Inventory
                    </h3>
                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      {/* Regular Price */}
                      <div className="sm:col-span-2">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          Regular Price <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            step="0.01"
                            min="0"
                            required
                            className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                              errors?.price ? 'ring-red-300' : 'ring-gray-300'
                            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                            placeholder="0.00"
                            value={data.price || ''}
                            onChange={(e) => setData('price', parseFloat(e.target.value))}
                          />
                        </div>
                        {errors?.price && (
                          <p className="mt-2 text-sm text-red-600" id="price-error">
                            <AlertCircle className="h-4 w-4 inline mr-1" />
                            {errors.price}
                          </p>
                        )}
                      </div>

                      {/* Sale Price */}
                      <div className="sm:col-span-2">
                        <label htmlFor="special_price" className="block text-sm font-medium text-gray-700">
                          Sale Price
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <input
                            type="number"
                            id="special_price"
                            name="special_price"
                            step="0.01"
                            min="0"
                            className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                              errors?.special_price ? 'ring-red-300' : 'ring-gray-300'
                            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                            placeholder="0.00"
                            value={data.special_price || ''}
                            onChange={(e) => setData('special_price', e.target.value ? parseFloat(e.target.value) : '')}
                          />
                        </div>
                        {errors?.special_price && (
                          <p className="mt-2 text-sm text-red-600" id="special-price-error">
                            <AlertCircle className="h-4 w-4 inline mr-1" />
                            {errors.special_price}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">Leave empty for no sale price</p>
                      </div>

                      {/* Unit */}
                      <div className="sm:col-span-2">
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                          Unit <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Box className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <select
                            id="unit"
                            name="unit"
                            required
                            className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                              errors?.unit ? 'ring-red-300' : 'ring-gray-300'
                            } focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                            value={data.unit}
                            onChange={(e) => setData('unit', e.target.value)}
                          >
                            <option value="piece">Piece</option>
                            <option value="kg">Kilogram (kg)</option>
                            <option value="g">Gram (g)</option>
                            <option value="lb">Pound (lb)</option>
                            <option value="oz">Ounce (oz)</option>
                            <option value="l">Liter (l)</option>
                            <option value="ml">Milliliter (ml)</option>
                            <option value="set">Set</option>
                            <option value="pack">Pack</option>
                            <option value="box">Box</option>
                            <option value="pair">Pair</option>
                            <option value="dozen">Dozen</option>
                          </select>
                        </div>
                        {errors?.unit && (
                          <p className="mt-2 text-sm text-red-600" id="unit-error">
                            <AlertCircle className="h-4 w-4 inline mr-1" />
                            {errors.unit}
                          </p>
                        )}
                      </div>

                      {/* Stock */}
                      <div className="sm:col-span-3">
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                          Stock Quantity <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Truck className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <input
                            type="number"
                            id="stock"
                            name="stock"
                            min="0"
                            required
                            className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                              errors?.stock ? 'ring-red-300' : 'ring-gray-300'
                            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                            placeholder="0"
                            value={data.stock}
                            onChange={(e) => setData('stock', parseInt(e.target.value))}
                          />
                        </div>
                        {errors?.stock && (
                          <p className="mt-2 text-sm text-red-600" id="stock-error">
                            <AlertCircle className="h-4 w-4 inline mr-1" />
                            {errors.stock}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Images */}
                  <div className="pt-5 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 flex items-center">
                      <FileImage className="h-4 w-4 mr-2 text-emerald-600" />
                      Product Images <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Upload product images and select a primary image to be displayed in product listings.
                    </p>

                    {errors?.images && (
                      <div className="mt-2 p-2 bg-red-50 rounded-md border border-red-200">
                        <p className="text-sm text-red-600 flex items-start">
                          <AlertCircle className="h-5 w-5 mr-1 flex-shrink-0" />
                          <span>{errors.images}</span>
                        </p>
                      </div>
                    )}

                    {errors?.["images.*"] && (
                      <div className="mt-2 p-2 bg-red-50 rounded-md border border-red-200">
                        <p className="text-sm text-red-600 flex items-start">
                          <AlertCircle className="h-5 w-5 mr-1 flex-shrink-0" />
                          <span>{errors["images.*"]}</span>
                        </p>
                      </div>
                    )}

                    {errors?.primary_image && (
                      <div className="mt-2 p-2 bg-red-50 rounded-md border border-red-200">
                        <p className="text-sm text-red-600 flex items-start">
                          <AlertCircle className="h-5 w-5 mr-1 flex-shrink-0" />
                          <span>{errors.primary_image}</span>
                        </p>
                      </div>
                    )}

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">Current Images</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
                          {existingImages.map((image) => (
                            <div key={image.id} className={`relative border rounded-md overflow-hidden group ${
                              primaryImageId === image.id ? 'ring-2 ring-emerald-500' : ''
                            }`}>
                              <div className="h-32 w-full">
                                <img
                                  src={`/storage/${image.image}`}
                                  alt={`Product Image ${image.id}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="absolute top-0 right-0 p-1">
                                <button
                                  type="button"
                                  onClick={() => markExistingImageForRemoval(image.id)}
                                  className="bg-white rounded-full p-1 shadow hover:bg-gray-100 focus:outline-none"
                                >
                                  <X className="h-4 w-4 text-gray-600" />
                                </button>
                              </div>
                              <div className="p-2 bg-gray-50 text-center">
                                {primaryImageId === image.id ? (
                                  <span className="text-xs font-medium text-emerald-600 flex items-center justify-center">
                                    <Star className="h-3 w-3 mr-1 fill-emerald-500" /> Primary Image
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setPrimaryImage(image.id)}
                                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium focus:outline-none"
                                  >
                                    Set as Primary
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Image Upload */}
                    <div className="mt-4">
                      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <FileImage className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                          <div className="flex text-sm text-gray-600 justify-center">
                            <label
                              htmlFor="image-upload"
                              className="relative cursor-pointer rounded-md bg-white font-medium text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 hover:text-emerald-500"
                            >
                              <span>Upload new images</span>
                              <input
                                id="image-upload"
                                name="image-upload"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                multiple
                                onChange={handleNewImageChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                        </div>
                      </div>
                    </div>

                    {/* New Image Previews */}
                    {newImagePreviews.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700">New Images</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
                          {newImagePreviews.map((preview, index) => (
                            <div key={`new-${index}`} className={`relative border rounded-md overflow-hidden group ${
                              primaryImageId === `new_${index}` ? 'ring-2 ring-emerald-500' : ''
                            }`}>
                              <div className="h-32 w-full">
                                <img
                                  src={preview}
                                  alt={`New Image ${index + 1}`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="absolute top-0 right-0 p-1">
                                <button
                                  type="button"
                                  onClick={() => removeNewImage(index)}
                                  className="bg-white rounded-full p-1 shadow hover:bg-gray-100 focus:outline-none"
                                >
                                  <X className="h-4 w-4 text-gray-600" />
                                </button>
                              </div>
                              <div className="p-2 bg-gray-50 text-center">
                                {primaryImageId === `new_${index}` ? (
                                  <span className="text-xs font-medium text-emerald-600 flex items-center justify-center">
                                    <Star className="h-3 w-3 mr-1 fill-emerald-500" /> Primary Image
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setPrimaryImage(`new_${index}`)}
                                    className="text-xs text-emerald-600 hover:text-emerald-700 font-medium focus:outline-none"
                                  >
                                    Set as Primary
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Warning if no images */}
                    {existingImages.length === 0 && newImageFiles.length === 0 && (
                      <div className="mt-4 p-2 bg-amber-50 rounded-md border border-amber-200">
                        <p className="text-sm text-amber-600 flex items-start">
                          <AlertTriangle className="h-5 w-5 mr-1 flex-shrink-0" />
                          <span>At least one product image is required.</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <Link
                    href={route('admin.products.index')}
                    className="inline-flex justify-center rounded-md bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={processing || (existingImages.length === 0 && newImageFiles.length === 0)}
                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-emerald-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-1" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Edit;
