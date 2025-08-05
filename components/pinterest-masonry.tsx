"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import PinterestCard from "./pinterest-card"

// Base card data with optimized images (smaller sizes)
const baseCardData = [
  {
    id: "1",
    title: "NEON.Family",
    subtitle: "Benefits",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237c11d?w=320&h=240&fit=crop&auto=format&q=75",
    height: "h-48",
    type: "benefits",
  },
  {
    id: "2",
    title: "Jenka Jahn",
    subtitle: "People & Culture | Operations",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=320&h=400&fit=crop&auto=format&q=75",
    height: "h-80",
    type: "person",
  },
  {
    id: "3",
    title: "UVC Partners on €6.5m Series Seed financing round of Biomatter",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=320&h=256&fit=crop&auto=format&q=75",
    height: "h-64",
    type: "deal",
    badge: "DEAL",
  },
  {
    id: "4",
    title: "Disputes",
    subtitle: "Expertise",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=320&h=192&fit=crop&auto=format&q=75",
    height: "h-48",
    type: "expertise",
  },
  {
    id: "5",
    title: "Talent Boosters",
    subtitle: "We believe in",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=320&h=176&fit=crop&auto=format&q=75",
    height: "h-44",
    type: "benefits",
  },
  {
    id: "6",
    title: "TX Ventures on $50m Series B Round of Pliant",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=320&h=224&fit=crop&auto=format&q=75",
    height: "h-56",
    type: "deal",
    badge: "DEAL",
  },
  {
    id: "7",
    title: "Jan-Peter Heyer",
    subtitle: "Partner",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&h=400&fit=crop&auto=format&q=75",
    height: "h-80",
    type: "person",
  },
  {
    id: "8",
    title: "Energisto eG on renewables Joint Venture with LichtBlick",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=320&h=288&fit=crop&auto=format&q=75",
    height: "h-72",
    type: "deal",
    badge: "DEAL",
  },
  {
    id: "9",
    title: "Tech & Data",
    subtitle: "Expertise",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=320&h=192&fit=crop&auto=format&q=75",
    height: "h-48",
    type: "expertise",
  },
  {
    id: "10",
    title: "NOXTUA on €80.7m Series B Financing Round with C.H. Beck",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=320&h=304&fit=crop&auto=format&q=75",
    height: "h-76",
    type: "deal",
    badge: "DEAL",
  },
  {
    id: "11",
    title: "Tina Tilger",
    subtitle: "Notary Office",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=320&h=288&fit=crop&auto=format&q=75",
    height: "h-72",
    type: "person",
  },
  {
    id: "12",
    title: "All Jobs",
    subtitle: "NEON",
    image: "https://images.unsplash.com/photo-1486312338219-ce68e2c6b696?w=320&h=192&fit=crop&auto=format&q=75",
    height: "h-48",
    type: "job",
    hasButton: true,
    buttonText: "APPLY NOW",
  },
]

export default function PinterestMasonry() {
  const [columns, setColumns] = useState(4)
  const containerRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)

  // Memoize grid creation to prevent unnecessary recalculations
  const cardData = useMemo(() => {
    const horizontalCopies = 5 // Reduced from 7 to 5
    const verticalCopies = 5 // Reduced from 7 to 5
    const gridData = []

    for (let vCopy = 0; vCopy < verticalCopies; vCopy++) {
      for (let hCopy = 0; hCopy < horizontalCopies; hCopy++) {
        baseCardData.forEach((card, index) => {
          gridData.push({
            ...card,
            id: `grid-${vCopy}-${hCopy}-${card.id}-${index}`,
            gridX: hCopy,
            gridY: vCopy,
          })
        })
      }
    }
    return gridData
  }, [])

  // Debounced scroll handler with useCallback
  const handleScroll = useCallback(() => {
    if (isScrollingRef.current) return

    const scrollY = window.scrollY
    const scrollX = window.scrollX
    const documentHeight = document.documentElement.scrollHeight
    const documentWidth = document.documentElement.scrollWidth

    // Calculate dimensions of one complete set
    const oneSetHeight = documentHeight / 5 // 5 vertical copies
    const oneSetWidth = documentWidth / 5 // 5 horizontal copies

    let newScrollY = scrollY
    let newScrollX = scrollX
    let shouldReposition = false

    // Vertical infinite scroll logic
    if (scrollY > oneSetHeight * 3.5) {
      newScrollY = oneSetHeight * 1.5
      shouldReposition = true
    } else if (scrollY < oneSetHeight * 0.5) {
      newScrollY = oneSetHeight * 2.5
      shouldReposition = true
    }

    // Horizontal infinite scroll logic
    if (scrollX > oneSetWidth * 3.5) {
      newScrollX = oneSetWidth * 1.5
      shouldReposition = true
    } else if (scrollX < oneSetWidth * 0.5) {
      newScrollX = oneSetWidth * 2.5
      shouldReposition = true
    }

    // Reposition if needed
    if (shouldReposition) {
      isScrollingRef.current = true
      window.scrollTo(newScrollX, newScrollY)

      setTimeout(() => {
        isScrollingRef.current = false
      }, 50) // Reduced timeout
    }
  }, [])

  // Throttled scroll event listener
  useEffect(() => {
    let ticking = false

    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", throttledScroll, { passive: true })

    // Set initial position to center of the grid
    const timer = setTimeout(() => {
      const documentHeight = document.documentElement.scrollHeight
      const documentWidth = document.documentElement.scrollWidth
      const oneSetHeight = documentHeight / 5
      const oneSetWidth = documentWidth / 5
      window.scrollTo(oneSetWidth * 2, oneSetHeight * 2)
    }, 100) // Reduced delay

    return () => {
      window.removeEventListener("scroll", throttledScroll)
      clearTimeout(timer)
    }
  }, [handleScroll])

  // Optimized resize handler
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) setColumns(2)
      else if (width < 768) setColumns(3)
      else if (width < 1024) setColumns(4)
      else setColumns(5)
    }

    handleResize()
    window.addEventListener("resize", handleResize, { passive: true })
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Memoize grid columns to prevent unnecessary recalculations
  const gridColumns = useMemo(() => {
    const totalColumns = columns * 5 // 5 horizontal copies
    const cols = []

    for (let col = 0; col < totalColumns; col++) {
      const columnCards = cardData.filter((_, index) => index % totalColumns === col)
      cols.push(columnCards)
    }

    return cols
  }, [cardData, columns])

  return (
    <div ref={containerRef} className="w-full min-h-screen">
      <div
        className="flex gap-6" // Reduced gap from 8 to 6
        style={{
          width: `${gridColumns.length * 300}px`, // Reduced width from 320 to 300
          minHeight: "150vh", // Reduced from 200vh
        }}
      >
        {gridColumns.map((columnCards, columnIndex) => (
          <div key={columnIndex} className="flex-shrink-0 space-y-6" style={{ width: "300px" }}>
            {columnCards.map((card) => (
              <PinterestCard key={card.id} {...card} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
