<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Get or create the cart for the current user or session
     */
    private function getOrCreateCart(): Cart
    {
        if (auth()->check()) {
            // Get or create the user's cart
            return Cart::firstOrCreate(
                ['user_id' => auth()->id()],
                ['total_amount' => 0]
            );
        } else {
            // Get or create a cart for the guest using session ID
            $sessionId = session()->getId();
            return Cart::firstOrCreate(
                ['session_id' => $sessionId],
                ['total_amount' => 0]
            );
        }
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
                'admin' => $request->user('admin'),
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'appSettings' => [
                'store_name' => Setting::get('store_name', 'My Grocery Store'),
                'store_email' => Setting::get('store_email', 'info@store.com'),
                'store_phone' => Setting::get('store_phone', '+123456789'),
                'store_address' => Setting::get('store_address', '123 Store St'),
                'store_city' => Setting::get('store_city', 'Store City'),
                'store_country' => Setting::get('store_country', 'Country'),
                'store_zip' => Setting::get('store_zip', '12345'),
                'logo' => Setting::get('logo', null),
                'favicon' => Setting::get('favicon', null),
                'social_facebook' => Setting::get('social_facebook', ''),
                'social_twitter' => Setting::get('social_twitter', ''),
                'social_instagram' => Setting::get('social_instagram', ''),
                'currency' => Setting::get('currency', 'USD'),
                'currency_symbol' => Setting::get('currency_symbol', '$'),
                'meta_title' => Setting::get('meta_title', 'Online Grocery Store'),
                'meta_description' => Setting::get('meta_description', 'Fresh groceries delivered to your doorstep'),
            ],

            'categories' => function () {
                // Get main categories with their subcategories (children)
                return \App\Models\Category::with([
                    'children' => function ($query) {
                    $query->where('is_active', true)->orderBy('order');
                }
                ])
                    ->whereNull('parent_id')
                    ->where('is_active', true)
                    ->orderBy('order')
                    ->get();
            },
        ]);
    }
}
