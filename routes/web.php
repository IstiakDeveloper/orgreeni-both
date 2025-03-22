<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Frontend Routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/products', [HomeController::class, 'allProducts'])->name('products');
Route::get('/page/{page}', [SettingController::class, 'getPage'])->name('page');

// Product Routes
Route::get('/product/{product:slug}', [ProductController::class, 'getProductDetails'])->name('product.details');
Route::get('/category/{category:slug}', [CategoryController::class, 'getCategoryWithProducts'])->name('category.products');
Route::get('/search', [ProductController::class, 'searchProducts'])->name('product.search');

// Cart Routes
Route::get('/cart', [CartController::class, 'showCart'])->name('cart');
Route::post('/cart/add', [CartController::class, 'addToCart'])->name('cart.add');
Route::patch('/cart/update/{cartItem}', [CartController::class, 'updateCartItem'])->name('cart.update');
Route::delete('/cart/remove/{cartItem}', [CartController::class, 'removeCartItem'])->name('cart.remove');
Route::post('/cart/clear', [CartController::class, 'clearCart'])->name('cart.clear');
Route::post('/cart/coupon', [CartController::class, 'applyCoupon'])->name('cart.coupon.apply');
Route::delete('/cart/coupon', [CartController::class, 'removeCoupon'])->name('cart.coupon.remove');
Route::get('/cart/count', [CartController::class, 'getCartCount'])->name('cart.count');

// Checkout & Order Routes
Route::get('/checkout', [OrderController::class, 'checkout'])->name('checkout');
Route::post('/place-order', [OrderController::class, 'placeOrder'])->name('order.place');
Route::get('/order-confirmation/{order}', [OrderController::class, 'orderConfirmation'])->name('order.confirmation');

// API Routes for Frontend
Route::get('/api/categories', [CategoryController::class, 'getAllCategories'])->name('api.categories');
Route::get('/api/featured-products', [ProductController::class, 'getFeaturedProducts'])->name('api.featured-products');
Route::get('/api/banners', [BannerController::class, 'getActiveBanners'])->name('api.banners');
Route::get('/api/settings', [SettingController::class, 'getSettings'])->name('api.settings');
Route::get('/api/areas', [AreaController::class, 'getServiceableAreas'])->name('api.areas');
Route::post('/api/delivery-charge', [AreaController::class, 'getDeliveryCharge'])->name('api.delivery-charge');
Route::post('/api/validate-coupon', [CouponController::class, 'validateCoupon'])->name('api.validate-coupon');

// Authentication Routes
Route::middleware('guest')->group(function () {
    // Login Routes
    Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [LoginController::class, 'login']);

    // OTP Login Routes
    Route::get('/login/otp', [LoginController::class, 'showOtpForm'])->name('login.otp');
    Route::post('/login/otp/send', [LoginController::class, 'sendOtp'])->name('login.otp.send');
    Route::post('/login/otp/verify', [LoginController::class, 'verifyOtp'])->name('login.otp.verify');

    // Registration Routes
    Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
    Route::post('/register', [RegisterController::class, 'register']);
    Route::get('/register/verify', [RegisterController::class, 'showVerificationForm'])->name('register.verify');
    Route::post('/register/verify/send', [RegisterController::class, 'sendVerificationOtp'])->name('register.verify.send');
    Route::post('/register/verify/otp', [RegisterController::class, 'verifyRegistrationOtp'])->name('register.verify.otp');

    // Password Reset Routes
    Route::get('/forgot-password', [ForgotPasswordController::class, 'showForgotPasswordForm'])->name('password.request');
    Route::post('/forgot-password', [ForgotPasswordController::class, 'sendResetOtp'])->name('password.email');
    Route::get('/reset-password', [ForgotPasswordController::class, 'showResetForm'])->name('password.reset');
    Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword'])->name('password.update');
});

// Authenticated User Routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

    // User Profile Routes
    Route::get('/profile', [UserController::class, 'profile'])->name('user.profile');
    Route::patch('/profile', [UserController::class, 'updateProfile'])->name('user.profile.update');

    // User Orders Routes
    Route::get('/orders', [OrderController::class, 'userOrders'])->name('user.orders');
    Route::get('/orders/{order}', [OrderController::class, 'userOrderDetails'])->name('user.orders.show');

    // Wishlist Routes
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist');
    Route::post('/wishlist/add', [WishlistController::class, 'addToWishlist'])->name('wishlist.add');
    Route::delete('/wishlist/remove', [WishlistController::class, 'removeFromWishlist'])->name('wishlist.remove');
    Route::get('/wishlist/check', [WishlistController::class, 'checkWishlist'])->name('wishlist.check');
    Route::post('/wishlist/to-cart', [WishlistController::class, 'moveToCart'])->name('wishlist.to-cart');
});

// Admin Routes
Route::prefix('admin')->name('admin.')->group(function () {
    // Admin Authentication
    Route::middleware('guest:admin')->group(function () {
        Route::get('/login', [AdminController::class, 'showLoginForm'])->name('login');
        Route::post('/login', [AdminController::class, 'login']);
    });

    // Admin Protected Routes
    Route::middleware('auth:admin')->group(function () {
        Route::post('/logout', [AdminController::class, 'logout'])->name('logout');

        // Dashboard
        Route::get('/dashboard', [HomeController::class, 'adminDashboard'])->name('dashboard');

        // Admin Profile
        Route::get('/profile', [AdminController::class, 'profile'])->name('profile');
        Route::patch('/profile', [AdminController::class, 'updateProfile'])->name('profile.update');

        // Admin Users Management (Admin users only)
        Route::middleware('admin.role:admin')->group(function () {
            Route::resource('admins', AdminController::class)->except(['show']);
        });

        // Products Management
        Route::resource('products', ProductController::class);

        // Categories Management
        Route::resource('categories', CategoryController::class);

        // Orders Management
        Route::resource('orders', OrderController::class)->only(['index', 'show']);
        Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status.update');

        // Users Management
        Route::resource('users', UserController::class);

        // Banners Management
        Route::resource('banners', BannerController::class)->except(['show']);

        // Areas Management
        Route::resource('areas', AreaController::class)->except(['show']);

        // Coupons Management
        Route::resource('coupons', CouponController::class)->except(['show']);

        // Settings
        Route::get('/settings', [SettingController::class, 'index'])->name('settings');
        Route::patch('/settings', [SettingController::class, 'update'])->name('settings.update');
    });
});
