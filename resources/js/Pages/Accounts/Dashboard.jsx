import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Accounts Dashboard
                </h2>
            }
        >
            <Head title="Accounts Dashboard - IslandLink ISDN" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold mb-4">Welcome, Accounts Manager</h3>
                            <p className="text-gray-600">
                                This is the accounts dashboard. Financial management features are coming soon.
                            </p>

                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="rounded-lg bg-yellow-50 p-4">
                                    <h4 className="font-medium text-yellow-800">💰 Invoices</h4>
                                    <p className="mt-1 text-sm text-yellow-600">Manage customer invoices</p>
                                </div>
                                <div className="rounded-lg bg-lime-50 p-4">
                                    <h4 className="font-medium text-lime-800">💳 Payments</h4>
                                    <p className="mt-1 text-sm text-lime-600">Track payment records</p>
                                </div>
                                <div className="rounded-lg bg-rose-50 p-4">
                                    <h4 className="font-medium text-rose-800">📊 Financial Reports</h4>
                                    <p className="mt-1 text-sm text-rose-600">View financial summaries</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
