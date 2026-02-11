import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-rose-500 bg-rose-50 text-rose-700 focus:border-rose-700 focus:bg-rose-100 focus:text-rose-800'
                    : 'border-transparent text-gray-600 hover:border-rose-300 hover:bg-rose-50 hover:text-gray-800 focus:border-rose-300 focus:bg-rose-50 focus:text-gray-800'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
