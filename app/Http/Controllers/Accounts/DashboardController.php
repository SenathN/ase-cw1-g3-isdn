<?php

namespace App\Http\Controllers\Accounts;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the accounts dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('Accounts/Dashboard');
    }
}
