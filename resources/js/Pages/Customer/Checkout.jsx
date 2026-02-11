import CustomerLayout from '@/Layouts/CustomerLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Checkout({ cart = {}, items = [], totals = {}, issues = [], user = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        delivery_address: user?.address || '',
        delivery_phone: user?.phone || '',
        delivery_notes: '',
        preferred_rdc: user?.preferred_rdc || '',
        payment_method: 'cash_on_delivery',
    });

    const rdcLocations = [
        { value: 'North', label: 'North RDC' },
        { value: 'South', label: 'South RDC' },
        { value: 'East', label: 'East RDC' },
        { value: 'West', label: 'West RDC' },
        { value: 'Central', label: 'Central RDC' },
    ];

    const paymentMethods = [
        { value: 'cash_on_delivery', label: 'Cash on Delivery' },
        { value: 'card', label: 'Credit/Debit Card' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('customer.orders.store'));
    };

    const hasIssues = issues.length > 0;

    return (
        <CustomerLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Checkout
                </h2>
            }
        >
            <Head title="Checkout - IslandLink ISDN" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {hasIssues && (
                        <div className="mb-4 rounded-md bg-red-50 p-4">
                            <h4 className="font-medium text-red-800">Cannot proceed with checkout</h4>
                            <ul className="mt-2 text-sm text-red-700">
                                {issues.map((issue, idx) => (
                                    <li key={idx}>• {issue.product_name}: {issue.issue}</li>
                                ))}
                            </ul>
                            <Link
                                href={route('customer.cart.index')}
                                className="mt-2 inline-block text-sm font-medium text-red-800 underline"
                            >
                                Return to cart
                            </Link>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-8 lg:grid-cols-3">
                            {/* Delivery Information */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Delivery Details */}
                                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                                    <div className="border-b border-gray-200 p-4">
                                        <h3 className="font-medium text-gray-900">Delivery Details</h3>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <div>
                                            <InputLabel htmlFor="delivery_address" value="Delivery Address" />
                                            <textarea
                                                id="delivery_address"
                                                value={data.delivery_address}
                                                onChange={(e) => setData('delivery_address', e.target.value)}
                                                rows={3}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                                                placeholder="Enter your full delivery address"
                                            />
                                            <InputError message={errors.delivery_address} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="delivery_phone" value="Contact Phone" />
                                            <TextInput
                                                id="delivery_phone"
                                                type="tel"
                                                value={data.delivery_phone}
                                                onChange={(e) => setData('delivery_phone', e.target.value)}
                                                className="mt-1 block w-full"
                                                placeholder="0400 000 000"
                                            />
                                            <InputError message={errors.delivery_phone} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="preferred_rdc" value="Preferred RDC Location" />
                                            <SelectInput
                                                id="preferred_rdc"
                                                value={data.preferred_rdc}
                                                onChange={(e) => setData('preferred_rdc', e.target.value)}
                                                options={rdcLocations}
                                                placeholder="Select nearest RDC"
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.preferred_rdc} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="delivery_notes" value="Delivery Notes (Optional)" />
                                            <textarea
                                                id="delivery_notes"
                                                value={data.delivery_notes}
                                                onChange={(e) => setData('delivery_notes', e.target.value)}
                                                rows={2}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                                                placeholder="Any special delivery instructions..."
                                            />
                                            <InputError message={errors.delivery_notes} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                                    <div className="border-b border-gray-200 p-4">
                                        <h3 className="font-medium text-gray-900">Payment Method</h3>
                                    </div>
                                    <div className="p-4">
                                        <div className="space-y-3">
                                            {paymentMethods.map((method) => (
                                                <label
                                                    key={method.value}
                                                    className={`flex cursor-pointer items-center rounded-lg border p-4 transition ${
                                                        data.payment_method === method.value
                                                            ? 'border-rose-500 bg-rose-50'
                                                            : 'border-gray-200 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="payment_method"
                                                        value={method.value}
                                                        checked={data.payment_method === method.value}
                                                        onChange={(e) => setData('payment_method', e.target.value)}
                                                        className="h-4 w-4 border-gray-300 text-rose-600 focus:ring-rose-500"
                                                    />
                                                    <span className="ml-3 font-medium text-gray-900">
                                                        {method.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                        <InputError message={errors.payment_method} className="mt-2" />
                                    </div>
                                </div>

                                {/* Order Items Summary */}
                                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                                    <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                                        <h3 className="font-medium text-gray-900">Order Items ({totals.item_count})</h3>
                                        <Link
                                            href={route('customer.cart.index')}
                                            className="text-sm text-rose-600 hover:underline"
                                        >
                                            Edit Cart
                                        </Link>
                                    </div>
                                    <ul className="divide-y divide-gray-200">
                                        {items.map((item) => (
                                            <li key={item.id} className="flex items-center gap-4 p-4">
                                                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                                                    {item.product?.image_url ? (
                                                        <img
                                                            src={item.product.image_url}
                                                            alt={item.product.name}
                                                            className="h-full w-full object-contain p-1"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center text-lg">
                                                            📦
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{item.product?.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {item.quantity} × ${parseFloat(item.unit_price).toFixed(2)}
                                                    </p>
                                                </div>
                                                <p className="font-medium text-gray-900">
                                                    ${(item.quantity * item.unit_price).toFixed(2)}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="sticky top-8 overflow-hidden rounded-lg bg-white shadow-sm">
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
                                    <div className="p-4 pt-0 space-y-3">
                                        <button
                                            type="submit"
                                            disabled={processing || hasIssues}
                                            className="block w-full rounded-md bg-rose-600 px-4 py-3 text-center font-medium text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
                                        >
                                            {processing ? 'Placing Order...' : 'Place Order'}
                                        </button>
                                        <Link
                                            href={route('customer.cart.index')}
                                            className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-center font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                                        >
                                            Back to Cart
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </CustomerLayout>
    );
}
