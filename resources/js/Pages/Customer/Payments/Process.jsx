import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Process({ order = {}, paymentMethods = [] }) {
    const { flash } = usePage().props;
    const [selectedMethod, setSelectedMethod] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        payment_method: '',
        card_number: '',
        card_expiry: '',
        card_cvv: '',
        card_name: '',
    });

    const handleMethodSelect = (methodId) => {
        setSelectedMethod(methodId);
        setData('payment_method', methodId);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('customer.payments.store', order.id));
    };

    const isCardPayment = ['credit_card', 'debit_card'].includes(selectedMethod);

    return (
        <CustomerLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Pay for Order {order.order_number}
                    </h2>
                    <Link
                        href={route('customer.orders.show', order.id)}
                        className="text-sm text-rose-600 hover:text-rose-700"
                    >
                        ← Back to Order
                    </Link>
                </div>
            }
        >
            <Head title="Payment - IslandLink ISDN" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {flash?.error && (
                        <div className="mb-6 rounded-lg bg-red-50 p-4">
                            <p className="text-red-700">{flash.error}</p>
                        </div>
                    )}

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Payment Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit}>
                                {/* Payment Methods */}
                                <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                                    <div className="border-b border-gray-200 px-6 py-4">
                                        <h3 className="font-semibold text-gray-800">Select Payment Method</h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {paymentMethods.map((method) => (
                                                <button
                                                    key={method.id}
                                                    type="button"
                                                    onClick={() => handleMethodSelect(method.id)}
                                                    className={`flex items-start gap-3 rounded-lg border-2 p-4 text-left transition ${
                                                        selectedMethod === method.id
                                                            ? 'border-rose-600 bg-rose-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <span className="text-2xl">{method.icon}</span>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{method.name}</p>
                                                        <p className="text-sm text-gray-600">{method.description}</p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        {errors.payment_method && (
                                            <p className="mt-2 text-sm text-red-600">{errors.payment_method}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Card Details (for card payments) */}
                                {isCardPayment && (
                                    <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
                                        <div className="border-b border-gray-200 px-6 py-4">
                                            <h3 className="font-semibold text-gray-800">Card Details</h3>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Name on Card
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.card_name}
                                                    onChange={(e) => setData('card_name', e.target.value)}
                                                    placeholder="John Doe"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                                                />
                                                {errors.card_name && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.card_name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Card Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.card_number}
                                                    onChange={(e) => setData('card_number', e.target.value.replace(/\D/g, '').slice(0, 16))}
                                                    placeholder="1234 5678 9012 3456"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                                                />
                                                {errors.card_number && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.card_number}</p>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Expiry Date
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.card_expiry}
                                                        onChange={(e) => setData('card_expiry', e.target.value)}
                                                        placeholder="MM/YY"
                                                        maxLength={5}
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                                                    />
                                                    {errors.card_expiry && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.card_expiry}</p>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        CVV
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.card_cvv}
                                                        onChange={(e) => setData('card_cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                        placeholder="123"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                                                    />
                                                    {errors.card_cvv && (
                                                        <p className="mt-1 text-sm text-red-600">{errors.card_cvv}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="rounded-lg bg-gray-50 p-3">
                                                <p className="text-xs text-gray-500">
                                                    🔒 Your payment information is encrypted and secure. We do not store your full card details.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Bank Transfer Info */}
                                {selectedMethod === 'bank_transfer' && (
                                    <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
                                        <div className="border-b border-gray-200 px-6 py-4">
                                            <h3 className="font-semibold text-gray-800">Bank Transfer Details</h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="rounded-lg bg-blue-50 p-4">
                                                <p className="text-sm text-blue-800">
                                                    After confirming, you'll receive bank details to complete the transfer.
                                                    Your order will be processed once payment is verified (1-2 business days).
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Cash on Delivery Info */}
                                {selectedMethod === 'cash' && (
                                    <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
                                        <div className="border-b border-gray-200 px-6 py-4">
                                            <h3 className="font-semibold text-gray-800">Cash on Delivery</h3>
                                        </div>
                                        <div className="p-6">
                                            <div className="rounded-lg bg-yellow-50 p-4">
                                                <p className="text-sm text-yellow-800">
                                                    Please prepare the exact amount of <strong>${parseFloat(order.total).toFixed(2)}</strong> for the delivery driver.
                                                    Your order will be marked as paid upon delivery.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        disabled={!selectedMethod || processing}
                                        className="w-full rounded-md bg-rose-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {processing
                                            ? 'Processing...'
                                            : `Pay $${parseFloat(order.total).toFixed(2)}`}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-8 overflow-hidden rounded-lg bg-white shadow-sm">
                                <div className="border-b border-gray-200 px-6 py-4">
                                    <h3 className="font-semibold text-gray-800">Order Summary</h3>
                                </div>
                                <div className="p-6">
                                    <div className="mb-4 space-y-3">
                                        {order.items.slice(0, 3).map((item, index) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span className="text-gray-600">
                                                    {item.product_name} × {item.quantity}
                                                </span>
                                                <span className="text-gray-900">
                                                    ${parseFloat(item.subtotal).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <p className="text-sm text-gray-500">
                                                +{order.items.length - 3} more items
                                            </p>
                                        )}
                                    </div>

                                    <div className="border-t pt-4 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span>${parseFloat(order.subtotal).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Tax</span>
                                            <span>${parseFloat(order.tax).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Delivery</span>
                                            <span>${parseFloat(order.delivery_fee).toFixed(2)}</span>
                                        </div>
                                        {parseFloat(order.discount) > 0 && (
                                            <div className="flex justify-between text-sm text-green-600">
                                                <span>Discount</span>
                                                <span>-${parseFloat(order.discount).toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 border-t pt-4">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-rose-600">
                                                ${parseFloat(order.total).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
