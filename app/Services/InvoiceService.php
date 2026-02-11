<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Order;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class InvoiceService
{
    /**
     * Create invoice for an order.
     */
    public function createInvoice(Order $order): Invoice
    {
        return DB::transaction(function () use ($order) {
            $invoice = Invoice::create([
                'order_id' => $order->id,
                'invoice_number' => Invoice::generateInvoiceNumber(),
                'invoice_date' => now(),
                'due_date' => now()->addDays(14), // 14 days to pay
                'subtotal' => $order->subtotal,
                'tax' => $order->tax,
                'total' => $order->total,
                'status' => Invoice::STATUS_DRAFT,
            ]);

            return $invoice;
        });
    }

    /**
     * Send invoice to customer.
     */
    public function sendInvoice(Invoice $invoice): Invoice
    {
        $invoice->update([
            'status' => Invoice::STATUS_SENT,
            'sent_at' => now(),
        ]);

        // Here you would typically send an email notification
        // Mail::to($invoice->order->user)->send(new InvoiceMail($invoice));

        return $invoice->fresh();
    }

    /**
     * Mark invoice as paid.
     */
    public function markAsPaid(Invoice $invoice): Invoice
    {
        $invoice->update([
            'status' => Invoice::STATUS_PAID,
            'paid_at' => now(),
        ]);

        // Update the order payment status as well
        $invoice->order->update([
            'payment_status' => Order::PAYMENT_PAID,
            'paid_at' => now(),
        ]);

        return $invoice->fresh();
    }

    /**
     * Get user's invoices.
     */
    public function getUserInvoices(int $userId, ?string $status = null, int $perPage = 10): LengthAwarePaginator
    {
        $query = Invoice::whereHas('order', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })
        ->with(['order' => function ($q) {
            $q->select('id', 'order_number', 'status', 'total');
        }]);

        if ($status) {
            $query->where('status', $status);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get invoice by ID for a user.
     */
    public function getInvoice(int $userId, int $invoiceId): ?Invoice
    {
        return Invoice::whereHas('order', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })
        ->with(['order.items.product', 'order.user', 'payments'])
        ->find($invoiceId);
    }

    /**
     * Check and update overdue invoices.
     */
    public function updateOverdueInvoices(): int
    {
        return Invoice::where('status', Invoice::STATUS_SENT)
            ->where('due_date', '<', now())
            ->update(['status' => Invoice::STATUS_OVERDUE]);
    }

    /**
     * Get invoice statistics for a user.
     */
    public function getUserInvoiceStats(int $userId): array
    {
        $baseQuery = Invoice::whereHas('order', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        });

        return [
            'total_invoices' => (clone $baseQuery)->count(),
            'pending_invoices' => (clone $baseQuery)->whereIn('status', [Invoice::STATUS_DRAFT, Invoice::STATUS_SENT])->count(),
            'paid_invoices' => (clone $baseQuery)->where('status', Invoice::STATUS_PAID)->count(),
            'overdue_invoices' => (clone $baseQuery)->where('status', Invoice::STATUS_OVERDUE)->count(),
            'total_amount' => (clone $baseQuery)->sum('total'),
            'paid_amount' => (clone $baseQuery)->where('status', Invoice::STATUS_PAID)->sum('total'),
            'pending_amount' => (clone $baseQuery)->whereIn('status', [Invoice::STATUS_DRAFT, Invoice::STATUS_SENT, Invoice::STATUS_OVERDUE])->sum('total'),
        ];
    }
}
