import React, { FormEventHandler, useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import GuestLayout from '@/layouts/GuestLayout';

interface OtpLoginProps {
  errors: {
    phone?: string;
    otp?: string;
  };
  success?: string;
}

const OtpLogin: React.FC<OtpLoginProps> = ({ errors, success }) => {
  const [otpSent, setOtpSent] = useState(false);

  const { data: phoneData, setData: setPhoneData, post: postPhone, processing: processingPhone } = useForm({
    phone: '',
  });

  const { data: otpData, setData: setOtpData, post: postOtp, processing: processingOtp } = useForm({
    phone: '',
    otp: '',
    remember: false,
  });

  const handleSendOtp: FormEventHandler = (e) => {
    e.preventDefault();
    postPhone(route('login.otp.send'), {
      onSuccess: () => {
        setOtpSent(true);
        setOtpData('phone', phoneData.phone);
      },
    });
  };

  const handleVerifyOtp: FormEventHandler = (e) => {
    e.preventDefault();
    postOtp(route('login.otp.verify'));
  };

  const handleResendOtp = () => {
    postPhone(route('login.otp.send'), {
      preserveState: true,
    });
  };

  return (
    <GuestLayout>
      <Head title="Login with OTP" />
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {otpSent ? 'Enter Verification Code' : 'Login with OTP'}
          </h2>
          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {!otpSent ? (
            // Phone Number Form
            <form className="space-y-6" onSubmit={handleSendOtp}>
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
                      errors?.phone ? 'ring-red-300' : 'ring-gray-300'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                    placeholder="Enter your registered phone number"
                    value={phoneData?.phone}
                    onChange={(e) => setPhoneData('phone', e.target.value)}
                  />
                  {errors?.phone && (
                    <div className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors?.phone}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={processingPhone}
                  className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-70"
                >
                  {processingPhone ? 'Sending...' : 'Send OTP'}
                </button>
              </div>
            </form>
          ) : (
            // OTP Verification Form
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium leading-6 text-gray-900">
                  Verification Code
                </label>
                <div className="mt-2">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                      errors?.otp ? 'ring-red-300' : 'ring-gray-300'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                    placeholder="Enter 6-digit verification code"
                    value={otpData?.otp}
                    onChange={(e) => setOtpData('otp', e.target.value)}
                  />
                  <input type="hidden" name="phone" value={otpData?.phone} />
                  {errors?.otp && (
                    <div className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors?.otp}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                  checked={otpData.remember}
                  onChange={(e) => setOtpData('remember', e.target.checked)}
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={processingOtp}
                  className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-70"
                >
                  {processingOtp ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>

              <div className="flex items-center justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Change phone number
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={processingPhone}
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-500 disabled:opacity-70"
                >
                  {processingPhone ? 'Sending...' : 'Resend OTP'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-10 text-center">
            <Link
              href={route('login')}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-500"
            >
              Login with password instead
            </Link>
          </div>

          <p className="mt-5 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link
              href={route('register')}
              className="font-semibold leading-6 text-emerald-600 hover:text-emerald-500"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </GuestLayout>
  );
};

export default OtpLogin;
