import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@headlessui/react';
import { Head, Link, router } from '@inertiajs/react';
import Form from './Form';
import { useEffect } from 'react';

export default function Index({ schedule }) {

    // useEffect(() => {
        
    //     axios.get(route('logistics.orders.list'))
    //         .then(response => {
    //             // Handle response and update state with options
    //             console.log('logistics.orders.list > ',response.data.data)
    //             setOrderOptions(response.data.data)
    //         })
    //         .catch(error => {
    //             console.error('Error fetching options:', error)
    //         })
        
    // }, [schedules]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Delivery Schedules {'>'} Edit Schedule
                </h2>
            }
        >
            <Head title="Delivery Schedules" />
            
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Form schedule={schedule} />
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
