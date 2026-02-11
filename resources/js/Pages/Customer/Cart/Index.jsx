import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ cart, items = [], totals = {}, issues = [] }) {
    const { flash } = usePage().props;

    const updateQuantity = (itemId, quantity) => {
        router.patch(route('customer.cart.update', itemId), { quantity }, {
            preserveScroll: true,
        });
    };

    const removeItem = (itemId) => {
        router.delete(route('customer.cart.remove', itemId), {
            preserveScroll: true,
        });
    };

    const clearCart = () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            router.delete(route('customer.cart.clear'));
        }
    };

    const syncPrices = () => {
        router.post(route('customer.cart.sync'));
    };

    const hasIssues = issues.length > 0;
    const hasPriceChanges = issues.some(i => i.issue === 'Price has changed');

    if (items.length === 0) {
        return (
            <CustomerLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Shopping Cart
                    </h2>
                }
            >
                <Head title="Cart - IslandLink ISDN" />

                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🛍️</div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        Your Cart is Empty
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Add some products to your cart to get started.
                                    </p>
                                    <Link
                                        href={route('customer.products.index')}
                                        className="inline-flex items-center rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-700"
                                    >
                                        Browse Products
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Shopping Cart ({totals.item_count} items)
                </h2>
            }
        >
            <Head title="Cart - IslandLink ISDN" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-4 rounded-md bg-green-50 p-4 text-green-700">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
                            {flash.error}
                        </div>
                    )}

                    {/* Issues Alert */}
                    {hasIssues && (
                        <div className="mb-4 rounded-md bg-yellow-50 p-4">
                            <h4 className="font-medium text-yellow-800">Cart Issues</h4>
                            <ul className="mt-2 text-sm text-yellow-700">
                                {issues.map((issue, idx) => (
                                    <li key={idx}>• {issue.product_name}: {issue.issue}</li>
                                ))}
                            </ul>
                            {hasPriceChanges && (
                                <button
                                    onClick={syncPrices}
                                    className="mt-2 text-sm font-medium text-yellow-800 underline"
                                >
                                    Update to current prices
                                </button>
                            )}
                        </div>
                    )}

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                                <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                                    <h3 className="font-medium text-gray-900">Cart Items</h3>
                                    <button
                                        onClick={clearCart}
                                        className="text-sm text-gray-500 hover:text-red-600"
                                    >
                                        Clear Cart
                                    </button>
                                </div>

                                <ul className="divide-y divide-gray-200">
                                    {items.map((item) => (
                                        <li key={item.id} className="p-4">
                                            <div className="flex gap-4">
                                                {/* Product Image */}
                                                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                                                    {item.product?.image_url ? (
                                                        <img
                                                            src={item.product.image_url}
                                                            alt={item.product.name}
                                                            className="h-full w-full object-contain p-2"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center text-2xl">
                                                            📦
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex flex-1 flex-col">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <Link
                                                                href={route('customer.products.show', item.product_id)}
                                                                className="font-medium text-gray-900 hover:text-rose-600"
                                                            >
                                                                {item.product?.name}
                                                            </Link>
                                                            <p className="mt-1 text-sm text-gray-500">
                                                                ${parseFloat(item.unit_price).toFixed(2)} per {item.product?.unit}
                                                            </p>
                                                        </div>
                                                        <p className="font-medium text-gray-900">
                                                            ${(item.quantity * item.unit_price).toFixed(2)}
                                                        </p>
                                                    </div>

                                                    <div className="mt-2 flex items-center justify-between">
                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-8 text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                disabled={item.quantity >= item.product?.stock_quantity}
                                                                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        {/* Remove Button */}
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-sm text-red-600 hover:underline"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Continue Shopping */}
                            <div className="mt-4">
                                <Link
                                    href={route('customer.products.index')}
                                    className="text-sm text-rose-600 hover:underline"
                                >
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                                <div className="border-b border-gray-200 p-4">
                                    <h3 className="font-medium text-gray-900">Order Summary</h3>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="text-gray-900">${totals.subtotal?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax (10%)</span>
                                        <span className="text-gray-900">${totals.tax?.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Delivery Fee</span>
                                        <span className="text-gray-900">${totals.delivery_fee?.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                                        <span className="font-medium text-gray-900">Total</span>
                                        <span className="font-bold text-lg text-rose-600">${totals.total?.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="p-4 pt-0">
                                    <Link
                                        href={route('customer.checkout')}
                                        className={`block w-full rounded-md bg-rose-600 px-4 py-3 text-center font-medium text-white shadow-sm transition hover:bg-rose-700 ${hasIssues ? 'opacity-50 pointer-events-none' : ''}`}
                                    >
                                        Proceed to Checkout
                                    </Link>
                                    {hasIssues && (
                                        <p className="mt-2 text-center text-xs text-red-600">
                                            Please resolve cart issues before checkout
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
