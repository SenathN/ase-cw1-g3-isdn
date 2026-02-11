<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    protected InvoiceService $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    /**
     * Process a payment for an order.
     */
    public function processPayment(
        Order $order,
        string $paymentMethod,
        float $amount,
        array $paymentDetails = []
    ): Payment {
        return DB::transaction(function () use ($order, $paymentMethod, $amount, $paymentDetails) {
            // Get or create invoice
            $invoice = $order->latestInvoice ?? $this->invoiceService->createInvoice($order);

            // Create payment record
            $payment = Payment::create([
                'order_id' => $order->id,
                'invoice_id' => $invoice->id,
                'payment_number' => Payment::generatePaymentNumber(),
                'amount' => $amount,
                'payment_method' => $paymentMethod,
                'status' => Payment::STATUS_PROCESSING,
                'payment_details' => $paymentDetails,
            ]);

            // Simulate payment processing
            $success = $this->simulatePaymentGateway($paymentMethod, $amount, $paymentDetails);

            if ($success) {
                $payment->update([
                    'status' => Payment::STATUS_COMPLETED,
                    'transaction_id' => 'TXN-' . strtoupper(uniqid()),
                    'processed_at' => now(),
                ]);

                // Mark invoice as paid
                $this->invoiceService->markAsPaid($invoice);
            } else {
                $payment->update([
                    'status' => Payment::STATUS_FAILED,
                    'failure_reason' => 'Payment was declined. Please try again or use a different payment method.',
                    'processed_at' => now(),
                ]);
            }

            return $payment->fresh();
        });
    }

    /**
     * Simulate payment gateway (replace with actual gateway integration).
     */
    protected function simulatePaymentGateway(string $method, float $amount, array $details): bool
    {
        // In production, this would connect to Stripe, PayPal, etc.
        // For demo, always return success except for specific test cases
        
        // Simulate failure for amounts ending in .99
        if (str_ends_with(number_format($amount, 2), '.99')) {
            return false;
        }

        return true;
    }

    /**
     * Get user's payment history.
     */
    public function getUserPayments(int $userId, ?string $status = null, int $perPage = 10): LengthAwarePaginator
    {
        $query = Payment::whereHas('order', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })
        ->with(['order' => function ($q) {
            $q->select('id', 'order_number', 'total');
        }]);

        if ($status) {
            $query->where('status', $status);
        }

        return $query->orderBy('created_at', 'desc')->paginate($perPage);
    }

    /**
     * Get payment by ID for a user.
     */
    public function getPayment(int $userId, int $paymentId): ?Payment
    {
        return Payment::whereHas('order', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })
        ->with(['order', 'invoice'])
        ->find($paymentId);
    }

    /**
     * Request refund for a payment.
     */
    public function requestRefund(Payment $payment, ?string $reason = null): Payment
    {
        if ($payment->status !== Payment::STATUS_COMPLETED) {
            throw new \Exception('Only completed payments can be refunded.');
        }

        // In production, this would process through the payment gateway
        $payment->update([
            'status' => Payment::STATUS_REFUNDED,
            'failure_reason' => $reason ?? 'Refund requested by customer',
        ]);

        // Update order payment status
        $payment->order->update([
            'payment_status' => Order::PAYMENT_REFUNDED,
        ]);

        // Update invoice if exists
        if ($payment->invoice) {
            $payment->invoice->update([
                'status' => Invoice::STATUS_CANCELLED,
            ]);
        }

        return $payment->fresh();
    }

    /**
     * Get payment statistics for a user.
     */
    public function getUserPaymentStats(int $userId): array
    {
        $baseQuery = Payment::whereHas('order', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        });

        return [
            'total_payments' => (clone $baseQuery)->count(),
            'completed_payments' => (clone $baseQuery)->where('status', Payment::STATUS_COMPLETED)->count(),
            'pending_payments' => (clone $baseQuery)->whereIn('status', [Payment::STATUS_PENDING, Payment::STATUS_PROCESSING])->count(),
            'failed_payments' => (clone $baseQuery)->where('status', Payment::STATUS_FAILED)->count(),
            'total_paid' => (clone $baseQuery)->where('status', Payment::STATUS_COMPLETED)->sum('amount'),
            'total_refunded' => (clone $baseQuery)->where('status', Payment::STATUS_REFUNDED)->sum('amount'),
        ];
    }

    /**
     * Get available payment methods.
     */
    public function getAvailablePaymentMethods(): array
    {
        return [
            [
                'id' => Payment::METHOD_CREDIT_CARD,
                'name' => 'Credit Card',
                'icon' => '💳',
                'description' => 'Pay securely with your credit card',
            ],
            [
                'id' => Payment::METHOD_DEBIT_CARD,
                'name' => 'Debit Card',
                'icon' => '💳',
                'description' => 'Pay directly from your bank account',
            ],
            [
                'id' => Payment::METHOD_BANK_TRANSFER,
                'name' => 'Bank Transfer',
                'icon' => '🏦',
                'description' => 'Direct bank transfer (may take 1-2 days)',
            ],
            [
                'id' => Payment::METHOD_CASH,
                'name' => 'Cash on Delivery',
                'icon' => '💵',
                'description' => 'Pay when your order arrives',
            ],
        ];
    }
}
