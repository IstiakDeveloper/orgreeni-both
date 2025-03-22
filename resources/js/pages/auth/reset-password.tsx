import React, { FormEventHandler, useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import GuestLayout from '@/layouts/GuestLayout';

interface ResetPasswordProps {
  errors: {
    phone?: string;
    otp?: string;
    password?: string;
    password_confirmation?: string;
  };
  phone?: string;
  success?: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ errors, phone, success }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(phone ? 'otp' : 'phone');

  const { data: phoneData, setData: setPhoneData, post: postPhone, processing: processingPhone } = useForm({
    phone: phone || '',
  });

  const { data: otpData, setData: setOtpData, post: postOtp, processing: processingOtp } = useForm({
    phone: phone || '',
    otp: '',
  });

  const { data: passwordData, setData: setPasswordData, post: postPassword, processing: processingPassword } = useForm({
    phone: phone || '',
    otp: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    if (phone) {
      setPhoneData('phone', phone);
      setOtpData('phone', phone);
      setPasswordData('phone', phone);
    }
  }, [phone]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSendOtp: FormEventHandler = (e) => {
    e.preventDefault();
    postPhone(route('password.email'), {
      onSuccess: () => {
        setStep('otp');
        setOtpData('phone', phoneData.phone);
        setPasswordData('phone', phoneData.phone);
      },
    });
  };

  const handleVerifyOtp: FormEventHandler = (e) => {
    e.preventDefault();
    postOtp(route('password.validate-otp'), {
      onSuccess: () => {
        setStep('password');
        setPasswordData('otp', otpData.otp);
      },
    });
  };

  const handleResetPassword: FormEventHandler = (e) => {
    e.preventDefault();
    postPassword(route('password.update'));
  };

  const handleResendOtp = () => {
    postPhone(route('password.resend-otp'), {
      preserveState: true,
    });
  };

  return (
    <GuestLayout>
      <Head title="Reset Password" />
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            {step === 'phone' && 'Reset your password'}
            {step === 'otp' && 'Verify your identity'}
            {step === 'password' && 'Create new password'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 'phone' && 'Enter your phone number to receive a reset code'}
            {step === 'otp' && 'Enter the verification code sent to your phone'}
            {step === 'password' && 'Create a new password for your account'}
          </p>
          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {step === 'phone' && (
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
                      errors.phone ? 'ring-red-300' : 'ring-gray-300'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                    placeholder="Enter your registered phone number"
                    value={phoneData.phone}
                    onChange={(e) => setPhoneData('phone', e.target.value)}
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
                  disabled={processingPhone}
                  className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-70"
                >
                  {processingPhone ? 'Sending...' : 'Send Reset Code'}
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
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
                      errors.otp ? 'ring-red-300' : 'ring-gray-300'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                    placeholder="Enter 6-digit verification code"
                    value={otpData.otp}
                    onChange={(e) => setOtpData('otp', e.target.value)}
                  />
                  <input type="hidden" name="phone" value={otpData.phone} />
                  {errors.otp && (
                    <div className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.otp}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={processingOtp}
                  className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-70"
                >
                  {processingOtp ? 'Verifying...' : 'Verify Code'}
                </button>
              </div>

              <div className="flex items-center justify-between mt-4">
                {!phone && (
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Change phone number
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={processingPhone}
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-500 disabled:opacity-70"
                >
                  {processingPhone ? 'Sending...' : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

          {step === 'password' && (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <input type="hidden" name="phone" value={passwordData.phone} />
              <input type="hidden" name="otp" value={passwordData.otp} />

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  New Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                      errors.password ? 'ring-red-300' : 'ring-gray-300'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                    placeholder="Create a new password"
                    value={passwordData.password}
                    onChange={(e) => setPasswordData('password', e.target.value)}
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
                  {errors.password && (
                    <div className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.password}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium leading-6 text-gray-900">
                  Confirm New Password
                </label>
                <div className="mt-2 relative">
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${
                      errors.password_confirmation ? 'ring-red-300' : 'ring-gray-300'
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                    placeholder="Confirm your new password"
                    value={passwordData.password_confirmation}
                    onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                  {errors.password_confirmation && (
                    <div className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.password_confirmation}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={processingPassword}
                  className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-70"
                >
                  {processingPassword ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}

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

export default ResetPassword;
