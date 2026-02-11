import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ invoice = {}, canPay = false }) {
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-700';
            case 'sent':
                return 'bg-blue-100 text-blue-700';
            case 'overdue':
                return 'bg-red-100 text-red-700';
            case 'draft':
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
                        Invoice {invoice.invoice_number}
                    </h2>
                    <Link
                        href={route('customer.invoices.index')}
                        className="text-sm text-rose-600 hover:text-rose-700"
                    >
                        ← Back to Invoices
                    </Link>
                </div>
            }
        >
            <Head title={`Invoice ${invoice.invoice_number} - IslandLink ISDN`} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Invoice Header */}
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="border-b border-gray-200 p-6">
                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">🧾</span>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">
                                                {invoice.invoice_number}
                                            </h3>
                                            <p className="text-gray-600">
                                                Order: {invoice.order.order_number}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusBadgeColor(
                                            invoice.status
                                        )}`}
                                    >
                                        {invoice.status_label}
                                    </span>
                                    {invoice.is_overdue && (
                                        <p className="mt-1 text-sm text-red-600">⚠️ Overdue</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Invoice Details */}
                        <div className="grid gap-6 p-6 md:grid-cols-3">
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-500">Invoice Date</h4>
                                <p className="text-gray-900">{invoice.invoice_date}</p>
                            </div>
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-500">Due Date</h4>
                                <p className={invoice.is_overdue ? 'text-red-600 font-medium' : 'text-gray-900'}>
                                    {invoice.due_date}
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-2 text-sm font-medium text-gray-500">Total Amount</h4>
                                <p className="text-xl font-bold text-rose-600">
                                    ${parseFloat(invoice.total).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bill To / Ship To */}
                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                            <h4 className="mb-3 font-semibold text-gray-800">Bill To</h4>
                            <div className="space-y-2 text-sm">
                                <p className="font-medium text-gray-900">{invoice.customer.name}</p>
                                <p className="text-gray-600">{invoice.customer.email}</p>
                                {invoice.customer.phone && (
                                    <p className="text-gray-600">{invoice.customer.phone}</p>
                                )}
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                            <h4 className="mb-3 font-semibold text-gray-800">Ship To</h4>
                            <p className="text-sm text-gray-600">{invoice.order.delivery_address}</p>
                        </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h4 className="font-semibold text-gray-800">Items</h4>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Item
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Unit Price
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {invoice.order.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {item.product_name}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-600">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-600">
                                            ${parseFloat(item.unit_price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                            ${parseFloat(item.subtotal).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50">
                                <tr>
                                    <td colSpan="3" className="px-6 py-3 text-right text-sm text-gray-600">
                                        Subtotal
                                    </td>
                                    <td className="px-6 py-3 text-right text-sm text-gray-900">
                                        ${parseFloat(invoice.subtotal).toFixed(2)}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="3" className="px-6 py-3 text-right text-sm text-gray-600">
                                        Tax
                                    </td>
                                    <td className="px-6 py-3 text-right text-sm text-gray-900">
                                        ${parseFloat(invoice.tax).toFixed(2)}
                                    </td>
                                </tr>
                                <tr className="border-t border-gray-200">
                                    <td colSpan="3" className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                                        Total Due
                                    </td>
                                    <td className="px-6 py-4 text-right text-lg font-bold text-rose-600">
                                        ${parseFloat(invoice.total).toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Payment History */}
                    {invoice.payments.length > 0 && (
                        <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
                            <div className="border-b border-gray-200 px-6 py-4">
                                <h4 className="font-semibold text-gray-800">Payment History</h4>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {invoice.payments.map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between p-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{payment.payment_number}</p>
                                            <p className="text-sm text-gray-600">
                                                {payment.payment_method} • {payment.processed_at || 'Pending'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                ${parseFloat(payment.amount).toFixed(2)}
                                            </p>
                                            <span
                                                className={`text-xs font-medium ${
                                                    payment.status === 'completed'
                                                        ? 'text-green-600'
                                                        : payment.status === 'failed'
                                                        ? 'text-red-600'
                                                        : 'text-yellow-600'
                                                }`}
                                            >
                                                {payment.status_label}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {invoice.notes && (
                        <div className="mt-6 overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                            <h4 className="mb-2 font-semibold text-gray-800">Notes</h4>
                            <p className="text-sm text-gray-600">{invoice.notes}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex gap-3">
                            <Link
                                href={route('customer.orders.show', invoice.order.id)}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                View Order
                            </Link>
                            <a
                                href={route('customer.invoices.download', invoice.id)}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                📥 Download PDF
                            </a>
                        </div>
                        {canPay && (
                            <Link
                                href={route('customer.payments.create', invoice.order.id)}
                                className="rounded-md bg-rose-600 px-6 py-2 text-sm font-medium text-white hover:bg-rose-700"
                            >
                                Pay Now
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
