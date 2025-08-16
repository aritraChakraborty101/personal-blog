import { useState } from 'react'
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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Mobile menu button and logo */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 mr-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-gray-800 font-bold text-xl">Aritra's Blog</span>
            </Link>
          </div>

          {/* Right side navigation - Desktop */}
          <div className="hidden md:flex items-center ml-4 md:ml-6">
            <Link to="/" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
              Dashboard
            </Link>
            <Link to="/blog" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
              Blog
            </Link>
            
            {/* Admin-only links */}
            {userRole === 'admin' && (
              <Link to="/admin" className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium">
                Admin
              </Link>
            )}
            
            {/* Profile section */}
            <div className="ml-3 relative">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {session.user.email}
                    {userRole === 'admin' && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
                        Admin
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="ml-4 bg-gray-800 hover:bg-gray-900 text-white px-3 py-1 rounded text-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Mobile profile dropdown button */}
          <div className="md:hidden">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <span className="sr-only">Open user menu</span>
              <div className="flex items-center">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <svg 
                  className={`ml-1 h-4 w-4 transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {dropdownOpen && (
          <div className="md:hidden border-t border-gray-200 pt-4 pb-3 px-2">
            <div className="mb-3 px-2">
              <p className="text-sm font-medium text-gray-700">
                {session.user.email}
                {userRole === 'admin' && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
                    Admin
                  </span>
                )}
              </p>
            </div>
            
            <div className="space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                Blog
              </Link>
              
              {/* Admin-only links */}
              {userRole === 'admin' && (
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setDropdownOpen(false)}
                >
                  Admin
                </Link>
              )}
              
              <button
                onClick={() => {
                  handleSignOut();
                  setDropdownOpen(false);
                }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-white hover:bg-gray-800"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}