import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index(props) {
    const { products = {}, categories = [], featuredProducts = [], filters: rawFilters } = props || {};
    const filters = rawFilters && typeof rawFilters === 'object' && !Array.isArray(rawFilters) ? rawFilters : {};
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [sortBy, setSortBy] = useState(filters.sort || 'name');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('customer.products.index'), {
            search,
            category: selectedCategory,
            sort: sortBy,
        }, { preserveState: true, replace: true });
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        router.get(route('customer.products.index'), {
            search,
            category: categoryId,
            sort: sortBy,
        }, { preserveState: true, replace: true });
    };

    const handleSortChange = (sort) => {
        setSortBy(sort);
        router.get(route('customer.products.index'), {
            search,
            category: selectedCategory,
            sort,
        }, { preserveState: true, replace: true });
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedCategory('');
        setSortBy('name');
        router.get(route('customer.products.index'));
    };

    const productList = products?.data || [];
    const categoryList = categories || [];

    return (
        <CustomerLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Products
                </h2>
            }
        >
            <Head title="Products - IslandLink ISDN" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Featured Products */}
                    {featuredProducts && featuredProducts.length > 0 && (
                        <div className="mb-8">
                            <h3 className="mb-4 text-lg font-semibold text-gray-800">Featured Products</h3>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {featuredProducts.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={route('customer.products.show', product.id)}
                                        className="group overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className="aspect-square bg-gray-100 p-4">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-4xl">
                                                    📦
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h4 className="truncate text-sm font-medium text-gray-900 group-hover:text-rose-600">
                                                {product.name}
                                            </h4>
                                            <p className="mt-1 text-sm font-bold text-rose-600">
                                                ${parseFloat(product.price).toFixed(2)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search and Filters */}
                    <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
                        <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                                />
                            </div>
                            <div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                                >
                                    <option value="">All Categories</option>
                                    {categoryList.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                                >
                                    <option value="name">Name (A-Z)</option>
                                    <option value="price_low">Price (Low to High)</option>
                                    <option value="price_high">Price (High to Low)</option>
                                    <option value="newest">Newest</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                                >
                                    Search
                                </button>
                                {(search || selectedCategory || sortBy !== 'name') && (
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Category Pills */}
                    {categoryList.length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-2">
                            <button
                                onClick={() => handleCategoryChange('')}
                                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                    !selectedCategory
                                        ? 'bg-rose-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-rose-50'
                                }`}
                            >
                                All
                            </button>
                            {categoryList.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryChange(category.id.toString())}
                                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                        selectedCategory === category.id.toString()
                                            ? 'bg-rose-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-rose-50'
                                    }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Products Grid */}
                    {productList.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                {productList.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={route('customer.products.show', product.id)}
                                        className="group overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:shadow-md"
                                    >
                                        <div className="relative aspect-square bg-gray-50 p-4">
                                            {product.image_url ? (
                                                <img
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    className="h-full w-full object-contain"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-5xl">
                                                    📦
                                                </div>
                                            )}
                                            {product.is_on_sale && product.original_price && (
                                                <span className="absolute right-2 top-2 rounded bg-rose-600 px-2 py-1 text-xs font-bold text-white">
                                                    SALE
                                                </span>
                                            )}
                                            {!product.stock_quantity && (
                                                <span className="absolute bottom-2 left-2 rounded bg-gray-800 px-2 py-1 text-xs text-white">
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <span className="text-xs text-gray-500">
                                                {product.category?.name}
                                            </span>
                                            <h3 className="mt-1 truncate font-medium text-gray-900 group-hover:text-rose-600">
                                                {product.name}
                                            </h3>
                                            <div className="mt-2 flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-rose-600">
                                                    ${parseFloat(product.price).toFixed(2)}
                                                </span>
                                                {product.original_price && product.is_on_sale && (
                                                    <span className="text-sm text-gray-400 line-through">
                                                        ${parseFloat(product.original_price).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">
                                                per {product.unit}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Pagination */}
                            {products?.last_page > 1 && products?.links && (
                                <div className="mt-8 flex justify-center">
                                    <nav className="flex gap-1">
                                        {products.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`rounded-md px-3 py-2 text-sm ${
                                                    link.active
                                                        ? 'bg-rose-600 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 hover:bg-rose-50'
                                                        : 'cursor-not-allowed bg-gray-100 text-gray-400'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                            <div className="text-5xl">🔍</div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
                            <p className="mt-2 text-gray-500">
                                Try adjusting your search or filter to find what you're looking for.
                            </p>
                            <button
                                onClick={clearFilters}
                                className="mt-4 rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
