<?php

namespace App\Http\Controllers\RDC;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the RDC staff dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('RDC/Dashboard');
    }
}
