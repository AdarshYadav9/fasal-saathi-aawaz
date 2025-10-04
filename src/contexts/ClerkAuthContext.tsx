import React, { createContext, useContext } from 'react'
import { useUser, useAuth } from '@clerk/clerk-react'

interface ClerkAuthContextType {
  user: any
  isSignedIn: boolean
  isLoaded: boolean
  signOut: () => Promise<void>
}

const ClerkAuthContext = createContext<ClerkAuthContextType | undefined>(undefined)

export const useClerkAuth = () => {
  const context = useContext(ClerkAuthContext)
  if (context === undefined) {
    throw new Error('useClerkAuth must be used within a ClerkAuthProvider')
  }
  return context
}

interface ClerkAuthProviderProps {
  children: React.ReactNode
}

export const ClerkAuthProvider: React.FC<ClerkAuthProviderProps> = ({ children }) => {
  const { user, isSignedIn, isLoaded } = useUser()
  const { signOut } = useAuth()

  const value = {
    user,
    isSignedIn: !!isSignedIn,
    isLoaded,
    signOut: async () => {
      await signOut()
    }
  }

  return (
    <ClerkAuthContext.Provider value={value}>
      {children}
    </ClerkAuthContext.Provider>
  )
}
