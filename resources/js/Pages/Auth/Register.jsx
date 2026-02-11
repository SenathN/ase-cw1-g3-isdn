import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register({ rdcLocations = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        preferred_rdc: '',
        password: '',
        password_confirmation: '',
    });

    const rdcOptions = rdcLocations.map((rdc) => ({
        value: rdc,
        label: `${rdc} RDC`,
    }));

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register - IslandLink ISDN" />

            <div className="mb-4 text-center">
                <h2 className="text-xl font-bold text-gray-800">Create Your Account</h2>
                <p className="text-sm text-gray-600 mt-1">Join IslandLink Sales Distribution Network</p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Full Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email Address" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="phone" value="Phone Number" />

                    <TextInput
                        id="phone"
                        type="tel"
                        name="phone"
                        value={data.phone}
                        className="mt-1 block w-full"
                        autoComplete="tel"
                        onChange={(e) => setData('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                    />

                    <InputError message={errors.phone} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="address" value="Delivery Address" />

                    <textarea
                        id="address"
                        name="address"
                        value={data.address}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        rows={3}
                        autoComplete="street-address"
                        onChange={(e) => setData('address', e.target.value)}
                        placeholder="Enter your full delivery address"
                    />

                    <InputError message={errors.address} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="preferred_rdc" value="Preferred Regional Distribution Centre" />

                    <SelectInput
                        id="preferred_rdc"
                        name="preferred_rdc"
                        value={data.preferred_rdc}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('preferred_rdc', e.target.value)}
                        options={rdcOptions}
                        placeholder="Select your nearest RDC"
                    />

                    <InputError message={errors.preferred_rdc} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-6 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already have an account?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Create Account
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
