import React, { FormEventHandler, useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Eye, EyeOff, AlertCircle, ArrowLeft, User, Phone, Lock, MapPin, Building, Home } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface UserEditProps {
  user: {
    id: number;
    name: string;
    phone: string;
    address: string | null;
    city: string | null;
    area: string | null;
  };
  errors: {
    name?: string;
    phone?: string;
    password?: string;
    address?: string;
    city?: string;
    area?: string;
  };
}

const Edit: React.FC<UserEditProps> = ({ user, errors }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, put, processing } = useForm({
    name: user.name || '',
    phone: user.phone || '',
    password: '',
    address: user.address || '',
    city: user.city || '',
    area: user.area || '',
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    put(route('admin.users.update', user.id));
  };

  return (
    <AdminLayout title={`Edit User: ${user.name}`}>
      <Head title={`Edit User: ${user.name}`} />

      <div className="mb-6">
        <Link
          href={route('admin.users.index')}
          className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Users
        </Link>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-3">
              <User className="h-6 w-6" />
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Edit User: {user.name}</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                <User className="h-4 w-4 mr-2 text-emerald-600" />
                Personal Information
              </h4>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                        errors?.name ? 'ring-red-300' : 'ring-gray-300'
                      } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                    />
                  </div>
                  {errors?.name && (
                    <p className="mt-2 text-sm text-red-600" id="name-error">
                      <AlertCircle className="h-4 w-4 inline mr-1" />
                      {errors?.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      required
                      className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                        errors?.phone ? 'ring-red-300' : 'ring-gray-300'
                      } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      placeholder="e.g. +8801XXXXXXXXX"
                    />
                  </div>
                  {errors?.phone && (
                    <p className="mt-2 text-sm text-red-600" id="phone-error">
                      <AlertCircle className="h-4 w-4 inline mr-1" />
                      {errors?.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                <Lock className="h-4 w-4 mr-2 text-emerald-600" />
                Change Password (Optional)
              </h4>
              <p className="text-xs text-gray-500 mb-4">Leave blank to keep the current password</p>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className={`block w-full rounded-md border-0 py-2 pl-10 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ${
                      errors?.password ? 'ring-red-300' : 'ring-gray-300'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                    placeholder="Enter new password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>
                {errors?.password && (
                  <p className="mt-2 text-sm text-red-600" id="password-error">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    {errors?.password}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">New password must be at least 6 characters long.</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-emerald-600" />
                Address Information (Optional)
              </h4>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Street Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Home className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                        errors?.address ? 'ring-red-300' : 'ring-gray-300'
                      } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                      placeholder="Enter street address"
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                    />
                  </div>
                  {errors?.address && (
                    <p className="mt-2 text-sm text-red-600" id="address-error">
                      <AlertCircle className="h-4 w-4 inline mr-1" />
                      {errors?.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                          errors?.city ? 'ring-red-300' : 'ring-gray-300'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                        placeholder="Enter city"
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                      />
                    </div>
                    {errors?.city && (
                      <p className="mt-2 text-sm text-red-600" id="city-error">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        {errors?.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                      Area
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        id="area"
                        name="area"
                        className={`block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                          errors?.area ? 'ring-red-300' : 'ring-gray-300'
                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                        placeholder="Enter area/neighborhood"
                        value={data.area}
                        onChange={(e) => setData('area', e.target.value)}
                      />
                    </div>
                    {errors?.area && (
                      <p className="mt-2 text-sm text-red-600" id="area-error">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        {errors?.area}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <Link
                  href={route('admin.users.index')}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                >
                  {processing ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Edit;
