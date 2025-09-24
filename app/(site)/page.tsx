
import { headers } from 'next/headers';
import Navbar from "@/components/nav/Navbar";
import HeroTransition from "@/components/layout/HeroTransition";
import UnifiedMasonry from "@/components/grids/UnifiedMasonry";
import Footer from '@/components/layout/Footer';
import ExitTransition from '@/components/layout/HeroSectionExit';
async function getBase() {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'http';
  return `${proto}://${host}`;
}

async function getCategories() {
  const base = await getBase();
  const res = await fetch(`${base}/api/categories`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json();
}

export default async function Page() {
  const categories = await getCategories();

  return (
    <div className="bg-white relative">
      <HeroTransition />

      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 bg-white">
        <img src="/Blue.png" alt="NEON Background Logo" className="w-150 h-150 object-contain" />
      </div>

      <div className="relative z-10 pt-4 pb-12">
        <UnifiedMasonry />
      </div>

      <Navbar />
      <Footer />
      <ExitTransition />
    </div>
  );
}
