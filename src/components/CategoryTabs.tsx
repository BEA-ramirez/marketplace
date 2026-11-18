"use client";

import { CATEGORIES } from "@/types/categories";

interface CategoryTabsProps {
  active: string;
  onChange: (value: string) => void;
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  const tabs = ["All", ...CATEGORIES];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {tabs.map((tab) => {
        const isActive = active === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-medium transition-all ${
              isActive
                ? "bg-slate-900 text-white shadow-xs"
                : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
