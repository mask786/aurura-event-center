"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { getBooking, updateBooking } from "@/lib/booking";
import { formatCurrency, getPackage } from "@/lib/pricing";
import { eventTypes } from "@/lib/config";

type Status = "verifying" | "success" | "not_paid" | "error";

export default function PaySuccessPage() {
  return (
    <Suspense fallback={<div className="pt-40 pb-32 text-center text-charcoal-soft/60">Loading…</div>}>
      <PaySuccessInner />
    </Suspense>
  );
}

function PaySuccessInner() {
  const { t } = useLanguage();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("verifying");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const sessionId = searchParams.get("session_id");

    async function run() {
      if (!id || !sessionId) {
        setStatus("error");
        return;
      }

      const booking = getBooking(id);
      if (!booking || !booking.quote) {
        setStatus("error");
        return;
      }

      // Already processed (e.g. a page refresh after success) — just move on.
      if (booking.payment?.depositPaid) {
        router.replace(`/confirmation/${id}`);
        return;
      }

      try {
        const res = await fetch(`/api/verify-checkout-session?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();

        if (!res.ok || !data.paid) {
          setStatus("not_paid");
          return;
        }

        const eventDate = booking.estimate ? new Date(booking.estimate.eventDate) : null;
        const nextPaymentDate = eventDate ? new Date(eventDate.getTime() - 14 * 86400000) : new Date();

        updateBooking(id, {
          stage: "confirmed",
          payment: {
            depositPaid: true,
            amount: data.amountTotal ?? booking.quote.deposit,
            paidAt: new Date().toISOString(),
            method: "Card via Stripe",
            nextPaymentDue: nextPaymentDate.toISOString(),
          },
        });

        const pkg = booking.estimate ? getPackage(booking.estimate.packageId) : undefined;
        const eventTypeName = booking.estimate
          ? eventTypes.find((e) => e.id === booking.estimate!.eventType)?.name.en
          : undefined;

        fetch("/api/booking-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: id,
            firstName: booking.lead?.firstName,
            lastName: booking.lead?.lastName,
            email: booking.lead?.email,
            eventType: eventTypeName,
            eventDate: booking.estimate?.eventDate,
            packageName: pkg?.name.en,
            total: formatCurrency(booking.quote.finalTotal),
            depositPaid: formatCurrency(data.amountTotal ?? booking.quote.deposit),
            balance: formatCurrency(booking.quote.balance),
            nextPaymentDue: nextPaymentDate.toLocaleDateString(),
          }),
        }).catch((err) => console.error("Failed to send booking confirmation email", err));

        setStatus("success");
        router.replace(`/confirmation/${id}`);
      } catch (err) {
        console.error("Failed to verify Stripe checkout session", err);
        setStatus("error");
      }
    }

    run();
  }, [params.id, searchParams, router]);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (status === "verifying" || status === "success") {
    return <div className="pt-40 pb-32 text-center text-charcoal-soft/60">{t.common.loading}</div>;
  }

  return (
    <div className="pt-40 pb-32 text-center">
      <p className="text-charcoal-soft/70 mb-6">
        {status === "not_paid"
          ? "We couldn't confirm your payment yet. If you completed checkout, please give it a moment and try again."
          : "Something went wrong confirming your payment."}
      </p>
      <Link href={`/pay/${id}`} className="btn btn-primary">
        Back to payment
      </Link>
    </div>
  );
}
