import { useState, FormEvent } from 'react';
import { X } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeCardElementOptions } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Payment } from '../types/payments';
import { updateInvoiceStatus } from '../firebase/invoices';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onComplete: (payment: Payment) => void;
  amount: number;
  invoiceId: string;
}

const cardElementOptions: StripeCardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      '::placeholder': {
        color: '#a0aec0',
      },
    },
    invalid: {
      color: '#e53e3e',
    },
  },
};

/* eslint-disable no-unused-vars */
type CheckoutFormProps = {
  amount: number;
  invoiceId: string;
  onComplete: (payment: Payment) => void;
  onClose: () => void;
};
/* eslint-enable no-unused-vars */

function CheckoutForm({ amount, invoiceId, onComplete, onClose }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const { clientSecret } = await res.json();
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        await updateInvoiceStatus(invoiceId, 'paid');
        const payment: Payment = {
          id: result.paymentIntent.id,
          invoiceId,
          amount,
          currency: result.paymentIntent.currency || 'usd',
          status: 'completed',
          method: 'stripe',
          transactionId: result.paymentIntent.id,
          paidAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        onComplete(payment);
        onClose();
      }
    } catch (err) {
      console.error('Payment error', err);
      setError('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount to Pay
        </label>
        <div className="text-2xl font-bold text-gray-900">
          ${amount.toFixed(2)}
        </div>
      </div>
      <CardElement options={cardElementOptions} className="p-3 border rounded" />
      {error && <div className="text-sm text-red-600">{error}</div>}
      <button
        type="submit"
        className="btn-primary w-full"
        disabled={!stripe || loading}
      >
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
}

function PaymentModal({ isOpen, onClose, onComplete, amount, invoiceId }: PaymentModalProps) {
  if (!isOpen) return null;

  return (
    <Elements stripe={stripePromise}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="p-6">
            <CheckoutForm
              amount={amount}
              invoiceId={invoiceId}
              onComplete={onComplete}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default PaymentModal;

