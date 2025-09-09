import Navbar from "@/components/nav/Navbar";
import HeroTransition from "@/components/layout/HeroTransition";
import BeliefsMasonry from "@/components/grids/BeliefsMasonry";
import Footer from '@/components/layout/Footer';
import ExitTransition from '@/components/layout/HeroSectionExit';

export const revalidate = 60;

export default async function AboutPage() {
  return (
    <div className="bg-white relative">
      <HeroTransition />

      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 bg-white">
        <img src="/Blue.png" alt="NEON Background Logo" className="w-96 h-96 object-contain" />
      </div>

      <div className="relative z-10 pt-4 pb-12">
        <BeliefsMasonry />
      </div>

      <Navbar />
      <Footer />
      <ExitTransition />
    </div>
  );
}
