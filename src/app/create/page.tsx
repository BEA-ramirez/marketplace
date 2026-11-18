"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, ImageIcon, ArrowLeft, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/types/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function CreateListingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [sellerEmail, setSellerEmail] = useState("");
  const [location, setLocation] = useState("Palo Alto, CA");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearPhoto = () => {
    setPhoto(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const priceNum = Number(price);
    if (
      !title.trim() ||
      !sellerEmail.trim() ||
      isNaN(priceNum) ||
      priceNum < 0
    ) {
      setError("Please fill in title, a valid price, and your email.");
      return;
    }

    setSubmitting(true);

    let image_url: string | null = null;

    if (photo) {
      const ext = photo.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(fileName, photo, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        setError(`Photo upload failed: ${uploadError.message}`);
        setSubmitting(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("listing-images")
        .getPublicUrl(fileName);

      image_url = publicUrlData.publicUrl;
    }

    const { data, error: insertError } = await supabase
      .from("listings")
      .insert({
        title: title.trim(),
        description: description.trim() || null,
        price: priceNum,
        category,
        seller_email: sellerEmail.trim(),
        image_url,
        location: location.trim() || null,
      })
      .select("id")
      .single();

    setSubmitting(false);

    if (insertError || !data) {
      setError(insertError?.message ?? "Failed to create listing");
      return;
    }

    setTitle("");
    setDescription("");
    setPrice("");
    setCategory(CATEGORIES[0]);
    setSellerEmail("");
    setLocation("Palo Alto, CA");
    clearPhoto();

    router.push(`/listing/${data.id}`);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to marketplace</span>
      </Link>

      <div className="mt-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Create a listing
        </h1>
        <p className="text-xs text-slate-500">
          Fill in the details below to publish your item.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Left Column: Photo Upload (Compact square) */}
          <div className="md:col-span-5 flex flex-col">
            <Label className="text-xs font-semibold text-slate-700 mb-2">
              Item Photo
            </Label>
            <div className="flex-1 flex flex-col">
              {preview ? (
                <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearPhoto}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/80 text-white backdrop-blur-xs transition-transform hover:scale-105"
                    aria-label="Remove photo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-semibold text-slate-700">
                      Click to upload
                    </span>
                    <p className="text-[11px] text-slate-400">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Right Column: Form Inputs */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <Label
                htmlFor="title"
                className="text-xs font-semibold text-slate-700"
              >
                Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Vintage road bike"
                maxLength={255}
                required
                className="mt-1.5 rounded-xl border-slate-200 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="price"
                  className="text-xs font-semibold text-slate-700"
                >
                  Price (USD) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                  className="mt-1.5 rounded-xl border-slate-200 text-sm"
                />
              </div>
              <div>
                <Label
                  htmlFor="category"
                  className="text-xs font-semibold text-slate-700"
                >
                  Category *
                </Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold text-slate-700"
                >
                  Your email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="mt-1.5 rounded-xl border-slate-200 text-sm"
                />
              </div>
              <div>
                <Label
                  htmlFor="location"
                  className="text-xs font-semibold text-slate-700"
                >
                  Location
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, State"
                  className="mt-1.5 rounded-xl border-slate-200 text-sm"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="description"
                className="text-xs font-semibold text-slate-700"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe condition, features..."
                rows={3}
                className="mt-1.5 rounded-xl border-slate-200 text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-5 text-xs text-red-600 rounded-xl bg-red-50 p-3">
            {error}
          </p>
        )}

        <div className="mt-6 border-t border-slate-100 pt-4 flex justify-end">
          <Button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            {submitting ? "Publishing..." : "Publish Listing"}
          </Button>
        </div>
      </form>
    </main>
  );
}
