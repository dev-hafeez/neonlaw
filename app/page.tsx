import { MasonryGrid } from "@/components/masonry-grid"
import { Header } from "@/components/header"
import { SearchOverlay } from "@/components/search-overlay"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <SearchOverlay />
      <main className="pt-0">
        <MasonryGrid />
      </main>
    </div>
  )
}
