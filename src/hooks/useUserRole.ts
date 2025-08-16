import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import type { Session } from '@supabase/supabase-js'

export type UserRole = 'admin' | 'user' | 'anonymous'

export function useUserRole(session: Session | null) {
  const [userRole, setUserRole] = useState<UserRole>('anonymous')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!session?.user) {
        setUserRole('anonymous')
        setLoading(false)
        return
      }

      try {
        console.log('Fetching role for user ID:', session.user.id)
        
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        
        if (error) {
          console.error('Error fetching user role:', error)
          
          // If no profile exists, create one with default 'user' role
          if (error.code === 'PGRST116') { // Record not found
            console.log('Creating profile for user', session.user.id)
            
            try {
              await supabase.from('profiles').insert({
                id: session.user.id,
                email: session.user.email,
                role: 'user' // Default role for new signups
              })
              
              setUserRole('user')
            } catch (insertError) {
              console.error('Error creating profile:', insertError)
              setUserRole('user')
            }
          } else {
            setUserRole('user') // Default to user role on other errors
          }
        } else if (data) {
          console.log('Found user role:', data.role)
          setUserRole(data.role as UserRole)
        } else {
          setUserRole('user')
        }
      } catch (error) {
        console.error('Unexpected error fetching role:', error)
        setUserRole('user')
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [session])

  return { userRole, loading }
}