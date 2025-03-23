import React, { ChangeEvent, FormEventHandler, useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
  ArrowLeft,
  AlertCircle,
  FileImage,
  Type,
  Link as LinkIcon,
  Hash,
  Save,
  CircleCheck
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface Banner {
    id: number;
    title: string;
    image: string;
    link: string | null;
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;
  }

  interface EditBannerProps {
    banner: Banner;
    errors: {
      title?: string;
      image?: string;
      link?: string;
      is_active?: string;
      order?: string;
    };
  }

  const Edit: React.FC<EditBannerProps> = ({ banner, errors }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(
      banner.image ? `/storage/${banner.image}` : null
    );

    const { data, setData, post, processing } = useForm({
      _method: 'PUT',
      title: banner.title || '',
      image: null as File | null,
      link: banner.link || '',
      is_active: banner.is_active,
      order: banner.order || 0,
    });

    const handleSubmit: FormEventHandler = (e) => {
      e.preventDefault();

      const formData = new FormData();

      // Append method for PUT request
      formData.append('_method', 'PUT');

      // Append text fields
      formData.append('title', data.title);
      if (data.link) formData.append('link', data.link);
      formData.append('is_active', data.is_active ? '1' : '0');
      formData.append('order', data.order.toString());

      // Append image if a new one was selected
      if (data.image) {
        formData.append('image', data.image);
      }

      post(route('admin.banners.update', banner.id), formData);
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
      <AdminLayout title={`Edit Banner: ${banner.title}`}>
        <Head title={`Edit Banner: ${banner.title}`} />

        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href={route('admin.banners.index')}
              className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Banners
            </Link>
          </div>

          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Banner</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Update the details of your promotional banner. You can modify its title, link, order, status, and image.
                </p>
                <div className="mt-6">
                  <div className="flex items-center">
                    <CircleCheck className="h-5 w-5 text-emerald-500" />
                    <span className="ml-2 text-sm text-gray-600">All fields marked with * are required</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <CircleCheck className="h-5 w-5 text-emerald-500" />
                    <span className="ml-2 text-sm text-gray-600">Leave the image field empty to keep the current image</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 md:col-span-2 md:mt-0">
              <form onSubmit={handleSubmit}>
                <div className="shadow sm:overflow-hidden sm:rounded-md">
                  <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Banner Title <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Type className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          required
                          className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.title ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          placeholder="Enter banner title"
                          value={data.title}
                          onChange={(e) => setData('title', e.target.value)}
                        />
                      </div>
                      {errors?.title && (
                        <p className="mt-2 text-sm text-red-600" id="title-error">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors.title}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">This is for internal reference and may not be displayed to customers.</p>
                    </div>

                    {/* Link */}
                    <div>
                      <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                        Link URL
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <LinkIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          type="text"
                          id="link"
                          name="link"
                          className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.link ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          placeholder="e.g., https://example.com or /products/category-slug"
                          value={data.link}
                          onChange={(e) => setData('link', e.target.value)}
                        />
                      </div>
                      {errors?.link && (
                        <p className="mt-2 text-sm text-red-600" id="link-error">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors.link}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">Where users will be directed when they click on the banner. Leave empty for non-clickable banners.</p>
                    </div>

                    {/* Order */}
                    <div>
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
                          placeholder="0"
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
                      <p className="mt-1 text-xs text-gray-500">Lower numbers appear first in banner displays.</p>
                    </div>

                    {/* Active Status */}
                    <div>
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
                          <p className="text-gray-500">Display this banner on the store.</p>
                        </div>
                      </div>
                      {errors?.is_active && (
                        <p className="mt-2 text-sm text-red-600" id="is-active-error">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors.is_active}
                        </p>
                      )}
                    </div>

                    {/* Banner Image */}
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                        Banner Image
                      </label>
                      {/* Current Image */}
                      {imagePreview && (
                        <div className="mt-2 mb-4">
                          <p className="text-xs text-gray-500 mb-2">Current Image:</p>
                          <img
                            src={imagePreview}
                            alt="Current banner"
                            className="max-h-64 object-contain rounded-md border border-gray-200"
                          />
                        </div>
                      )}
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <FileImage className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
                          <div className="flex text-sm text-gray-600 justify-center">
                            <label
                              htmlFor="image-upload"
                              className="relative cursor-pointer rounded-md bg-white font-medium text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 hover:text-emerald-500"
                            >
                              <span>Upload a new image</span>
                              <input
                                id="image-upload"
                                name="image"
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
                      {errors?.image && (
                        <p className="mt-2 text-sm text-red-600" id="image-error">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors.image}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">Leave empty to keep the current image.</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <Link
                      href={route('admin.banners.index')}
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
