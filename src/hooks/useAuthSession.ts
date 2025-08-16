import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import type { Session, AuthChangeEvent } from '@supabase/supabase-js'
import { useUserRole } from './useUserRole'
import type { UserRole } from './useUserRole'

interface AuthSessionState {
  session: Session | null
  loading: boolean
  userRole: UserRole
  roleLoading: boolean
}

export function useAuthSession(): AuthSessionState {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setSession(data.session)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Use our role hook
  const { userRole, loading: roleLoading } = useUserRole(session)

  return { 
    session, 
    loading: loading || roleLoading, 
    userRole,
    roleLoading
  }
}