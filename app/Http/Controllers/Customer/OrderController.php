<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\CartService;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    protected OrderService $orderService;
    protected CartService $cartService;

    public function __construct(OrderService $orderService, CartService $cartService)
    {
        $this->orderService = $orderService;
        $this->cartService = $cartService;
    }

    /**
     * Display the list of orders.
     */
    public function index(Request $request)
    {
        $status = $request->get('status');
        $orders = $this->orderService->getUserOrders($request->user(), $status);

        return Inertia::render('Customer/Orders/Index', [
            'orders' => $orders,
            'filters' => [
                'status' => $status,
            ],
            'statuses' => [
                Order::STATUS_PENDING => 'Pending',
                Order::STATUS_CONFIRMED => 'Confirmed',
                Order::STATUS_PROCESSING => 'Processing',
                Order::STATUS_READY_FOR_DELIVERY => 'Ready for Delivery',
                Order::STATUS_OUT_FOR_DELIVERY => 'Out for Delivery',
                Order::STATUS_DELIVERED => 'Delivered',
                Order::STATUS_CANCELLED => 'Cancelled',
            ],
        ]);
    }

    /**
     * Display the checkout page.
     */
    public function checkout(Request $request)
    {
        $cart = $this->cartService->getCartWithItems($request->user());
        $totals = $this->cartService->getCartTotals($request->user());
        $issues = $this->cartService->validateCart($request->user());

        if ($cart->items->isEmpty()) {
            return redirect()->route('customer.cart.index')
                ->with('error', 'Your cart is empty.');
        }

        return Inertia::render('Customer/Checkout', [
            'cart' => $cart,
            'items' => $cart->items,
            'totals' => $totals,
            'issues' => $issues,
            'user' => $request->user(),
        ]);
    }

    /**
     * Place the order.
     */
    public function store(Request $request)
    {
        $request->validate([
            'delivery_address' => 'required|string|max:500',
            'delivery_phone' => 'required|string|max:20',
            'delivery_notes' => 'nullable|string|max:500',
            'preferred_rdc' => 'nullable|string',
            'payment_method' => 'required|in:cash_on_delivery,card',
        ]);

        try {
            $order = $this->orderService->createOrderFromCart($request->user(), [
                'delivery_address' => $request->delivery_address,
                'delivery_phone' => $request->delivery_phone,
                'delivery_notes' => $request->delivery_notes,
                'preferred_rdc' => $request->preferred_rdc,
                'payment_method' => $request->payment_method,
            ]);

            return redirect()->route('customer.orders.show', $order->id)
                ->with('success', 'Order placed successfully! Order #' . $order->order_number);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display a specific order.
     */
    public function show(Request $request, int $orderId)
    {
        $order = $this->orderService->getOrder($request->user(), $orderId);

        if (!$order) {
            abort(404);
        }

        return Inertia::render('Customer/Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Cancel an order.
     */
    public function cancel(Request $request, int $orderId)
    {
        try {
            $this->orderService->cancelOrder($request->user(), $orderId);
            return back()->with('success', 'Order cancelled successfully.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
