import React, { FormEventHandler, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  errors: {
    email?: string;
    password?: string;
  };
}

const AdminLogin: React.FC<AdminLoginProps> = ({ errors }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('admin.login'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head title="Admin Login" />

      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <img
              className="h-12 w-auto"
              src="/storage/logo/admin-logo.png"
              alt="Admin Logo"
              onError={(e) => {
                // Fallback if image doesn't exist
                e.currentTarget.src = 'https://tailwindui.com/img/logos/workflow-mark-emerald-600.svg';
              }}
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to access the admin panel
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors?.email ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
              />
              {errors?.email && (
                <div className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors?.email}
                </div>
              )}
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  errors?.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
              {errors?.password && (
                <div className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors?.password}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                checked={data.remember}
                onChange={(e) => setData('remember', e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={processing}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-70"
            >
              {processing ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="text-sm text-center mt-4">
          <span className="text-gray-600">
            Back to
          </span>{' '}
          <a href="/" className="font-medium text-emerald-600 hover:text-emerald-500">
            main site
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
