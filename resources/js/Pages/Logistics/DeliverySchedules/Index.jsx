import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Toast from '@/Components/Toast';
import { PencilSquareIcon, TrashIcon, TruckIcon, PlusIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function Index({ schedules }) {
    const { flash } = usePage().props;
    const [showToast, setShowToast] = useState(!!flash?.message);

    const formatStatus = (s) => s?.replace(/_/g, ' ')?.split(' ')?.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const getStatusColor = (status) => {
        const colors = {
            'pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
            'scheduled': 'bg-blue-50 text-blue-700 border-blue-200',
            'out_for_delivery': 'bg-orange-50 text-orange-700 border-orange-200',
            'delivered': 'bg-green-50 text-green-700 border-green-200',
            'failed': 'bg-red-50 text-red-700 border-red-200',
        };
        return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'delivered':
                return <CheckCircleIcon className="w-5 h-5" />;
            case 'failed':
                return <XCircleIcon className="w-5 h-5" />;
            case 'out_for_delivery':
                return <TruckIcon className="w-5 h-5" />;
            default:
                return <ClockIcon className="w-5 h-5" />;
        }
    };

    const destroy = (id) => {
        if (confirm('Delete this schedule?')) {
            router.delete(route('logistics.schedules.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold leading-tight text-gray-900">
                    Delivery Schedules
                </h2>
            }
        >
            <Head title="Delivery Schedules" />

            {showToast && flash.message && (
                <Toast 
                    message={flash.message} 
                    type={flash.type || 'success'}
                    onClose={() => setShowToast(false)}
                />
            )}

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <a href={route('logistics.schedules.create')} 
                              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-rose-700 hover:to-rose-800 transition shadow-md hover:shadow-lg">
                            <PlusIcon className="w-5 h-5" />
                            Schedule Delivery
                        </a>
                    </div>

                    {/* Cards Grid */}
                    {schedules.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {schedules.map(schedule => (
                                <div key={schedule.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100 flex flex-col">
                                    {/* Card Header with Status */}
                                    <div className="bg-white px-6 py-4 border-b border-gray-200">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold uppercase">Order</p>
                                                <p className="text-xl font-bold text-gray-900">{schedule.order?.order_number || schedule.code}</p>
                                            </div>
                                            <span className={`border px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap ${getStatusColor(schedule.status)}`}>
                                                {getStatusIcon(schedule.status)}
                                                {formatStatus(schedule.status)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="px-6 py-4 space-y-4 flex-grow">
                                        {/* Driver Info */}
                                        <div className="flex items-start gap-3">
                                            <TruckIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold uppercase">Assigned Driver</p>
                                                <p className="text-gray-900 font-medium">{schedule?.driver?.code ?? 'Unassigned'}</p>
                                                {schedule?.driver?.user && (
                                                    <p className="text-sm text-gray-600">{schedule.driver.user.name}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Schedule Details */}
                                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                                            {schedule.scheduled_date && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Date:</span>
                                                    <span className="font-semibold text-gray-900">{new Date(schedule.scheduled_date).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                            {schedule.scheduled_time && (
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">Time:</span>
                                                    <span className="font-semibold text-gray-900">{schedule.scheduled_time}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* ID Badge */}
                                        <div className="text-xs">
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">ID: {schedule.id}</span>
                                        </div>
                                    </div>

                                    {/* Card Footer - Actions */}
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                                        <Link href={route('logistics.schedules.edit', schedule.id)}
                                              className="flex-1 flex items-center justify-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-rose-700 transition text-sm">
                                            <PencilSquareIcon className="w-4 h-4" />
                                            Edit
                                        </Link>
                                        <button onClick={() => destroy(schedule.id)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition border border-red-200 text-sm">
                                            <TrashIcon className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
                            <TruckIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Delivery Schedules Yet</h3>
                            <p className="text-gray-600 mb-6">Create your first delivery schedule to get started</p>
                            <a href={route('logistics.schedules.create')}
                               className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition no-underline">
                                <PlusIcon className="w-5 h-5" />
                                Schedule Delivery
                            </a>
                        </div>
                    )}
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
