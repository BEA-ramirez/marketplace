import Link from "next/link";
import { Plus } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white transition-transform group-hover:scale-105">
            M
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Marketplace
          </span>
        </Link>
        <Link
          href="/create"
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-slate-800 hover:shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Create Listing</span>
        </Link>
      </div>
    </header>
  );
}
