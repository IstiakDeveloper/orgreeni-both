<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class ForgotPasswordController extends Controller
{
    /**
     * Show the form to request a password reset link.
     *
     * @return \Inertia\Response
     */
    public function showForgotPasswordForm()
    {
        return Inertia::render('auth/forgot-password');
    }

    /**
     * Send a reset OTP to the user's phone.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function sendResetOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|exists:users,phone',
        ]);

        // Find the user
        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            return back()->withErrors([
                'phone' => 'We cannot find a user with that phone number.',
            ]);
        }

        // Generate a 6-digit OTP
        $otp = rand(100000, 999999);

        // Store OTP in the database
        $user->update([
            'otp' => $otp,
            'otp_expires_at' => now()->addMinutes(10), // OTP valid for 10 minutes
        ]);

        // In a real application, you would send this OTP via SMS
        // For example using a service like Twilio, Vonage/Nexmo, etc.

        // Log for development/testing
        Log::info('Password reset OTP: ' . $otp . ' for ' . $request->phone);

        // Store the phone in session for the reset form
        Session::put('reset_phone', $request->phone);

        // For development purposes, show the OTP in the flash message
        return redirect()->route('password.reset')
            ->with('success', 'Reset code sent to your phone. For testing, use: ' . $otp);
    }

    /**
     * Show the password reset form.
     *
     * @return \Inertia\Response
     */
    public function showResetForm()
    {
        return Inertia::render('auth/reset-password', [
            'phone' => Session::get('reset_phone')
        ]);
    }

    /**
     * Reset the user's password.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|exists:users,phone',
            'otp' => 'required|string|size:6',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Find the user with matching OTP
        $user = User::where('phone', $request->phone)
                    ->where('otp', $request->otp)
                    ->where('otp_expires_at', '>', now())
                    ->first();

        if (!$user) {
            return back()->withErrors([
                'otp' => 'The reset code is invalid or has expired.',
            ]);
        }

        // Update password and clear OTP
        $user->update([
            'password' => Hash::make($request->password),
            'otp' => null,
            'otp_expires_at' => null,
        ]);

        // Clear the session
        Session::forget('reset_phone');

        return redirect()->route('login')
            ->with('success', 'Your password has been reset successfully. You can now login with your new password.');
    }

    /**
     * Validate the reset OTP without changing the password yet.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function validateOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|exists:users,phone',
            'otp' => 'required|string|size:6',
        ]);

        // Find the user with matching OTP
        $user = User::where('phone', $request->phone)
                    ->where('otp', $request->otp)
                    ->where('otp_expires_at', '>', now())
                    ->first();

        if (!$user) {
            return back()->withErrors([
                'otp' => 'The reset code is invalid or has expired.',
            ]);
        }

        // Store validation in session
        Session::put('otp_validated', true);
        Session::put('validated_phone', $request->phone);

        return back()->with('success', 'Code verified successfully. Please set your new password.');
    }

    /**
     * Resend the reset OTP to the user's phone.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function resendOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|exists:users,phone',
        ]);

        // Find the user
        $user = User::where('phone', $request->phone)->first();

        if (!$user) {
            return back()->withErrors([
                'phone' => 'We cannot find a user with that phone number.',
            ]);
        }

        // Check if we can send a new OTP (prevent spam)
        if ($user->otp_expires_at && now()->diffInMinutes($user->otp_expires_at) > 8) {
            return back()->withErrors([
                'phone' => 'Please wait before requesting a new code.',
            ]);
        }

        // Generate a new OTP
        $otp = rand(100000, 999999);

        // Store OTP in the database
        $user->update([
            'otp' => $otp,
            'otp_expires_at' => now()->addMinutes(10), // OTP valid for 10 minutes
        ]);

        // In a real application, you would send this OTP via SMS
        // Log for development/testing
        Log::info('Password reset OTP (resend): ' . $otp . ' for ' . $request->phone);

        // For development purposes, show the OTP in the flash message
        return back()->with('success', 'New reset code sent to your phone. For testing, use: ' . $otp);
    }
}
