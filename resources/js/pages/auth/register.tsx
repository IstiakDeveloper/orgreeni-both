import React, { FormEventHandler, useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import GuestLayout from '@/layouts/ShopLayout';

interface RegisterProps {
    errors: {
        name?: string;
        phone?: string;
        password?: string;
        password_confirmation?: string;
        address?: string;
        city?: string;
        area?: string;
    };
    verifiedPhone?: string;
    success?: string;
}

const Register: React.FC<RegisterProps> = ({ errors, verifiedPhone, success }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing } = useForm({
        name: '',
        phone: verifiedPhone || '',
        password: '',
        password_confirmation: '',
        address: '',
        city: '',
        area: '',
    });


    useEffect(() => {
        if (verifiedPhone) {
            setData(prevData => ({
                ...prevData,
                phone: verifiedPhone
            }));
        }
    }, [verifiedPhone]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Create a new account
                    </h2>
                    {success && (
                        <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{success}</span>
                        </div>
                    )}
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                    Full Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${errors?.name ? 'ring-red-300' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                                        placeholder="Enter your full name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors?.name && (
                                        <div className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle size={14} className="mr-1" />
                                            {errors?.name}
                                        </div>
                                    )}
                                </div>
                            </div>

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
                                        readOnly={!!verifiedPhone}
                                        className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${errors?.phone ? 'ring-red-300' : 'ring-gray-300'} ${verifiedPhone ? 'bg-gray-50' : ''} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                                        placeholder="Enter your phone number"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
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
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                                <div className="mt-2 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${errors?.password ? 'ring-red-300' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                                        placeholder="Create a password"
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

                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium leading-6 text-gray-900">
                                    Confirm Password
                                </label>
                                <div className="mt-2 relative">
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${errors?.password_confirmation ? 'ring-red-300' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                                        placeholder="Confirm your password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
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
                                    {errors?.password_confirmation && (
                                        <div className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle size={14} className="mr-1" />
                                            {errors?.password_confirmation}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ঐচ্ছিক ফিল্ডগুলি যদি প্রয়োজন হয় */}
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                                    Address (Optional)
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${errors?.address ? 'ring-red-300' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                                        placeholder="Enter your address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                    />
                                    {errors?.address && (
                                        <div className="text-red-500 text-xs mt-1 flex items-center">
                                            <AlertCircle size={14} className="mr-1" />
                                            {errors?.address}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                        City (Optional)
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="city"
                                            name="city"
                                            type="text"
                                            className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${errors?.city ? 'ring-red-300' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                                            placeholder="City"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                        />
                                        {errors?.city && (
                                            <div className="text-red-500 text-xs mt-1 flex items-center">
                                                <AlertCircle size={14} className="mr-1" />
                                                {errors?.city}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="area" className="block text-sm font-medium leading-6 text-gray-900">
                                        Area (Optional)
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="area"
                                            name="area"
                                            type="text"
                                            className={`block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ${errors?.area ? 'ring-red-300' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6`}
                                            placeholder="Area"
                                            value={data.area}
                                            onChange={(e) => setData('area', e.target.value)}
                                        />
                                        {errors?.area && (
                                            <div className="text-red-500 text-xs mt-1 flex items-center">
                                                <AlertCircle size={14} className="mr-1" />
                                                {errors?.area}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full justify-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-70"
                                >
                                    {processing ? 'Creating Account...' : 'Create Account'}
                                </button>
                            </div>
                        </form>

                        {!verifiedPhone && (
                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-white px-2 text-gray-500">Or</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Link
                                        href={route('register.verify')}
                                        className="flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                    >
                                        Verify phone number first
                                    </Link>
                                </div>
                            </div>
                        )}

                        <p className="mt-6 text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link
                                href={route('login')}
                                className="font-semibold leading-6 text-emerald-600 hover:text-emerald-500"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
};

export default Register;
