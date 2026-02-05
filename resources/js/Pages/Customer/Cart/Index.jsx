import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ cartItems = [], total = 0 }) {
    return (
        <CustomerLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Shopping Cart
                </h2>
            }
        >
            <Head title="Cart - IslandLink ISDN" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🛍️</div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    Your Cart is Empty
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Add some products to your cart to get started.
                                </p>
                                <Link
                                    href={route('customer.products.index')}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Browse Products
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
