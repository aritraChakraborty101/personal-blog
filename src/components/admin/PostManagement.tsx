import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'

interface Post {
  id: string
  title: string
  slug: string
  status: string
  published_at: string
  created_at: string
  views_count: number
  likes_count: number
  category_names?: string[]
}

export default function PostManagement() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')

  useEffect(() => {
    fetchPosts()
  }, [filter])

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('posts_with_details')
        .select('*')
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
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

  const deletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) {
        console.error('Error deleting post:', error)
      } else {
        fetchPosts() // Refresh the list
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const updatePostStatus = async (postId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ status: newStatus })
        .eq('id', postId)

      if (error) {
        console.error('Error updating post status:', error)
      } else {
        fetchPosts() // Refresh the list
      }
    } catch (error) {
      console.error('Error:', error)
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
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Manage Posts</h1>
            <Link
              to="/dashboard/create-post"
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Create New Post
            </Link>
          </div>
          
          {/* Filter buttons */}
          <div className="mt-4 flex space-x-2">
            {(['all', 'published', 'draft', 'archived'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-md text-sm capitalize ${
                  filter === status
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-sm text-gray-500">/{post.slug}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={post.status}
                      onChange={(e) => updatePostStatus(post.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : post.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.category_names?.map((category, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>{post.views_count} views</div>
                    <div>{post.likes_count} likes</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div>
                      {post.status === 'published' && post.published_at
                        ? `Published: ${new Date(post.published_at).toLocaleDateString()}`
                        : `Created: ${new Date(post.created_at).toLocaleDateString()}`
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/dashboard/edit-post/${post.id}`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all' ? 'Get started by creating your first post.' : `No ${filter} posts found.`}
            </p>
            <Link
              to="/dashboard/create-post"
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Create New Post
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}