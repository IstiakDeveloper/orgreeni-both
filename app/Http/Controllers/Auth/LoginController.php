<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class LoginController extends Controller
{
    /**
     * Show the login form.
     */
    public function showLoginForm()
    {
        return Inertia::render('auth/login');
    }

    /**
     * Handle user login with password.
     */
    public function login(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('phone', 'password');

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('home'));
        }

        return back()->withErrors([
            'phone' => 'The provided credentials do not match our records.',
        ]);
    }

    /**
     * Show the OTP login form.
     */
    public function showOtpForm()
    {
        return Inertia::render('auth/otp-login');
    }

    /**
     * Send OTP to the user's phone.
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|exists:users,phone',
        ]);

        $user = User::where('phone', $request->phone)->first();

        // Generate a 6-digit OTP
        $otp = rand(100000, 999999);

        // Store OTP in the database
        $user->update([
            'otp' => $otp,
            'otp_expires_at' => now()->addMinutes(10), // OTP valid for 10 minutes
        ]);

        // Add this line before the return statement
        \Log::info('OTP generated for user ID ' . $user->id . ' (' . $request->phone . '): ' . $otp);
        // In a real application, you would send this OTP via SMS
        // For development, we'll just return it in the response

        return back()->with('success', 'OTP has been sent to your phone number. Use the following code for testing: ' . $otp);
    }

    /**
     * Verify OTP and login the user.
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|exists:users,phone',
            'otp' => 'required|string|size:6',
        ]);

        $user = User::where('phone', $request->phone)
            ->where('otp', $request->otp)
            ->where('otp_expires_at', '>', now())
            ->first();

        if (!$user) {
            return back()->withErrors([
                'otp' => 'The OTP entered is invalid or has expired.',
            ]);
        }

        // Clear OTP after successful verification
        $user->update([
            'otp' => null,
            'otp_expires_at' => null,
        ]);

        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        return redirect()->intended(route('home'));
    }

    /**
     * Log the user out.
     */
    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
