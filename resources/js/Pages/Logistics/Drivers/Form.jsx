import { useForm } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { UserIcon, EnvelopeIcon, XMarkIcon } from '@heroicons/react/24/solid'

export default function Form({ driver = null, onCancel = () => window.history.back() }) {
    const { data, setData, post, put, processing, errors } = useForm({
        user_id: driver?.user_id || ''
    })

    const [userOptions, setUserOptions] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)

    const submit = (e) => {
        e.preventDefault()

        if (driver) {
            put(route('logistics.drivers.update', driver.id))
        } else {
            post(route('logistics.drivers.store'))
        }
    }

    useEffect(() => {
        axios.get(route('logistics.users.list'))
            .then(response => setUserOptions(response.data.data))
            .catch(err => console.error('Failed to fetch users', err))
    }, [])

    useEffect(() => {
        if (data.user_id) {
            const user = userOptions.find(u => u.id == data.user_id)
            setSelectedUser(user)
        }
    }, [data.user_id, userOptions])

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gray-800 px-8 py-6">
                    <h2 className="text-3xl font-bold text-white">
                        {driver ? 'Edit Driver' : 'Create New Driver'}
                    </h2>
                    <p className="text-gray-300 text-sm mt-1">
                        {driver ? 'Update driver information' : 'Assign a user as a delivery driver'}
                    </p>
                </div>

                <form onSubmit={submit} className="p-8 space-y-8">
                    {/* User Selection Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <UserIcon className="w-5 h-5 text-gray-700" />
                            <label className="block text-lg font-semibold text-gray-900">
                                Assign User
                            </label>
                        </div>
                        
                        {/* Select Field */}
                        <div className="relative">
                            <select
                                value={data.user_id}
                                onChange={e => setData('user_id', e.target.value)}
                                className={`w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none focus:ring-2 focus:ring-rose-500 appearance-none cursor-pointer ${
                                    errors.user_id 
                                        ? 'border-red-500 bg-red-50' 
                                        : 'border-gray-300 bg-white hover:border-gray-400'
                                }`}
                            >
                                <option value="">Choose a user...</option>
                                {userOptions.map(u => (
                                    <option key={u.id} value={u.id}>
                                        {u.name} - {u.email}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-600">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>

                        {/* Error Message */}
                        {errors.user_id && (
                            <p className="text-red-600 text-sm font-medium flex items-center gap-2">
                                <XMarkIcon className="w-4 h-4" />
                                {errors.user_id}
                            </p>
                        )}
                    </div>

                    {/* Selected User Preview */}
                    {selectedUser && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
                                Selected User
                            </h3>
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-800 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-gray-900">{selectedUser.name}</p>
                                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                                        <EnvelopeIcon className="w-4 h-4" />
                                        {selectedUser.email}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Information Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> Once assigned, this user will be able to manage deliveries as a driver in the system.
                        </p>
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
                            disabled={processing || !data.user_id}
                            className="px-8 py-3 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold hover:from-rose-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        >
                            {processing ? 'Processing...' : driver ? 'Update Driver' : 'Create Driver'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
