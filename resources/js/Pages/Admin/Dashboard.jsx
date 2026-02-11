import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Admin Dashboard
                </h2>
            }
        >
            <Head title="Admin Dashboard - IslandLink ISDN" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold mb-4">Welcome, System Administrator</h3>
                            <p className="text-gray-600">
                                This is the admin dashboard. System management features are coming soon.
                            </p>

                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-lg bg-blue-50 p-4">
                                    <h4 className="font-medium text-blue-800">👥 User Management</h4>
                                    <p className="mt-1 text-sm text-blue-600">Manage system users and roles</p>
                                </div>
                                <div className="rounded-lg bg-green-50 p-4">
                                    <h4 className="font-medium text-green-800">📦 Product Management</h4>
                                    <p className="mt-1 text-sm text-green-600">Manage product catalog</p>
                                </div>
                                <div className="rounded-lg bg-purple-50 p-4">
                                    <h4 className="font-medium text-purple-800">📊 Reports</h4>
                                    <p className="mt-1 text-sm text-purple-600">View system analytics</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
