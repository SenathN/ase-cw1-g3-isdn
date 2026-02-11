import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ invoices = {}, stats = {}, filters = {}, statusOptions = [] }) {
    const [selectedStatus, setSelectedStatus] = useState(filters?.status || '');

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        router.get(route('customer.invoices.index'), { status }, { preserveState: true, replace: true });
    };

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

    const invoiceList = invoices?.data || [];

    return (
        <CustomerLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Invoices
                </h2>
            }
        >
            <Head title="Invoices - IslandLink ISDN" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <p className="text-sm text-gray-500">Total Invoices</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total_invoices}</p>
                        </div>
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <p className="text-sm text-gray-500">Pending</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.pending_invoices}</p>
                            <p className="text-xs text-gray-500">${parseFloat(stats.pending_amount || 0).toFixed(2)}</p>
                        </div>
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <p className="text-sm text-gray-500">Paid</p>
                            <p className="text-2xl font-bold text-green-600">{stats.paid_invoices}</p>
                            <p className="text-xs text-gray-500">${parseFloat(stats.paid_amount || 0).toFixed(2)}</p>
                        </div>
                        <div className="rounded-lg bg-white p-4 shadow-sm">
                            <p className="text-sm text-gray-500">Overdue</p>
                            <p className="text-2xl font-bold text-red-600">{stats.overdue_invoices}</p>
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

                    {/* Invoices List */}
                    {invoiceList.length === 0 ? (
                        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                            <div className="mx-auto mb-4 text-6xl">📄</div>
                            <h4 className="mb-2 text-lg font-medium text-gray-800">No Invoices Found</h4>
                            <p className="text-gray-600">
                                {selectedStatus
                                    ? 'No invoices match the selected filter.'
                                    : 'You don\'t have any invoices yet.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Invoice
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Order
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                            Due Date
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
                                    {invoiceList.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <Link
                                                    href={route('customer.invoices.show', invoice.id)}
                                                    className="font-medium text-rose-600 hover:text-rose-700"
                                                >
                                                    {invoice.invoice_number}
                                                </Link>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                {invoice.order?.order_number || 'N/A'}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                {new Date(invoice.invoice_date).toLocaleDateString()}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                {new Date(invoice.due_date).toLocaleDateString()}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                ${parseFloat(invoice.total).toFixed(2)}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeColor(
                                                        invoice.status
                                                    )}`}
                                                >
                                                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                <Link
                                                    href={route('customer.invoices.show', invoice.id)}
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
                            {invoices.last_page > 1 && (
                                <div className="border-t border-gray-200 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600">
                                            Showing {invoices.from} to {invoices.to} of {invoices.total} invoices
                                        </p>
                                        <div className="flex gap-2">
                                            {invoices.prev_page_url && (
                                                <Link
                                                    href={invoices.prev_page_url}
                                                    className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50"
                                                >
                                                    Previous
                                                </Link>
                                            )}
                                            {invoices.next_page_url && (
                                                <Link
                                                    href={invoices.next_page_url}
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
