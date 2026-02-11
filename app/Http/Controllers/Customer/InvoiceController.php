<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Services\InvoiceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InvoiceController extends Controller
{
    protected InvoiceService $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    /**
     * Display a listing of the user's invoices.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $status = $request->input('status');

        $invoices = $this->invoiceService->getUserInvoices($user->id, $status);
        $stats = $this->invoiceService->getUserInvoiceStats($user->id);

        return Inertia::render('Customer/Invoices/Index', [
            'invoices' => $invoices,
            'stats' => $stats,
            'filters' => [
                'status' => $status,
            ],
            'statusOptions' => [
                ['value' => '', 'label' => 'All Invoices'],
                ['value' => Invoice::STATUS_DRAFT, 'label' => 'Draft'],
                ['value' => Invoice::STATUS_SENT, 'label' => 'Sent'],
                ['value' => Invoice::STATUS_PAID, 'label' => 'Paid'],
                ['value' => Invoice::STATUS_OVERDUE, 'label' => 'Overdue'],
            ],
        ]);
    }

    /**
     * Display a specific invoice.
     */
    public function show(Request $request, Invoice $invoice): Response
    {
        $user = $request->user();

        // Ensure the invoice belongs to the user
        if ($invoice->order->user_id !== $user->id) {
            abort(403, 'Unauthorized access to this invoice.');
        }

        $invoice->load(['order.items', 'order.user', 'payments']);

        return Inertia::render('Customer/Invoices/Show', [
            'invoice' => [
                'id' => $invoice->id,
                'invoice_number' => $invoice->invoice_number,
                'invoice_date' => $invoice->invoice_date->format('M d, Y'),
                'due_date' => $invoice->due_date->format('M d, Y'),
                'subtotal' => $invoice->subtotal,
                'tax' => $invoice->tax,
                'total' => $invoice->total,
                'status' => $invoice->status,
                'status_label' => $invoice->status_label,
                'status_color' => $invoice->status_color,
                'is_overdue' => $invoice->isOverdue(),
                'sent_at' => $invoice->sent_at?->format('M d, Y h:i A'),
                'paid_at' => $invoice->paid_at?->format('M d, Y h:i A'),
                'notes' => $invoice->notes,
                'order' => [
                    'id' => $invoice->order->id,
                    'order_number' => $invoice->order->order_number,
                    'items' => $invoice->order->items->map(function ($item) {
                        return [
                            'product_name' => $item->product_name,
                            'quantity' => $item->quantity,
                            'unit_price' => $item->unit_price,
                            'subtotal' => $item->subtotal,
                        ];
                    }),
                    'delivery_address' => $invoice->order->delivery_address,
                ],
                'customer' => [
                    'name' => $invoice->order->user->name,
                    'email' => $invoice->order->user->email,
                    'phone' => $invoice->order->delivery_phone,
                ],
                'payments' => $invoice->payments->map(function ($payment) {
                    return [
                        'id' => $payment->id,
                        'payment_number' => $payment->payment_number,
                        'amount' => $payment->amount,
                        'payment_method' => $payment->payment_method_label,
                        'status' => $payment->status,
                        'status_label' => $payment->status_label,
                        'processed_at' => $payment->processed_at?->format('M d, Y h:i A'),
                    ];
                }),
            ],
            'canPay' => in_array($invoice->status, [Invoice::STATUS_DRAFT, Invoice::STATUS_SENT, Invoice::STATUS_OVERDUE]),
        ]);
    }

    /**
     * Download invoice as PDF (stub for future implementation).
     */
    public function download(Request $request, Invoice $invoice)
    {
        $user = $request->user();

        if ($invoice->order->user_id !== $user->id) {
            abort(403, 'Unauthorized access to this invoice.');
        }

        // For now, redirect back with a message
        // In production, you would generate and return a PDF
        return back()->with('info', 'PDF download functionality will be available soon.');
    }
}
