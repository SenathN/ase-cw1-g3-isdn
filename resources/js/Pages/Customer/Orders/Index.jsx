import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ orders = {}, filters = {}, statuses = {} }) {
    const { flash } = usePage().props;

    const handleStatusFilter = (status) => {
        router.get(route('customer.orders.index'), { status: status || undefined }, {
            preserveState: true,
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            processing: 'bg-purple-100 text-purple-800',
            ready_for_delivery: 'bg-indigo-100 text-indigo-800',
            out_for_delivery: 'bg-cyan-100 text-cyan-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const orderData = orders.data || [];

    return (
        <CustomerLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    My Orders
                </h2>
            }
        >
            <Head title="Orders - IslandLink ISDN" />

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

                    {/* Status Filter */}
                    <div className="mb-6 flex flex-wrap gap-2">
                        <button
                            onClick={() => handleStatusFilter('')}
                            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                !filters.status
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-white text-gray-700 hover:bg-rose-50'
                            }`}
                        >
                            All Orders
                        </button>
                        {Object.entries(statuses).map(([value, label]) => (
                            <button
                                key={value}
                                onClick={() => handleStatusFilter(value)}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                    filters.status === value
                                        ? 'bg-rose-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-rose-50'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {orderData.length > 0 ? (
                        <div className="space-y-4">
                            {orderData.map((order) => (
                                <div key={order.id} className="overflow-hidden rounded-lg bg-white shadow-sm">
                                    <div className="border-b border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-medium text-gray-900">
                                                    Order #{order.order_number}
                                                </h3>
                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {statuses[order.status] || order.status}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Placed on {new Date(order.created_at).toLocaleDateString('en-AU', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-rose-600">
                                                ${parseFloat(order.total).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {order.items?.length || 0} items
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Order Items Preview */}
                                    <div className="p-4 flex items-center gap-4 overflow-x-auto">
                                        {order.items?.slice(0, 4).map((item) => (
                                            <div key={item.id} className="flex-shrink-0 text-center">
                                                <div className="h-16 w-16 rounded-md bg-gray-100 p-2">
                                                    <div className="flex h-full items-center justify-center text-2xl">
                                                        📦
                                                    </div>
                                                </div>
                                                <p className="mt-1 text-xs text-gray-500 truncate w-16">
                                                    {item.product_name}
                                                </p>
                                            </div>
                                        ))}
                                        {(order.items?.length || 0) > 4 && (
                                            <div className="flex-shrink-0 text-center">
                                                <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center">
                                                    <span className="text-sm text-gray-500">
                                                        +{order.items.length - 4}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-200 p-4 flex justify-between items-center">
                                        <div className="text-sm text-gray-500">
                                            📍 {order.preferred_rdc} RDC
                                        </div>
                                        <Link
                                            href={route('customer.orders.show', order.id)}
                                            className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination */}
                            {orders.last_page > 1 && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="flex gap-1">
                                        {orders.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`rounded-md px-3 py-2 text-sm ${
                                                    link.active
                                                        ? 'bg-rose-600 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 hover:bg-rose-50'
                                                        : 'cursor-not-allowed bg-gray-100 text-gray-400'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                            <div className="p-6 text-gray-900">
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📦</div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        {filters.status ? 'No orders found' : 'No Orders Yet'}
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        {filters.status
                                            ? 'No orders match the selected filter.'
                                            : 'Your order history will appear here once you start placing orders.'}
                                    </p>
                                    <Link
                                        href={route('customer.products.index')}
                                        className="inline-flex items-center rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-700"
                                    >
                                        Start Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
