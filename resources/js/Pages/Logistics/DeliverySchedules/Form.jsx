import { useForm } from '@inertiajs/react'
import { Listbox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon, TruckIcon, DocumentIcon, CalendarIcon, ClockIcon } from '@heroicons/react/20/solid'
import axios from 'axios'
import { useEffect, useState } from 'react'

const statuses = [
    { id: 'pending', name: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
    { id: 'scheduled', name: 'Scheduled', color: 'bg-blue-100 text-blue-700' },
    { id: 'out_for_delivery', name: 'Out For Delivery', color: 'bg-orange-100 text-orange-700' },
    { id: 'delivered', name: 'Delivered', color: 'bg-green-100 text-green-700' },
    { id: 'failed', name: 'Failed', color: 'bg-red-100 text-red-700' },
]

export default function Form({ schedule = null, onCancel = () => window.history.back() }) {
    const { data, setData, post, put, processing, errors } = useForm({
        order_id: schedule?.order_id || '',
        driver_id: schedule?.driver_id || '',
        scheduled_date: schedule?.scheduled_date || '',
        scheduled_time: schedule?.scheduled_time || '',
        route_notes: schedule?.route_notes || '',
        status: schedule?.status || 'pending'
    })

    const [orderOptions, setOrderOptions] = useState([])
    const [driverOptions, setDriverOptions] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [selectedDriver, setSelectedDriver] = useState(null)

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
                console.log('logistics.orders.list > ',response.data.data)
                setOrderOptions(response.data.data)
            })
            .catch(error => {
                console.error('Error fetching options:', error)
            })

        axios.get(route('logistics.drivers.list'))
            .then(response => {
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

    useEffect(() => {
        if (data.order_id) {
            const order = orderOptions.find(o => o.id == data.order_id)
            setSelectedOrder(order)
        }
    }, [data.order_id, orderOptions])

    useEffect(() => {
        if (data.driver_id) {
            const driver = driverOptions.find(d => d.id == data.driver_id)
            setSelectedDriver(driver)
        }
    }, [data.driver_id, driverOptions])

    const currentStatus = statuses.find(s => s.id === data.status)

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gray-800 px-8 py-6">
                    <h2 className="text-3xl font-bold text-white">
                        {schedule ? 'Edit Delivery Schedule' : 'Create Delivery Schedule'}
                    </h2>
                    <p className="text-gray-300 text-sm mt-1">
                        {schedule ? 'Update delivery schedule details' : 'Create a new delivery schedule with driver assignment'}
                    </p>
                </div>

                <form onSubmit={submit} className="p-8 space-y-8">

                    {/* Section 1: Order & Driver Assignment */}
                    <div className="space-y-6 pb-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <DocumentIcon className="w-5 h-5 text-gray-700" />
                            Assignment
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Order Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Select Order *
                                </label>
                                <ReusableListBox 
                                    label="" 
                                    data={data.order_id} 
                                    setData={(value) => setData('order_id', value)} 
                                    options={orderOptions}
                                    showLabel={false}
                                />
                                {errors.order_id && <p className="text-red-600 text-sm mt-1">{errors.order_id}</p>}
                            </div>

                            {/* Driver Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Assign Driver *
                                </label>
                                <ReusableListBox 
                                    label="" 
                                    data={data.driver_id} 
                                    setData={(value) => setData('driver_id', value)} 
                                    options={driverOptions}
                                    option_display_key="code"
                                    showLabel={false}
                                />
                                {errors.driver_id && <p className="text-red-600 text-sm mt-1">{errors.driver_id}</p>}
                            </div>
                        </div>

                        {/* Selected Items Preview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            {selectedOrder && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Selected Order</p>
                                    <p className="text-lg font-bold text-gray-900">{selectedOrder.code}</p>
                                </div>
                            )}
                            {selectedDriver && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Assigned Driver</p>
                                    <p className="text-lg font-bold text-gray-900">{selectedDriver.code}</p>
                                    {selectedDriver.user && (
                                        <p className="text-sm text-gray-700">{selectedDriver.user.name}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section 2: Scheduling */}
                    <div className="space-y-6 pb-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-gray-700" />
                            Schedule
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                                    Scheduled Date
                                </label>
                                <input
                                    type="date"
                                    value={data.scheduled_date}
                                    onChange={e => setData('scheduled_date', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none transition"
                                />
                                {errors.scheduled_date && <p className="text-red-600 text-sm mt-1">{errors.scheduled_date}</p>}
                            </div>

                            {/* Time */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <ClockIcon className="w-4 h-4 text-gray-500" />
                                    Scheduled Time
                                </label>
                                <input
                                    type="time"
                                    value={data.scheduled_time}
                                    onChange={e => setData('scheduled_time', e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none transition"
                                />
                                {errors.scheduled_time && <p className="text-red-600 text-sm mt-1">{errors.scheduled_time}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Status */}
                    <div className="space-y-6 pb-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <TruckIcon className="w-5 h-5 text-gray-700" />
                            Status
                        </h3>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Delivery Status
                            </label>

                            <Listbox
                                value={data.status}
                                onChange={(value) => setData('status', value)}
                            >
                                <div className="relative">
                                    <Listbox.Button className={`relative w-full cursor-pointer rounded-lg py-3 px-4 text-left border-2 transition focus:outline-none focus:ring-2 focus:ring-green-200 ${
                                        currentStatus ? currentStatus.color : 'bg-white border-gray-300'
                                    }`}>
                                        <span className="block truncate font-semibold capitalize">
                                            {currentStatus?.name || 'Select status'}
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <ChevronUpDownIcon className="h-5 w-5" />
                                        </span>
                                    </Listbox.Button>

                                    <Listbox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 border border-gray-200">
                                        {statuses.map((status) => (
                                            <Listbox.Option
                                                key={status.id}
                                                value={status.id}
                                                className={({ active }) =>
                                                    `cursor-pointer select-none py-3 px-4 ${
                                                        active ? 'bg-gray-100' : 'text-gray-900'
                                                    }`
                                                }
                                            >
                                                {({ selected }) => (
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status.color}`}>
                                                                {status.name}
                                                            </span>
                                                        </div>
                                                        {selected && (
                                                            <CheckIcon className="h-5 w-5 text-green-600" />
                                                        )}
                                                    </div>
                                                )}
                                            </Listbox.Option>
                                        ))}
                                    </Listbox.Options>
                                </div>
                            </Listbox>
                        </div>
                    </div>

                    {/* Section 4: Route Notes */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            📋
                            Notes
                        </h3>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Route Notes
                            </label>
                            <textarea
                                rows="4"
                                placeholder="Add any special instructions or delivery notes..."
                                value={data.route_notes}
                                onChange={e => setData('route_notes', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none transition resize-none"
                            />
                            {errors.route_notes && <p className="text-red-600 text-sm mt-1">{errors.route_notes}</p>}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            disabled={processing}
                            onClick={onCancel}
                            className="px-6 py-3 rounded-lg bg-gray-100 text-gray-900 font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={processing || !data.order_id || !data.driver_id}
                            className="px-8 py-3 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold hover:from-rose-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        >
                            {processing ? 'Processing...' : schedule ? 'Update Schedule' : 'Create Schedule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const ReusableListBox = ({data, setData, options, option_selection_key = 'id', option_display_key = 'code', label = 'Select', showLabel = true}) => {
    return (
        <div>
            {showLabel && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            
            <Listbox
                value={data}
                onChange={(value) => setData(value)}
            >
                <div className="relative">
                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-3 px-4 text-left border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-200 hover:border-gray-400 transition">
                        <span className="block truncate capitalize font-medium">
                            {Array.isArray(options) && options.find(i => i.id == data)?.[option_display_key] || 'Select...'}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                        </span>
                    </Listbox.Button>

                    <Listbox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 border border-gray-200">
                        {options.map((opt) => (
                            <Listbox.Option
                                key={opt[option_selection_key]}
                                value={opt[option_selection_key]}
                                className={({ active }) =>
                                    `cursor-pointer select-none py-3 px-4 ${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-900'
                                    }`
                                }
                            >
                                {({ selected }) => (
                                    <div className="flex justify-between">
                                        <span className={"capitalize " + (selected ? 'font-semibold text-gray-900' : '')}>
                                            {opt[option_display_key]} 
                                        </span>
                                        {selected && (
                                            <CheckIcon className="h-5 w-5 text-gray-800" />
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