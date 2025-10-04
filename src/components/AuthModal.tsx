import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Phone, User, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  language: string
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, language }) => {
  const { signUp, signIn, signUpWithPhone, signInWithPhone } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const translations = {
    en: {
      title: 'Welcome to Smart Crop Advisory',
      subtitle: 'Sign in to access personalized farming advice',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      email: 'Email',
      phone: 'Phone Number',
      password: 'Password',
      fullName: 'Full Name',
      signInWithEmail: 'Sign in with Email',
      signInWithPhone: 'Sign in with Phone',
      signUpWithEmail: 'Sign up with Email',
      signUpWithPhone: 'Sign up with Phone',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      signInSuccess: 'Successfully signed in!',
      signUpSuccess: 'Account created successfully! Please check your email for verification.',
      error: 'An error occurred. Please try again.',
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      invalidPhone: 'Please enter a valid phone number',
      passwordTooShort: 'Password must be at least 6 characters',
    },
    hi: {
      title: 'स्मार्ट फसल सलाहकार में स्वागत है',
      subtitle: 'व्यक्तिगत कृषि सलाह के लिए साइन इन करें',
      signIn: 'साइन इन',
      signUp: 'साइन अप',
      email: 'ईमेल',
      phone: 'फोन नंबर',
      password: 'पासवर्ड',
      fullName: 'पूरा नाम',
      signInWithEmail: 'ईमेल से साइन इन',
      signInWithPhone: 'फोन से साइन इन',
      signUpWithEmail: 'ईमेल से साइन अप',
      signUpWithPhone: 'फोन से साइन अप',
      alreadyHaveAccount: 'पहले से खाता है?',
      dontHaveAccount: 'खाता नहीं है?',
      signInSuccess: 'सफलतापूर्वक साइन इन!',
      signUpSuccess: 'खाता सफलतापूर्वक बनाया गया! कृपया सत्यापन के लिए अपना ईमेल देखें।',
      error: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
      required: 'यह फ़ील्ड आवश्यक है',
      invalidEmail: 'कृपया एक वैध ईमेल पता दर्ज करें',
      invalidPhone: 'कृपया एक वैध फोन नंबर दर्ज करें',
      passwordTooShort: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
    },
    pa: {
      title: 'ਸਮਾਰਟ ਫਸਲ ਸਲਾਹਕਾਰ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ',
      subtitle: 'ਨਿੱਜੀ ਖੇਤੀ ਸਲਾਹ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ',
      signIn: 'ਸਾਈਨ ਇਨ',
      signUp: 'ਸਾਈਨ ਅੱਪ',
      email: 'ਈਮੇਲ',
      phone: 'ਫੋਨ ਨੰਬਰ',
      password: 'ਪਾਸਵਰਡ',
      fullName: 'ਪੂਰਾ ਨਾਮ',
      signInWithEmail: 'ਈਮੇਲ ਨਾਲ ਸਾਈਨ ਇਨ',
      signInWithPhone: 'ਫੋਨ ਨਾਲ ਸਾਈਨ ਇਨ',
      signUpWithEmail: 'ਈਮੇਲ ਨਾਲ ਸਾਈਨ ਅੱਪ',
      signUpWithPhone: 'ਫੋਨ ਨਾਲ ਸਾਈਨ ਅੱਪ',
      alreadyHaveAccount: 'ਪਹਿਲਾਂ ਤੋਂ ਖਾਤਾ ਹੈ?',
      dontHaveAccount: 'ਖਾਤਾ ਨਹੀਂ ਹੈ?',
      signInSuccess: 'ਸਫਲਤਾਪੂਰਵਕ ਸਾਈਨ ਇਨ!',
      signUpSuccess: 'ਖਾਤਾ ਸਫਲਤਾਪੂਰਵਕ ਬਣਾਇਆ ਗਿਆ! ਕਿਰਪਾ ਕਰਕੇ ਸਥਿਰੀਕਰਣ ਲਈ ਆਪਣਾ ਈਮੇਲ ਦੇਖੋ।',
      error: 'ਇੱਕ ਗਲਤੀ ਹੋਈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
      required: 'ਇਹ ਫੀਲਡ ਜ਼ਰੂਰੀ ਹੈ',
      invalidEmail: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ ਈਮੇਲ ਪਤਾ ਦਰਜ ਕਰੋ',
      invalidPhone: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ ਫੋਨ ਨੰਬਰ ਦਰਜ ਕਰੋ',
      passwordTooShort: 'ਪਾਸਵਰਡ ਘੱਟੋ-ਘੱਟ 6 ਅੱਖਰਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ',
    }
  }

  const t = translations[language as keyof typeof translations] || translations.en

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    fullName: ''
  })

  const [activeTab, setActiveTab] = useState('signin')

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const validateForm = (isSignUp: boolean = false) => {
    if (isSignUp && !formData.fullName.trim()) {
      setError(t.required)
      return false
    }
    if (!formData.password || formData.password.length < 6) {
      setError(t.passwordTooShort)
      return false
    }
    return true
  }

  const handleEmailSignIn = async () => {
    if (!formData.email || !formData.password) {
      setError(t.required)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await signIn(formData.email, formData.password)
      if (error) {
        setError(error.message || t.error)
      } else {
        setSuccess(t.signInSuccess)
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 1000)
      }
    } catch (err) {
      setError(t.error)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSignUp = async () => {
    if (!validateForm(true)) return

    setLoading(true)
    setError(null)

    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName)
      if (error) {
        setError(error.message || t.error)
      } else {
        setSuccess(t.signUpSuccess)
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 2000)
      }
    } catch (err) {
      setError(t.error)
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneSignIn = async () => {
    if (!formData.phone || !formData.password) {
      setError(t.required)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await signInWithPhone(formData.phone, formData.password)
      if (error) {
        setError(error.message || t.error)
      } else {
        setSuccess(t.signInSuccess)
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 1000)
      }
    } catch (err) {
      setError(t.error)
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneSignUp = async () => {
    if (!validateForm(true)) return

    setLoading(true)
    setError(null)

    try {
      const { error } = await signUpWithPhone(formData.phone, formData.password, formData.fullName)
      if (error) {
        setError(error.message || t.error)
      } else {
        setSuccess(t.signUpSuccess)
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 2000)
      }
    } catch (err) {
      setError(t.error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({ email: '', phone: '', password: '', fullName: '' })
    setError(null)
    setSuccess(null)
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">{t.signIn}</TabsTrigger>
            <TabsTrigger value="signup">{t.signUp}</TabsTrigger>
          </TabsList>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="signin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {t.signInWithEmail}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">{t.email}</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">{t.password}</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleEmailSignIn}
                  disabled={loading}
                  className="w-full"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t.signIn}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {t.signInWithPhone}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-phone">{t.phone}</Label>
                  <Input
                    id="signin-phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password-phone">{t.password}</Label>
                  <Input
                    id="signin-password-phone"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </div>
                <Button
                  onClick={handlePhoneSignIn}
                  disabled={loading}
                  className="w-full"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t.signIn}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  {t.signUpWithEmail}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">{t.fullName}</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">{t.email}</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">{t.password}</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleEmailSignUp}
                  disabled={loading}
                  className="w-full"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t.signUp}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  {t.signUpWithPhone}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name-phone">{t.fullName}</Label>
                  <Input
                    id="signup-name-phone"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">{t.phone}</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password-phone">{t.password}</Label>
                  <Input
                    id="signup-password-phone"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </div>
                <Button
                  onClick={handlePhoneSignUp}
                  disabled={loading}
                  className="w-full"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t.signUp}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
