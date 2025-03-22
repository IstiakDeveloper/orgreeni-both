<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display a listing of the admins.
     */
    public function index()
    {
        $admins = Admin::latest()->paginate(10);

        return Inertia::render('admin/admins/index', [
            'admins' => $admins
        ]);
    }

    /**
     * Show the form for creating a new admin.
     */
    public function create()
    {
        return Inertia::render('admin/admins/create');
    }

    /**
     * Store a newly created admin in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:admin,editor',
        ]);

        Admin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return redirect()->route('admin.admins.index')
            ->with('success', 'Admin user created successfully.');
    }

    /**
     * Show the form for editing the specified admin.
     */
    public function edit(Admin $admin)
    {
        // Prevent editing self through this route
        if ($admin->id === Auth::guard('admin')->id()) {
            return redirect()->route('admin.profile')
                ->with('error', 'Please use the profile page to edit your own account.');
        }

        return Inertia::render('admin/admins/edit', [
            'admin' => $admin
        ]);
    }

    /**
     * Update the specified admin in storage.
     */
    public function update(Request $request, Admin $admin)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('admins')->ignore($admin->id),
            ],
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|string|in:admin,editor',
        ]);

        $adminData = [
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
        ];

        if ($request->filled('password')) {
            $adminData['password'] = Hash::make($request->password);
        }

        $admin->update($adminData);

        return redirect()->route('admin.admins.index')
            ->with('success', 'Admin user updated successfully.');
    }

    /**
     * Remove the specified admin from storage.
     */
    public function destroy(Admin $admin)
    {
        // Prevent deleting self
        if ($admin->id === Auth::guard('admin')->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        // Prevent deleting the last admin
        if (Admin::count() <= 1) {
            return back()->with('error', 'Cannot delete the last admin account.');
        }

        $admin->delete();

        return redirect()->route('admin.admins.index')
            ->with('success', 'Admin user deleted successfully.');
    }

    /**
     * Show the admin profile form.
     */
    public function profile()
    {
        return Inertia::render('admin/profile', [
            'admin' => Auth::guard('admin')->user()
        ]);
    }

    /**
     * Update the admin profile.
     */
    public function updateProfile(Request $request)
    {
        $admin = Auth::guard('admin')->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('admins')->ignore($admin->id),
            ],
            'current_password' => 'nullable|required_with:password|string',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        // Verify current password if changing password
        if ($request->filled('current_password')) {
            if (!Hash::check($request->current_password, $admin->password)) {
                return back()->withErrors([
                    'current_password' => 'The current password is incorrect.',
                ]);
            }
        }

        $adminData = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        if ($request->filled('password')) {
            $adminData['password'] = Hash::make($request->password);
        }

        $admin->update($adminData);

        return back()->with('success', 'Profile updated successfully.');
    }

    /**
     * Show the login form for admin.
     */
    public function showLoginForm()
    {
        return Inertia::render('admin/auth/login');
    }

    /**
     * Handle admin login.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::guard('admin')->attempt($credentials, $request->filled('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('admin.dashboard'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    /**
     * Handle admin logout.
     */
    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
