import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthUser, auth } from '@/lib/supabase'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
  signUpWithPhone: (phone: string, password: string, fullName?: string) => Promise<{ data: any; error: any }>
  signInWithPhone: (phone: string, password: string) => Promise<{ data: any; error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { user } = await auth.getCurrentUser()
      setUser(user as AuthUser)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      setUser(session?.user as AuthUser || null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName?: string) => {
    return await auth.signUpWithEmail(email, password, fullName)
  }

  const signIn = async (email: string, password: string) => {
    return await auth.signInWithEmail(email, password)
  }

  const signOut = async () => {
    return await auth.signOut()
  }

  const signUpWithPhone = async (phone: string, password: string, fullName?: string) => {
    return await auth.signUpWithPhone(phone, password, fullName)
  }

  const signInWithPhone = async (phone: string, password: string) => {
    return await auth.signInWithPhone(phone, password)
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    signUpWithPhone,
    signInWithPhone,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
