import Link from "next/link";
import Image from "next/image";
import { Listing } from "@/types/marketplace";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md"
    >
      {/* 4:3 aspect ratio instead of 1:1 square makes cards ~25% shorter */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100">
        {listing.image_url ? (
          <Image
            src={listing.image_url}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-medium text-slate-400">
            No image
          </div>
        )}
        <div className="absolute left-2 top-2">
          <span className="rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-800 shadow-xs backdrop-blur-xs">
            {listing.category}
          </span>
        </div>
      </div>

      <div className="mt-2.5 flex flex-1 flex-col justify-between px-0.5">
        <div>
          <p className="text-sm font-bold tracking-tight text-slate-900">
            $
            {Number(listing.price).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <h2 className="mt-0.5 line-clamp-1 text-xs font-medium text-slate-800">
            {listing.title}
          </h2>
        </div>
        <p className="mt-1.5 text-[11px] text-slate-400">
          {listing.location || "Local pickup"}
        </p>
      </div>
    </Link>
  );
}
