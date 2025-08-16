import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Auth from './components/Authentication/Auth'
import Layout from './layout/MainLayout'
import PublicLayout from './layout/PublicLayout'
import Dashboard from './components/Dashboard'
import PublicBlog from './components/pages/PublicBlog'
import BlogPost from './components/pages/BlogPost'
import ProtectedRoute from './components/Authentication/ProtectedRoute'
import { useAuthSession } from './hooks/useAuthSession'
import AdminDashboard from './components/AdminDashboard'
import PostEditor from './components/admin/PostEditor'
import PostManagement from './components/admin/PostManagement'

function App() {
  const { session, loading, userRole } = useAuthSession()
  const baseUrl = import.meta.env.BASE_URL || '/personal-blog'

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    )
  }

  return (
    <Router basename={baseUrl}>
      <Routes>
        {/* Public routes - accessible to everyone */}
        <Route path="/blog" element={
          <PublicLayout>
            <PublicBlog />
          </PublicLayout>
        } />
        
        {/* Updated to use slug instead of id */}
        <Route path="/blog/:slug" element={
          <PublicLayout>
            <BlogPost userRole={userRole} session={session} />
          </PublicLayout>
        } />

        {/* Auth route */}
        <Route
          path="/login"
          element={
            session ? <Navigate to="/dashboard" replace /> : <Auth />
          }
        />

        {/* Protected routes - for logged-in users */}
        <Route
          path="/dashboard/*"
          element={
            session ? (
              <ProtectedRoute>
                <Layout session={session} userRole={userRole}>
                  <Routes>
                    <Route path="/" element={<Dashboard session={session} userRole={userRole} />} />
                    
                    {/* Admin-only routes */}
                    {userRole === 'admin' && (
                      <>
                        <Route path="/admin" element={<AdminDashboard session={session} />} />
                        <Route path="/create-post" element={<PostEditor />} />
                        <Route path="/edit-post/:id" element={<PostEditor />} />
                        <Route path="/manage-posts" element={<PostManagement />} />
                      </>
                    )}
                  </Routes>
                </Layout>
              </ProtectedRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Root redirect */}
        <Route path="/" element={
          session ? <Navigate to="/dashboard" replace /> : <Navigate to="/blog" replace />
        } />
      </Routes>
    </Router>
  )
}

export default App