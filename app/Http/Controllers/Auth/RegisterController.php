<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class RegisterController extends Controller
{
    /**
     * Display the registration view.
     *
     * @return \Inertia\Response
     */
    public function showRegistrationForm()
    {
        return Inertia::render('auth/register', [
            'verifiedPhone' => session('verified_phone')
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|unique:users,phone',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'area' => 'nullable|string|max:255',
        ]);

        // Create the user
        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'address' => $request->address,
            'city' => $request->city,
            'area' => $request->area,
        ]);

        // Log the user in
        Auth::login($user);

        // Transfer guest cart to user cart if any
        $this->transferGuestCart($user);

        return redirect()->route('home');
    }

    /**
     * Show phone verification form.
     *
     * @return \Inertia\Response
     */
    public function showVerificationForm()
    {
        return Inertia::render('auth/phone-verification');
    }

    /**
     * Send verification OTP to phone.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function sendVerificationOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|unique:users,phone',
        ]);

        // Generate a 6-digit OTP
        $otp = rand(100000, 999999);

        Log::channel('daily')->info('Phone verification OTP: ' . $otp . ' for ' . $request->phone);

        // সেশন সঠিকভাবে সেভ হচ্ছে কিনা নিশ্চিত করুন
        Session::put('verification_phone', $request->phone);
        Session::put('verification_otp', (string) $otp); // স্ট্রিং হিসাবে সেভ করুন
        Session::put('verification_expires_at', now()->addMinutes(10)->timestamp);
        Session::save(); // সেশন এক্সপ্লিসিটলি সেভ করুন
        // In a real application, you would send the OTP via SMS
        // For example using a service like Twilio, Vonage/Nexmo, etc.

        // For development purposes, show the OTP in the flash message
        return back()->with('success', 'Verification code sent to your phone. For testing, use: ' . $otp);
    }

    /**
     * Verify the OTP for phone verification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function verifyRegistrationOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'otp' => 'required|string|size:6',
        ]);

        $verificationPhone = Session::get('verification_phone');
        $verificationOtp = Session::get('verification_otp');
        $expiresAt = Session::get('verification_expires_at');

        // বিস্তারিত লগিং যোগ করুন
        Log::channel('daily')->info('OTP Verification attempt: ', [
            'input_phone' => $request->phone,
            'input_otp' => $request->otp,
            'session_phone' => $verificationPhone,
            'session_otp' => $verificationOtp,
            'expires_at' => $expiresAt,
            'current_time' => now()->timestamp,
            'session_id' => Session::getId()
        ]);

        // টাইপ কনভার্শন সমস্যা এড়াতে type-safe কম্পেয়ারিসন ব্যবহার করুন
        if (
            $verificationPhone !== $request->phone ||
            (string) $verificationOtp !== (string) $request->otp ||
            (int) now()->timestamp > (int) $expiresAt
        ) {
            return back()->withErrors([
                'otp' => 'The verification code is invalid or has expired.',
            ]);
        }

        // সফল হলে বিস্তারিত লগিং
        Log::channel('daily')->info('OTP Verification successful for phone: ' . $request->phone);

        // Clear verification session data
        Session::forget(['verification_phone', 'verification_otp', 'verification_expires_at']);

        // Store verified phone for registration
        Session::put('verified_phone', $request->phone);

        return redirect()->route('register')
            ->with('success', 'Phone number verified successfully. Please complete your registration.');
    }

    /**
     * Transfer guest cart to user cart after registration.
     *
     * @param  \App\Models\User  $user
     * @return void
     */
    protected function transferGuestCart(User $user)
    {
        // Get session ID
        $sessionId = Session::getId();

        // Find guest cart if any
        $guestCart = Cart::where('session_id', $sessionId)->first();

        if ($guestCart) {
            // Check if user already has a cart
            $userCart = Cart::where('user_id', $user->id)->first();

            if ($userCart) {
                // Transfer items from guest cart to user cart
                foreach ($guestCart->items as $item) {
                    // Check if product already exists in user cart
                    $existingItem = $userCart->items()
                        ->where('product_id', $item->product_id)
                        ->first();

                    if ($existingItem) {
                        // Update quantity
                        $existingItem->update([
                            'quantity' => $existingItem->quantity + $item->quantity,
                        ]);
                    } else {
                        // Create new item in user cart
                        $userCart->items()->create([
                            'product_id' => $item->product_id,
                            'quantity' => $item->quantity,
                            'price' => $item->price,
                            'subtotal' => $item->subtotal,
                        ]);
                    }
                }

                // Update user cart total
                $userCart->updateTotal();

                // Delete guest cart and its items
                $guestCart->items()->delete();
                $guestCart->delete();
            } else {
                // Simply update the cart with user_id and remove session_id
                $guestCart->update([
                    'user_id' => $user->id,
                    'session_id' => null,
                ]);
            }
        }
    }
}
