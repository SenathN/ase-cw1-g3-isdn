import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ product = {}, relatedProducts = [] }) {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        router.post(route('customer.cart.add'), {
            product_id: product.id,
            quantity,
        });
    };

    const incrementQuantity = () => {
        if (quantity < product.stock_quantity) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <CustomerLayout
            header={
                <div className="flex items-center gap-2 text-sm">
                    <Link href={route('customer.products.index')} className="text-rose-600 hover:underline">
                        Products
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600">{product.category?.name}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-800">{product.name}</span>
                </div>
            }
        >
            <Head title={`${product.name} - IslandLink ISDN`} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Product Details */}
                    <div className="mb-8 overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="grid gap-8 p-6 md:grid-cols-2">
                            {/* Product Image */}
                            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-50 p-8">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-8xl">
                                        📦
                                    </div>
                                )}
                                {product.is_on_sale && product.original_price && (
                                    <span className="absolute right-4 top-4 rounded-full bg-rose-600 px-3 py-1 text-sm font-bold text-white">
                                        {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                                    </span>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col">
                                <div className="mb-2">
                                    <Link
                                        href={route('customer.products.index', { category: product.category_id })}
                                        className="text-sm text-rose-600 hover:underline"
                                    >
                                        {product.category?.name}
                                    </Link>
                                </div>
                                
                                <h1 className="mb-4 text-2xl font-bold text-gray-900">
                                    {product.name}
                                </h1>

                                <div className="mb-6 flex items-baseline gap-3">
                                    <span className="text-3xl font-bold text-rose-600">
                                        ${parseFloat(product.price).toFixed(2)}
                                    </span>
                                    {product.original_price && product.is_on_sale && (
                                        <span className="text-xl text-gray-400 line-through">
                                            ${parseFloat(product.original_price).toFixed(2)}
                                        </span>
                                    )}
                                    <span className="text-gray-500">
                                        per {product.unit}
                                    </span>
                                </div>

                                {product.description && (
                                    <div className="mb-6">
                                        <h3 className="mb-2 font-medium text-gray-900">Description</h3>
                                        <p className="text-gray-600">{product.description}</p>
                                    </div>
                                )}

                                {/* Stock Status */}
                                <div className="mb-6">
                                    {product.stock_quantity > 0 ? (
                                        <span className="inline-flex items-center gap-1 text-sm text-green-600">
                                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                            In Stock ({product.stock_quantity} available)
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-sm text-red-600">
                                            <span className="h-2 w-2 rounded-full bg-red-500"></span>
                                            Out of Stock
                                        </span>
                                    )}
                                </div>

                                {/* Quantity Selector */}
                                {product.stock_quantity > 0 && (
                                    <div className="mb-6">
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Quantity
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={decrementQuantity}
                                                disabled={quantity <= 1}
                                                className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock_quantity, parseInt(e.target.value) || 1)))}
                                                className="h-10 w-20 rounded-md border-gray-300 text-center"
                                                min="1"
                                                max={product.stock_quantity}
                                            />
                                            <button
                                                onClick={incrementQuantity}
                                                disabled={quantity >= product.stock_quantity}
                                                className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Add to Cart */}
                                <div className="mt-auto flex gap-3">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.stock_quantity <= 0}
                                        className="flex-1 rounded-md bg-rose-600 px-6 py-3 text-center font-medium text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div>
                            <h2 className="mb-4 text-lg font-semibold text-gray-800">Related Products</h2>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                {relatedProducts.map((relatedProduct) => (
                                    <Link
                                        key={relatedProduct.id}
                                        href={route('customer.products.show', relatedProduct.id)}
                                        className="group overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
                                    >
                                        <div className="aspect-square bg-gray-50 p-4">
                                            {relatedProduct.image_url ? (
                                                <img
                                                    src={relatedProduct.image_url}
                                                    alt={relatedProduct.name}
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
                                                {relatedProduct.name}
                                            </h4>
                                            <p className="mt-1 text-sm font-bold text-rose-600">
                                                ${parseFloat(relatedProduct.price).toFixed(2)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Back Link */}
                    <div className="mt-8">
                        <Link
                            href={route('customer.products.index')}
                            className="text-sm text-rose-600 hover:underline"
                        >
                            ← Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
