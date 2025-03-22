import React, { FormEventHandler, useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';

interface AdminEditProps {
  admin: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  errors: {
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
    role?: string;
  };
}

const Edit: React.FC<AdminEditProps> = ({ admin, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, setData, put, processing } = useForm({
    name: admin.name || '',
    email: admin.email || '',
    password: '',
    password_confirmation: '',
    role: admin.role || 'editor',
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    put(route('admin.admins.update', admin.id));
  };

  return (
    <AdminLayout title={`Edit Admin: ${admin.name}`}>
      <Head title={`Edit Admin: ${admin.name}`} />

      <div className="mb-6">
        <Link
          href={route('admin.admins.index')}
          className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Admin Users
        </Link>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Admin User</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  className={`shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.email ? 'border-red-300' : ''
                  }`}
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <h4 className="text-sm font-medium text-gray-700">Change Password (Optional)</h4>
              <p className="text-xs text-gray-500 mt-1">Leave blank to keep the current password</p>
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

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <div className="mt-1">
                <select
                  id="role"
                  name="role"
                  className={`shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    errors.role ? 'border-red-300' : ''
                  }`}
                  value={data.role}
                  onChange={(e) => setData('role', e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                </select>
                {errors.role && (
                  <p className="mt-2 text-sm text-red-600" id="role-error">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    {errors.role}
                  </p>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Admin roles have full access to the system. Editor roles have limited access.
              </p>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <Link
                  href={route('admin.admins.index')}
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
