import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import { Editor } from '@tinymce/tinymce-react'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

interface PostData {
  title: string
  slug: string
  excerpt: string
  content: string
  status: 'draft' | 'published' | 'archived'
  category_ids: string[]
  featured_image_url?: string
  author_id?: string
  published_at?: string | null
}

export default function TinyMCEEditor() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [postData, setPostData] = useState<PostData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    status: 'draft',
    category_ids: [],
    featured_image_url: '',
    author_id: '',
    published_at: null
  })
  
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    getCurrentUser()
    fetchCategories()
    if (isEditing) {
      fetchPost()
    }
  }, [id])

  const getCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error getting user:', error)
        navigate('/login')
      } else {
        setCurrentUser(user)
        setPostData(prev => ({
          ...prev,
          author_id: user?.id || ''
        }))
      }
    } catch (error) {
      console.error('Error:', error)
      navigate('/login')
    }
  }

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
      // Fetch the post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (postError) {
        console.error('Error fetching post:', postError)
        return
      }

      // Fetch associated categories from junction table
      const { data: postCategories } = await supabase
        .from('post_categories')
        .select('category_id')
        .eq('post_id', id)

      const categoryIds = postCategories?.map(pc => pc.category_id) || []

      setPostData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        status: post.status || 'draft',
        category_ids: categoryIds,
        featured_image_url: post.featured_image_url || '',
        author_id: post.author_id || '',
        published_at: post.published_at
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
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setPostData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `blog-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('blog-assets')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError)
        return null
      }

      const { data: urlData } = supabase.storage
        .from('blog-assets')
        .getPublicUrl(filePath)

      return urlData.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    const imageUrl = await uploadImage(file)
    if (imageUrl) {
      setPostData(prev => ({
        ...prev,
        featured_image_url: imageUrl
      }))
    }
    setImageUploading(false)
  }

  const manageCategoriesForPost = async (postId: string, categoryIds: string[]) => {
    // First, delete existing categories for this post
    const { error: deleteError } = await supabase
      .from('post_categories')
      .delete()
      .eq('post_id', postId)

    if (deleteError) {
      console.error('Error deleting existing categories:', deleteError)
      throw deleteError
    }

    // Then, insert new categories if any are selected
    if (categoryIds.length > 0) {
      const categoryInserts = categoryIds.map(categoryId => ({
        post_id: postId,
        category_id: categoryId
      }))

      const { error: insertError } = await supabase
        .from('post_categories')
        .insert(categoryInserts)

      if (insertError) {
        console.error('Error inserting categories:', insertError)
        throw insertError
      }
    }
  }

  const handleSave = async (status: 'draft' | 'published' | 'archived') => {
    if (!currentUser) {
      alert('You must be logged in to save posts')
      return
    }

    setSaving(true)
    try {
      // Prepare the post payload matching your exact database schema
      const postPayload = {
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt || null,
        content: postData.content,
        featured_image_url: postData.featured_image_url || null,
        author_id: currentUser.id,
        status,
        published_at: status === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      }

      let postId = id

      if (isEditing && postId) {
        // Update existing post
        const { error: updateError } = await supabase
          .from('posts')
          .update(postPayload)
          .eq('id', postId)

        if (updateError) {
          console.error('Error updating post:', updateError)
          throw updateError
        }
      } else {
        // Create new post
        const { data: newPost, error: insertError } = await supabase
          .from('posts')
          .insert([{
            ...postPayload,
            created_at: new Date().toISOString()
          }])
          .select()
          .single()

        if (insertError) {
          console.error('Error creating post:', insertError)
          throw insertError
        }

        postId = newPost.id
      }

      // Manage categories in junction table
      if (typeof postId === 'string') {
        await manageCategoriesForPost(postId, postData.category_ids)
      } else {
        throw new Error('Post ID is undefined after save')
      }

      // Navigate back to post management
      navigate('/dashboard/manage-posts')
    } catch (error: any) {
      console.error('Error saving post:', error)
      alert(`Error saving post: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  // Custom image upload handler for TinyMCE
  const handleEditorImageUpload = (blobInfo: any): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const file = blobInfo.blob()
        const imageUrl = await uploadImage(file)
        
        if (imageUrl) {
          resolve(imageUrl)
        } else {
          reject('Image upload failed')
        }
      } catch (error) {
        reject('Image upload failed')
      }
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </h1>
          <p className="text-gray-600 mt-2">
            Write and format your blog post with rich text, images, and code snippets.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Title *
            </label>
            <input
              type="text"
              value={postData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your post title..."
              required
            />
          </div>

          {/* Auto-generated Slug */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug (auto-generated)
            </label>
            <input
              type="text"
              value={postData.slug}
              onChange={(e) => setPostData(prev => ({ ...prev, slug: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="post-url-slug"
            />
            <p className="text-sm text-gray-500 mt-1">
              Preview: /blog/{postData.slug}
            </p>
          </div>

          {/* Excerpt */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt (Brief description)
            </label>
            <textarea
              value={postData.excerpt}
              onChange={(e) => setPostData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write a brief description of your post..."
            />
          </div>

          {/* Featured Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={imageUploading}
              />
              {imageUploading && (
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </div>
              )}
            </div>
            {postData.featured_image_url && (
              <div className="mt-3">
                <img
                  src={postData.featured_image_url}
                  alt="Featured"
                  className="w-32 h-20 object-cover rounded-md border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={postData.category_ids.includes(category.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPostData(prev => ({
                          ...prev,
                          category_ids: [...prev.category_ids, category.id]
                        }))
                      } else {
                        setPostData(prev => ({
                          ...prev,
                          category_ids: prev.category_ids.filter(id => id !== category.id)
                        }))
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
            {categories.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                No categories available. Create some categories first.
              </p>
            )}
          </div>

          {/* Status Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Status
            </label>
            <select
              value={postData.status}
              onChange={(e) => setPostData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' | 'archived' }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* TinyMCE Editor */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Content *
            </label>
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
              value={postData.content}
              onEditorChange={(content) => setPostData(prev => ({ ...prev, content }))}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'help', 'wordcount', 'codesample'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help | link image media | codesample code | fullscreen',
                content_style: `
                  body { 
                    font-family: Helvetica, Arial, sans-serif; 
                    font-size: 14px; 
                    line-height: 1.6; 
                    color: #374151;
                  }
                  pre { 
                    background-color: #f4f4f4; 
                    padding: 10px; 
                    border-radius: 5px; 
                    overflow-x: auto;
                  }
                  code { 
                    background-color: #f4f4f4; 
                    padding: 2px 4px; 
                    border-radius: 3px; 
                    font-family: Monaco, Consolas, monospace;
                  }
                  img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    margin: 1rem 0;
                  }
                  blockquote {
                    border-left: 4px solid #e5e7eb;
                    padding-left: 1rem;
                    margin: 1rem 0;
                    color: #6b7280;
                    font-style: italic;
                  }
                `,
                images_upload_handler: handleEditorImageUpload,
                automatic_uploads: true,
                file_picker_types: 'image',
                paste_data_images: true,
                codesample_languages: [
                  { text: 'HTML/XML', value: 'markup' },
                  { text: 'JavaScript', value: 'javascript' },
                  { text: 'TypeScript', value: 'typescript' },
                  { text: 'CSS', value: 'css' },
                  { text: 'Python', value: 'python' },
                  { text: 'Java', value: 'java' },
                  { text: 'C++', value: 'cpp' },
                  { text: 'PHP', value: 'php' },
                  { text: 'SQL', value: 'sql' },
                  { text: 'Bash', value: 'bash' },
                  { text: 'JSON', value: 'json' },
                  { text: 'Markdown', value: 'markdown' }
                ]
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between border-t border-gray-200 pt-6">
            <div className="flex gap-3">
              <button
                onClick={() => handleSave('draft')}
                disabled={saving || !postData.title.trim() || !postData.content.trim()}
                className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : 'Save as Draft'}
              </button>
              
              <button
                onClick={() => handleSave('published')}
                disabled={saving || !postData.title.trim() || !postData.content.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Publishing...' : 'Publish Post'}
              </button>

              {isEditing && (
                <button
                  onClick={() => handleSave('archived')}
                  disabled={saving}
                  className="px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Archiving...' : 'Archive Post'}
                </button>
              )}
            </div>
            
            <button
              onClick={() => navigate('/dashboard/manage-posts')}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Quick Help */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">✨ Rich Text Editor Features</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <h4 className="font-semibold mb-2">📝 Text & Formatting:</h4>
              <ul className="space-y-1">
                <li>• Rich text formatting (bold, italic, colors)</li>
                <li>• Headers and text blocks</li>
                <li>• Lists and indentation</li>
                <li>• Links and alignment</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🎨 Media & Code:</h4>
              <ul className="space-y-1">
                <li>• Drag & drop image uploads</li>
                <li>• Code samples with syntax highlighting</li>
                <li>• Tables and media embeds</li>
                <li>• Full-screen editing mode</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}