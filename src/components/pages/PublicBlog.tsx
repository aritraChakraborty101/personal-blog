import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../../supabaseClient'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image_url?: string
  status: string
  published_at: string
  created_at: string
  views_count: number
  likes_count: number
  author_id: string
  category_names?: string[]
  category_slugs?: string[]
}

export default function PublicBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category')

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [selectedCategory])

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

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('posts_with_details')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (selectedCategory) {
        query = query.contains('category_slugs', [selectedCategory])
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching posts:', error)
      } else {
        setPosts(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (categorySlug: string | null) => {
    if (categorySlug) {
      setSearchParams({ category: categorySlug })
    } else {
      setSearchParams({})
    }
  }

  const trackView = async (postId: string) => {
    try {
      // Track the view
      await supabase.from('post_views').insert({
        post_id: postId,
        ip_address: null,
        user_agent: navigator.userAgent
      })

      // Update views count
      await supabase.rpc('increment_post_views', { post_id: postId })
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    )
  }

  const selectedCategoryName = selectedCategory 
    ? categories.find(cat => cat.slug === selectedCategory)?.name 
    : null

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {selectedCategoryName ? `${selectedCategoryName} Posts` : "Welcome to Aritra's Blog"}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {selectedCategoryName 
            ? `Explore all posts in ${selectedCategoryName}` 
            : "Exploring technology, sharing insights, and documenting the journey of a passionate developer."
          }
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              !selectedCategory 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Posts
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === category.slug 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-600 mb-4">
            {selectedCategory ? 'No posts in this category yet' : 'No blog posts yet'}
          </h3>
          <p className="text-gray-500">Check back soon for new content!</p>
          {selectedCategory && (
            <button
              onClick={() => handleCategoryChange(null)}
              className="mt-4 text-gray-700 hover:text-gray-900 underline"
            >
              View all posts
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {post.featured_image_url && (
                <img 
                  src={post.featured_image_url} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.category_names?.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => handleCategoryChange(post.category_slugs?.[index] || '')}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  <Link 
                    to={`/blog/${post.slug}`} 
                    className="hover:text-gray-600"
                    onClick={() => trackView(post.id)}
                  >
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{new Date(post.published_at).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-4">
                    <span>{post.views_count} views</span>
                    <span>{post.likes_count} likes</span>
                  </div>
                </div>
                
                <Link 
                  to={`/blog/${post.slug}`}
                  className="inline-block mt-4 text-gray-700 hover:text-gray-900 font-medium"
                  onClick={() => trackView(post.id)}
                >
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}