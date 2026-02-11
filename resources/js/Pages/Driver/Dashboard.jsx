import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Driver Dashboard
                </h2>
            }
        >
            <Head title="Driver Dashboard - IslandLink ISDN" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold mb-4">
                                Welcome, {user?.name || 'Driver'}
                                {user?.preferred_rdc && (
                                    <span className="ml-2 text-sm font-normal text-gray-500">
                                        — {user.preferred_rdc} RDC
                                    </span>
                                )}
                            </h3>
                            <p className="text-gray-600">
                                This is the driver dashboard. Delivery management features are coming soon.
                            </p>

                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-lg bg-emerald-50 p-4">
                                    <h4 className="font-medium text-emerald-800">📍 My Deliveries</h4>
                                    <p className="mt-1 text-sm text-emerald-600">View assigned deliveries</p>
                                </div>
                                <div className="rounded-lg bg-sky-50 p-4">
                                    <h4 className="font-medium text-sky-800">🗺️ My Route</h4>
                                    <p className="mt-1 text-sm text-sky-600">View today's delivery route</p>
                                </div>
                                <div className="rounded-lg bg-violet-50 p-4">
                                    <h4 className="font-medium text-violet-800">✅ Delivery History</h4>
                                    <p className="mt-1 text-sm text-violet-600">View completed deliveries</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
