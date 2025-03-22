<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BannerController extends Controller
{
    /**
     * Display a listing of the banners in admin panel.
     */
    public function index()
    {
        $banners = Banner::orderBy('order')
            ->paginate(10);

        return Inertia::render('Admin/Banners/Index', [
            'banners' => $banners
        ]);
    }

    /**
     * Show the form for creating a new banner.
     */
    public function create()
    {
        return Inertia::render('Admin/Banners/Create');
    }

    /**
     * Store a newly created banner in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'link' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $imagePath = $request->file('image')->store('banners', 'public');

        Banner::create([
            'title' => $request->title,
            'image' => $imagePath,
            'link' => $request->link,
            'is_active' => $request->is_active ?? true,
            'order' => $request->order ?? 0,
        ]);

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner created successfully.');
    }

    /**
     * Show the form for editing the specified banner.
     */
    public function edit(Banner $banner)
    {
        return Inertia::render('Admin/Banners/Edit', [
            'banner' => $banner
        ]);
    }

    /**
     * Update the specified banner in storage.
     */
    public function update(Request $request, Banner $banner)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'link' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $bannerData = [
            'title' => $request->title,
            'link' => $request->link,
            'is_active' => $request->is_active ?? true,
            'order' => $request->order ?? 0,
        ];

        if ($request->hasFile('image')) {
            // Delete old image
            Storage::disk('public')->delete($banner->image);

            // Store new image
            $bannerData['image'] = $request->file('image')->store('banners', 'public');
        }

        $banner->update($bannerData);

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner updated successfully.');
    }

    /**
     * Remove the specified banner from storage.
     */
    public function destroy(Banner $banner)
    {
        // Delete banner image
        Storage::disk('public')->delete($banner->image);

        $banner->delete();

        return redirect()->route('admin.banners.index')
            ->with('success', 'Banner deleted successfully.');
    }

    /**
     * Get active banners for frontend
     */
    public function getActiveBanners()
    {
        $banners = Banner::where('is_active', true)
            ->orderBy('order')
            ->get();

        return response()->json($banners);
    }
}
