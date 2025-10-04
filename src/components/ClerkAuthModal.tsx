import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  SignIn, 
  SignUp, 
  UserButton,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  useUser
} from '@clerk/clerk-react'
import { Loader2, Mail, Phone, User, Lock, LogIn } from 'lucide-react'

interface ClerkAuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  language: string
}

export const ClerkAuthModal: React.FC<ClerkAuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  language 
}) => {
  const { user, isLoaded } = useUser()

  const translations = {
    en: {
      title: 'Welcome to Smart Crop Advisory',
      subtitle: 'Sign in to access personalized farming advice',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signInWithGoogle: 'Sign in with Google',
      signUpWithGoogle: 'Sign up with Google',
      signInWithEmail: 'Sign in with Email',
      signUpWithEmail: 'Sign up with Email',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      signInSuccess: 'Successfully signed in!',
      signUpSuccess: 'Account created successfully!',
      error: 'An error occurred. Please try again.',
      loading: 'Loading...',
      welcomeBack: 'Welcome back!',
      getStarted: 'Get started with your farming journey'
    },
    hi: {
      title: 'स्मार्ट फसल सलाहकार में स्वागत है',
      subtitle: 'व्यक्तिगत कृषि सलाह के लिए साइन इन करें',
      signIn: 'साइन इन',
      signUp: 'साइन अप',
      signInWithGoogle: 'Google से साइन इन',
      signUpWithGoogle: 'Google से साइन अप',
      signInWithEmail: 'ईमेल से साइन इन',
      signUpWithEmail: 'ईमेल से साइन अप',
      alreadyHaveAccount: 'पहले से खाता है?',
      dontHaveAccount: 'खाता नहीं है?',
      signInSuccess: 'सफलतापूर्वक साइन इन!',
      signUpSuccess: 'खाता सफलतापूर्वक बनाया गया!',
      error: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
      loading: 'लोड हो रहा है...',
      welcomeBack: 'वापस स्वागत है!',
      getStarted: 'अपनी कृषि यात्रा शुरू करें'
    },
    pa: {
      title: 'ਸਮਾਰਟ ਫਸਲ ਸਲਾਹਕਾਰ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ',
      subtitle: 'ਨਿੱਜੀ ਖੇਤੀ ਸਲਾਹ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ',
      signIn: 'ਸਾਈਨ ਇਨ',
      signUp: 'ਸਾਈਨ ਅੱਪ',
      signInWithGoogle: 'Google ਨਾਲ ਸਾਈਨ ਇਨ',
      signUpWithGoogle: 'Google ਨਾਲ ਸਾਈਨ ਅੱਪ',
      signInWithEmail: 'ਈਮੇਲ ਨਾਲ ਸਾਈਨ ਇਨ',
      signUpWithEmail: 'ਈਮੇਲ ਨਾਲ ਸਾਈਨ ਅੱਪ',
      alreadyHaveAccount: 'ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ?',
      dontHaveAccount: 'ਖਾਤਾ ਨਹੀਂ ਹੈ?',
      signInSuccess: 'ਸਫਲਤਾਪੂਰਵਕ ਸਾਈਨ ਇਨ!',
      signUpSuccess: 'ਖਾਤਾ ਸਫਲਤਾਪੂਰਵਕ ਬਣਾਇਆ ਗਿਆ!',
      error: 'ਇੱਕ ਗਲਤੀ ਹੋਈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
      loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
      welcomeBack: 'ਵਾਪਸ ਜੀ ਆਇਆਂ ਨੂੰ!',
      getStarted: 'ਆਪਣੀ ਖੇਤੀ ਦੀ ਯਾਤਰਾ ਸ਼ੁਰੂ ਕਰੋ'
    }
  }

  const t = translations[language as keyof typeof translations] || translations.en

  if (!isLoaded) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">{t.loading}</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-primary">
              {t.welcomeBack}
            </DialogTitle>
            <p className="text-center text-muted-foreground">
              {t.getStarted}
            </p>
          </DialogHeader>
          
          <Card className="mt-4">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-16 h-16"
                    }
                  }}
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {user.fullName || user.emailAddresses[0]?.emailAddress || 'User'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {user.emailAddresses[0]?.emailAddress}
              </p>
              <Button 
                onClick={onSuccess}
                className="w-full"
              >
                Continue to App
              </Button>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary">
            {t.title}
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            {t.subtitle}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Google Sign In */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center justify-center">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                {t.signInWithGoogle}
              </CardTitle>
              <CardDescription className="text-center">
                Quick and secure sign in with your Google account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignInButton 
                mode="modal"
                redirectUrl="/"
                afterSignInUrl="/"
              >
                <Button className="w-full" variant="outline">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4 mr-2" />
                  {t.signInWithGoogle}
                </Button>
              </SignInButton>
            </CardContent>
          </Card>

          {/* Email Sign In */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center justify-center">
                <Mail className="w-5 h-5" />
                {t.signInWithEmail}
              </CardTitle>
              <CardDescription className="text-center">
                Sign in with your email address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignInButton 
                mode="modal"
                redirectUrl="/"
                afterSignInUrl="/"
              >
                <Button className="w-full" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  {t.signInWithEmail}
                </Button>
              </SignInButton>
            </CardContent>
          </Card>

          {/* Sign Up */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-center justify-center">
                <User className="w-5 h-5" />
                {t.dontHaveAccount}
              </CardTitle>
              <CardDescription className="text-center">
                Create a new account to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignUpButton 
                mode="modal"
                redirectUrl="/"
                afterSignUpUrl="/"
              >
                <Button className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  {t.signUp}
                </Button>
              </SignUpButton>
            </CardContent>
          </Card>
        </div>

        {/* Clerk Components for Inline Authentication */}
        <div className="mt-6">
          <SignedOut>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Or use the inline forms below:
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">{t.signIn}</h4>
                  <SignIn 
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "w-full",
                        formButtonPrimary: "w-full",
                        footerActionLink: "text-primary hover:text-primary/80"
                      }
                    }}
                    redirectUrl="/"
                    afterSignInUrl="/"
                  />
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">{t.signUp}</h4>
                  <SignUp 
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0",
                        headerTitle: "hidden",
                        headerSubtitle: "hidden",
                        socialButtonsBlockButton: "w-full",
                        formButtonPrimary: "w-full",
                        footerActionLink: "text-primary hover:text-primary/80"
                      }
                    }}
                    redirectUrl="/"
                    afterSignUpUrl="/"
                  />
                </div>
              </div>
            </div>
          </SignedOut>
          
          <SignedIn>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                You are already signed in!
              </p>
              <Button onClick={onSuccess} className="w-full">
                Continue to App
              </Button>
            </div>
          </SignedIn>
        </div>
      </DialogContent>
    </Dialog>
  )
}
