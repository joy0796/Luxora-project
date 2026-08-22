"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";

type PaymentStatus = "checking" | "success" | "failed";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const [status, setStatus] =
    useState<PaymentStatus>("checking");

  const [reference, setReference] = useState("");

  useEffect(() => {
  const transactionReference =
    searchParams.get("reference");

  if (!transactionReference) {
    setStatus("failed");
    return;
  }

  setReference(transactionReference);

  async function verifyPayment(reference: string) {
    try {
      const response = await fetch(
        `/api/paystack/verify?reference=${encodeURIComponent(
          reference
        )}`
      );

      const data = await response.json();

      if (
        response.ok &&
        data.status === "success"
      ) {
        setStatus("success");
        clearCart();
      } else {
        console.error(
          "Payment verification failed:",
          data
        );

        setStatus("failed");
      }
    } catch (error) {
      console.error(
        "Payment verification error:",
        error
      );

      setStatus("failed");
    }
  }

  verifyPayment(transactionReference);
}, [searchParams, clearCart]);
  if (status === "checking") {
    return (
      <main className="container min-h-[65vh] py-24">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">
            LUXORA / Payment
          </span>

          <h1 className="display-serif mt-4 text-5xl">
            Confirming your payment...
          </h1>

          <p className="mt-5 text-sm leading-7 text-muted">
            Please wait while we confirm your
            transaction with Paystack.
          </p>

          <div className="mx-auto mt-8 h-8 w-8 animate-spin rounded-full border-2 border-line border-t-ink" />
        </div>
      </main>
    );
  }

  if (status === "failed") {
    return (
      <main className="container min-h-[65vh] py-24">
        <div className="mx-auto max-w-xl text-center">
          <span className="eyebrow">
            LUXORA / Payment
          </span>

          <h1 className="display-serif mt-4 text-5xl">
            Payment could not be confirmed.
          </h1>

          <p className="mt-5 text-sm leading-7 text-muted">
            We couldn't confirm your payment.
            Please check your transaction or try
            again.
          </p>

          {reference && (
            <p className="mt-4 text-xs text-muted">
              Reference: {reference}
            </p>
          )}

          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/checkout"
              className="lux-button"
            >
              Return to Checkout
            </Link>

            <Link
              href="/collections"
              className="border border-line px-6 py-3 text-[10px] uppercase tracking-[.1em]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container min-h-[65vh] py-24">
      <div className="mx-auto max-w-xl text-center">
        <span className="eyebrow">
          LUXORA / Order Confirmed
        </span>

        <h1 className="display-serif mt-4 text-5xl">
          Thank you for your order.
        </h1>

        <p className="mt-5 text-sm leading-7 text-muted">
          Your payment has been successfully
          confirmed. Your LUXORA order is now being
          processed.
        </p>

        {reference && (
          <div className="mt-6 border border-line p-4">
            <p className="text-[9px] uppercase tracking-[.1em] text-muted">
              Payment reference
            </p>

            <p className="mt-2 text-xs">
              {reference}
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/collections"
            className="lux-button"
          >
            Continue Shopping
          </Link>

          <Link
            href="/"
            className="border border-line px-6 py-3 text-[10px] uppercase tracking-[.1em]"
          >
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}