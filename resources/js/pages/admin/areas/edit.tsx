import React, { FormEventHandler } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
  ArrowLeft,
  AlertCircle,
  MapPin,
  Building,
  DollarSign,
  Save,
  CircleCheck
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface Area {
  id: number;
  name: string;
  city: string;
  is_serviceable: boolean;
  delivery_charge: number;
  created_at: string;
  updated_at: string;
}

interface EditAreaProps {
  area: Area;
  errors: {
    name?: string;
    city?: string;
    is_serviceable?: string;
    delivery_charge?: string;
  };
}

const Edit: React.FC<EditAreaProps> = ({ area, errors }) => {
  const { data, setData, post, processing } = useForm({
    _method: 'PUT',
    name: area.name || '',
    city: area.city || '',
    is_serviceable: area.is_serviceable,
    delivery_charge: area.delivery_charge || 0,
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('admin.areas.update', area.id));
  };

  return (
    <AdminLayout title={`Edit Area: ${area.name}, ${area.city}`}>
      <Head title={`Edit Area: ${area.name}, ${area.city}`} />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={route('admin.areas.index')}
            className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Areas
          </Link>
        </div>

        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Edit Delivery Area</h3>
              <p className="mt-1 text-sm text-gray-600">
                Update the details for this delivery area. Changes will be reflected immediately in the customer checkout process.
              </p>
              <div className="mt-6">
                <div className="flex items-center">
                  <CircleCheck className="h-5 w-5 text-emerald-500" />
                  <span className="ml-2 text-sm text-gray-600">All fields marked with * are required</span>
                </div>
                <div className="flex items-center mt-2">
                  <CircleCheck className="h-5 w-5 text-emerald-500" />
                  <span className="ml-2 text-sm text-gray-600">Non-serviceable areas won't be available for delivery</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 md:col-span-2 md:mt-0">
            <form onSubmit={handleSubmit}>
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                          errors?.city ? 'ring-red-300' : 'ring-gray-300'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                        placeholder="Enter city name"
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                      />
                    </div>
                    {errors?.city && (
                      <p className="mt-2 text-sm text-red-600" id="city-error">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  {/* Area Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Area Name <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                          errors?.name ? 'ring-red-300' : 'ring-gray-300'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                        placeholder="Enter area name"
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
                    <p className="mt-1 text-xs text-gray-500">
                      Examples: "Gulshan", "Banani", "Dhanmondi", etc.
                    </p>
                  </div>

                  {/* Delivery Charge */}
                  <div>
                    <label htmlFor="delivery_charge" className="block text-sm font-medium text-gray-700">
                      Delivery Charge <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="number"
                        id="delivery_charge"
                        name="delivery_charge"
                        step="0.01"
                        min="0"
                        required
                        className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                          errors?.delivery_charge ? 'ring-red-300' : 'ring-gray-300'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                        placeholder="0.00"
                        value={data.delivery_charge}
                        onChange={(e) => setData('delivery_charge', parseFloat(e.target.value))}
                      />
                    </div>
                    {errors?.delivery_charge && (
                      <p className="mt-2 text-sm text-red-600" id="delivery-charge-error">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        {errors.delivery_charge}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Set to 0 for free delivery to this area.
                    </p>
                  </div>

                  {/* Serviceable Status */}
                  <div>
                    <div className="flex items-start">
                      <div className="flex h-6 items-center">
                        <input
                          id="is_serviceable"
                          name="is_serviceable"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                          checked={data.is_serviceable}
                          onChange={(e) => setData('is_serviceable', e.target.checked)}
                        />
                      </div>
                      <div className="ml-3 text-sm leading-6">
                        <label htmlFor="is_serviceable" className="font-medium text-gray-900">
                          Serviceable
                        </label>
                        <p className="text-gray-500">This area is available for delivery.</p>
                      </div>
                    </div>
                    {errors?.is_serviceable && (
                      <p className="mt-2 text-sm text-red-600" id="is-serviceable-error">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        {errors.is_serviceable}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <Link
                    href={route('admin.areas.index')}
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
