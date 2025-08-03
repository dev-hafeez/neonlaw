"use client"

import { useState, useEffect } from "react"
import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { masonryPosts, categories } from "@/lib/masonry-data"

export function SearchOverlay() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filteredPosts, setFilteredPosts] = useState(masonryPosts)

  useEffect(() => {
    const filtered = masonryPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.description && post.description.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = !selectedCategory || post.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    setFilteredPosts(filtered)
  }, [searchTerm, selectedCategory])

  const closeOverlay = () => {
    const overlay = document.getElementById("search-overlay")
    if (overlay) {
      overlay.classList.add("hidden")
      overlay.classList.remove("flex")
    }
    setSearchTerm("")
    setSelectedCategory(null)
  }

  return (
    <div
      id="search-overlay"
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 hidden items-start justify-center pt-20 p-4"
      onClick={closeOverlay}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-lg font-medium text-gray-900">Search</span>
            </div>
            <Button variant="ghost" size="sm" onClick={closeOverlay}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Input
            id="search-input"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 h-10"
          />

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className={`cursor-pointer text-xs ${
                selectedCategory === null
                  ? "bg-[#0a72bd] hover:bg-[#0a72bd]/90 text-white"
                  : "hover:bg-[#0a72bd]/10 hover:text-[#0a72bd]"
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`cursor-pointer text-xs ${
                  selectedCategory === category
                    ? "bg-[#0a72bd] hover:bg-[#0a72bd]/90 text-white"
                    : "hover:bg-[#0a72bd]/10 hover:text-[#0a72bd]"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Contact Information - Editable Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                Email: <span className="text-[#0a72bd]">info@neonlaw.com</span>
              </p>
              <p>
                Phone: <span className="text-[#0a72bd]">(555) 123-4567</span>
              </p>
              <p>Address: 123 Legal Street, Law City, LC 12345</p>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto p-6">
          {filteredPosts.length > 0 ? (
            <div className="space-y-4">
              {filteredPosts.slice(0, 10).map((post) => (
                <div key={post.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            post.category === "DEAL"
                              ? "text-[#0a72bd] border-[#0a72bd]"
                              : "text-gray-600 border-gray-300"
                          }`}
                        >
                          {post.category}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{post.title}</h4>
                      {post.description && <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No results found matching your search criteria.</div>
          )}
        </div>
      </div>
    </div>
  )
}
