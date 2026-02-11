import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Toast from '@/Components/Toast';
import { PencilSquareIcon, TrashIcon, UserIcon, EnvelopeIcon, PlusIcon } from '@heroicons/react/24/solid';

export default function Index({ drivers }) {
    const { flash } = usePage().props;
    const [showToast, setShowToast] = useState(!!flash?.message);

    const destroy = (id) => {
        if (confirm('Delete this driver?')) {
            router.delete(route('logistics.drivers.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold leading-tight text-gray-900">
                    Drivers Management
                </h2>
            }
        >
            <Head title="Drivers" />

            {showToast && flash?.message && (
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
                        <Link href={route('logistics.drivers.create')} 
                              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-rose-700 hover:to-rose-800 transition shadow-md hover:shadow-lg">
                            <PlusIcon className="w-5 h-5" />
                            Add New Driver
                        </Link>
                    </div>

                    {/* Cards Grid */}
                    {drivers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {drivers.map(driver => (
                                <div key={driver.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100">
                                    {/* Card Header */}
                                    <div className="bg-white px-6 py-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                                    {driver?.user?.name?.charAt(0) || 'D'}
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-semibold uppercase">Driver Code</p>
                                                    <p className="text-lg font-bold text-gray-900">{driver.code}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-semibold">ID: {driver.id}</span>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="px-6 py-4 space-y-4">
                                        {/* User Name */}
                                        <div className="flex items-start gap-3">
                                            <UserIcon className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold uppercase">User Name</p>
                                                <p className="text-gray-900 font-medium">{driver?.user?.name ?? 'Not Assigned'}</p>
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div className="flex items-start gap-3">
                                            <EnvelopeIcon className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500 font-semibold uppercase">Email</p>
                                                <p className="text-gray-900 font-medium break-all text-sm">{driver?.user?.email ?? 'No Email'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer - Actions */}
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                                        <Link href={route('logistics.drivers.edit', driver.id)}
                                              className="flex-1 flex items-center justify-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-rose-700 transition">
                                            <PencilSquareIcon className="w-4 h-4" />
                                            Edit
                                        </Link>
                                        <button onClick={() => destroy(driver.id)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition border border-red-200">
                                            <TrashIcon className="w-4 h-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-12 text-center">
                            <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Drivers Yet</h3>
                            <p className="text-gray-600 mb-6">Create your first driver to get started</p>
                            <Link href={route('logistics.drivers.create')}
                                  className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-700 transition">
                                <PlusIcon className="w-5 h-5" />
                                Create Driver
                            </Link>
                        </div>
                    )}
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
