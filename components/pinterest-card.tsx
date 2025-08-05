import { Button } from "@/components/ui/button"
import { memo } from "react"

interface PinterestCardProps {
  id: string
  title: string
  subtitle?: string
  description?: string
  image: string
  height: string
  type?: string
  hasButton?: boolean
  buttonText?: string
  badge?: string
}

// Memoize the card component to prevent unnecessary re-renders
const PinterestCard = memo(function PinterestCard({
  id,
  title,
  subtitle,
  description,
  image,
  height,
  type,
  hasButton = false,
  buttonText = "APPLY NOW",
  badge,
}: PinterestCardProps) {
  return (
    <div
      className={`relative ${height} rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow group`}
    >
      <img
        src={image || "/placeholder.svg?height=300&width=250"}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy" // Add lazy loading
        decoding="async" // Optimize image decoding
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Badge (for DEAL cards, etc.) */}
      {badge && (
        <div className="absolute top-4 left-4">
          <span className="bg-white text-[#0a72bd] px-3 py-1 rounded-full text-sm font-semibold">{badge}</span>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        {subtitle && <div className="text-sm opacity-90 mb-1">{subtitle}</div>}
        <div className="text-lg font-semibold mb-1">{title}</div>
        {description && <div className="text-sm opacity-90 mb-3">{description}</div>}

        {/* Button for job cards */}
        {hasButton && (
          <Button className="bg-[#0a72bd] hover:bg-[#085a96] text-white px-4 py-2 rounded-full text-sm font-semibold">
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  )
})

export default PinterestCard
