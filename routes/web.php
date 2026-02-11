<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('logistics')
        ->name('logistics.')
        ->group(function () {
            Route::resource('delivery-schedules', \App\Http\Controllers\Logistics\DeliveryScheduleController::class)
                ->names([
                    'index' => 'schedules.index',
                    'create' => 'schedules.create',
                    'store' => 'schedules.store',
                    'edit' => 'schedules.edit',
                    'update' => 'schedules.update',
                    'destroy' => 'schedules.destroy'
                ]);

                Route::get('orders-list', 
                    [\App\Http\Controllers\Logistics\DeliveryScheduleController::class, 'optionsFetch']
                )->name('orders.list');
                Route::get('drivers-list', 
                    [\App\Http\Controllers\Logistics\DeliveryScheduleController::class, 'driversOptionsFetch']
                )->name('drivers.list');
        });
});

require __DIR__.'/auth.php';
