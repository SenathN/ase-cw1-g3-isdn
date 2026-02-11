import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import Form from './Form';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';
import Toast from '@/Components/Toast';

export default function Create() {
    const { flash } = usePage().props;
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (flash.message) {
            setShowToast(true);
        }
    }, [flash.message]);
    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-bold leading-tight text-gray-900">Create Driver</h2>}
        >
            <Head title="Create Driver" />

            {showToast && flash.message && (
                <Toast 
                    message={flash.message} 
                    type={flash.type || 'success'}
                    onClose={() => setShowToast(false)}
                />
            )}
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="mb-6 flex items-center gap-2 text-sm">
                        <Link href={route('logistics.drivers.index')} className="text-rose-600 hover:text-rose-700 font-medium">
                            Drivers
                        </Link>
                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Create New Driver</span>
                    </div>
                    <Form />
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
