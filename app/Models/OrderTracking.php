<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderTracking extends Model
{
    protected $fillable = [
        'order_id',
        'status',
        'title',
        'description',
        'location',
        'updated_by',
    ];

    /**
     * Get the order that owns this tracking entry.
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get icon for status.
     */
    public function getIconAttribute(): string
    {
        return match($this->status) {
            Order::STATUS_PENDING => '📋',
            Order::STATUS_CONFIRMED => '✅',
            Order::STATUS_PROCESSING => '📦',
            Order::STATUS_READY_FOR_DELIVERY => '🚚',
            Order::STATUS_OUT_FOR_DELIVERY => '🛻',
            Order::STATUS_DELIVERED => '🏠',
            Order::STATUS_CANCELLED => '❌',
            default => '📌',
        };
    }
}
