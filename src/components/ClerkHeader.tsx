import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  UserButton 
} from '@clerk/clerk-react'
import { LogIn, User } from 'lucide-react'

interface ClerkHeaderProps {
  language: string
}

export const ClerkHeader: React.FC<ClerkHeaderProps> = ({ language }) => {
  const translations = {
    en: {
      signIn: 'Sign In',
      welcome: 'Welcome',
      signOut: 'Sign Out'
    },
    hi: {
      signIn: 'साइन इन',
      welcome: 'स्वागत',
      signOut: 'साइन आउट'
    },
    pa: {
      signIn: 'ਸਾਈਨ ਇਨ',
      welcome: 'ਜੀ ਆਇਆਂ ਨੂੰ',
      signOut: 'ਸਾਈਨ ਆਊਟ'
    }
  }

  const t = translations[language as keyof typeof translations] || translations.en

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-sm border-b">
      <div className="flex items-center gap-2">
        <div className="text-2xl">🌾</div>
        <h1 className="text-xl font-bold text-primary">
          Smart Crop Advisory
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              {t.signIn}
            </Button>
          </SignInButton>
        </SignedOut>
        
        <SignedIn>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
                userButtonPopoverCard: "shadow-lg",
                userButtonPopoverActionButton: "hover:bg-primary/10"
              }
            }}
          />
        </SignedIn>
      </div>
    </div>
  )
}
