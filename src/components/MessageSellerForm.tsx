"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Send, MessageSquare } from "lucide-react";

interface MessageSellerFormProps {
  listingId: string;
  sellerEmail: string;
}

export function MessageSellerForm({
  listingId,
  sellerEmail,
}: MessageSellerFormProps) {
  const [buyerEmail, setBuyerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!buyerEmail.trim() || !message.trim()) {
      setError("Please fill in your email and message.");
      return;
    }

    setSending(true);

    const { error: insertError } = await supabase.from("messages").insert({
      listing_id: listingId,
      buyer_email: buyerEmail.trim(),
      seller_email: sellerEmail,
      message: message.trim(),
    });

    setSending(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSent(true);
    setBuyerEmail("");
    setMessage("");
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900">
          Message sent successfully!
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-500 max-w-xs mx-auto">
          Your message has been securely saved. The seller will reply to your
          email address shortly.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <MessageSquare className="h-4 w-4" />
        </div>
        <h2 className="text-sm font-bold tracking-tight text-slate-900">
          Contact Seller
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label
            htmlFor="buyer-email"
            className="text-xs font-semibold text-slate-700"
          >
            Your email
          </Label>
          <Input
            id="buyer-email"
            type="email"
            value={buyerEmail}
            onChange={(e) => setBuyerEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="mt-1.5 rounded-xl border-slate-200 text-sm"
          />
        </div>
        <div>
          <Label
            htmlFor="buyer-message"
            className="text-xs font-semibold text-slate-700"
          >
            Message
          </Label>
          <Textarea
            id="buyer-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi, is this still available?"
            rows={3}
            required
            className="mt-1.5 rounded-xl border-slate-200 text-sm resize-none"
          />
        </div>
      </div>

      {error && (
        <p className="mt-3 text-xs text-red-600 rounded-xl bg-red-50 p-2.5">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={sending}
        className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
      >
        <Send className="h-3.5 w-3.5" />
        <span>{sending ? "Sending..." : "Send Message"}</span>
      </Button>
    </form>
  );
}
