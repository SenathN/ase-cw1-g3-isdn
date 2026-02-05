import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head } from '@inertiajs/react';

export default function Index({ products = [], categories = [] }) {
    return (
        <CustomerLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Products
                </h2>
            }
        >
            <Head title="Products - IslandLink ISDN" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🛒</div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Product Catalog Coming Soon
                                </h3>
                                <p className="text-gray-500">
                                    Browse our FMCG products including packaged foods, beverages, home cleaning products, and personal care items.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
