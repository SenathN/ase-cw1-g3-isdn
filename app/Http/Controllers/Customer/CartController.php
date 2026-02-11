<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    protected CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Display the shopping cart.
     */
    public function index(Request $request)
    {
        $cart = $this->cartService->getCartWithItems($request->user());
        $totals = $this->cartService->getCartTotals($request->user());
        $issues = $this->cartService->validateCart($request->user());

        return Inertia::render('Customer/Cart/Index', [
            'cart' => $cart,
            'items' => $cart->items,
            'totals' => $totals,
            'issues' => $issues,
        ]);
    }

    /**
     * Add a product to the cart.
     */
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'nullable|integer|min:1|max:99',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Check if product is active and in stock
        if (!$product->is_active) {
            return back()->with('error', 'This product is not available.');
        }

        if ($product->stock_quantity < 1) {
            return back()->with('error', 'This product is out of stock.');
        }

        $quantity = $request->quantity ?? 1;

        // Check stock availability
        if ($quantity > $product->stock_quantity) {
            $quantity = $product->stock_quantity;
        }

        $this->cartService->addToCart($request->user(), $product, $quantity);

        return back()->with('success', "{$product->name} added to cart!");
    }

    /**
     * Update the quantity of a cart item.
     */
    public function update(Request $request, int $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:0|max:99',
        ]);

        $cartItem = $this->cartService->updateQuantity(
            $request->user(),
            $itemId,
            $request->quantity
        );

        if ($request->quantity <= 0) {
            return back()->with('success', 'Item removed from cart.');
        }

        if (!$cartItem) {
            return back()->with('error', 'Item not found in cart.');
        }

        return back()->with('success', 'Cart updated.');
    }

    /**
     * Remove an item from the cart.
     */
    public function remove(Request $request, int $itemId)
    {
        $removed = $this->cartService->removeFromCart($request->user(), $itemId);

        if (!$removed) {
            return back()->with('error', 'Item not found in cart.');
        }

        return back()->with('success', 'Item removed from cart.');
    }

    /**
     * Clear all items from the cart.
     */
    public function clear(Request $request)
    {
        $this->cartService->clearCart($request->user());

        return back()->with('success', 'Cart cleared.');
    }

    /**
     * Sync cart prices with current product prices.
     */
    public function syncPrices(Request $request)
    {
        $this->cartService->syncPrices($request->user());

        return back()->with('success', 'Prices updated to current values.');
    }

    /**
     * Get cart count (for header badge).
     */
    public function count(Request $request)
    {
        $totals = $this->cartService->getCartTotals($request->user());
        return response()->json(['count' => $totals['item_count']]);
    }
}
