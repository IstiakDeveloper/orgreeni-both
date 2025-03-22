import React, { FormEventHandler, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, AlertCircle, User, Mail, Key } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface ProfileProps {
  admin: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  errors: {
    name?: string;
    email?: string;
    current_password?: string;
    password?: string;
    password_confirmation?: string;
  };
}

const Profile: React.FC<ProfileProps> = ({ admin, errors }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, setData, patch, processing, reset, recentlySuccessful } = useForm({
    name: admin.name || '',
    email: admin.email || '',
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const toggleShowCurrentPassword = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const updateProfile: FormEventHandler = (e) => {
    e.preventDefault();
    patch(route('admin.profile.update'), {
      onSuccess: () => {
        if (!errors) {
          reset('current_password', 'password', 'password_confirmation');
        }
      },
    });
  };

  return (
    <AdminLayout title="Profile">
      <Head title="Profile" />

      <div className="py-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex-shrink-0 h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
                  {admin.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{admin.name}</h3>
                  <p className="text-sm text-gray-500">{admin.email}</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 mt-1">
                    {admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}
                  </span>
                </div>
              </div>

              <form onSubmit={updateProfile} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`block w-full pl-10 sm:text-sm rounded-md focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={data.name}
                      onChange={e => setData('name', e.target.value)}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" /> {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`block w-full pl-10 sm:text-sm rounded-md focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={data.email}
                      onChange={e => setData('email', e.target.value)}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" /> {errors.email}
                    </p>
                  )}
                </div>

                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Leave the password fields empty if you don't want to change your password.
                  </p>
                </div>

                <div>
                  <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      id="current_password"
                      name="current_password"
                      className={`block w-full pl-10 sm:text-sm rounded-md focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.current_password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={data.current_password}
                      onChange={e => setData('current_password', e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={toggleShowCurrentPassword}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <Eye className="h-5 w-5" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                  </div>
                  {errors.current_password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" /> {errors.current_password}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className={`block w-full pl-10 sm:text-sm rounded-md focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                      value={data.password}
                      onChange={e => setData('password', e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={toggleShowPassword}
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
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" /> {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="password_confirmation"
                      name="password_confirmation"
                      className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                      value={data.password_confirmation}
                      onChange={e => setData('password_confirmation', e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={toggleShowConfirmPassword}
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

                <div className="flex items-center justify-end">
                  {recentlySuccessful && (
                    <p className="text-sm text-green-600 mr-3">Saved successfully.</p>
                  )}
                  <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                  >
                    {processing ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Profile;
