import { Link } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import type { UserRole } from '../hooks/useUserRole'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  session: Session
  userRole: UserRole
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, userRole }: SidebarProps) {
  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-20 transition-opacity ease-linear duration-300 ${
          sidebarOpen ? 'opacity-100 block' : 'opacity-0 hidden'
        } md:hidden`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform bg-white border-r md:translate-x-0 md:static md:h-screen ${
          sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
        }`}
      >
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center">
            <span className="text-blue-600 font-bold text-2xl">MyBlog</span>
          </div>
        </div>

        <nav className="mt-10 px-4">
          <div className="space-y-1">
            <Link
              to="/"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              Dashboard
            </Link>
            
            <Link
              to="/create-post"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              Create Post
            </Link>
            
            <Link
              to="/manage-posts"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              Manage Posts
            </Link>
            
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              Profile
            </Link>
            
            {/* Admin-only links */}
            {userRole === 'admin' && (
              <>
                <div className="pt-4 pb-2">
                  <h3 className="px-4 text-xs font-semibold text-blue-500 uppercase tracking-wider">
                    Admin Tools
                  </h3>
                </div>
                
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 hover:text-blue-900 rounded-md"
                  onClick={() => setSidebarOpen(false)}
                >
                  Admin Dashboard
                </Link>
                
                <Link
                  to="/admin/users"
                  className="block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 hover:text-blue-900 rounded-md"
                  onClick={() => setSidebarOpen(false)}
                >
                  Manage Users
                </Link>
                
                <Link
                  to="/admin/settings"
                  className="block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 hover:text-blue-900 rounded-md"
                  onClick={() => setSidebarOpen(false)}
                >
                  Site Settings
                </Link>
              </>
            )}
          </div>
          
          <div className="mt-10">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Categories
            </h3>
            <div className="mt-2 space-y-1">
              <Link
                to="/category/technology"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                onClick={() => setSidebarOpen(false)}
              >
                Technology
              </Link>
              <Link
                to="/category/lifestyle"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                onClick={() => setSidebarOpen(false)}
              >
                Lifestyle
              </Link>
              <Link
                to="/category/travel"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                onClick={() => setSidebarOpen(false)}
              >
                Travel
              </Link>
              <Link
                to="/category/food"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                onClick={() => setSidebarOpen(false)}
              >
                Food
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}