"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { blogPosts, categories } from "@/lib/blog-data"
import { Calendar, User, ArrowRight, Clock } from "lucide-react"

export function BlogGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [visiblePosts, setVisiblePosts] = useState(9)

  const filteredPosts = selectedCategory ? blogPosts.filter((post) => post.category === selectedCategory) : blogPosts
  const displayedPosts = filteredPosts.slice(0, visiblePosts)

  const loadMore = () => {
    setVisiblePosts((prev) => prev + 6)
  }

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-12">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
            selectedCategory === null
              ? "bg-[#0a72bd] hover:bg-[#0a72bd]/90 text-white shadow-lg shadow-[#0a72bd]/25"
              : "hover:bg-[#0a72bd]/10 hover:text-[#0a72bd] hover:border-[#0a72bd] hover:shadow-md"
          }`}
          onClick={() => setSelectedCategory(null)}
        >
          All Categories
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
              selectedCategory === category
                ? "bg-[#0a72bd] hover:bg-[#0a72bd]/90 text-white shadow-lg shadow-[#0a72bd]/25"
                : "hover:bg-[#0a72bd]/10 hover:text-[#0a72bd] hover:border-[#0a72bd] hover:shadow-md"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {displayedPosts.map((post, index) => (
          <article
            key={post.id}
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src={post.image || "/placeholder.svg?height=300&width=400"}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-4 left-4">
                <Badge
                  variant="secondary"
                  className="bg-white/90 text-[#0a72bd] border-0 font-medium shadow-lg backdrop-blur-sm"
                >
                  {post.category}
                </Badge>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#0a72bd] transition-colors duration-300">
                {post.title}
              </h2>

              <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{post.excerpt}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>5 min read</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#0a72bd] hover:bg-[#0a72bd]/10 font-medium group/btn transition-all duration-300"
                >
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Load More Button */}
      {visiblePosts < filteredPosts.length && (
        <div className="text-center">
          <Button
            onClick={loadMore}
            className="bg-[#0a72bd] hover:bg-[#0a72bd]/90 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-[#0a72bd]/25 hover:shadow-xl hover:shadow-[#0a72bd]/30 transition-all duration-300 hover:scale-105"
          >
            Load More Articles
          </Button>
        </div>
      )}
    </div>
  )
}
