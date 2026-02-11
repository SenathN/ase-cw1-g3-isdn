<?php

namespace App\Http\Controllers\Logistics;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the logistics dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('Logistics/Dashboard');
    }
}
