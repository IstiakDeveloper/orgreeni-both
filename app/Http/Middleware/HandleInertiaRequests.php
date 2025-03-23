<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    // ... other middleware methods ...

    /**
     * Define the props that are shared by default.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request)
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
            'cartItemsCount' => function () use ($request) {
                if ($request->user()) {
                    // Get cart count for logged in user
                    return \App\Models\CartItem::where('user_id', $request->user()->id)->sum('quantity');
                } else {
                    // Get cart count from session for guest users
                    $cartId = session('cart_id');
                    if ($cartId) {
                        return \App\Models\CartItem::where('cart_id', $cartId)->sum('quantity');
                    }
                }
                return 0;
            },
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
