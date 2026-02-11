import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@headlessui/react';
import { Head, Link, router } from '@inertiajs/react';
import Form from './Form';

export default function Index({ schedules }) {

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Delivery Schedules {'>'} New Schedule
                </h2>
            }
        >
            <Head title="Delivery Schedules" />


            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Form></Form>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
