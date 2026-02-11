<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderTracking;
use Illuminate\Support\Facades\DB;

class TrackingService
{
    /**
     * Add a tracking entry for an order.
     */
    public function addTrackingEntry(Order $order, string $title, ?string $description = null, ?string $location = null, ?string $updatedBy = null): OrderTracking
    {
        return OrderTracking::create([
            'order_id' => $order->id,
            'status' => $order->status,
            'title' => $title,
            'description' => $description,
            'location' => $location ?? $order->preferred_rdc,
            'updated_by' => $updatedBy,
        ]);
    }

    /**
     * Get tracking history for an order.
     */
    public function getTrackingHistory(Order $order): array
    {
        return $order->trackings()
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($tracking) {
                return [
                    'id' => $tracking->id,
                    'status' => $tracking->status,
                    'title' => $tracking->title,
                    'description' => $tracking->description,
                    'location' => $tracking->location,
                    'updated_by' => $tracking->updated_by,
                    'icon' => $tracking->icon,
                    'timestamp' => $tracking->created_at->format('M d, Y h:i A'),
                    'relative_time' => $tracking->created_at->diffForHumans(),
                ];
            })
            ->toArray();
    }

    /**
     * Get the current status step for an order (for progress display).
     */
    public function getStatusStep(Order $order): int
    {
        $steps = [
            Order::STATUS_PENDING => 1,
            Order::STATUS_CONFIRMED => 2,
            Order::STATUS_PROCESSING => 3,
            Order::STATUS_READY_FOR_DELIVERY => 4,
            Order::STATUS_OUT_FOR_DELIVERY => 5,
            Order::STATUS_DELIVERED => 6,
        ];

        return $steps[$order->status] ?? 0;
    }

    /**
     * Get all status steps for display.
     */
    public function getStatusSteps(): array
    {
        return [
            ['step' => 1, 'status' => Order::STATUS_PENDING, 'label' => 'Order Placed', 'icon' => '📋'],
            ['step' => 2, 'status' => Order::STATUS_CONFIRMED, 'label' => 'Confirmed', 'icon' => '✅'],
            ['step' => 3, 'status' => Order::STATUS_PROCESSING, 'label' => 'Processing', 'icon' => '📦'],
            ['step' => 4, 'status' => Order::STATUS_READY_FOR_DELIVERY, 'label' => 'Ready', 'icon' => '🚚'],
            ['step' => 5, 'status' => Order::STATUS_OUT_FOR_DELIVERY, 'label' => 'On The Way', 'icon' => '🛻'],
            ['step' => 6, 'status' => Order::STATUS_DELIVERED, 'label' => 'Delivered', 'icon' => '🏠'],
        ];
    }

    /**
     * Update order status and add tracking entry.
     */
    public function updateOrderStatus(Order $order, string $newStatus, string $title, ?string $description = null, ?string $location = null, ?string $updatedBy = null): Order
    {
        return DB::transaction(function () use ($order, $newStatus, $title, $description, $location, $updatedBy) {
            $order->update(['status' => $newStatus]);

            // Set delivered_at if delivered
            if ($newStatus === Order::STATUS_DELIVERED) {
                $order->update(['delivered_at' => now()]);
            }

            // Set confirmed_at if confirmed
            if ($newStatus === Order::STATUS_CONFIRMED) {
                $order->update(['confirmed_at' => now()]);
            }

            $this->addTrackingEntry($order, $title, $description, $location, $updatedBy);

            return $order->fresh();
        });
    }

    /**
     * Get estimated delivery time based on status.
     */
    public function getEstimatedDelivery(Order $order): ?string
    {
        if ($order->status === Order::STATUS_DELIVERED || $order->status === Order::STATUS_CANCELLED) {
            return null;
        }

        // Estimate based on status
        $estimatedDays = match($order->status) {
            Order::STATUS_PENDING => 5,
            Order::STATUS_CONFIRMED => 4,
            Order::STATUS_PROCESSING => 3,
            Order::STATUS_READY_FOR_DELIVERY => 2,
            Order::STATUS_OUT_FOR_DELIVERY => 1,
            default => 5,
        };

        return now()->addDays($estimatedDays)->format('M d, Y');
    }

    /**
     * Create initial tracking entry when order is placed.
     */
    public function createInitialTracking(Order $order): OrderTracking
    {
        return $this->addTrackingEntry(
            $order,
            'Order Placed',
            'Your order has been received and is awaiting confirmation.',
            $order->preferred_rdc . ' RDC',
            'System'
        );
    }
}
