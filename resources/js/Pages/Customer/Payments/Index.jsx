import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ payments = {}, stats = {}, filters = {}, statusOptions = [] }) {
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        router.get(route('customer.payments.index'), { status }, { preserveState: true, replace: true });
    };

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

    const paymentList = payments?.data || [];

    return (
        <CustomerLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Payment History
                </h2>
            }
        >
            <Head title="Payments - IslandLink ISDN" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <p className="text-sm text-gray-500">Total Payments</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_payments}</p>
                        </div>
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <p className="text-sm text-gray-500">Completed</p>
                            <p className="text-2xl font-bold text-green-600">{stats.completed_payments}</p>
                            <p className="text-xs text-gray-500">${parseFloat(stats.total_paid || 0).toFixed(2)}</p>
                        </div>
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.pending_payments}</p>
                        </div>
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <p className="text-sm text-gray-500">Refunded</p>
                            <p className="text-2xl font-bold text-gray-600">
                                ${parseFloat(stats.total_refunded || 0).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Filter */}
                    <div className="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-medium text-gray-700">Filter by status:</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="rounded-md border-gray-300 text-sm shadow-sm focus:border-rose-500 focus:ring-rose-500"
                            >
                                {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Payments List */}
                    {paymentList.length === 0 ? (
                        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                            <div className="mx-auto mb-4 text-6xl">💳</div>
                            <h4 className="mb-2 text-lg font-medium text-gray-800">No Payments Found</h4>
                            <p className="text-gray-600">
                                {selectedStatus
                                    ? 'No payments match the selected filter.'
                                    : 'You haven\'t made any payments yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Payment
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Order
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Method
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {paymentList.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <Link
                                                    href={route('customer.payments.show', payment.id)}
                                                    className="font-medium text-rose-600 hover:text-rose-700"
                                                >
                                                    {payment.payment_number}
                                                </Link>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(payment.created_at).toLocaleDateString()}
                                                </p>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                {payment.order?.order_number || 'N/A'}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                {payment.payment_method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                ${parseFloat(payment.amount).toFixed(2)}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeColor(
                                                        payment.status
                                                    )}`}
                                                >
                                                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                <Link
                                                    href={route('customer.payments.show', payment.id)}
                                                    className="text-rose-600 hover:text-rose-700"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {payments.last_page > 1 && (
                                <div className="border-t border-gray-200 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600">
                                            Showing {payments.from} to {payments.to} of {payments.total} payments
                                        </p>
                                        <div className="flex gap-2">
                                            {payments.prev_page_url && (
                                                <Link
                                                    href={payments.prev_page_url}
                                                    className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
                                                >
                                                    Previous
                                                </Link>
                                            )}
                                            {payments.next_page_url && (
                                                <Link
                                                    href={payments.next_page_url}
                                                    className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
                                                >
                                                    Next
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
