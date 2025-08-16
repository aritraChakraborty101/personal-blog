import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import type { UserRole } from '../hooks/useUserRole'
import { supabase } from '../supabaseClient'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  session: Session
  userRole: UserRole
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function Sidebar({ sidebarOpen, setSidebarOpen, userRole }: SidebarProps) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

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
            <span className="text-gray-800 font-bold text-2xl">Aritra's Blog</span>
          </div>
        </div>

        <nav className="mt-10 px-4">
          <div className="space-y-1">
            {/* Main Navigation */}
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="flex items-center">
                <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                </svg>
                Dashboard
              </span>
            </Link>

            <Link
              to="/blog"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="flex items-center">
                <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Public Blog
              </span>
            </Link>

            {/* Admin-only links */}
            {userRole === 'admin' && (
              <>
                <div className="pt-4 pb-2">
                  <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Admin Tools
                  </h3>
                </div>
                
                <Link
                  to="/dashboard/admin"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="flex items-center">
                    <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Admin Dashboard
                  </span>
                </Link>
                
                <Link
                  to="/dashboard/create-post"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="flex items-center">
                    <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Post
                  </span>
                </Link>
                
                <Link
                  to="/dashboard/manage-posts"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="flex items-center">
                    <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Manage Posts
                  </span>
                </Link>
              </>
            )}
          </div>
          
          {/* Categories Section */}
          <div className="mt-10">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Categories
            </h3>
            <div className="mt-2 space-y-1">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/blog?category=${category.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="flex items-center">
                      <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {category.name}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No categories yet
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-10">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Quick Links
            </h3>
            <div className="mt-2 space-y-1">
              <a
                href="mailto:aritra.chakraborty@g.bracu.ac.bd"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
              >
                <span className="flex items-center">
                  <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact
                </span>
              </a>

              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
              >
                <span className="flex items-center">
                  <svg className="mr-3 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </span>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}