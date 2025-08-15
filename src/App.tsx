import { useState, useEffect } from 'react'
import './App.css'
import { supabase } from './supabaseClient'
import type { Session, AuthChangeEvent } from '@supabase/supabase-js'
import Auth from './components/Authentication/Auth'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!session ? (
        <Auth />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">Welcome to Your Blog</h1>
          <p className="text-lg text-gray-700 mb-6">
            You are logged in as {session.user.email}
          </p>
          
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

export default App