import type { ReactNode } from 'react'
import PublicNavbar from '../components/PublicNavbar'
import { useAuthSession } from '../hooks/useAuthSession'
import { supabase } from '../supabaseClient'

interface PublicLayoutProps {
  children: ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const { session, userRole } = useAuthSession()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      // The useAuthSession hook will handle the state update
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar 
        session={session} 
        userRole={userRole} 
        handleSignOut={handleSignOut}
      />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-gray-800 font-bold text-lg">Aritra's Blog</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <a
                href="mailto:aritra.chakraborty@g.bracu.ac.bd"
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                Contact Me
              </a>
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                GitHub
              </a>
              <span className="text-gray-500 text-sm">
                © 2024 Aritra's Blog. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}