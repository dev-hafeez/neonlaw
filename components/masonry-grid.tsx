"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { masonryPosts } from "@/lib/masonry-data"

export function MasonryGrid() {
  const [visiblePosts, setVisiblePosts] = useState(20)

  const displayedPosts = masonryPosts.slice(0, visiblePosts)

  const loadMore = () => {
    setVisiblePosts((prev) => prev + 10)
  }

  return (
    <div className="container mx-auto px-6 pt-20">
      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-6 space-y-6">
        {displayedPosts.map((post) => (
          <Link key={post.id} href={`/post/${post.id}`} className="block">
            <div className="break-inside-avoid mb-6 group cursor-pointer" style={{ height: post.height }}>
              <div className="relative w-full h-full rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <Image
                  src={post.image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  {/* Category Badge */}
                  <div className="flex justify-start">
                    <Badge
                      variant="secondary"
                      className={`text-xs font-bold px-2 py-1 ${
                        post.category === "DEAL"
                          ? "bg-[#0a72bd] text-white"
                          : post.category === "Expertise"
                            ? "bg-red-600 text-white"
                            : post.category === "Associate" || post.category === "Partner"
                              ? "bg-gray-800 text-white"
                              : post.category === "Career Development"
                                ? "bg-green-600 text-white"
                                : post.category === "NEON NEWS"
                                  ? "bg-purple-600 text-white"
                                  : "bg-gray-600 text-white"
                      }`}
                    >
                      {post.category}
                    </Badge>
                  </div>

                  {/* Title and Subtitle */}
                  <div className="text-white">
                    {post.subtitle && <p className="text-sm font-medium mb-1 opacity-90">{post.subtitle}</p>}
                    <h3 className="font-bold text-lg leading-tight">{post.title}</h3>
                    {post.description && <p className="text-sm mt-2 opacity-80">{post.description}</p>}
                  </div>
                </div>

                {/* Apply Now Button for Job Posts */}
                {post.category === "NEON" && post.title === "All Jobs" && (
                  <div className="absolute bottom-4 right-4">
                    <Button className="bg-[#0a72bd] hover:bg-[#0a72bd]/90 text-white font-bold px-4 py-2 rounded-full text-sm">
                      APPLY NOW
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      {visiblePosts < masonryPosts.length && (
        <div className="text-center mt-12 mb-8">
          <Button
            onClick={loadMore}
            variant="outline"
            className="px-8 py-3 font-medium hover:bg-gray-50 bg-transparent"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}
