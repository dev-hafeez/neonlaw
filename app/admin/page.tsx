"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { blogPosts, categories } from "@/lib/blog-data"
import { Trash2, Edit, Plus } from "lucide-react"

export default function AdminPage() {
  const [posts, setPosts] = useState(blogPosts)
  const [isEditing, setIsEditing] = useState(false)
  const [editingPost, setEditingPost] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: "",
    author: "",
    image: "",
    content: "",
  })

  const handleEdit = (post: any) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      author: post.author,
      image: post.image,
      content: post.content || "",
    })
    setIsEditing(true)
  }

  const handleDelete = (id: number) => {
    setPosts(posts.filter((post) => post.id !== id))
  }

  const handleSave = () => {
    if (editingPost) {
      // Update existing post
      setPosts(posts.map((post) => (post.id === editingPost.id ? { ...post, ...formData } : post)))
    } else {
      // Create new post
      const newPost = {
        id: Math.max(...posts.map((p) => p.id)) + 1,
        ...formData,
        date: new Date().toLocaleDateString(),
      }
      setPosts([newPost, ...posts])
    }

    setIsEditing(false)
    setEditingPost(null)
    setFormData({
      title: "",
      excerpt: "",
      category: "",
      author: "",
      image: "",
      content: "",
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingPost(null)
    setFormData({
      title: "",
      excerpt: "",
      category: "",
      author: "",
      image: "",
      content: "",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog Administration</h1>
          <Button onClick={() => setIsEditing(true)} className="bg-[#0a72bd] hover:bg-[#0a72bd]/90">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>

        {isEditing && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingPost ? "Edit Post" : "Create New Post"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief description of the post"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Author</label>
                  <Input
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Author name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full post content"
                  rows={6}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-[#0a72bd] hover:bg-[#0a72bd]/90">
                  {editingPost ? "Update Post" : "Create Post"}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-[#0a72bd] border-[#0a72bd]">
                        {post.category}
                      </Badge>
                      <span className="text-sm text-gray-500">{post.date}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-2">{post.excerpt}</p>
                    <p className="text-sm text-gray-500">By {post.author}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
