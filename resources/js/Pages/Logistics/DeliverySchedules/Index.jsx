import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@headlessui/react';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ schedules }) {

    const destroy = (id) => {
        if (confirm('Delete this schedule?')) {
            router.delete(route('logistics.schedules.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Delivery Schedules
                </h2>
            }
        >
            <Head title="Delivery Schedules" />


            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            <Button className="mb-4 bg-blue-500 text-white px-4 py-2 rounded">
                                <Link href={route('logistics.schedules.create')}>
                                    Create Schedule
                                </Link>
                            </Button>

                            <table class="min-w-full divide-y divide-gray-200">
                                <thead className='bg-gray-200'>
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order</th>
                                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Driver</th>
                                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                        <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200 text-sm">
                                    {schedules.map(schedule => (
                                        <tr key={schedule.id} class="hover:bg-gray-50 transition">
                                            <td class="px-6 py-4 text-gray-600">{schedule.id}</td>
                                            <td class="px-6 py-4 text-gray-600">{schedule.order_id}</td>
                                            <td class="px-6 py-4 text-gray-600">{schedule.driver_id}</td>
                                            <td class="px-6 py-4 text-gray-600">{schedule.status}</td>
                                            <td class="px-6 py-4 text-gray-600">
                                                <Link href={route('logistics.schedules.edit', schedule.id)}>
                                                    Edit
                                                </Link>

                                                <Button class="text-red-600 hover:text-red-800 font-medium" onClick={() => destroy(schedule.id)}>
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
