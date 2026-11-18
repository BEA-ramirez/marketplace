"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Listing } from "@/types/marketplace";
import { ListingCard } from "@/components/ListingCard";
import { CategoryTabs } from "@/components/CategoryTabs";

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchListings() {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) setError(error.message);
      else setListings(data ?? []);
      setLoading(false);
    }
    fetchListings();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return listings.filter((l) => {
      const matchesCategory =
        activeCategory === "All" || l.category === activeCategory;
      const matchesSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        (l.description ?? "").toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [listings, activeCategory, search]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Today&apos;s picks
          </h1>
          <p className="text-xs text-slate-500">
            Fresh items listed by your community
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings..."
            className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 shadow-xs transition-colors focus:border-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <div className="mb-5">
        <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          Error: {error}
        </p>
      )}

      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
            <div
              key={n}
              className="animate-pulse rounded-xl border border-slate-200/80 bg-white p-2.5"
            >
              <div className="aspect-[4/3] w-full rounded-lg bg-slate-100" />
              <div className="mt-2.5 space-y-1.5">
                <div className="h-3.5 w-1/3 rounded bg-slate-100" />
                <div className="h-3 w-3/4 rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center shadow-xs">
          <p className="text-sm font-medium text-slate-600">
            No listings found.
          </p>
          <Link
            href="/create"
            className="mt-2 inline-block text-xs font-semibold text-slate-900 underline hover:text-slate-700"
          >
            Be the first to post →
          </Link>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </main>
  );
}
