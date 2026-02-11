import { useForm } from '@inertiajs/react'
import { Listbox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import axios from 'axios'
import { use, useEffect, useState } from 'react'

const statuses = [
    { id: 'pending', name: 'Pending' },
    { id: 'assigned', name: 'Assigned' },
    { id: 'in_transit', name: 'In Transit' },
    { id: 'delivered', name: 'Delivered' },
    { id: 'failed', name: 'Failed' },
]

export default function Form({ schedule = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        order_id: schedule?.order_id || '',
        driver_id: schedule?.driver_id || '',
        scheduled_date: schedule?.scheduled_date || '',
        scheduled_time: schedule?.scheduled_time || '',
        route_notes: schedule?.route_notes || '',
        status: schedule?.status || 'pending'
    })

    const [orderOptions, setOrderOptions] = useState([{ id: 1, code: 'ORD-001'}, { id: 2, code: 'ORD-002'}, { id: 3, code: 'ORD-003'}]) // Placeholder options, replace with actual data;
    const [driverOptions, setDriverOptions] = useState([]);

    const submit = (e) => {
        e.preventDefault()

        if (schedule) {
            put(route('logistics.schedules.update', schedule.id))
        } else {
            post(route('logistics.schedules.store'))
        }
    }

    const fetchOptions = () => {
        axios.get(route('logistics.orders.list'))
            .then(response => {
                // Handle response and update state with options
                console.log('logistics.orders.list > ',response.data.data)
                setOrderOptions(response.data.data)
            })
            .catch(error => {
                console.error('Error fetching options:', error)
            })

        axios.get(route('logistics.drivers.list'))
            .then(response => {
                // Handle response and update state with options
                console.log('logistics.drivers.list > ',response.data.data)
                setDriverOptions(response.data.data)
            })
            .catch(error => {
                console.error('Error fetching options:', error)
            })
    }

    useEffect(() => {
        fetchOptions()
    }, [])

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {schedule ? 'Edit Delivery Schedule' : 'Create Delivery Schedule'}
            </h2>

            <form onSubmit={submit} className="space-y-6">

                {/* Order ID */}
                <ReusableListBox label="Order" data={data.order_id} setData={(value) => setData('order_id', value)} options={orderOptions} />

                {/* Driver ID */}
                <ReusableListBox label="Driver" data={data.driver_id} setData={(value) => setData('driver_id', value)} options={driverOptions} />

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Scheduled Date
                        </label>
                        <input
                            type="date"
                            value={data.scheduled_date}
                            onChange={e => setData('scheduled_date', e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Scheduled Time
                        </label>
                        <input
                            type="time"
                            value={data.scheduled_time}
                            onChange={e => setData('scheduled_time', e.target.value)}
                            className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                {/* Status Dropdown (Headless UI) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>

                    <Listbox
                        value={data.status}
                        onChange={(value) => setData('status', value)}
                    >
                        <div className="relative">
                            <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <span className="block truncate capitalize">
                                    {data.status.replace('_', ' ')}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                                </span>
                            </Listbox.Button>

                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                {statuses.map((status) => (
                                    <Listbox.Option
                                        key={status.id}
                                        value={status.id}
                                        className={({ active }) =>
                                            `cursor-pointer select-none py-2 px-4 ${
                                                active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                                            }`
                                        }
                                    >
                                        {({ selected }) => (
                                            <div className="flex justify-between">
                                                <span className="capitalize">
                                                    {status.name}
                                                </span>
                                                {selected && (
                                                    <CheckIcon className="h-5 w-5 text-indigo-600" />
                                                )}
                                            </div>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </div>
                    </Listbox>
                </div>

                {/* Route Notes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Route Notes
                    </label>
                    <textarea
                        rows="4"
                        value={data.route_notes}
                        onChange={e => setData('route_notes', e.target.value)}
                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {schedule ? 'Update Schedule' : 'Create Schedule'}
                    </button>
                </div>
            </form>
        </div>
    )
}

const ReusableListBox = ({data, setData, options, option_selection_key = 'id', option_display_key = 'code', label = 'Select'}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            
            <Listbox
                value={data.order_id}
                onChange={(value) => setData(value)}
            >
                <div className="relative">
                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        <span className="block truncate capitalize">
                            {Array.isArray(options) && options.find(i => i.id == data)?.[option_display_key] || 'Select'}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                        </span>
                    </Listbox.Button>

                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        {options.map((opt) => (
                            <Listbox.Option
                                key={opt[option_selection_key]}
                                value={opt[option_selection_key]}
                                className={({ active }) =>
                                    `cursor-pointer select-none py-2 px-4 ${
                                        active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                                    }`
                                }
                            >
                                {({ selected }) => (
                                    <div className="flex justify-between">
                                        <span className={"capitalize " + (selected ? 'font-semibold' : '')}>
                                            {opt[option_display_key]} 
                                        </span>
                                        {selected && (
                                            <CheckIcon className="h-5 w-5 text-indigo-600" />
                                        )}
                                    </div>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </div>
            </Listbox>
        </div>
    )
}