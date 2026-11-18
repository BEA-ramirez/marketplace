export const instant = false;
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Listing } from "@/types/marketplace";
import { MessageSellerForm } from "@/components/MessageSellerForm";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single<Listing>();

  if (error || !listing) notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to listings</span>
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Image Preview */}
        <div className="lg:col-span-7">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-100 shadow-xs">
            {listing.image_url ? (
              <Image
                src={listing.image_url}
                alt={listing.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400">
                No image available
              </div>
            )}
          </div>
        </div>

        {/* Details & Messaging */}
        <div className="flex flex-col justify-between lg:col-span-5">
          <div>
            <span className="inline-block rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
              {listing.category}
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              {listing.title}
            </h1>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              $
              {Number(listing.price).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 border-y border-slate-100 py-3">
              {listing.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {listing.location}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {new Date(listing.created_at).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {listing.description && (
              <div className="mt-6">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Description
                </h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                  {listing.description}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <MessageSellerForm
              listingId={listing.id}
              sellerEmail={listing.seller_email}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
