import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import LogisticsLayout from './LogisticsLayout';
import CustomerLayout from './CustomerLayout';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <div>
            { user?.role == 'logistics' ? (
                <LogisticsLayout>{children}</LogisticsLayout>
            ) : ('')}

            { user?.role == 'customer' ? (
                <CustomerLayout>{children}</CustomerLayout>
            ) : ('')}
        </div>
    );
}
