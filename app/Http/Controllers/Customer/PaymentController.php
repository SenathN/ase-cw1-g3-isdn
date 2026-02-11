<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use App\Services\PaymentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    protected PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Display payment history.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $status = $request->input('status');

        $payments = $this->paymentService->getUserPayments($user->id, $status);
        $stats = $this->paymentService->getUserPaymentStats($user->id);

        return Inertia::render('Customer/Payments/Index', [
            'payments' => $payments,
            'stats' => $stats,
            'filters' => [
                'status' => $status,
            ],
            'statusOptions' => [
                ['value' => '', 'label' => 'All Payments'],
                ['value' => Payment::STATUS_COMPLETED, 'label' => 'Completed'],
                ['value' => Payment::STATUS_PENDING, 'label' => 'Pending'],
                ['value' => Payment::STATUS_FAILED, 'label' => 'Failed'],
                ['value' => Payment::STATUS_REFUNDED, 'label' => 'Refunded'],
            ],
        ]);
    }

    /**
     * Show payment page for an order.
     */
    public function create(Request $request, Order $order): Response
    {
        $user = $request->user();

        if ($order->user_id !== $user->id) {
            abort(403, 'Unauthorized access to this order.');
        }

        if ($order->payment_status === Order::PAYMENT_PAID) {
            return redirect()->route('customer.orders.show', $order)
                ->with('info', 'This order has already been paid.');
        }

        $order->load('items');

        return Inertia::render('Customer/Payments/Process', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'subtotal' => $order->subtotal,
                'tax' => $order->tax,
                'delivery_fee' => $order->delivery_fee,
                'discount' => $order->discount,
                'total' => $order->total,
                'payment_status' => $order->payment_status,
                'items' => $order->items->map(function ($item) {
                    return [
                        'product_name' => $item->product_name,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'subtotal' => $item->subtotal,
                    ];
                }),
            ],
            'paymentMethods' => $this->paymentService->getAvailablePaymentMethods(),
        ]);
    }

    /**
     * Process payment for an order.
     */
    public function store(Request $request, Order $order): RedirectResponse
    {
        $user = $request->user();

        if ($order->user_id !== $user->id) {
            abort(403, 'Unauthorized access to this order.');
        }

        if ($order->payment_status === Order::PAYMENT_PAID) {
            return redirect()->route('customer.orders.show', $order)
                ->with('info', 'This order has already been paid.');
        }

        $validated = $request->validate([
            'payment_method' => 'required|string|in:credit_card,debit_card,bank_transfer,cash',
            'card_number' => 'required_if:payment_method,credit_card,debit_card|nullable|string',
            'card_expiry' => 'required_if:payment_method,credit_card,debit_card|nullable|string',
            'card_cvv' => 'required_if:payment_method,credit_card,debit_card|nullable|string',
            'card_name' => 'required_if:payment_method,credit_card,debit_card|nullable|string',
        ]);

        // Build payment details (in production, this would be tokenized by the payment gateway)
        $paymentDetails = [];
        if (in_array($validated['payment_method'], ['credit_card', 'debit_card'])) {
            $paymentDetails = [
                'card_last_four' => substr($validated['card_number'] ?? '', -4),
                'card_name' => $validated['card_name'] ?? null,
            ];
        }

        try {
            $payment = $this->paymentService->processPayment(
                $order,
                $validated['payment_method'],
                (float) $order->total,
                $paymentDetails
            );

            if ($payment->status === Payment::STATUS_COMPLETED) {
                return redirect()->route('customer.orders.show', $order)
                    ->with('success', 'Payment successful! Your order has been paid.');
            } else {
                return back()
                    ->with('error', $payment->failure_reason ?? 'Payment failed. Please try again.');
            }
        } catch (\Exception $e) {
            return back()
                ->with('error', 'An error occurred while processing your payment. Please try again.');
        }
    }

    /**
     * Show payment details.
     */
    public function show(Request $request, Payment $payment): Response
    {
        $user = $request->user();

        if ($payment->order->user_id !== $user->id) {
            abort(403, 'Unauthorized access to this payment.');
        }

        $payment->load(['order', 'invoice']);

        return Inertia::render('Customer/Payments/Show', [
            'payment' => [
                'id' => $payment->id,
                'payment_number' => $payment->payment_number,
                'amount' => $payment->amount,
                'payment_method' => $payment->payment_method,
                'payment_method_label' => $payment->payment_method_label,
                'status' => $payment->status,
                'status_label' => $payment->status_label,
                'status_color' => $payment->status_color,
                'transaction_id' => $payment->transaction_id,
                'payment_details' => $payment->payment_details,
                'failure_reason' => $payment->failure_reason,
                'processed_at' => $payment->processed_at?->format('M d, Y h:i A'),
                'created_at' => $payment->created_at->format('M d, Y h:i A'),
                'order' => [
                    'id' => $payment->order->id,
                    'order_number' => $payment->order->order_number,
                ],
                'invoice' => $payment->invoice ? [
                    'id' => $payment->invoice->id,
                    'invoice_number' => $payment->invoice->invoice_number,
                ] : null,
            ],
        ]);
    }
}
