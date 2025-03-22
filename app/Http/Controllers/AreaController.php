<?php

namespace App\Http\Controllers;

use App\Models\Area;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AreaController extends Controller
{
    /**
     * Display a listing of the areas in admin panel.
     */
    public function index()
    {
        $areas = Area::orderBy('city')
            ->orderBy('name')
            ->paginate(15);

        return Inertia::render('Admin/Areas/Index', [
            'areas' => $areas
        ]);
    }

    /**
     * Show the form for creating a new area.
     */
    public function create()
    {
        return Inertia::render('Admin/Areas/Create');
    }

    /**
     * Store a newly created area in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'is_serviceable' => 'boolean',
            'delivery_charge' => 'required|numeric|min:0',
        ]);

        Area::create([
            'name' => $request->name,
            'city' => $request->city,
            'is_serviceable' => $request->is_serviceable ?? true,
            'delivery_charge' => $request->delivery_charge,
        ]);

        return redirect()->route('admin.areas.index')
            ->with('success', 'Area created successfully.');
    }

    /**
     * Show the form for editing the specified area.
     */
    public function edit(Area $area)
    {
        return Inertia::render('Admin/Areas/Edit', [
            'area' => $area
        ]);
    }

    /**
     * Update the specified area in storage.
     */
    public function update(Request $request, Area $area)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'is_serviceable' => 'boolean',
            'delivery_charge' => 'required|numeric|min:0',
        ]);

        $area->update([
            'name' => $request->name,
            'city' => $request->city,
            'is_serviceable' => $request->is_serviceable ?? true,
            'delivery_charge' => $request->delivery_charge,
        ]);

        return redirect()->route('admin.areas.index')
            ->with('success', 'Area updated successfully.');
    }

    /**
     * Remove the specified area from storage.
     */
    public function destroy(Area $area)
    {
        $area->delete();

        return redirect()->route('admin.areas.index')
            ->with('success', 'Area deleted successfully.');
    }

    /**
     * Get serviceable areas for frontend
     */
    public function getServiceableAreas()
    {
        $areas = Area::where('is_serviceable', true)
            ->orderBy('city')
            ->orderBy('name')
            ->get();

        return response()->json($areas);
    }

    /**
     * Get delivery charge for an area
     */
    public function getDeliveryCharge(Request $request)
    {
        $request->validate([
            'city' => 'required|string',
            'area' => 'required|string',
        ]);

        $area = Area::where('city', $request->city)
            ->where('name', $request->area)
            ->where('is_serviceable', true)
            ->first();

        if (!$area) {
            return response()->json([
                'message' => 'Area not found or not serviceable',
                'delivery_charge' => 0
            ], 404);
        }

        return response()->json([
            'delivery_charge' => $area->delivery_charge
        ]);
    }
}
