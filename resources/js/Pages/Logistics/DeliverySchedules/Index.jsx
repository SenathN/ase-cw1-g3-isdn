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

                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className='bg-gray-200'>
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Driver</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                    {schedules.map(schedule => (
                                        <tr key={schedule.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-gray-600">{schedule.id}</td>
                                            <td className="px-6 py-4 text-gray-600">{schedule.code}</td>
                                            <td className="px-6 py-4 text-gray-600">{schedule?.driver?.code ?? "N/A"}</td>
                                            <td className="px-6 py-4 text-gray-600">{schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}</td>
                                            <td className="px-6 py-4 text-gray-600 flex space-x-4">
                                                <Link href={route('logistics.schedules.edit', schedule.id)}>
                                                    Edit
                                                </Link>

                                                <Button className="text-red-600 hover:text-red-800 font-medium" onClick={() => destroy(schedule.id)}>
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
