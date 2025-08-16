import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

interface PublicLayoutProps {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Public Navbar */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-gray-800 font-bold text-xl">Aritra's Blog</span>
            </Link>
            
            {/* Public Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-gray-800 font-medium">
                Home
              </Link>
              <Link to="/blog" className="text-gray-600 hover:text-gray-800 font-medium">
                Blog
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-gray-800 font-medium">
                About
              </Link>
            </nav>
            
            {/* Sign In/Up buttons */}
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Sign In
              </Link>
              <Link 
                to="/login" 
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}