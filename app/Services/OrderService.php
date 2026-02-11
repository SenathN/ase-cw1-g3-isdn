<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class OrderService
{
    protected CartService $cartService;
    protected TrackingService $trackingService;
    protected InvoiceService $invoiceService;

    public function __construct(CartService $cartService, TrackingService $trackingService, InvoiceService $invoiceService)
    {
        $this->cartService = $cartService;
        $this->trackingService = $trackingService;
        $this->invoiceService = $invoiceService;
    }

    /**
     * Create an order from the user's cart.
     */
    public function createOrderFromCart(User $user, array $orderData): Order
    {
        return DB::transaction(function () use ($user, $orderData) {
            $cart = $this->cartService->getCartWithItems($user);

            if ($cart->items->isEmpty()) {
                throw new \Exception('Cart is empty');
            }

            // Calculate totals
            $totals = $this->cartService->getCartTotals($user);

            // Create the order
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => Order::generateOrderNumber(),
                'status' => Order::STATUS_PENDING,
                'subtotal' => $totals['subtotal'],
                'tax' => $totals['tax'],
                'delivery_fee' => $totals['delivery_fee'],
                'discount' => 0,
                'total' => $totals['total'],
                'delivery_address' => $orderData['delivery_address'],
                'delivery_phone' => $orderData['delivery_phone'],
                'delivery_notes' => $orderData['delivery_notes'] ?? null,
                'preferred_rdc' => $orderData['preferred_rdc'] ?? $user->preferred_rdc,
                'payment_status' => Order::PAYMENT_PENDING,
                'payment_method' => $orderData['payment_method'] ?? 'cash_on_delivery',
            ]);

            // Create order items and update stock
            foreach ($cart->items as $cartItem) {
                // Check stock availability
                $product = $cartItem->product;
                if ($cartItem->quantity > $product->stock_quantity) {
                    throw new \Exception("Insufficient stock for {$product->name}");
                }

                // Create order item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => $cartItem->quantity,
                    'unit_price' => $cartItem->unit_price,
                    'subtotal' => $cartItem->quantity * $cartItem->unit_price,
                ]);

                // Reduce stock
                $product->decrement('stock_quantity', $cartItem->quantity);
            }

            // Clear the cart
            $this->cartService->clearCart($user);

            // Create initial tracking entry
            $this->trackingService->createInitialTracking($order);

            // Create invoice for the order
            $invoice = $this->invoiceService->createInvoice($order);
            $this->invoiceService->sendInvoice($invoice);

            return $order->load('items');
        });
    }

    /**
     * Get orders for a user.
     */
    public function getUserOrders(User $user, ?string $status = null, int $perPage = 10)
    {
        $query = Order::forUser($user->id)
            ->with('items')
            ->orderBy('created_at', 'desc');

        if ($status) {
            $query->status($status);
        }

        return $query->paginate($perPage);
    }

    /**
     * Get a single order for a user.
     */
    public function getOrder(User $user, int $orderId): ?Order
    {
        return Order::forUser($user->id)
            ->with('items.product')
            ->find($orderId);
    }

    /**
     * Cancel an order.
     */
    public function cancelOrder(User $user, int $orderId): Order
    {
        return DB::transaction(function () use ($user, $orderId) {
            $order = Order::forUser($user->id)->findOrFail($orderId);

            if (!$order->canBeCancelled()) {
                throw new \Exception('This order cannot be cancelled.');
            }

            // Restore stock
            foreach ($order->items as $item) {
                $item->product->increment('stock_quantity', $item->quantity);
            }

            // Update order status
            $order->status = Order::STATUS_CANCELLED;
            $order->save();

            return $order;
        });
    }

    /**
     * Get order statistics for user dashboard.
     */
    public function getUserOrderStats(User $user): array
    {
        $orders = Order::forUser($user->id);

        return [
            'total_orders' => $orders->count(),
            'pending_orders' => Order::forUser($user->id)->status(Order::STATUS_PENDING)->count(),
            'total_spent' => Order::forUser($user->id)
                ->whereIn('status', [Order::STATUS_DELIVERED, Order::STATUS_CONFIRMED, Order::STATUS_PROCESSING])
                ->sum('total'),
        ];
    }
}
