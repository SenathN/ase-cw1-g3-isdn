<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DriverController extends Controller
{
    public function index()
    {
        $drivers = Driver::with('user')->latest()->get();

        return Inertia::render('Logistics/Drivers/Index', [
            'drivers' => $drivers
        ]);
    }

    public function create()
    {
        return Inertia::render('Logistics/Drivers/Create');
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
            ]);

            Driver::create([
                'user_id' => $validated['user_id'],
                'code' => strtoupper('DRV-'.Str::random(6)),
            ]);

            return redirect()->route('logistics.drivers.index')
                ->with('message', 'Driver created successfully!')
                ->with('type', 'success');
        } catch (\Exception $e) {
            return redirect()->route('logistics.drivers.index')
                ->with('message', 'Failed to create driver: ' . $e->getMessage())
                ->with('type', 'error');
        }
    }

    public function edit(Driver $driver)
    {
        return Inertia::render('Logistics/Drivers/Edit', [
            'driver' => $driver
        ]);
    }

    public function update(Request $request, Driver $driver)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
            ]);

            $driver->update($validated);

            return redirect()->route('logistics.drivers.index')
                ->with('message', 'Driver updated successfully!')
                ->with('type', 'success');
        } catch (\Exception $e) {
            return redirect()->route('logistics.drivers.index')
                ->with('message', 'Failed to update driver: ' . $e->getMessage())
                ->with('type', 'error');
        }
    }

    public function destroy(Driver $driver)
    {
        try {
            $driver->delete();

            return redirect()->route('logistics.drivers.index')
                ->with('message', 'Driver deleted successfully!')
                ->with('type', 'success');
        } catch (\Exception $e) {
            return redirect()->route('logistics.drivers.index')
                ->with('message', 'Failed to delete driver: ' . $e->getMessage())
                ->with('type', 'error');
        }
    }

    public function usersOptionsFetch()
    {
        $users = \App\Models\User::select('id', 'name', 'email')->get();

        return response()->json([
            'data' => $users
        ]);
    }
}
