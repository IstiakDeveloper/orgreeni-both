import React, { useState, FormEventHandler, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import {
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Hash,
  DollarSign,
  Percent,
  Facebook,
  Twitter,
  Instagram,
  AlertCircle,
  Save,
  FileImage,
  Info
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

type Settings = {
  store_name: string;
  store_email: string;
  store_phone: string;
  store_address: string;
  store_city: string;
  store_country: string;
  store_zip: string;
  meta_title: string;
  meta_description: string;
  logo: string | null;
  favicon: string | null;
  currency: string;
  currency_symbol: string;
  tax_percentage: number;
  free_shipping_threshold: number;
  social_facebook: string;
  social_twitter: string;
  social_instagram: string;
  about_us: string;
  privacy_policy: string;
  terms_conditions: string;
  return_policy: string;
  shipping_policy: string;
};

interface SettingsProps {
  settings: Settings;
  errors: Record<string, string>;
}

const Index = ({ settings, errors }: SettingsProps) => {
  const [activeTab, setActiveTab] = useState('general');
  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);

  const { data, setData, patch, processing } = useForm({
    store_name: settings.store_name,
    store_email: settings.store_email,
    store_phone: settings.store_phone,
    store_address: settings.store_address,
    store_city: settings.store_city,
    store_country: settings.store_country,
    store_zip: settings.store_zip,
    meta_title: settings.meta_title,
    meta_description: settings.meta_description,
    logo: null as File | null,
    favicon: null as File | null,
    currency: settings.currency,
    currency_symbol: settings.currency_symbol,
    tax_percentage: settings.tax_percentage,
    free_shipping_threshold: settings.free_shipping_threshold,
    social_facebook: settings.social_facebook,
    social_twitter: settings.social_twitter,
    social_instagram: settings.social_instagram,
    about_us: settings.about_us,
    privacy_policy: settings.privacy_policy,
    terms_conditions: settings.terms_conditions,
    return_policy: settings.return_policy,
    shipping_policy: settings.shipping_policy,
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();

    // We don't need to append _method for Inertia.patch - it's handled automatically

    // Append all text fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'logo' && key !== 'favicon' && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Append files if they exist
    if (data.logo) {
      formData.append('logo', data.logo);
    }

    if (data.favicon) {
      formData.append('favicon', data.favicon);
    }

    patch(route('admin.settings.update'), formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'favicon') => {
    if (e.target.files && e.target.files[0]) {
      setData(field, e.target.files[0]);
    }
  };

  return (
    <AdminLayout title="Store Settings">
      <Head title="Store Settings" />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Store Settings</h1>
          <p className="mt-1 text-sm text-gray-600">
            Configure your store details, appearance, and policies.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {[
              { id: 'general', name: 'General' },
              { id: 'appearance', name: 'Appearance' },
              { id: 'seo', name: 'SEO' },
              { id: 'financial', name: 'Financial' },
              { id: 'social', name: 'Social Media' },
              { id: 'pages', name: 'Pages' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  ${activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit}>
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Store Information</h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* Store Name */}
                    <div className="sm:col-span-3">
                      <label htmlFor="store_name" className="block text-sm font-medium text-gray-700">
                        Store Name <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="store_name"
                          name="store_name"
                          required
                          className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.store_name ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          value={data.store_name}
                          onChange={(e) => setData('store_name', e.target.value)}
                        />
                      </div>
                      {errors?.store_name && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.store_name}
                        </p>
                      )}
                    </div>

                    {/* Store Email */}
                    <div className="sm:col-span-3">
                      <label htmlFor="store_email" className="block text-sm font-medium text-gray-700">
                        Store Email <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="store_email"
                          name="store_email"
                          required
                          className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.store_email ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          value={data.store_email}
                          onChange={(e) => setData('store_email', e.target.value)}
                        />
                      </div>
                      {errors?.store_email && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.store_email}
                        </p>
                      )}
                    </div>

                    {/* Store Phone */}
                    <div className="sm:col-span-3">
                      <label htmlFor="store_phone" className="block text-sm font-medium text-gray-700">
                        Store Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="store_phone"
                          name="store_phone"
                          required
                          className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.store_phone ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          value={data.store_phone}
                          onChange={(e) => setData('store_phone', e.target.value)}
                        />
                      </div>
                      {errors?.store_phone && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.store_phone}
                        </p>
                      )}
                    </div>

                    {/* Store Address */}
                    <div className="sm:col-span-6">
                      <label htmlFor="store_address" className="block text-sm font-medium text-gray-700">
                        Store Address <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="store_address"
                          name="store_address"
                          required
                          className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.store_address ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          value={data.store_address}
                          onChange={(e) => setData('store_address', e.target.value)}
                        />
                      </div>
                      {errors?.store_address && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.store_address}
                        </p>
                      )}
                    </div>

                    {/* Store City */}
                    <div className="sm:col-span-2">
                      <label htmlFor="store_city" className="block text-sm font-medium text-gray-700">
                        City <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="store_city"
                          name="store_city"
                          required
                          className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.store_city ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          value={data.store_city}
                          onChange={(e) => setData('store_city', e.target.value)}
                        />
                      </div>
                      {errors?.store_city && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.store_city}
                        </p>
                      )}
                    </div>

                    {/* Store Country */}
                    <div className="sm:col-span-2">
                      <label htmlFor="store_country" className="block text-sm font-medium text-gray-700">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="store_country"
                          name="store_country"
                          required
                          className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.store_country ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          value={data.store_country}
                          onChange={(e) => setData('store_country', e.target.value)}
                        />
                      </div>
                      {errors?.store_country && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.store_country}
                        </p>
                      )}
                    </div>

                    {/* Store ZIP */}
                    <div className="sm:col-span-2">
                      <label htmlFor="store_zip" className="block text-sm font-medium text-gray-700">
                        ZIP / Postal Code <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Hash className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="store_zip"
                          name="store_zip"
                          required
                          className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.store_zip ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          value={data.store_zip}
                          onChange={(e) => setData('store_zip', e.target.value)}
                        />
                      </div>
                      {errors?.store_zip && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.store_zip}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Store Appearance</h3>
                  <div className="mt-6 space-y-6">
                    {/* Store Logo */}
                    <div>
                      <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                        Store Logo
                      </label>
                      <div className="mt-2 flex items-center">
                        {settings.logo && (
                          <div className="mr-4">
                            <img
                              src={`/storage/${settings.logo}`}
                              alt="Store logo"
                              className="h-16 w-auto object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="logo-upload"
                              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <FileImage className="w-8 h-8 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                              </div>
                              <input
                                id="logo-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={logoRef}
                                onChange={(e) => handleFileChange(e, 'logo')}
                              />
                            </label>
                          </div>
                          {errors?.logo && (
                            <p className="mt-2 text-sm text-red-600">
                              <AlertCircle className="h-4 w-4 inline mr-1" />
                              {errors?.logo}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-gray-500">
                            Recommended size: 200x60 pixels. Will be displayed in the header of your store.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Store Favicon */}
                    <div>
                      <label htmlFor="favicon" className="block text-sm font-medium text-gray-700">
                        Favicon
                      </label>
                      <div className="mt-2 flex items-center">
                        {settings.favicon && (
                          <div className="mr-4">
                            <img
                              src={`/storage/${settings.favicon}`}
                              alt="Favicon"
                              className="h-8 w-auto object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-center w-full">
                            <label
                              htmlFor="favicon-upload"
                              className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <FileImage className="w-6 h-6 mb-2 text-gray-400" />
                                <p className="mb-1 text-sm text-gray-500">
                                  <span className="font-semibold">Upload favicon</span>
                                </p>
                                <p className="text-xs text-gray-500">ICO, PNG (MAX. 1MB)</p>
                              </div>
                              <input
                                id="favicon-upload"
                                type="file"
                                accept="image/x-icon,image/png,image/gif"
                                className="hidden"
                                ref={faviconRef}
                                onChange={(e) => handleFileChange(e, 'favicon')}
                              />
                            </label>
                          </div>
                          {errors?.favicon && (
                            <p className="mt-2 text-sm text-red-600">
                              <AlertCircle className="h-4 w-4 inline mr-1" />
                              {errors?.favicon}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-gray-500">
                            Recommended size: 32x32 pixels. Will be displayed in browser tabs.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO Settings */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">SEO Settings</h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
                    {/* Meta Title */}
                    <div>
                      <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700">
                        Meta Title <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="meta_title"
                          name="meta_title"
                          required
                          className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.meta_title ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          value={data.meta_title}
                          onChange={(e) => setData('meta_title', e.target.value)}
                        />
                      </div>
                      {errors?.meta_title && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.meta_title}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        The title that appears in search engine results (recommended: 50-60 characters).
                      </p>
                    </div>

                    {/* Meta Description */}
                    <div>
                      <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700">
                        Meta Description <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="meta_description"
                          name="meta_description"
                          rows={3}
                          required
                          className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.meta_description ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          value={data.meta_description}
                          onChange={(e) => setData('meta_description', e.target.value)}
                        />
                      </div>
                      {errors?.meta_description && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.meta_description}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        The description that appears in search engine results (recommended: 150-160 characters).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Settings */}
          {activeTab === 'financial' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Financial Settings</h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* Currency */}
                    <div className="sm:col-span-2">
                      <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                        Currency <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="currency"
                          name="currency"
                          required
                          className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.currency ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          placeholder="USD"
                          value={data.currency}
                          onChange={(e) => setData('currency', e.target.value)}
                        />
                      </div>
                      {errors?.currency && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.currency}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Currency code (e.g., USD, EUR, GBP).
                      </p>
                    </div>

                    {/* Currency Symbol */}
                    <div className="sm:col-span-2">
                      <label htmlFor="currency_symbol" className="block text-sm font-medium text-gray-700">
                        Currency Symbol <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="text"
                          id="currency_symbol"
                          name="currency_symbol"
                          required
                          className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.currency_symbol ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          placeholder="$"
                          value={data.currency_symbol}
                          onChange={(e) => setData('currency_symbol', e.target.value)}
                        />
                      </div>
                      {errors?.currency_symbol && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.currency_symbol}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Currency symbol (e.g., $, €, £).
                      </p>
                    </div>

                    {/* Tax Percentage */}
                    <div className="sm:col-span-2">
                      <label htmlFor="tax_percentage" className="block text-sm font-medium text-gray-700">
                        Tax Percentage <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Percent className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="tax_percentage"
                          name="tax_percentage"
                          min="0"
                          max="100"
                          step="0.01"
                          required
                          className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.tax_percentage ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          placeholder="0"
                          value={data.tax_percentage}
                          onChange={(e) => setData('tax_percentage', parseFloat(e.target.value))}
                        />
                      </div>
                      {errors?.tax_percentage && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.tax_percentage}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Default tax rate applied to products.
                      </p>
                    </div>

                    {/* Free Shipping Threshold */}
                    <div className="sm:col-span-3">
                      <label htmlFor="free_shipping_threshold" className="block text-sm font-medium text-gray-700">
                        Free Shipping Threshold <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="free_shipping_threshold"
                          name="free_shipping_threshold"
                          min="0"
                          step="0.01"
                          required
                          className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.free_shipping_threshold ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          placeholder="0"
                          value={data.free_shipping_threshold}
                          onChange={(e) => setData('free_shipping_threshold', parseFloat(e.target.value))}
                        />
                      </div>
                      {errors?.free_shipping_threshold && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.free_shipping_threshold}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Minimum order amount for free shipping. Set to 0 for no free shipping option.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Media Settings */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Social Media</h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4">
                    {/* Facebook */}
                    <div>
                      <label htmlFor="social_facebook" className="block text-sm font-medium text-gray-700">
                        Facebook URL
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Facebook className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="url"
                          id="social_facebook"
                          name="social_facebook"
                          className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.social_facebook ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          placeholder="https://facebook.com/yourstorepage"
                          value={data.social_facebook}
                          onChange={(e) => setData('social_facebook', e.target.value)}
                        />
                      </div>
                      {errors?.social_facebook && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.social_facebook}
                        </p>
                      )}
                    </div>

                    {/* Twitter */}
                    <div>
                      <label htmlFor="social_twitter" className="block text-sm font-medium text-gray-700">
                        Twitter URL
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Twitter className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="url"
                          id="social_twitter"
                          name="social_twitter"
                          className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.social_twitter ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          placeholder="https://twitter.com/yourstorename"
                          value={data.social_twitter}
                          onChange={(e) => setData('social_twitter', e.target.value)}
                        />
                      </div>
                      {errors?.social_twitter && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.social_twitter}
                        </p>
                      )}
                    </div>

                    {/* Instagram */}
                    <div>
                      <label htmlFor="social_instagram" className="block text-sm font-medium text-gray-700">
                        Instagram URL
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Instagram className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="url"
                          id="social_instagram"
                          name="social_instagram"
                          className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.social_instagram ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          placeholder="https://instagram.com/yourstorename"
                          value={data.social_instagram}
                          onChange={(e) => setData('social_instagram', e.target.value)}
                        />
                      </div>
                      {errors?.social_instagram && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.social_instagram}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Page Content Settings */}
          {activeTab === 'pages' && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Page Content</h3>
                  <div className="mt-6 space-y-8">
                    {/* About Us */}
                    <div>
                      <label htmlFor="about_us" className="block text-sm font-medium text-gray-700">
                        About Us Page
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="about_us"
                          name="about_us"
                          rows={10}
                          className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.about_us ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          value={data.about_us}
                          onChange={(e) => setData('about_us', e.target.value)}
                        />
                      </div>
                      {errors?.about_us && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.about_us}
                        </p>
                      )}
                    </div>

                    {/* Privacy Policy */}
                    <div>
                      <label htmlFor="privacy_policy" className="block text-sm font-medium text-gray-700">
                        Privacy Policy
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="privacy_policy"
                          name="privacy_policy"
                          rows={10}
                          className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.privacy_policy ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          value={data.privacy_policy}
                          onChange={(e) => setData('privacy_policy', e.target.value)}
                        />
                      </div>
                      {errors?.privacy_policy && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.privacy_policy}
                        </p>
                      )}
                    </div>

                    {/* Terms & Conditions */}
                    <div>
                      <label htmlFor="terms_conditions" className="block text-sm font-medium text-gray-700">
                        Terms & Conditions
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="terms_conditions"
                          name="terms_conditions"
                          rows={10}
                          className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.terms_conditions ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          value={data.terms_conditions}
                          onChange={(e) => setData('terms_conditions', e.target.value)}
                        />
                      </div>
                      {errors?.terms_conditions && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.terms_conditions}
                        </p>
                      )}
                    </div>

                    {/* Return Policy */}
                    <div>
                      <label htmlFor="return_policy" className="block text-sm font-medium text-gray-700">
                        Return Policy
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="return_policy"
                          name="return_policy"
                          rows={10}
                          className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.return_policy ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          value={data.return_policy}
                          onChange={(e) => setData('return_policy', e.target.value)}
                        />
                      </div>
                      {errors?.return_policy && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.return_policy}
                        </p>
                      )}
                    </div>

                    {/* Shipping Policy */}
                    <div>
                      <label htmlFor="shipping_policy" className="block text-sm font-medium text-gray-700">
                        Shipping Policy
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="shipping_policy"
                          name="shipping_policy"
                          rows={10}
                          className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.shipping_policy ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          value={data.shipping_policy}
                          onChange={(e) => setData('shipping_policy', e.target.value)}
                        />
                      </div>
                      {errors?.shipping_policy && (
                        <p className="mt-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors?.shipping_policy}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="bg-white shadow rounded-lg overflow-hidden mt-6">
            <div className="px-4 py-5 sm:p-6 flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Info className="h-5 w-5 mr-2 text-gray-400" />
                <span>All changes will be applied immediately</span>
              </div>
              <button
                type="submit"
                disabled={processing}
                className="inline-flex justify-center rounded-md border border-transparent bg-emerald-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
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
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Index;
