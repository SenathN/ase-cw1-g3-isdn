import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ order = {}, trackingHistory = [], statusSteps = [], currentStep = 0, estimatedDelivery = null }) {
    const isCancelled = order?.status === 'cancelled';
    const isDelivered = order?.status === 'delivered';

    return (
        <CustomerLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Track Order {order.order_number}
                    </h2>
                    <Link
                        href={route('customer.tracking.index')}
                        className="text-sm text-rose-600 hover:text-rose-700"
                    >
                        ← Back to Tracking
                    </Link>
                </div>
            }
        >
            <Head title={`Track Order ${order.order_number} - IslandLink ISDN`} />

            <div className="py-8">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Status Banner */}
                    {isCancelled ? (
                        <div className="mb-6 rounded-lg bg-red-50 p-4">
                            <div className="flex items-center">
                                <span className="text-2xl">❌</span>
                                <div className="ml-3">
                                    <h3 className="font-medium text-red-800">Order Cancelled</h3>
                                    <p className="text-sm text-red-600">This order has been cancelled.</p>
                                </div>
                            </div>
                        </div>
                    ) : isDelivered ? (
                        <div className="mb-6 rounded-lg bg-green-50 p-4">
                            <div className="flex items-center">
                                <span className="text-2xl">🎉</span>
                                <div className="ml-3">
                                    <h3 className="font-medium text-green-800">Order Delivered!</h3>
                                    <p className="text-sm text-green-600">
                                        Delivered on {order.delivered_at}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        estimatedDelivery && (
                            <div className="mb-6 rounded-lg bg-rose-50 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <span className="text-2xl">🚚</span>
                                        <div className="ml-3">
                                            <h3 className="font-medium text-rose-800">Estimated Delivery</h3>
                                            <p className="text-sm text-rose-600">{estimatedDelivery}</p>
                                        </div>
                                    </div>
                                    <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700">
                                        {order.status_label}
                                    </span>
                                </div>
                            </div>
                        )
                    )}

                    {/* Progress Tracker */}
                    {!isCancelled && (
                        <div className="mb-6 overflow-hidden rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold text-gray-800">Delivery Progress</h3>
                            <div className="relative">
                                {/* Progress Line */}
                                <div className="absolute left-5 top-5 h-[calc(100%-40px)] w-0.5 bg-gray-200">
                                    <div
                                        className="w-full bg-rose-600 transition-all duration-500"
                                        style={{
                                            height: `${Math.min(100, ((currentStep - 1) / (statusSteps.length - 1)) * 100)}%`,
                                        }}
                                    />
                                </div>

                                {/* Steps */}
                                <div className="space-y-6">
                                    {statusSteps.map((step) => (
                                        <div key={step.step} className="relative flex items-start">
                                            <div
                                                className={`z-10 flex h-10 w-10 items-center justify-center rounded-full text-lg ${
                                                    currentStep >= step.step
                                                        ? 'bg-rose-600 text-white'
                                                        : 'border-2 border-gray-300 bg-white text-gray-400'
                                                }`}
                                            >
                                                {step.icon}
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <h4
                                                    className={`font-medium ${
                                                        currentStep >= step.step ? 'text-gray-900' : 'text-gray-500'
                                                    }`}
                                                >
                                                    {step.label}
                                                </h4>
                                                {currentStep === step.step && (
                                                    <p className="text-sm text-rose-600">Current status</p>
                                                )}
                                            </div>
                                            {currentStep >= step.step && (
                                                <span className="text-green-600">✓</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tracking History */}
                    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-800">Tracking History</h3>
                        </div>
                        <div className="p-6">
                            {trackingHistory.length === 0 ? (
                                <p className="text-center text-gray-500">No tracking updates yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {trackingHistory.map((entry, index) => (
                                        <div
                                            key={entry.id}
                                            className={`relative pl-8 ${
                                                index === trackingHistory.length - 1 ? '' : 'pb-4'
                                            }`}
                                        >
                                            {/* Timeline dot and line */}
                                            <div className="absolute left-0 top-1.5">
                                                <span className="text-lg">{entry.icon}</span>
                                            </div>
                                            {index < trackingHistory.length - 1 && (
                                                <div className="absolute left-[12px] top-8 h-full w-0.5 bg-gray-200" />
                                            )}

                                            <div>
                                                <h4 className="font-medium text-gray-900">{entry.title}</h4>
                                                {entry.description && (
                                                    <p className="mt-1 text-sm text-gray-600">{entry.description}</p>
                                                )}
                                                <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                                                    <span>{entry.timestamp}</span>
                                                    {entry.location && <span>📍 {entry.location}</span>}
                                                    {entry.updated_by && <span>By: {entry.updated_by}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Delivery Information */}
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                            <div className="border-b border-gray-200 px-6 py-4">
                                <h3 className="font-semibold text-gray-800">Delivery Information</h3>
                            </div>
                            <div className="p-6 space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500">Address</p>
                                    <p className="text-gray-900">{order.delivery_address}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="text-gray-900">{order.delivery_phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">RDC</p>
                                    <p className="text-gray-900">{order.preferred_rdc}</p>
                                </div>
                                {order.delivery_notes && (
                                    <div>
                                        <p className="text-sm text-gray-500">Notes</p>
                                        <p className="text-gray-900">{order.delivery_notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                            <div className="border-b border-gray-200 px-6 py-4">
                                <h3 className="font-semibold text-gray-800">Order Summary</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span>${parseFloat(order.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax</span>
                                        <span>${parseFloat(order.tax).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Delivery Fee</span>
                                        <span>${parseFloat(order.delivery_fee).toFixed(2)}</span>
                                    </div>
                                    {parseFloat(order.discount) > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Discount</span>
                                            <span>-${parseFloat(order.discount).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="border-t pt-2">
                                        <div className="flex justify-between font-semibold">
                                            <span>Total</span>
                                            <span className="text-rose-600">
                                                ${parseFloat(order.total).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Payment Status</span>
                                        <span className={`font-medium ${
                                            order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                            {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h3 className="font-semibold text-gray-800">Items in Order</h3>
                        </div>
                        <div className="divide-y divide-gray-200">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 p-4">
                                    <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-gray-100 p-2">
                                        {item.product?.image_url ? (
                                            <img
                                                src={item.product.image_url}
                                                alt={item.product_name}
                                                className="h-full w-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-2xl">
                                                📦
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                                        <p className="text-sm text-gray-600">
                                            ${parseFloat(item.unit_price).toFixed(2)} × {item.quantity}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            ${parseFloat(item.subtotal).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex justify-between">
                        <Link
                            href={route('customer.orders.show', order.id)}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            View Full Order
                        </Link>
                        {order.payment_status !== 'paid' && !isCancelled && (
                            <Link
                                href={route('customer.payments.create', order.id)}
                                className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
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
