import React, { FormEventHandler, useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
  ArrowLeft,
  AlertCircle,
  Ticket,
  DollarSign,
  Percent,
  Calendar,
  Hash,
  CheckCircle,
  CircleCheck,
  RefreshCw
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface CreateCouponProps {
  errors: {
    code?: string;
    type?: string;
    value?: string;
    min_order_amount?: string;
    starts_at?: string;
    expires_at?: string;
    is_active?: string;
    usage_limit?: string;
  };
}

const Create: React.FC<CreateCouponProps> = ({ errors }) => {
  const [usageLimit, setUsageLimit] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<boolean>(false);

  const { data, setData, post, processing } = useForm({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: '' as unknown as number,
    min_order_amount: '' as unknown as number,
    starts_at: '',
    expires_at: '',
    is_active: true,
    usage_limit: '' as unknown as number,
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    // Clear empty fields to avoid validation issues
    const formData = { ...data };
    if (!dateRange) {
      formData.starts_at = '';
      formData.expires_at = '';
    }
    if (!usageLimit) {
      formData.usage_limit = '';
    }
    if (!formData.min_order_amount) {
      formData.min_order_amount = '';
    }

    post(route('admin.coupons.store'), formData);
  };

  // Generate a random coupon code
  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setData('code', code);
  };

  return (
    <AdminLayout title="Create Coupon">
      <Head title="Create Coupon" />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={route('admin.coupons.index')}
            className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Coupons
          </Link>
        </div>

        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Create Coupon</h3>
              <p className="mt-1 text-sm text-gray-600">
                Add a new discount coupon for your customers. Set the discount amount, validity period, and usage limits.
              </p>
              <div className="mt-6">
                <div className="flex items-center">
                  <CircleCheck className="h-5 w-5 text-emerald-500" />
                  <span className="ml-2 text-sm text-gray-600">All fields marked with * are required</span>
                </div>
                <div className="flex items-center mt-2">
                  <CircleCheck className="h-5 w-5 text-emerald-500" />
                  <span className="ml-2 text-sm text-gray-600">For percentage discounts, max value is 100%</span>
                </div>
                <div className="flex items-center mt-2">
                  <CircleCheck className="h-5 w-5 text-emerald-500" />
                  <span className="ml-2 text-sm text-gray-600">Set date ranges and usage limits if needed</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 md:col-span-2 md:mt-0">
            <form onSubmit={handleSubmit}>
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  {/* Coupon Code */}
                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                      Coupon Code <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Ticket className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          type="text"
                          id="code"
                          name="code"
                          required
                          className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.code ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 uppercase`}
                          placeholder="SUMMER25"
                          value={data.code}
                          onChange={(e) => setData('code', e.target.value.toUpperCase())}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={generateCouponCode}
                        className="ml-3 inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Generate
                      </button>
                    </div>
                    {errors?.code && (
                      <p className="mt-2 text-sm text-red-600" id="code-error">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        {errors.code}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Code should be unique and easy to remember. Upper case letters and numbers only.
                    </p>
                  </div>

                  {/* Discount Type and Value */}
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    {/* Discount Type */}
                    <div>
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Discount Type <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <select
                          id="type"
                          name="type"
                          required
                          className={`block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.type ? 'ring-red-300' : 'ring-gray-300'
                          } focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          value={data.type}
                          onChange={(e) => setData('type', e.target.value as 'percentage' | 'fixed')}
                        >
                          <option value="percentage">Percentage Discount (%)</option>
                          <option value="fixed">Fixed Amount Discount ($)</option>
                        </select>
                      </div>
                      {errors?.type && (
                        <p className="mt-2 text-sm text-red-600" id="type-error">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors.type}
                        </p>
                      )}
                    </div>

                    {/* Discount Value */}
                    <div>
                      <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                        Discount Value <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          {data.type === 'percentage' ? (
                            <Percent className="h-5 w-5 text-gray-400" />
                          ) : (
                            <DollarSign className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <input
                          type="number"
                          id="value"
                          name="value"
                          step={data.type === 'percentage' ? '1' : '0.01'}
                          min="0"
                          max={data.type === 'percentage' ? '100' : undefined}
                          required
                          className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.value ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          placeholder={data.type === 'percentage' ? '25' : '10.00'}
                          value={data.value || ''}
                          onChange={(e) => setData('value', parseFloat(e.target.value))}
                        />
                      </div>
                      {errors?.value && (
                        <p className="mt-2 text-sm text-red-600" id="value-error">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors.value}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        {data.type === 'percentage'
                          ? 'Value must be between 1 and 100%'
                          : 'Enter the fixed discount amount'}
                      </p>
                    </div>
                  </div>

                  {/* Minimum Order Amount */}
                  <div>
                    <label htmlFor="min_order_amount" className="block text-sm font-medium text-gray-700">
                      Minimum Order Amount
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="number"
                        id="min_order_amount"
                        name="min_order_amount"
                        step="0.01"
                        min="0"
                        className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                          errors?.min_order_amount ? 'ring-red-300' : 'ring-gray-300'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                        placeholder="0.00"
                        value={data.min_order_amount || ''}
                        onChange={(e) => setData('min_order_amount', e.target.value ? parseFloat(e.target.value) : '')}
                      />
                    </div>
                    {errors?.min_order_amount && (
                      <p className="mt-2 text-sm text-red-600" id="min-order-error">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        {errors.min_order_amount}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Leave empty if there's no minimum order amount required.
                    </p>
                  </div>

                  {/* Date Range Toggle */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="date-range-toggle"
                          name="date-range-toggle"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                          checked={dateRange}
                          onChange={(e) => setDateRange(e.target.checked)}
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label htmlFor="date-range-toggle" className="font-medium text-gray-900">
                          Set Validity Period
                        </label>
                        <p className="text-gray-500">Specify when this coupon starts and expires.</p>
                      </div>
                    </div>
                  </div>

                  {/* Start and End Dates */}
                  {dateRange && (
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      {/* Start Date */}
                      <div>
                        <label htmlFor="starts_at" className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <input
                            type="date"
                            id="starts_at"
                            name="starts_at"
                            className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                              errors?.starts_at ? 'ring-red-300' : 'ring-gray-300'
                            } focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                            value={data.starts_at}
                            onChange={(e) => setData('starts_at', e.target.value)}
                          />
                        </div>
                        {errors?.starts_at && (
                          <p className="mt-2 text-sm text-red-600" id="starts-at-error">
                            <AlertCircle className="h-4 w-4 inline mr-1" />
                            {errors.starts_at}
                          </p>
                        )}
                      </div>

                      {/* End Date */}
                      <div>
                        <label htmlFor="expires_at" className="block text-sm font-medium text-gray-700">
                          Expiry Date
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </div>
                          <input
                            type="date"
                            id="expires_at"
                            name="expires_at"
                            className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                              errors?.expires_at ? 'ring-red-300' : 'ring-gray-300'
                            } focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                            value={data.expires_at}
                            onChange={(e) => setData('expires_at', e.target.value)}
                          />
                        </div>
                        {errors?.expires_at && (
                          <p className="mt-2 text-sm text-red-600" id="expires-at-error">
                            <AlertCircle className="h-4 w-4 inline mr-1" />
                            {errors.expires_at}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Usage Limit Toggle */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="usage-limit-toggle"
                          name="usage-limit-toggle"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                          checked={usageLimit}
                          onChange={(e) => setUsageLimit(e.target.checked)}
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label htmlFor="usage-limit-toggle" className="font-medium text-gray-900">
                          Set Usage Limit
                        </label>
                        <p className="text-gray-500">Limit how many times this coupon can be used.</p>
                      </div>
                    </div>
                  </div>

                  {/* Usage Limit */}
                  {usageLimit && (
                    <div>
                      <label htmlFor="usage_limit" className="block text-sm font-medium text-gray-700">
                        Maximum Uses
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Hash className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          type="number"
                          id="usage_limit"
                          name="usage_limit"
                          min="1"
                          className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                            errors?.usage_limit ? 'ring-red-300' : 'ring-gray-300'
                          } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                          placeholder="100"
                          value={data.usage_limit || ''}
                          onChange={(e) => setData('usage_limit', e.target.value ? parseInt(e.target.value) : '')}
                        />
                      </div>
                      {errors?.usage_limit && (
                        <p className="mt-2 text-sm text-red-600" id="usage-limit-error">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors.usage_limit}
                        </p>
                      )}
                    </div>
                  )}

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
                        <p className="text-gray-500">This coupon is available for use.</p>
                      </div>
                    </div>
                    {errors?.is_active && (
                      <p className="mt-2 text-sm text-red-600" id="is-active-error">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        {errors.is_active}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <Link
                    href={route('admin.coupons.index')}
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
                        Create Coupon
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
