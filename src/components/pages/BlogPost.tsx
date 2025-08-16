import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import type { UserRole } from '../../hooks/useUserRole'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image_url?: string
  published_at: string
  created_at: string
  views_count: number
  likes_count: number
  author_id: string
  author_email: string
  category_names?: string[]
}

interface Comment {
  id: string
  content: string
  status: string
  created_at: string
  author_email: string
  author_id: string
}

interface BlogPostProps {
  userRole: UserRole
  session?: any
}

export default function BlogPost({ userRole, session }: BlogPostProps) {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  // Separate useEffect for comments that only runs when post is loaded
  useEffect(() => {
    if (post?.id) {
      fetchComments()
      if (session) {
        checkIfLiked()
      }
    }
  }, [post?.id, session])

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts_with_details')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error) {
        console.error('Error fetching post:', error)
      } else {
        setPost(data)
        setLikesCount(data.likes_count)
        // Track view
        trackView(data.id)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    if (!post?.id) return // Guard clause to prevent fetching without post ID

    try {
      const { data, error } = await supabase
        .from('comments_with_author')
        .select('*')
        .eq('post_id', post.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching comments:', error)
      } else {
        setComments(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const trackView = async (postId: string) => {
    try {
      await supabase.from('post_views').insert({
        post_id: postId,
        user_id: session?.user?.id || null,
        ip_address: null,
        user_agent: navigator.userAgent
      })
    } catch (error) {
      console.error('Error tracking view:', error)
    }
  }

  const checkIfLiked = async () => {
    if (!post?.id || !session) return

    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select('*')
        .eq('post_id', post.id)
        .eq('user_id', session.user.id)
        .single()

      if (!error && data) {
        setIsLiked(true)
      }
    } catch (error) {
      // Not liked - this is fine
      setIsLiked(false)
    }
  }

  const handleLike = async () => {
    if (!post?.id || !session || userRole === 'anonymous') return

    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', session.user.id)
        
        setIsLiked(false)
        setLikesCount(prev => prev - 1)
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({
            post_id: post.id,
            user_id: session.user.id
          })
        
        setIsLiked(true)
        setLikesCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || userRole === 'anonymous' || !newComment.trim() || !post?.id) return

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: post.id,
          content: newComment.trim(),
          author_id: session.user.id,
          status: 'approved' // Auto-approve for now, you can change this
        })

      if (error) {
        console.error('Error posting comment:', error)
      } else {
        setNewComment('')
        fetchComments() // Refresh comments
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-gray-600 hover:text-gray-800">← Back to Blog</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Blog Post */}
      <article className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        {post.featured_image_url && (
          <img 
            src={post.featured_image_url} 
            alt={post.title}
            className="w-full h-64 object-cover"
          />
        )}
        
        <div className="p-8">
          <Link to="/blog" className="text-gray-600 hover:text-gray-800 mb-4 inline-block">
            ← Back to Blog
          </Link>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.category_names?.map((category, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
          
          <div className="flex items-center justify-between mb-6 text-gray-500">
            <div>
              <p>By {post.author_email}</p>
              <p>Published on {new Date(post.published_at).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span>{post.views_count} views</span>
              <button
                onClick={handleLike}
                disabled={!session || userRole === 'anonymous'}
                className={`flex items-center space-x-1 ${
                  isLiked ? 'text-red-500' : 'text-gray-500'
                } hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{likesCount}</span>
              </button>
            </div>
          </div>
          
          <div className="prose max-w-none text-gray-700">
            {post.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Comments ({comments.length})</h2>
        
        {/* Comment Form - Only for logged-in users */}
        {userRole === 'user' || userRole === 'admin' ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
              rows={4}
              placeholder="Share your thoughts..."
              required
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="mt-3 bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-4 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-gray-600 mb-2">Want to join the conversation?</p>
            <Link 
              to="/login" 
              className="text-gray-800 hover:text-gray-900 font-medium underline"
            >
              Sign in or create an account to comment
            </Link>
          </div>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800">{comment.author_email}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}