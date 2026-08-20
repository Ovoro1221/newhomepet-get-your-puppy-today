import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchPuppies, reservationAmount, type Puppy } from "@/lib/puppies";
import { ReviewsSection, Stars } from "@/components/Reviews";
import heroImg from "@/assets/hero-puppies.jpg";

function PuppyThumb({ puppy }: { puppy: Puppy }) {
  const sources = useMemo(() => {
    const urls = [puppy.image_url, ...puppy.media.filter((m) => m.type === "image").map((m) => m.url)];
    return Array.from(new Set(urls.filter(Boolean) as string[]));
  }, [puppy.image_url, puppy.media]);
  const [idx, setIdx] = useState(0);
  const src = sources[idx];

  if (!src) return <div className="flex h-full items-center justify-center text-6xl">🐶</div>;

  return (
    <img
      src={src}
      alt={puppy.name}
      loading="lazy"
      onError={() => setIdx((i) => i + 1)}
      className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${!puppy.available ? "opacity-70" : ""}`}
    />
  );
}



export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { data: puppies, isLoading } = useQuery({ queryKey: ["puppies"], queryFn: fetchPuppies });
  const available = puppies ?? [];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:gap-10 md:py-20">
          <div className="order-2 md:order-1">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/30 px-3 py-1 text-xs font-medium text-accent-foreground">
              <span aria-hidden="true">🐶</span> Healthy, happy puppies
            </span>
            <h1 className="mt-4 text-3xl leading-tight font-semibold sm:text-4xl md:text-6xl">
              Find your <span className="text-primary">new best friend</span>
            </h1>
            <p className="mt-3 max-w-md text-base text-muted-foreground sm:text-lg">
              Browse available puppies from trusted breeders. Pick your favorite and we'll deliver them safely to your door.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="#puppies" className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-soft transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">Browse puppies</a>
              <Link to="/about" className="inline-flex min-h-11 items-center rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">Learn more</Link>
            </div>
          </div>
          <div className="relative order-1 md:order-2">
            <img src={heroImg} alt="Group of happy puppies playing outdoors" width={1600} height={900} className="w-full rounded-2xl object-cover shadow-soft md:rounded-3xl" />
          </div>
        </div>
      </section>

      {/* Puppies */}
      <section id="puppies" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 md:mb-8">
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl">Available puppies</h2>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">{available.filter((p) => p.available).length} looking for a home</p>
          </div>
        </div>

        {isLoading && <div className="text-muted-foreground">Loading puppies…</div>}
        {!isLoading && available.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center md:p-12">
            <div className="text-4xl" aria-hidden="true">🐾</div>
            <p className="mt-3 font-medium">No puppies listed yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Sign in as admin to add your first puppy.</p>
          </div>
        )}
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {available.map((p) => <PuppyCard key={p.id} puppy={p} />)}
        </div>
      </section>

      <ReviewsSection />
    </div>
  );
}


function PuppyCard({ puppy }: { puppy: Puppy }) {
  return (
    <Link
      to="/puppy/$id"
      params={{ id: puppy.id }}
      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <PuppyThumb puppy={puppy} />

        {!puppy.available && (
          <span className="absolute left-3 top-3 rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground shadow-soft">Sold</span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-xl font-semibold">{puppy.name}</h3>
            <p className="text-sm text-muted-foreground">{puppy.breed} · {puppy.gender}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-primary">${puppy.price.toLocaleString()}</div>
            <div className="text-[11px] text-muted-foreground">Reserve ${reservationAmount(puppy.price).toLocaleString()}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Stars value={5} className="text-xs" />
          <span className="text-[11px] text-muted-foreground">5.0</span>
        </div>
        <div className="mt-3 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {puppy.age_weeks} weeks old
        </div>
      </div>

    </Link>
  );
}
