<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display the product catalog.
     */
    public function index(Request $request)
    {
        $query = Product::with('category')->active();

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        // Price range filter
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Sort
        $sortBy = $request->get('sort', 'name');
        $sortOrder = $request->get('order', 'asc');
        
        switch ($sortBy) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            default:
                $query->orderBy('name', $sortOrder);
        }

        $products = $query->paginate(12)->withQueryString();
        $categories = Category::active()->ordered()->get();
        $featuredProducts = Product::active()->featured()->limit(4)->get();

        return Inertia::render('Customer/Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'featuredProducts' => $featuredProducts,
            'filters' => (object) $request->only(['search', 'category', 'min_price', 'max_price', 'sort']),
        ]);
    }

    /**
     * Display a single product.
     */
    public function show(Product $product)
    {
        // Make sure the product is active
        if (!$product->is_active) {
            abort(404);
        }

        $product->load('category');

        // Get related products from the same category
        $relatedProducts = Product::active()
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();

        return Inertia::render('Customer/Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
