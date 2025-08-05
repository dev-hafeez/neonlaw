"use client"

import { useState, useEffect, useRef } from "react"
import PinterestCard from "./pinterest-card"

// Same base data for horizontal carousel
const baseCardData = [
  {
    id: "1",
    title: "NEON.Family",
    subtitle: "Benefits",
    image: "/placeholder.svg?height=200&width=300",
    height: "h-48",
    type: "benefits",
  },
  {
    id: "2",
    title: "Jenka Jahn",
    subtitle: "People & Culture | Operations",
    image: "/placeholder.svg?height=300&width=250",
    height: "h-80",
    type: "person",
  },
  {
    id: "3",
    title: "UVC Partners on €6.5m Series Seed financing round of Biomatter",
    image: "/placeholder.svg?height=250&width=300",
    height: "h-64",
    type: "deal",
    badge: "DEAL",
  },
  {
    id: "4",
    title: "Disputes",
    subtitle: "Expertise",
    image: "/placeholder.svg?height=200&width=250",
    height: "h-48",
    type: "expertise",
  },
  {
    id: "5",
    title: "Talent Boosters",
    subtitle: "We believe in",
    image: "/placeholder.svg?height=180&width=280",
    height: "h-44",
    type: "benefits",
  },
  {
    id: "6",
    title: "TX Ventures on $50m Series B Round of Pliant",
    image: "/placeholder.svg?height=220&width=280",
    height: "h-56",
    type: "deal",
    badge: "DEAL",
  },
  {
    id: "7",
    title: "Jan-Peter Heyer",
    subtitle: "Partner",
    image: "/placeholder.svg?height=320&width=250",
    height: "h-80",
    type: "person",
  },
  {
    id: "8",
    title: "Energisto eG on renewables Joint Venture with LichtBlick",
    image: "/placeholder.svg?height=280&width=300",
    height: "h-72",
    type: "deal",
    badge: "DEAL",
  },
]

export default function HorizontalCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [translateX, setTranslateX] = useState(0)

  // Create multiple copies for seamless horizontal loop
  const createHorizontalLoopedData = () => {
    const copies = 5
    const loopedData = []

    for (let copy = 0; copy < copies; copy++) {
      baseCardData.forEach((card, index) => {
        loopedData.push({
          ...card,
          id: `h-copy-${copy}-${card.id}-${index}`,
        })
      })
    }
    return loopedData
  }

  const [cardData] = useState(createHorizontalLoopedData())

  // Handle horizontal infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const container = containerRef.current
      const scrollLeft = container.scrollLeft
      const scrollWidth = container.scrollWidth
      const clientWidth = container.clientWidth

      const oneSetWidth = scrollWidth / 5 // 5 copies

      // Reset position when reaching boundaries
      if (scrollLeft >= oneSetWidth * 4) {
        container.scrollLeft = oneSetWidth * 2
      } else if (scrollLeft <= oneSetWidth) {
        container.scrollLeft = oneSetWidth * 3
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })

      // Set initial position
      setTimeout(() => {
        const oneSetWidth = container.scrollWidth / 5
        container.scrollLeft = oneSetWidth * 2
      }, 100)
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="flex gap-4 w-max">
        {cardData.map((card) => (
          <div key={card.id} className="flex-shrink-0 w-80">
            <PinterestCard {...card} />
          </div>
        ))}
      </div>
    </div>
  )
}
