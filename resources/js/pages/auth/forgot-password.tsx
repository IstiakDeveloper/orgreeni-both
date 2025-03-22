import React, { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import GuestLayout from '@/layouts/GuestLayout';

interface ForgotPasswordProps {
  errors: {
    phone?: string;
  };
  success?: string;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ errors, success }) => {
  const { data, setData, post, processing } = useForm({
    phone: '',
  });

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('password.email'));
  };

  return (
    <GuestLayout>
      <Head title="Forgot Password" />
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your phone number and we'll send you a verification code to reset your password.
          </p>
          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                Phone Number
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  required
                  className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                    errors.phone ? 'ring-red-300' : 'ring-gray-300'
                  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                  placeholder="Enter your registered phone number"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                />
                {errors.phone && (
                  <div className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.phone}
                  </div>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={processing}
                className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-70"
              >
                {processing ? 'Sending...' : 'Send Reset Code'}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Remember your password?{' '}
            <Link
              href={route('login')}
              className="font-semibold leading-6 text-emerald-600 hover:text-emerald-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </GuestLayout>
  );
};

export default ForgotPassword;
