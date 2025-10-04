import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Download, Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react'

interface PWAInstallProps {
  language: string
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const PWAInstall: React.FC<PWAInstallProps> = ({ language }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showInstallBanner, setShowInstallBanner] = useState(false)

  const translations = {
    en: {
      title: 'Install Smart Crop Advisory',
      subtitle: 'Get quick access to farming advice on your device',
      install: 'Install App',
      installed: 'App Installed',
      installDescription: 'Install this app on your device for quick access and offline use',
      benefits: [
        'Quick access from home screen',
        'Works offline',
        'Faster loading',
        'Native app experience'
      ],
      online: 'Online',
      offline: 'Offline',
      installNow: 'Install Now',
      later: 'Maybe Later',
      dismiss: 'Dismiss'
    },
    hi: {
      title: 'स्मार्ट फसल सलाहकार इंस्टॉल करें',
      subtitle: 'अपने डिवाइस पर कृषि सलाह तक त्वरित पहुंच प्राप्त करें',
      install: 'ऐप इंस्टॉल करें',
      installed: 'ऐप इंस्टॉल हो गया',
      installDescription: 'त्वरित पहुंच और ऑफलाइन उपयोग के लिए इस ऐप को अपने डिवाइस पर इंस्टॉल करें',
      benefits: [
        'होम स्क्रीन से त्वरित पहुंच',
        'ऑफलाइन काम करता है',
        'तेज़ लोडिंग',
        'नेटिव ऐप अनुभव'
      ],
      online: 'ऑनलाइन',
      offline: 'ऑफलाइन',
      installNow: 'अभी इंस्टॉल करें',
      later: 'बाद में',
      dismiss: 'खारिज करें'
    },
    pa: {
      title: 'ਸਮਾਰਟ ਫਸਲ ਸਲਾਹਕਾਰ ਇੰਸਟਾਲ ਕਰੋ',
      subtitle: 'ਆਪਣੇ ਡਿਵਾਈਸ \'ਤੇ ਖੇਤੀ ਸਲਾਹ ਤੱਕ ਤੁਰੰਤ ਪਹੁੰਚ ਪ੍ਰਾਪਤ ਕਰੋ',
      install: 'ਐਪ ਇੰਸਟਾਲ ਕਰੋ',
      installed: 'ਐਪ ਇੰਸਟਾਲ ਹੋ ਗਿਆ',
      installDescription: 'ਤੁਰੰਤ ਪਹੁੰਚ ਅਤੇ ਆਫਲਾਈਨ ਵਰਤੋਂ ਲਈ ਇਸ ਐਪ ਨੂੰ ਆਪਣੇ ਡਿਵਾਈਸ \'ਤੇ ਇੰਸਟਾਲ ਕਰੋ',
      benefits: [
        'ਹੋਮ ਸਕ੍ਰੀਨ ਤੋਂ ਤੁਰੰਤ ਪਹੁੰਚ',
        'ਆਫਲਾਈਨ ਕੰਮ ਕਰਦਾ ਹੈ',
        'ਤੇਜ਼ ਲੋਡਿੰਗ',
        'ਨੇਟਿਵ ਐਪ ਅਨੁਭਵ'
      ],
      online: 'ਆਨਲਾਈਨ',
      offline: 'ਆਫਲਾਈਨ',
      installNow: 'ਹੁਣੇ ਇੰਸਟਾਲ ਕਰੋ',
      later: 'ਬਾਅਦ ਵਿੱਚ',
      dismiss: 'ਖਾਰਜ ਕਰੋ'
    }
  }

  const t = translations[language as keyof typeof translations] || translations.en

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as any).standalone === true) {
        setIsInstalled(true)
      }
    }

    checkInstalled()

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallBanner(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallBanner(false)
      setDeferredPrompt(null)
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
      } else {
        console.log('User dismissed the install prompt')
      }
      
      setDeferredPrompt(null)
      setShowInstallBanner(false)
    } catch (error) {
      console.error('Error installing PWA:', error)
    }
  }

  const handleDismiss = () => {
    setShowInstallBanner(false)
    // Store dismissal in localStorage to avoid showing again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Don't show if already installed or recently dismissed
  if (isInstalled || !showInstallBanner) {
    return null
  }

  // Check if recently dismissed (within 7 days)
  const dismissedTime = localStorage.getItem('pwa-install-dismissed')
  if (dismissedTime) {
    const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24)
    if (daysSinceDismissed < 7) {
      return null
    }
  }

  return (
    <Card className="mb-4 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-primary">{t.title}</h3>
              <Badge variant="secondary" className="flex items-center gap-1">
                {isOnline ? (
                  <Wifi className="w-3 h-3" />
                ) : (
                  <WifiOff className="w-3 h-3" />
                )}
                {isOnline ? t.online : t.offline}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {t.installDescription}
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {t.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  {benefit}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleInstallClick}
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t.installNow}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDismiss}
              >
                {t.later}
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
