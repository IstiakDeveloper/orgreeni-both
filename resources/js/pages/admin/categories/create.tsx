import React, { ChangeEvent, FormEventHandler, useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
  ArrowLeft,
  AlertCircle,
  Tag,
  FileImage,
  Hash,
  AlignLeft,
  CheckCircle,
  FolderTree
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface ParentCategory {
  id: number;
  name: string;
}

interface CategoryCreateProps {
  parentCategories: ParentCategory[];
  errors: {
    name?: string;
    description?: string;
    image?: string;
    parent_id?: string;
    order?: string;
    is_active?: string;
  };
}

const Create: React.FC<CategoryCreateProps> = ({ parentCategories, errors }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data, setData, post, processing } = useForm({
    name: '',
    description: '',
    image: null as File | null,
    parent_id: '' as string | number,
    order: 0,
    is_active: true,
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('admin.categories.store'));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setData('image', file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AdminLayout title="Create Category">
      <Head title="Create Category" />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={route('admin.categories.index')}
            className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Categories
          </Link>
        </div>

        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Create Category</h3>
              <p className="mt-1 text-sm text-gray-600">
                Create a new product category for your store. Categories help organize your products and make them easier for customers to find.
              </p>
            </div>
          </div>

          <div className="mt-5 md:col-span-2 md:mt-0">
            <form onSubmit={handleSubmit}>
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-emerald-600" />
                      Basic Information
                    </h3>
                    <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      {/* Name */}
                      <div className="sm:col-span-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Tag className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                              errors?.name ? 'ring-red-300' : 'ring-gray-300'
                            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                            placeholder="Enter category name"
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

                      {/* Order */}
                      <div className="sm:col-span-2">
                        <label htmlFor="order" className="block text-sm font-medium text-gray-700">
                          Display Order
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Hash className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <input
                            type="number"
                            id="order"
                            name="order"
                            min="0"
                            className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                              errors?.order ? 'ring-red-300' : 'ring-gray-300'
                            } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                            value={data.order}
                            onChange={(e) => setData('order', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        {errors?.order && (
                          <p className="mt-2 text-sm text-red-600" id="order-error">
                            <AlertCircle className="h-4 w-4 inline mr-1" />
                            {errors.order}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">Lower numbers appear first.</p>
                      </div>

                      {/* Parent Category */}
                      <div className="sm:col-span-3">
                        <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700">
                          Parent Category
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FolderTree className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <select
                            id="parent_id"
                            name="parent_id"
                            className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                              errors?.parent_id ? 'ring-red-300' : 'ring-gray-300'
                            } focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                            value={data.parent_id}
                            onChange={(e) => setData('parent_id', e.target.value)}
                          >
                            <option value="">None (Top-level category)</option>
                            {parentCategories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        {errors?.parent_id && (
                          <p className="mt-2 text-sm text-red-600" id="parent-error">
                            <AlertCircle className="h-4 w-4 inline mr-1" />
                            {errors.parent_id}
                          </p>
                        )}
                      </div>

                      {/* Active Status */}
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
                            <p className="text-gray-500">Make this category visible on the store.</p>
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
                            placeholder="Enter category description (optional)"
                            value={data.description}
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

                      {/* Image */}
                      <div className="sm:col-span-6">
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                          Category Image
                        </label>
                        <div className="mt-1 flex items-center">
                          <div className="w-full flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              {imagePreview ? (
                                <div className="mb-4">
                                  <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mx-auto h-32 w-32 object-cover rounded-md"
                                  />
                                </div>
                              ) : (
                                <FileImage className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                              )}
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="image-upload"
                                  className="relative cursor-pointer rounded-md bg-white font-medium text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 hover:text-emerald-500"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="image-upload"
                                    name="image-upload"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                            </div>
                          </div>
                        </div>
                        {errors?.image && (
                          <p className="mt-2 text-sm text-red-600" id="image-error">
                            <AlertCircle className="h-4 w-4 inline mr-1" />
                            {errors.image}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <Link
                    href={route('admin.categories.index')}
                    className="inline-flex justify-center rounded-md bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={processing}
                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-emerald-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Create Category
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

export default Create;
