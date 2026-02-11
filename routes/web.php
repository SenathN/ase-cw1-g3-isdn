<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\Customer\ProductController as CustomerProductController;
use App\Http\Controllers\Customer\CartController as CustomerCartController;
use App\Http\Controllers\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Customer\TrackingController as CustomerTrackingController;
use App\Http\Controllers\Customer\InvoiceController as CustomerInvoiceController;
use App\Http\Controllers\Customer\PaymentController as CustomerPaymentController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\RDC\DashboardController as RDCDashboardController;
use App\Http\Controllers\Logistics\DashboardController as LogisticsDashboardController;
use App\Http\Controllers\Driver\DashboardController as DriverDashboardController;
use App\Http\Controllers\Accounts\DashboardController as AccountsDashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// Legacy dashboard route - redirects to role-based dashboard
Route::get('/dashboard', function () {
    $user = auth()->user();
    return redirect()->route($user->getDashboardRoute());
})->middleware(['auth', 'verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Customer Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:customer'])->prefix('customer')->name('customer.')->group(function () {
    Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');
    
    // Product routes
    Route::get('/products', [CustomerProductController::class, 'index'])->name('products.index');
    Route::get('/products/{product}', [CustomerProductController::class, 'show'])->name('products.show');
    
    // Cart routes
    Route::get('/cart', [CustomerCartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CustomerCartController::class, 'add'])->name('cart.add');
    Route::patch('/cart/{item}', [CustomerCartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{item}', [CustomerCartController::class, 'remove'])->name('cart.remove');
    Route::delete('/cart', [CustomerCartController::class, 'clear'])->name('cart.clear');
    Route::post('/cart/sync', [CustomerCartController::class, 'syncPrices'])->name('cart.sync');
    
    // Checkout & Order routes
    Route::get('/checkout', [CustomerOrderController::class, 'checkout'])->name('checkout');
    Route::post('/orders', [CustomerOrderController::class, 'store'])->name('orders.store');
    Route::get('/orders', [CustomerOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [CustomerOrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{order}/cancel', [CustomerOrderController::class, 'cancel'])->name('orders.cancel');
    
    // Tracking routes
    Route::get('/tracking', [CustomerTrackingController::class, 'index'])->name('tracking.index');
    Route::get('/tracking/{order}', [CustomerTrackingController::class, 'show'])->name('tracking.show');
    
    // Invoice routes
    Route::get('/invoices', [CustomerInvoiceController::class, 'index'])->name('invoices.index');
    Route::get('/invoices/{invoice}', [CustomerInvoiceController::class, 'show'])->name('invoices.show');
    Route::get('/invoices/{invoice}/download', [CustomerInvoiceController::class, 'download'])->name('invoices.download');
    
    // Payment routes
    Route::get('/payments', [CustomerPaymentController::class, 'index'])->name('payments.index');
    Route::get('/payments/process/{order}', [CustomerPaymentController::class, 'create'])->name('payments.create');
    Route::post('/payments/process/{order}', [CustomerPaymentController::class, 'store'])->name('payments.store');
    Route::get('/payments/{payment}', [CustomerPaymentController::class, 'show'])->name('payments.show');
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| RDC Staff Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:rdc_staff'])->prefix('rdc')->name('rdc.')->group(function () {
    Route::get('/dashboard', [RDCDashboardController::class, 'index'])->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| Logistics Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:logistics'])->prefix('logistics')->name('logistics.')->group(function () {
    Route::get('/dashboard', [LogisticsDashboardController::class, 'index'])->name('dashboard');

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
            
            // Drivers management
            Route::resource('drivers', \App\Http\Controllers\Logistics\DriverController::class)
                ->names([
                    'index' => 'drivers.index',
                    'create' => 'drivers.create',
                    'store' => 'drivers.store',
                    'edit' => 'drivers.edit',
                    'update' => 'drivers.update',
                    'destroy' => 'drivers.destroy'
                ]);

            Route::get('users-list', [\App\Http\Controllers\Logistics\DriverController::class, 'usersOptionsFetch'])
                ->name('users.list');
            
    Route::get('/products', [CustomerProductController::class, 'index'])->name('products.index');
    Route::get('/products/{product}', [CustomerProductController::class, 'show'])->name('products.show');
    
});

/*
|--------------------------------------------------------------------------
| Driver Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:driver'])->prefix('driver')->name('driver.')->group(function () {
    Route::get('/dashboard', [DriverDashboardController::class, 'index'])->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| Accounts Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified', 'role:accounts'])->prefix('accounts')->name('accounts.')->group(function () {
    Route::get('/dashboard', [AccountsDashboardController::class, 'index'])->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| Profile Routes (shared across all roles)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    
});

require __DIR__.'/auth.php';
