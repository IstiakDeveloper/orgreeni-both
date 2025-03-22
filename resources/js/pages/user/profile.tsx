import React, { FormEventHandler, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, AlertCircle, User, Phone, MapPin, Check } from 'lucide-react';
import ShopLayout from '@/layouts/ShopLayout';

interface ProfileProps {
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
    password_confirmation?: string;
    address?: string;
    city?: string;
    area?: string;
  };
}

const Profile: React.FC<ProfileProps> = ({ user, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, setData, patch, processing, recentlySuccessful, reset } = useForm({
    name: user.name || '',
    phone: user.phone || '',
    password: '',
    password_confirmation: '',
    address: user.address || '',
    city: user.city || '',
    area: user.area || '',
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const updateProfile: FormEventHandler = (e) => {
    e.preventDefault();
    patch(route('user.profile.update'), {
      onSuccess: () => {
        if (!errors) {
          reset('password', 'password_confirmation');
        }
      },
    });
  };

  return (
    <ShopLayout>
      <Head title="My Profile" />

      <div className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-1 text-sm text-gray-600">
              Update your account information and preferences.
            </p>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={updateProfile} className="space-y-6">
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2 text-emerald-500" />
                    Personal Information
                  </h3>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className={`shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.name ? 'border-red-300' : ''
                      }`}
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-600" id="name-error">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      required
                      className={`shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.phone ? 'border-red-300' : ''
                      }`}
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                    />
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-600" id="phone-error">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-t border-b border-gray-200 py-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-emerald-500" />
                    Delivery Address
                  </h3>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Street Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className={`shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.address ? 'border-red-300' : ''
                      }`}
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                    />
                    {errors.address && (
                      <p className="mt-2 text-sm text-red-600" id="address-error">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        {errors.address}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="city"
                        name="city"
                        className={`shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          errors.city ? 'border-red-300' : ''
                        }`}
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                      />
                      {errors.city && (
                        <p className="mt-2 text-sm text-red-600" id="city-error">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors.city}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                      Area
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="area"
                        name="area"
                        className={`shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                          errors.area ? 'border-red-300' : ''
                        }`}
                        value={data.area}
                        onChange={(e) => setData('area', e.target.value)}
                      />
                      {errors.area && (
                        <p className="mt-2 text-sm text-red-600" id="area-error">
                          <AlertCircle className="h-4 w-4 inline mr-1" />
                          {errors.area}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-b border-gray-200 py-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-emerald-500" />
                    Change Password
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Leave blank if you don't want to change your password.
                  </p>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className={`shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                        errors.password ? 'border-red-300' : ''
                      }`}
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
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600" id="password-error">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="password_confirmation"
                      name="password_confirmation"
                      className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={data.password_confirmation}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <Eye className="h-5 w-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-5 flex justify-end items-center">
                  {recentlySuccessful && (
                    <span className="mr-3 text-sm text-green-600 flex items-center">
                      <Check className="h-4 w-4 mr-1" />
                      Profile updated successfully
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                  >
                    {processing ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
};

export default Profile;
