<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CartService
{
    /**
     * Get or create a cart for the user.
     */
    public function getOrCreateCart(User $user): Cart
    {
        return Cart::firstOrCreate(['user_id' => $user->id]);
    }

    /**
     * Get cart with items for user.
     */
    public function getCartWithItems(User $user): Cart
    {
        $cart = $this->getOrCreateCart($user);
        $cart->load('items.product');
        return $cart;
    }

    /**
     * Add a product to the cart.
     */
    public function addToCart(User $user, Product $product, int $quantity = 1): CartItem
    {
        $cart = $this->getOrCreateCart($user);

        // Check if product is already in cart
        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        if ($cartItem) {
            // Update quantity
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            // Add new item
            $cartItem = $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $quantity,
                'unit_price' => $product->price,
            ]);
        }

        return $cartItem->load('product');
    }

    /**
     * Update the quantity of an item in the cart.
     */
    public function updateQuantity(User $user, int $cartItemId, int $quantity): ?CartItem
    {
        $cart = $this->getOrCreateCart($user);
        $cartItem = $cart->items()->find($cartItemId);

        if (!$cartItem) {
            return null;
        }

        if ($quantity <= 0) {
            $cartItem->delete();
            return null;
        }

        // Check stock availability
        if ($quantity > $cartItem->product->stock_quantity) {
            $quantity = $cartItem->product->stock_quantity;
        }

        $cartItem->quantity = $quantity;
        $cartItem->save();

        return $cartItem->load('product');
    }

    /**
     * Remove an item from the cart.
     */
    public function removeFromCart(User $user, int $cartItemId): bool
    {
        $cart = $this->getOrCreateCart($user);
        $cartItem = $cart->items()->find($cartItemId);

        if (!$cartItem) {
            return false;
        }

        $cartItem->delete();
        return true;
    }

    /**
     * Clear all items from the cart.
     */
    public function clearCart(User $user): void
    {
        $cart = $this->getOrCreateCart($user);
        $cart->clear();
    }

    /**
     * Get cart totals.
     */
    public function getCartTotals(User $user): array
    {
        $cart = $this->getCartWithItems($user);
        
        $subtotal = $cart->subtotal;
        $tax = $subtotal * 0.10; // 10% tax
        $deliveryFee = $subtotal > 0 ? 10.00 : 0; // $10 flat delivery fee
        $total = $subtotal + $tax + $deliveryFee;

        return [
            'item_count' => $cart->item_count,
            'subtotal' => round($subtotal, 2),
            'tax' => round($tax, 2),
            'delivery_fee' => round($deliveryFee, 2),
            'total' => round($total, 2),
        ];
    }

    /**
     * Validate cart items (check stock, prices, etc.)
     */
    public function validateCart(User $user): array
    {
        $cart = $this->getCartWithItems($user);
        $issues = [];

        foreach ($cart->items as $item) {
            // Check if product is still active
            if (!$item->product->is_active) {
                $issues[] = [
                    'item_id' => $item->id,
                    'product_name' => $item->product->name,
                    'issue' => 'Product is no longer available',
                ];
                continue;
            }

            // Check stock
            if ($item->quantity > $item->product->stock_quantity) {
                $issues[] = [
                    'item_id' => $item->id,
                    'product_name' => $item->product->name,
                    'issue' => "Only {$item->product->stock_quantity} available in stock",
                    'available' => $item->product->stock_quantity,
                ];
            }

            // Check if price has changed
            if ($item->unit_price != $item->product->price) {
                $issues[] = [
                    'item_id' => $item->id,
                    'product_name' => $item->product->name,
                    'issue' => 'Price has changed',
                    'old_price' => $item->unit_price,
                    'new_price' => $item->product->price,
                ];
            }
        }

        return $issues;
    }

    /**
     * Sync cart prices with current product prices.
     */
    public function syncPrices(User $user): void
    {
        $cart = $this->getCartWithItems($user);

        foreach ($cart->items as $item) {
            if ($item->unit_price != $item->product->price) {
                $item->unit_price = $item->product->price;
                $item->save();
            }
        }
    }
}
