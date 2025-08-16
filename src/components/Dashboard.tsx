import type { Session } from '@supabase/supabase-js'
import type { UserRole } from '../hooks/useUserRole'
import { Link } from 'react-router-dom'

interface DashboardProps {
  session: Session
  userRole: UserRole
}

export default function Dashboard({ session, userRole }: DashboardProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        <div className="p-6 bg-white border-b border-gray-200">
          <h2 className="text-2xl font-bold mb-4">Welcome to Your Blog Dashboard</h2>
          
          <p className="text-gray-600 mb-6">
            You are logged in as <span className="font-semibold">{session.user.email}</span>
            <span className="ml-2">
              Role: <span className="font-semibold">
                {userRole === 'admin' ? 'Administrator' : 'Regular User'}
              </span>
            </span>
          </p>
          
          {userRole === 'admin' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Admin Access</h3>
              <p className="text-blue-700 mb-2">
                You have administrator privileges on this blog.
              </p>
              <Link 
                to="/admin" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Go to Admin Dashboard
              </Link>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-blue-700 mb-2">Your Posts</h3>
              <p className="text-3xl font-bold">0</p>
              <p className="text-sm text-gray-500 mt-1">Published posts</p>
            </div>
            
            {/* Rest of the dashboard */}
          </div>
        </div>
      </div>
    </div>
  )
}