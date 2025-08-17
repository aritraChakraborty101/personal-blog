import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import type { UserRole } from '../hooks/useUserRole'

interface PublicNavbarProps {
  session?: Session | null
  userRole?: UserRole
  handleSignOut?: () => Promise<void>
}

export default function PublicNavbar({ session, userRole, handleSignOut }: PublicNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/blog" className="flex items-center">
              <span className="text-gray-800 font-bold text-xl">Aritra's Blog</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/blog" 
              className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            
            {/* Contact Link */}
            <a
              href="mailto:aritra.chakraborty@g.bracu.ac.bd"
              className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Contact
            </a>

            {/* GitHub Link */}
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              GitHub
            </a>

            {/* Authentication Section */}
            <div className="flex items-center space-x-4">
              {session ? (
                /* Logged in state */
                <div className="flex items-center space-x-4">
                  <Link
                    to="/dashboard"
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {session.user.email}
                      {userRole === 'admin' && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
                          Admin
                        </span>
                      )}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="text-gray-600 hover:text-gray-800 text-sm underline"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                /* Not logged in state */
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/login"
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 p-2 rounded-md"
            >
              <span className="sr-only">Open main menu</span>
              <svg 
                className="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              <Link
                to="/blog"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              <a
                href="mailto:aritra.chakraborty@g.bracu.ac.bd"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                Contact
              </a>

              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                GitHub
              </a>

              {/* Mobile Authentication */}
              <div className="pt-4 border-t border-gray-200">
                {session ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2">
                      <span className="text-sm text-gray-600">
                        Signed in as {session.user.email}
                        {userRole === 'admin' && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
                            Admin
                          </span>
                        )}
                      </span>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 rounded-md text-base font-medium bg-gray-800 text-white hover:bg-gray-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut?.()
                        setMobileMenuOpen(false)
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium bg-gray-800 text-white hover:bg-gray-900"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}