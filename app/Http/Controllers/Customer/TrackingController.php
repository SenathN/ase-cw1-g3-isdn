<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\TrackingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TrackingController extends Controller
{
    protected TrackingService $trackingService;

    public function __construct(TrackingService $trackingService)
    {
        $this->trackingService = $trackingService;
    }

    /**
     * Display the tracking page for all orders.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get orders that are in progress (not delivered or cancelled)
        $activeOrders = Order::where('user_id', $user->id)
            ->whereNotIn('status', [Order::STATUS_DELIVERED, Order::STATUS_CANCELLED])
            ->with(['items', 'trackings' => function ($q) {
                $q->orderBy('created_at', 'desc')->limit(1);
            }])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'status_label' => $order->status_label,
                    'total' => $order->total,
                    'item_count' => $order->items->count(),
                    'created_at' => $order->created_at->format('M d, Y'),
                    'estimated_delivery' => $this->trackingService->getEstimatedDelivery($order),
                    'current_step' => $this->trackingService->getStatusStep($order),
                    'latest_update' => $order->trackings->first() ? [
                        'title' => $order->trackings->first()->title,
                        'time' => $order->trackings->first()->created_at->diffForHumans(),
                    ] : null,
                ];
            });

        // Get recent delivered orders
        $deliveredOrders = Order::where('user_id', $user->id)
            ->where('status', Order::STATUS_DELIVERED)
            ->orderBy('delivered_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total' => $order->total,
                    'delivered_at' => $order->delivered_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Customer/Tracking/Index', [
            'activeOrders' => $activeOrders,
            'deliveredOrders' => $deliveredOrders,
            'statusSteps' => $this->trackingService->getStatusSteps(),
        ]);
    }

    /**
     * Display detailed tracking for a specific order.
     */
    public function show(Request $request, Order $order): Response
    {
        // Ensure the order belongs to the authenticated user
        if ($order->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized access to this order.');
        }

        $order->load(['items.product', 'trackings', 'user']);

        return Inertia::render('Customer/Tracking/Show', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'status_label' => $order->status_label,
                'subtotal' => $order->subtotal,
                'tax' => $order->tax,
                'delivery_fee' => $order->delivery_fee,
                'discount' => $order->discount,
                'total' => $order->total,
                'delivery_address' => $order->delivery_address,
                'delivery_phone' => $order->delivery_phone,
                'delivery_notes' => $order->delivery_notes,
                'preferred_rdc' => $order->preferred_rdc,
                'payment_status' => $order->payment_status,
                'payment_method' => $order->payment_method,
                'created_at' => $order->created_at->format('M d, Y h:i A'),
                'confirmed_at' => $order->confirmed_at?->format('M d, Y h:i A'),
                'delivered_at' => $order->delivered_at?->format('M d, Y h:i A'),
                'can_cancel' => $order->canBeCancelled(),
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product_name,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'subtotal' => $item->subtotal,
                        'product' => $item->product ? [
                            'id' => $item->product->id,
                            'image_url' => $item->product->image_url,
                        ] : null,
                    ];
                }),
            ],
            'trackingHistory' => $this->trackingService->getTrackingHistory($order),
            'statusSteps' => $this->trackingService->getStatusSteps(),
            'currentStep' => $this->trackingService->getStatusStep($order),
            'estimatedDelivery' => $this->trackingService->getEstimatedDelivery($order),
        ]);
    }
}
