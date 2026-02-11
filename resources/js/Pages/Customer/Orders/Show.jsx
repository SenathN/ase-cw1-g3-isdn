import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Show({ order = {} }) {
    const { flash } = usePage().props;

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

    const getPaymentStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            refunded: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const statusLabels = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        processing: 'Processing',
        ready_for_delivery: 'Ready for Delivery',
        out_for_delivery: 'Out for Delivery',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
    };

    const paymentStatusLabels = {
        pending: 'Pending',
        paid: 'Paid',
        failed: 'Failed',
        refunded: 'Refunded',
    };

    const canCancel = ['pending', 'confirmed'].includes(order.status);

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
            router.post(route('customer.orders.cancel', order.id));
        }
    };

    const orderSteps = [
        { status: 'pending', label: 'Order Placed' },
        { status: 'confirmed', label: 'Confirmed' },
        { status: 'processing', label: 'Processing' },
        { status: 'ready_for_delivery', label: 'Ready' },
        { status: 'out_for_delivery', label: 'Out for Delivery' },
        { status: 'delivered', label: 'Delivered' },
    ];

    const getStepIndex = (status) => {
        if (status === 'cancelled') return -1;
        return orderSteps.findIndex(s => s.status === status);
    };

    const currentStepIndex = getStepIndex(order.status);

    return (
        <CustomerLayout
            header={
                <div className="flex items-center gap-2 text-sm">
                    <Link href={route('customer.orders.index')} className="text-rose-600 hover:underline">
                        Orders
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-800">{order.order_number}</span>
                </div>
            }
        >
            <Head title={`Order ${order.order_number} - IslandLink ISDN`} />

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

                    {/* Order Header */}
                    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Order #{order.order_number}
                                    </h1>
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
                                <div className="flex items-center gap-3">
                                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {statusLabels[order.status] || order.status}
                                    </span>
                                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                                        {paymentStatusLabels[order.payment_status] || order.payment_status}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Tracker */}
                            {order.status !== 'cancelled' && (
                                <div className="mt-8">
                                    <div className="flex items-center justify-between">
                                        {orderSteps.map((step, index) => (
                                            <div key={step.status} className="flex flex-1 flex-col items-center">
                                                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                                    index <= currentStepIndex
                                                        ? 'bg-rose-600 text-white'
                                                        : 'bg-gray-200 text-gray-500'
                                                }`}>
                                                    {index <= currentStepIndex ? '✓' : index + 1}
                                                </div>
                                                <p className={`mt-2 text-xs ${
                                                    index <= currentStepIndex
                                                        ? 'font-medium text-rose-600'
                                                        : 'text-gray-500'
                                                }`}>
                                                    {step.label}
                                                </p>
                                                {index < orderSteps.length - 1 && (
                                                    <div className={`absolute h-1 w-full ${
                                                        index < currentStepIndex
                                                            ? 'bg-rose-600'
                                                            : 'bg-gray-200'
                                                    }`} style={{ left: '50%', top: '20px', zIndex: -1 }} />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {order.status === 'cancelled' && (
                                <div className="mt-6 rounded-md bg-red-50 p-4 text-center">
                                    <p className="font-medium text-red-800">This order has been cancelled</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Order Items */}
                        <div className="lg:col-span-2">
                            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                                <div className="border-b border-gray-200 p-4">
                                    <h3 className="font-medium text-gray-900">Order Items ({order.items?.length})</h3>
                                </div>
                                <ul className="divide-y divide-gray-200">
                                    {order.items?.map((item) => (
                                        <li key={item.id} className="flex items-center gap-4 p-4">
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                                                {item.product?.image_url ? (
                                                    <img
                                                        src={item.product.image_url}
                                                        alt={item.product_name}
                                                        className="h-full w-full object-contain p-2"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-2xl">
                                                        📦
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{item.product_name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {item.quantity} × Rs. {parseFloat(item.unit_price).toFixed(2)}
                                                </p>
                                            </div>
                                            <p className="font-medium text-gray-900">
                                                Rs. {parseFloat(item.subtotal).toFixed(2)}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Order Summary & Details */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Order Summary */}
                            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                                <div className="border-b border-gray-200 p-4">
                                    <h3 className="font-medium text-gray-900">Order Summary</h3>
                                </div>
                                <div className="p-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="text-gray-900">Rs. {parseFloat(order.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax</span>
                                        <span className="text-gray-900">Rs. {parseFloat(order.tax).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Delivery Fee</span>
                                        <span className="text-gray-900">Rs. {parseFloat(order.delivery_fee).toFixed(2)}</span>
                                    </div>
                                    {order.discount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Discount</span>
                                            <span className="text-green-600">-Rs. {parseFloat(order.discount).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                                        <span className="font-medium text-gray-900">Total</span>
                                        <span className="font-bold text-lg text-rose-600">Rs. {parseFloat(order.total).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Details */}
                            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                                <div className="border-b border-gray-200 p-4">
                                    <h3 className="font-medium text-gray-900">Delivery Details</h3>
                                </div>
                                <div className="p-4 space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-500">Address</p>
                                        <p className="text-gray-900">{order.delivery_address}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Phone</p>
                                        <p className="text-gray-900">{order.delivery_phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">RDC Location</p>
                                        <p className="text-gray-900">{order.preferred_rdc} RDC</p>
                                    </div>
                                    {order.delivery_notes && (
                                        <div>
                                            <p className="text-gray-500">Notes</p>
                                            <p className="text-gray-900">{order.delivery_notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                                <div className="border-b border-gray-200 p-4">
                                    <h3 className="font-medium text-gray-900">Payment Information</h3>
                                </div>
                                <div className="p-4 space-y-3 text-sm">
                                    <div>
                                        <p className="text-gray-500">Method</p>
                                        <p className="text-gray-900">
                                            {order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'Credit/Debit Card'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Status</p>
                                        <p className={`font-medium ${
                                            order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                            {paymentStatusLabels[order.payment_status] || order.payment_status}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                {canCancel && (
                                    <button
                                        onClick={handleCancel}
                                        className="block w-full rounded-md border border-red-300 bg-white px-4 py-3 text-center font-medium text-red-600 shadow-sm transition hover:bg-red-50"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                                <Link
                                    href={route('customer.orders.index')}
                                    className="block w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-center font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                                >
                                    Back to Orders
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
