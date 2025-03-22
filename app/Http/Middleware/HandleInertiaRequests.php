<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     */
    public function share(Request $request): array
    {
        return [
            'auth' => [
                'user' => $request->user(),
                'admin' => $request->user('admin'),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'storeSettings' => [
                'name' => Setting::get('store_name', 'My Grocery Store'),
                'logo' => Setting::get('logo', null),
                'currency_symbol' => Setting::get('currency_symbol', '$'),
            ],
        ];
    }
}
