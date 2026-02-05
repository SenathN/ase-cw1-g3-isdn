import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats = {}, recentOrders = [] }) {
    const quickActions = [
        {
            name: 'Browse Products',
            description: 'Explore our FMCG catalog',
            href: 'customer.products.index',
            icon: '🛒',
            color: 'bg-blue-500',
        },
        {
            name: 'View Orders',
            description: 'Track your order history',
            href: 'customer.orders.index',
            icon: '📦',
            color: 'bg-green-500',
        },
        {
            name: 'Shopping Cart',
            description: 'Review items in your cart',
            href: 'customer.cart.index',
            icon: '🛍️',
            color: 'bg-purple-500',
        },
        {
            name: 'My Profile',
            description: 'Manage your account',
            href: 'profile.edit',
            icon: '👤',
            color: 'bg-orange-500',
        },
    ];

    return (
        <CustomerLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Customer Dashboard
                </h2>
            }
        >
            <Head title="Dashboard - IslandLink ISDN" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Welcome Section */}
                    <div className="mb-8 overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-2xl font-bold text-gray-800">
                                Welcome to IslandLink! 👋
                            </h3>
                            <p className="mt-2 text-gray-600">
                                Your one-stop shop for FMCG products. Browse our catalog, place orders, and track deliveries all in one place.
                            </p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Total Orders</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">
                                {stats.totalOrders || 0}
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Pending Orders</div>
                            <div className="mt-2 text-3xl font-bold text-yellow-600">
                                {stats.pendingOrders || 0}
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                            <div className="text-sm font-medium text-gray-500">Total Spent</div>
                            <div className="mt-2 text-3xl font-bold text-green-600">
                                ${(stats.totalSpent || 0).toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800">Quick Actions</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {quickActions.map((action) => (
                                <Link
                                    key={action.name}
                                    href={route(action.href)}
                                    className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-sm transition-all hover:shadow-md"
                                >
                                    <div className="flex items-center">
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${action.color} text-2xl text-white`}>
                                            {action.icon}
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="font-medium text-gray-900 group-hover:text-indigo-600">
                                                {action.name}
                                            </h4>
                                            <p className="text-sm text-gray-500">{action.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                                <Link
                                    href={route('customer.orders.index')}
                                    className="text-sm text-indigo-600 hover:text-indigo-800"
                                >
                                    View all →
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            {recentOrders.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">📦</div>
                                    <p className="text-gray-500">No orders yet</p>
                                    <Link
                                        href={route('customer.products.index')}
                                        className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
                                    >
                                        Start shopping →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                                        >
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    Order #{order.order_number}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {order.created_at}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium text-gray-900">
                                                    ${order.total_amount}
                                                </div>
                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                                    order.status === 'delivered'
                                                        ? 'bg-green-100 text-green-800'
                                                        : order.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
