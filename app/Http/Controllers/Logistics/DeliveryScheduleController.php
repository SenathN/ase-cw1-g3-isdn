<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use App\Models\DeliverySchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DeliveryScheduleController extends Controller
{
    public function index()
    {
        $schedules = DeliverySchedule::with(['order', 'driver'])
            ->latest()
            ->get();

        return Inertia::render('Logistics/DeliverySchedules/Index', [
            'schedules' => $schedules
        ]);
    }

    public function create()
    {
        return Inertia::render('Logistics/DeliverySchedules/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'driver_id' => 'required|exists:drivers,id',
            'scheduled_date' => 'required|date',
            'scheduled_time' => 'required',
            'route_notes' => 'nullable|string'
        ]);

        $validated['created_by'] = auth()->id();

        DeliverySchedule::create(
            collect($validated)->merge([
                'code' => ucwords( 'ISDNDLV-'.Str::random(4).'-'.Str::random(3) ),
            ])->toArray()
        );

        return redirect()->route('logistics.schedules.index');
    }

    public function edit(DeliverySchedule $deliverySchedule)
    {
        return Inertia::render('Logistics/DeliverySchedules/Edit', [
            'schedule' => $deliverySchedule
        ]);
    }

    public function update(Request $request, DeliverySchedule $deliverySchedule)
    {
        $validated = $request->validate([
            'scheduled_date' => 'required|date',
            'scheduled_time' => 'required',
            'route_notes' => 'nullable|string',
            'status' => 'required|string'
        ]);

        $deliverySchedule->update($validated);

        return redirect()->route('logistics.schedules.index');
    }

    public function destroy(DeliverySchedule $deliverySchedule)
    {
        $deliverySchedule->delete();

        return redirect()->back();
    }

    public function optionsFetch()
    {
        $orders = \App\Models\Order::select('id', 'code')->get();

        return response()->json([
            'data' => $orders
         ]);
    }

    public function driversOptionsFetch()
    {
        $orders = \App\Models\Driver::select('id', 'code')->get();

        return response()->json([
            'data' => $orders
         ]);
     }
}
