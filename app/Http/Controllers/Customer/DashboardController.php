<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\CartService;
use App\Services\OrderService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    protected OrderService $orderService;
    protected CartService $cartService;

    public function __construct(OrderService $orderService, CartService $cartService)
    {
        $this->orderService = $orderService;
        $this->cartService = $cartService;
    }

    /**
     * Display the customer dashboard.
     */
    public function index(): Response
    {
        $user = auth()->user();
        $stats = $this->orderService->getUserOrderStats($user);
        $cartTotals = $this->cartService->getCartTotals($user);

        // Get recent orders
        $recentOrders = Order::forUser($user->id)
            ->with('items')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Customer/Dashboard', [
            'stats' => [
                'totalOrders' => $stats['total_orders'],
                'pendingOrders' => $stats['pending_orders'],
                'totalSpent' => $stats['total_spent'],
                'cartItems' => $cartTotals['item_count'],
            ],
            'recentOrders' => $recentOrders,
        ]);
    }
}
