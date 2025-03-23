<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    /**
     * Display a listing of the coupons in admin panel.
     */
    public function index()
    {
        $coupons = Coupon::latest()
            ->paginate(10);

        return Inertia::render('admin/coupons/index', [
            'coupons' => $coupons
        ]);
    }

    /**
     * Show the form for creating a new coupon.
     */
    public function create()
    {
        return Inertia::render('admin/coupons/create');
    }

    /**
     * Store a newly created coupon in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code',
            'type' => 'required|string|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:starts_at',
            'is_active' => 'boolean',
            'usage_limit' => 'nullable|integer|min:1',
        ]);

        // Additional validation for percentage type
        if ($request->type === 'percentage' && $request->value > 100) {
            return back()->withErrors(['value' => 'Percentage discount cannot exceed 100%.']);
        }

        Coupon::create([
            'code' => strtoupper($request->code),
            'type' => $request->type,
            'value' => $request->value,
            'min_order_amount' => $request->min_order_amount,
            'starts_at' => $request->starts_at,
            'expires_at' => $request->expires_at,
            'is_active' => $request->is_active ?? true,
            'usage_limit' => $request->usage_limit,
            'used_count' => 0,
        ]);

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Coupon created successfully.');
    }

    /**
     * Show the form for editing the specified coupon.
     */
    public function edit(Coupon $coupon)
    {
        return Inertia::render('admin/coupons/edit', [
            'coupon' => $coupon
        ]);
    }

    /**
     * Update the specified coupon in storage.
     */
    public function update(Request $request, Coupon $coupon)
    {
        $request->validate([
            'code' => 'required|string|max:50|unique:coupons,code,' . $coupon->id,
            'type' => 'required|string|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:starts_at',
            'is_active' => 'boolean',
            'usage_limit' => 'nullable|integer|min:1',
        ]);

        // Additional validation for percentage type
        if ($request->type === 'percentage' && $request->value > 100) {
            return back()->withErrors(['value' => 'Percentage discount cannot exceed 100%.']);
        }

        $coupon->update([
            'code' => strtoupper($request->code),
            'type' => $request->type,
            'value' => $request->value,
            'min_order_amount' => $request->min_order_amount,
            'starts_at' => $request->starts_at,
            'expires_at' => $request->expires_at,
            'is_active' => $request->is_active ?? true,
            'usage_limit' => $request->usage_limit,
        ]);

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Coupon updated successfully.');
    }

    /**
     * Remove the specified coupon from storage.
     */
    public function destroy(Coupon $coupon)
    {
        $coupon->delete();

        return redirect()->route('admin.coupons.index')
            ->with('success', 'Coupon deleted successfully.');
    }

    /**
     * Validate coupon code for frontend
     */
    public function validateCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string|exists:coupons,code',
            'amount' => 'required|numeric|min:0',
        ]);

        $coupon = Coupon::where('code', $request->code)->first();

        if (!$coupon) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid coupon code.'
            ]);
        }

        if (!$coupon->is_active) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon is inactive.'
            ]);
        }

        $now = now();

        if ($coupon->starts_at && $now->lt($coupon->starts_at)) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon is not active yet.'
            ]);
        }

        if ($coupon->expires_at && $now->gt($coupon->expires_at)) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon has expired.'
            ]);
        }

        if ($coupon->usage_limit && $coupon->used_count >= $coupon->usage_limit) {
            return response()->json([
                'valid' => false,
                'message' => 'This coupon has reached its usage limit.'
            ]);
        }

        if ($coupon->min_order_amount && $request->amount < $coupon->min_order_amount) {
            return response()->json([
                'valid' => false,
                'message' => "Minimum order amount of {$coupon->min_order_amount} required to use this coupon."
            ]);
        }

        // Calculate discount amount
        $discountAmount = $coupon->calculateDiscount($request->amount);

        return response()->json([
            'valid' => true,
            'message' => 'Coupon is valid.',
            'coupon' => $coupon,
            'discount_amount' => $discountAmount
        ]);
    }
}
