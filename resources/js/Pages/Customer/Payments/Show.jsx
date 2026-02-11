import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ payment = {} }) {
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-700';
            case 'pending':
            case 'processing':
                return 'bg-yellow-100 text-yellow-700';
            case 'failed':
                return 'bg-red-100 text-red-700';
            case 'refunded':
                return 'bg-gray-100 text-gray-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <CustomerLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Payment {payment.payment_number}
                    </h2>
                    <Link
                        href={route('customer.payments.index')}
                        className="text-sm text-rose-600 hover:text-rose-700"
                    >
                        ← Back to Payments
                    </Link>
                </div>
            }
        >
            <Head title={`Payment ${payment.payment_number} - IslandLink ISDN`} />

            <div className="py-8">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    {/* Payment Status Banner */}
                    <div
                        className={`mb-6 rounded-lg p-4 ${
                            payment.status === 'completed'
                                ? 'bg-green-50'
                                : payment.status === 'failed'
                                ? 'bg-red-50'
                                : payment.status === 'refunded'
                                ? 'bg-gray-50'
                                : 'bg-yellow-50'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">
                                    {payment.status === 'completed'
                                        ? '✅'
                                        : payment.status === 'failed'
                                        ? '❌'
                                        : payment.status === 'refunded'
                                        ? '↩️'
                                        : '⏳'}
                                </span>
                                <div>
                                    <h3
                                        className={`font-semibold ${
                                            payment.status === 'completed'
                                                ? 'text-green-800'
                                                : payment.status === 'failed'
                                                ? 'text-red-800'
                                                : payment.status === 'refunded'
                                                ? 'text-gray-800'
                                                : 'text-yellow-800'
                                        }`}
                                    >
                                        {payment.status_label}
                                    </h3>
                                    {payment.processed_at && (
                                        <p
                                            className={`text-sm ${
                                                payment.status === 'completed'
                                                    ? 'text-green-600'
                                                    : payment.status === 'failed'
                                                    ? 'text-red-600'
                                                    : 'text-gray-600'
                                            }`}
                                        >
                                            Processed on {payment.processed_at}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <span
                                className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadgeColor(
                                    payment.status
                                )}`}
                            >
                                {payment.status_label}
                            </span>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h3 className="font-semibold text-gray-800">Payment Details</h3>
                        </div>
                        <div className="p-6">
                            <dl className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Payment Number</dt>
                                    <dd className="mt-1 text-gray-900">{payment.payment_number}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Amount</dt>
                                    <dd className="mt-1 text-xl font-bold text-rose-600">
                                        ${parseFloat(payment.amount).toFixed(2)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                                    <dd className="mt-1 text-gray-900">{payment.payment_method_label}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Date</dt>
                                    <dd className="mt-1 text-gray-900">{payment.created_at}</dd>
                                </div>
                                {payment.transaction_id && (
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                                        <dd className="mt-1 font-mono text-gray-900">{payment.transaction_id}</dd>
                                    </div>
                                )}
                                {payment.payment_details?.card_last_four && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Card</dt>
                                        <dd className="mt-1 text-gray-900">
                                            •••• •••• •••• {payment.payment_details.card_last_four}
                                        </dd>
                                    </div>
                                )}
                                {payment.payment_details?.card_name && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Cardholder</dt>
                                        <dd className="mt-1 text-gray-900">{payment.payment_details.card_name}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>

                    {/* Failure Reason (if failed) */}
                    {payment.failure_reason && payment.status === 'failed' && (
                        <div className="mt-6 overflow-hidden rounded-lg bg-red-50 shadow-sm">
                            <div className="p-6">
                                <h4 className="font-medium text-red-800">Payment Failed</h4>
                                <p className="mt-1 text-sm text-red-700">{payment.failure_reason}</p>
                            </div>
                        </div>
                    )}

                    {/* Refund Info (if refunded) */}
                    {payment.status === 'refunded' && (
                        <div className="mt-6 overflow-hidden rounded-lg bg-gray-50 shadow-sm">
                            <div className="p-6">
                                <h4 className="font-medium text-gray-800">Refunded</h4>
                                <p className="mt-1 text-sm text-gray-600">
                                    {payment.failure_reason || 'This payment has been refunded.'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Related Order */}
                    <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h3 className="font-semibold text-gray-800">Related Order</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">{payment.order.order_number}</p>
                                    <Link
                                        href={route('customer.orders.show', payment.order.id)}
                                        className="text-sm text-rose-600 hover:text-rose-700"
                                    >
                                        View Order Details →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Invoice */}
                    {payment.invoice && (
                        <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
                            <div className="border-b border-gray-200 px-6 py-4">
                                <h3 className="font-semibold text-gray-800">Related Invoice</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {payment.invoice.invoice_number}
                                        </p>
                                        <Link
                                            href={route('customer.invoices.show', payment.invoice.id)}
                                            className="text-sm text-rose-600 hover:text-rose-700"
                                        >
                                            View Invoice →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 flex gap-4">
                        <Link
                            href={route('customer.payments.index')}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Back to Payments
                        </Link>
                        {payment.status === 'failed' && (
                            <Link
                                href={route('customer.payments.create', payment.order.id)}
                                className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
                            >
                                Try Again
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
