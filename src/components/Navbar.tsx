import { Link } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import type { UserRole } from '../hooks/useUserRole'

interface NavbarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  session: Session
  userRole: UserRole
  handleSignOut: () => Promise<void>
}

export default function Navbar({ 
  sidebarOpen, 
  setSidebarOpen, 
  session, 
  userRole,
  handleSignOut 
}: NavbarProps) {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Logo */}
          <div className="flex-1 flex justify-center md:justify-start">
            <Link to="/" className="flex items-center">
              <span className="text-blue-600 font-bold text-xl">MyBlog</span>
            </Link>
          </div>

          {/* Right side navigation */}
          <div className="hidden md:flex items-center ml-4 md:ml-6">
            <Link to="/" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/blog" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
              Blog
            </Link>
            
            {/* Admin-only links */}
            {userRole === 'admin' && (
              <Link to="/admin" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Admin
              </Link>
            )}
            
            {/* Profile dropdown */}
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {session.user.email}
                    {userRole === 'admin' && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Admin
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}