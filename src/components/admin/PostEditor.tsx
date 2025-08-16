import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'

interface Category {
  id: string
  name: string
  slug: string
}

interface PostData {
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image_url: string
  status: 'draft' | 'published' | 'archived'
  category_ids: string[]
}

export default function PostEditor() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const isEditing = !!id

  const [formData, setFormData] = useState<PostData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image_url: '',
    status: 'draft',
    category_ids: []
  })
  
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchCategories()
    if (isEditing) {
      fetchPost()
    }
  }, [id])

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching categories:', error)
      } else {
        setCategories(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const fetchPost = async () => {
    if (!id) return

    setLoading(true)
    try {
      // Fetch post details
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (postError) {
        console.error('Error fetching post:', postError)
        return
      }

      // Fetch post categories
      const { data: categoryData, error: categoryError } = await supabase
        .from('post_categories')
        .select('category_id')
        .eq('post_id', id)

      if (categoryError) {
        console.error('Error fetching post categories:', categoryError)
      }

    interface SupabasePost {
      title: string
      slug: string
      excerpt?: string
      content: string
      featured_image_url?: string
      status: 'draft' | 'published' | 'archived'
    }

    interface SupabasePostCategory {
      category_id: string
    }

    setFormData({
      title: (postData as SupabasePost).title,
      slug: (postData as SupabasePost).slug,
      excerpt: (postData as SupabasePost).excerpt || '',
      content: (postData as SupabasePost).content,
      featured_image_url: (postData as SupabasePost).featured_image_url || '',
      status: (postData as SupabasePost).status,
      category_ids: (categoryData as SupabasePostCategory[])?.map(item => item.category_id) || []
    })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.includes(categoryId)
        ? prev.category_ids.filter(id => id !== categoryId)
        : [...prev.category_ids, categoryId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        featured_image_url: formData.featured_image_url || null,
        status: formData.status,
        author_id: (await supabase.auth.getUser()).data.user?.id
      }

      let postId = id

      if (isEditing) {
        // Update existing post
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', id)

        if (error) throw error
      } else {
        // Create new post
        const { data, error } = await supabase
          .from('posts')
          .insert(postData)
          .select('id')
          .single()

        if (error) throw error
        postId = data.id
      }

      // Update categories
      if (postId) {
        // Delete existing categories
        await supabase
          .from('post_categories')
          .delete()
          .eq('post_id', postId)

        // Insert new categories
        if (formData.category_ids.length > 0) {
          const categoryInserts = formData.category_ids.map(categoryId => ({
            post_id: postId,
            category_id: categoryId
          }))

          await supabase
            .from('post_categories')
            .insert(categoryInserts)
        }
      }

      navigate('/dashboard/manage-posts')
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Error saving post. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug *
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              URL: /blog/{formData.slug}
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Brief description of the post..."
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image URL
            </label>
            <input
              type="url"
              value={formData.featured_image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, featured_image_url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.category_ids.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="mr-2"
                  />
                  <span className="text-sm">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 font-mono"
              required
              placeholder="Write your post content here..."
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Submit buttons */}
          <div className="flex space-x-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/manage-posts')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-md font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}