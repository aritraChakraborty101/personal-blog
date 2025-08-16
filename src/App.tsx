import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Auth from './components/Authentication/Auth'
import Layout from './layout/MainLayout'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/Authentication/ProtectedRoute'
import { useAuthSession } from './hooks/useAuthSession'
import AdminDashboard from "./components/AdminDashboard"// Create this component

function App() {
  const { session, loading, userRole } = useAuthSession()
  const baseUrl = import.meta.env.BASE_URL || '/personal-blog'

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  console.log('Current user role:', userRole)

  return (
    <Router basename={baseUrl}>
      <Routes>
        <Route
          path="/login"
          element={
            session
              ? <Navigate to="/" replace />
              : <Auth />
          }
        />
        <Route
          path="/*"
          element={
            session ? (
              <ProtectedRoute>
                <Layout session={session} userRole={userRole}>
                  <Routes>
                    <Route path="/" element={<Dashboard session={session} userRole={userRole} />} />
                    
                    {/* Admin-only route */}
                    {userRole === 'admin' && (
                      <Route path="/admin" element={<AdminDashboard session={session} />} />
                    )}
                  </Routes>
                </Layout>
              </ProtectedRoute>
            ) : (
              <Auth />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App