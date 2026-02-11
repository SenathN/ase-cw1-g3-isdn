import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    const features = [
        {
            icon: '🛒',
            title: 'Browse Products',
            description: 'Explore our comprehensive FMCG catalog with thousands of products',
        },
        {
            icon: '📦',
            title: 'Track Orders',
            description: 'Real-time tracking of your orders from warehouse to doorstep',
        },
        {
            icon: '💳',
            title: 'Secure Payments',
            description: 'Multiple payment options with enterprise-grade security',
        },
        {
            icon: '🚚',
            title: 'Fast Delivery',
            description: 'Efficient logistics network for timely deliveries across Sri Lanka',
        },
    ];

    return (
        <>
            <Head title="IslandLink - Integrated Sales Distribution Network" />
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50">
                {/* Navigation */}
                <nav className="border-b border-rose-100 bg-white/80 backdrop-blur-sm">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <img src="/images/logo.svg" alt="IslandLink" className="h-10 w-10" />
                                <div>
                                    <div className="text-xl font-bold text-gray-900">Island<span className="text-rose-600">Link</span></div>
                                    <div className="text-xs text-gray-500">ISDN Platform</div>
                                </div>
                            </div>

                            {/* Auth Links */}
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-lg border border-rose-200 px-6 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Welcome to <span className="text-rose-600">IslandLink</span>
                        </h1>
                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                            Sri Lanka's premier Integrated Sales Distribution Network platform. 
                            Streamlining FMCG distribution across the island with cutting-edge technology.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="rounded-lg bg-rose-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('register')}
                                        className="rounded-lg bg-rose-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                                    >
                                        Get Started
                                    </Link>
                                    <Link
                                        href={route('login')}
                                        className="text-base font-semibold leading-7 text-gray-900 transition hover:text-rose-600"
                                    >
                                        Sign in <span aria-hidden="true">→</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md hover:ring-rose-200"
                            >
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-rose-100 text-4xl">
                                    {feature.icon}
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-rose-600">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="rounded-2xl bg-white p-12 shadow-lg ring-1 ring-gray-200">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900">Powering Distribution Across Sri Lanka</h2>
                            <p className="mt-4 text-lg text-gray-600">
                                A comprehensive platform connecting suppliers, distributors, and retailers
                            </p>
                        </div>
                        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-rose-600">24/7</div>
                                <div className="mt-2 text-sm font-medium text-gray-600">Platform Availability</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-rose-600">Real-time</div>
                                <div className="mt-2 text-sm font-medium text-gray-600">Order Tracking</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-rose-600">Secure</div>
                                <div className="mt-2 text-sm font-medium text-gray-600">Payment Processing</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-white/50">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                <span>Powered by</span>
                                <span className="font-semibold text-rose-600">IslandLink ISDN</span>
                                <span>© 2026</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );}