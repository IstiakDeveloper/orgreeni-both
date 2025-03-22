<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller
{
    /**
     * Display store settings
     */
    public function index()
    {
        $settings = [
            'store_name' => Setting::get('store_name', 'My Grocery Store'),
            'store_email' => Setting::get('store_email', 'info@mygrocerystore.com'),
            'store_phone' => Setting::get('store_phone', '+1234567890'),
            'store_address' => Setting::get('store_address', '123 Main Street'),
            'store_city' => Setting::get('store_city', 'Anytown'),
            'store_country' => Setting::get('store_country', 'Country'),
            'store_zip' => Setting::get('store_zip', '12345'),
            'meta_title' => Setting::get('meta_title', 'My Grocery Store - Fresh Groceries Delivered'),
            'meta_description' => Setting::get('meta_description', 'Order fresh groceries online and get them delivered to your doorstep.'),
            'logo' => Setting::get('logo', null),
            'favicon' => Setting::get('favicon', null),
            'currency' => Setting::get('currency', 'USD'),
            'currency_symbol' => Setting::get('currency_symbol', '$'),
            'tax_percentage' => Setting::get('tax_percentage', 0),
            'free_shipping_threshold' => Setting::get('free_shipping_threshold', 0),
            'social_facebook' => Setting::get('social_facebook', ''),
            'social_twitter' => Setting::get('social_twitter', ''),
            'social_instagram' => Setting::get('social_instagram', ''),
            'about_us' => Setting::get('about_us', ''),
            'privacy_policy' => Setting::get('privacy_policy', ''),
            'terms_conditions' => Setting::get('terms_conditions', ''),
            'return_policy' => Setting::get('return_policy', ''),
            'shipping_policy' => Setting::get('shipping_policy', ''),
        ];

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings
        ]);
    }

    /**
     * Update the store settings.
     */
    public function update(Request $request)
    {
        $request->validate([
            'store_name' => 'required|string|max:255',
            'store_email' => 'required|email|max:255',
            'store_phone' => 'required|string|max:20',
            'store_address' => 'required|string|max:255',
            'store_city' => 'required|string|max:100',
            'store_country' => 'required|string|max:100',
            'store_zip' => 'required|string|max:20',
            'meta_title' => 'required|string|max:255',
            'meta_description' => 'required|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'favicon' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,ico|max:1024',
            'currency' => 'required|string|max:10',
            'currency_symbol' => 'required|string|max:5',
            'tax_percentage' => 'required|numeric|min:0|max:100',
            'free_shipping_threshold' => 'required|numeric|min:0',
            'social_facebook' => 'nullable|string|max:255',
            'social_twitter' => 'nullable|string|max:255',
            'social_instagram' => 'nullable|string|max:255',
            'about_us' => 'nullable|string',
            'privacy_policy' => 'nullable|string',
            'terms_conditions' => 'nullable|string',
            'return_policy' => 'nullable|string',
            'shipping_policy' => 'nullable|string',
        ]);

        // Update all text settings
        foreach ($request->except(['logo', 'favicon', '_token']) as $key => $value) {
            Setting::set($key, $value);
        }

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $oldLogo = Setting::get('logo');
            if ($oldLogo) {
                Storage::disk('public')->delete($oldLogo);
            }

            $logoPath = $request->file('logo')->store('settings', 'public');
            Setting::set('logo', $logoPath);
        }

        // Handle favicon upload
        if ($request->hasFile('favicon')) {
            $oldFavicon = Setting::get('favicon');
            if ($oldFavicon) {
                Storage::disk('public')->delete($oldFavicon);
            }

            $faviconPath = $request->file('favicon')->store('settings', 'public');
            Setting::set('favicon', $faviconPath);
        }

        // Clear all settings cache
        Cache::flush();

        return back()->with('success', 'Settings updated successfully.');
    }

    /**
     * Get general settings for frontend.
     */
    public function getSettings()
    {
        $settings = [
            'store_name' => Setting::get('store_name', 'My Grocery Store'),
            'store_email' => Setting::get('store_email', 'info@mygrocerystore.com'),
            'store_phone' => Setting::get('store_phone', '+1234567890'),
            'meta_title' => Setting::get('meta_title', 'My Grocery Store - Fresh Groceries Delivered'),
            'meta_description' => Setting::get('meta_description', 'Order fresh groceries online and get them delivered to your doorstep.'),
            'logo' => Setting::get('logo', null),
            'favicon' => Setting::get('favicon', null),
            'currency' => Setting::get('currency', 'USD'),
            'currency_symbol' => Setting::get('currency_symbol', '$'),
            'social_facebook' => Setting::get('social_facebook', ''),
            'social_twitter' => Setting::get('social_twitter', ''),
            'social_instagram' => Setting::get('social_instagram', ''),
        ];

        return response()->json($settings);
    }

    /**
     * Get a specific page content
     */
    public function getPage($page)
    {
        $content = '';

        switch ($page) {
            case 'about-us':
                $title = 'About Us';
                $content = Setting::get('about_us', '');
                break;
            case 'privacy-policy':
                $title = 'Privacy Policy';
                $content = Setting::get('privacy_policy', '');
                break;
            case 'terms-conditions':
                $title = 'Terms & Conditions';
                $content = Setting::get('terms_conditions', '');
                break;
            case 'return-policy':
                $title = 'Return Policy';
                $content = Setting::get('return_policy', '');
                break;
            case 'shipping-policy':
                $title = 'Shipping Policy';
                $content = Setting::get('shipping_policy', '');
                break;
            default:
                abort(404);
        }

        return Inertia::render('Shop/StaticPage', [
            'title' => $title,
            'content' => $content
        ]);
    }
}
