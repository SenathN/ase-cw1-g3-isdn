import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ activeOrders = [], deliveredOrders = [], statusSteps = [] }) {
    return (
        <CustomerLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Order Tracking
                </h2>
            }
        >
            <Head title="Order Tracking - IslandLink ISDN" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Active Orders */}
                    <div className="mb-8">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800">
                            Active Orders ({activeOrders.length})
                        </h3>

                        {activeOrders.length === 0 ? (
                            <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                                <div className="mx-auto mb-4 text-6xl">📦</div>
                                <h4 className="mb-2 text-lg font-medium text-gray-800">
                                    No Active Orders
                                </h4>
                                <p className="mb-4 text-gray-600">
                                    You don't have any orders being processed right now.
                                </p>
                                <Link
                                    href={route('customer.products.index')}
                                    className="inline-block rounded-md bg-rose-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
                                >
                                    Browse Products
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {activeOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="overflow-hidden rounded-lg bg-white shadow-sm"
                                    >
                                        <div className="p-6">
                                            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                                <div>
                                                    <Link
                                                        href={route('customer.tracking.show', order.id)}
                                                        className="text-lg font-semibold text-rose-600 hover:text-rose-700"
                                                    >
                                                        {order.order_number}
                                                    </Link>
                                                    <p className="mt-1 text-sm text-gray-600">
                                                        {order.item_count} item(s) • Rs. {parseFloat(order.total).toFixed(2)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Ordered on {order.created_at}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700">
                                                        {order.status_label}
                                                    </span>
                                                    {order.estimated_delivery && (
                                                        <p className="mt-1 text-sm text-gray-600">
                                                            Est. delivery: {order.estimated_delivery}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Progress Steps */}
                                            <div className="mt-6">
                                                <div className="flex items-center justify-between">
                                                    {statusSteps.map((step, index) => (
                                                        <div
                                                            key={step.step}
                                                            className="flex flex-1 items-center"
                                                        >
                                                            <div
                                                                className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${
                                                                    order.current_step >= step.step
                                                                        ? 'bg-rose-600 text-white'
                                                                        : 'bg-gray-200 text-gray-500'
                                                                }`}
                                                            >
                                                                {step.icon}
                                                            </div>
                                                            {index < statusSteps.length - 1 && (
                                                                <div
                                                                    className={`h-1 flex-1 ${
                                                                        order.current_step > step.step
                                                                            ? 'bg-rose-600'
                                                                            : 'bg-gray-200'
                                                                    }`}
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-2 flex justify-between text-xs text-gray-600">
                                                    {statusSteps.map((step) => (
                                                        <span
                                                            key={step.step}
                                                            className={`flex-1 text-center ${
                                                                order.current_step >= step.step
                                                                    ? 'font-medium text-rose-700'
                                                                    : ''
                                                            }`}
                                                        >
                                                            {step.label}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Latest Update */}
                                            {order.latest_update && (
                                                <div className="mt-4 rounded-md bg-gray-50 p-3">
                                                    <p className="text-sm text-gray-700">
                                                        <span className="font-medium">Latest update:</span>{' '}
                                                        {order.latest_update.title}
                                                        <span className="ml-2 text-gray-500">
                                                            ({order.latest_update.time})
                                                        </span>
                                                    </p>
                                                </div>
                                            )}

                                            <div className="mt-4 flex justify-end">
                                                <Link
                                                    href={route('customer.tracking.show', order.id)}
                                                    className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recently Delivered */}
                    {deliveredOrders.length > 0 && (
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-gray-800">
                                Recently Delivered
                            </h3>
                            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Order
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Delivered
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {deliveredOrders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <Link
                                                        href={route('customer.orders.show', order.id)}
                                                        className="font-medium text-rose-600 hover:text-rose-700"
                                                    >
                                                        {order.order_number}
                                                    </Link>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                    {order.delivered_at}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                                    Rs. {parseFloat(order.total).toFixed(2)}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right">
                                                    <Link
                                                        href={route('customer.orders.show', order.id)}
                                                        className="text-sm text-rose-600 hover:text-rose-700"
                                                    >
                                                        View Order
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
