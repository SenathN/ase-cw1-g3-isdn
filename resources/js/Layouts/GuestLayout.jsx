import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-rose-50 to-red-100 pt-6 sm:justify-center sm:pt-0">
            <div className="mb-4">
                <Link href="/">
                    <ApplicationLogo />
                </Link>
            </div>

            <div className="text-center mb-6">
                <p className="text-sm text-gray-600">
                    Sales Distribution Network
                </p>
            </div>

            <div className="w-full overflow-hidden bg-white px-6 py-8 shadow-lg sm:max-w-md sm:rounded-xl">
                {children}
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
                <p>Serving 5,000+ retail outlets across 5 regions</p>
            </div>
        </div>
    );
}
