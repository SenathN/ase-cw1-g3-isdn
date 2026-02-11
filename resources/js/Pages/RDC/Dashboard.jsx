import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    RDC Staff Dashboard
                </h2>
            }
        >
            <Head title="RDC Dashboard - IslandLink ISDN" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold mb-4">
                                Welcome, {user?.name || 'RDC Staff'}
                                {user?.preferred_rdc && (
                                    <span className="ml-2 text-sm font-normal text-gray-500">
                                        — {user.preferred_rdc} RDC
                                    </span>
                                )}
                            </h3>
                            <p className="text-gray-600">
                                This is the RDC staff dashboard. Warehouse management features are coming soon.
                            </p>

                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-lg bg-amber-50 p-4">
                                    <h4 className="font-medium text-amber-800">📦 Orders to Process</h4>
                                    <p className="mt-1 text-sm text-amber-600">View and manage incoming orders</p>
                                </div>
                                <div className="rounded-lg bg-teal-50 p-4">
                                    <h4 className="font-medium text-teal-800">🏭 Stock Management</h4>
                                    <p className="mt-1 text-sm text-teal-600">Manage warehouse inventory</p>
                                </div>
                                <div className="rounded-lg bg-indigo-50 p-4">
                                    <h4 className="font-medium text-rose-800">🚚 Dispatch</h4>
                                    <p className="mt-1 text-sm text-rose-600">Prepare orders for delivery</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
