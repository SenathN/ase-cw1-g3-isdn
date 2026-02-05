<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the customer dashboard.
     */
    public function index(): Response
    {
        $user = auth()->user();

        return Inertia::render('Customer/Dashboard', [
            'stats' => [
                'totalOrders' => 0, // TODO: Implement when Order model is ready
                'pendingOrders' => 0,
                'totalSpent' => 0,
            ],
            'recentOrders' => [], // TODO: Implement when Order model is ready
        ]);
    }
}
