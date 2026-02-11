import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Logistics Dashboard
                </h2>
            }
        >
            <Head title="Logistics Dashboard - IslandLink ISDN" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold mb-4">Welcome, Logistics Manager</h3>
                            <p className="text-gray-600">
                                This is the logistics dashboard. Route planning and delivery management features are coming soon.
                            </p>

                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-lg bg-cyan-50 p-4">
                                    <h4 className="font-medium text-cyan-800">🗺️ Route Planning</h4>
                                    <p className="mt-1 text-sm text-cyan-600">Plan and optimize delivery routes</p>
                                </div>
                                <div className="rounded-lg bg-orange-50 p-4">
                                    <h4 className="font-medium text-orange-800">🚛 Fleet Management</h4>
                                    <p className="mt-1 text-sm text-orange-600">Manage delivery vehicles</p>
                                </div>
                                <div className="rounded-lg bg-pink-50 p-4">
                                    <h4 className="font-medium text-pink-800">📋 Delivery Tracking</h4>
                                    <p className="mt-1 text-sm text-pink-600">Monitor all active deliveries</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
