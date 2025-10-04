import React, { useState, useRef, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  Camera, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Image as ImageIcon,
  Loader2
} from 'lucide-react'

interface SoilUploadProps {
  onUpload: (file: File) => Promise<void>
  language: string
  disabled?: boolean
}

interface UploadedFile {
  file: File
  preview: string
  id: string
}

export const SoilUpload: React.FC<SoilUploadProps> = ({ onUpload, language, disabled = false }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const translations = {
    en: {
      title: 'Upload Soil Photo',
      subtitle: 'Take a photo or upload an image of your soil for analysis',
      dragDrop: 'Drag and drop your soil photo here, or click to browse',
      or: 'or',
      takePhoto: 'Take Photo',
      browseFiles: 'Browse Files',
      supportedFormats: 'Supported formats: JPG, PNG, WebP (Max 10MB)',
      uploadSuccess: 'Photo uploaded successfully!',
      uploadError: 'Failed to upload photo. Please try again.',
      invalidFileType: 'Please upload a valid image file (JPG, PNG, WebP)',
      fileTooLarge: 'File size must be less than 10MB',
      analyzing: 'Analyzing soil...',
      remove: 'Remove',
      retry: 'Retry',
      uploadAnother: 'Upload Another Photo',
      soilType: 'Soil Type',
      nutrients: 'Nutrients',
      ph: 'pH Level',
      moisture: 'Moisture',
      organicMatter: 'Organic Matter',
      confidence: 'Confidence',
      analysisComplete: 'Analysis Complete',
      cropRecommendations: 'Crop Recommendations',
      viewRecommendations: 'View Recommendations'
    },
    hi: {
      title: 'मिट्टी की फोटो अपलोड करें',
      subtitle: 'विश्लेषण के लिए अपनी मिट्टी की फोटो लें या अपलोड करें',
      dragDrop: 'अपनी मिट्टी की फोटो यहाँ खींचें और छोड़ें, या ब्राउज़ करने के लिए क्लिक करें',
      or: 'या',
      takePhoto: 'फोटो लें',
      browseFiles: 'फाइलें ब्राउज़ करें',
      supportedFormats: 'समर्थित प्रारूप: JPG, PNG, WebP (अधिकतम 10MB)',
      uploadSuccess: 'फोटो सफलतापूर्वक अपलोड!',
      uploadError: 'फोटो अपलोड करने में विफल। कृपया पुनः प्रयास करें।',
      invalidFileType: 'कृपया एक वैध छवि फ़ाइल अपलोड करें (JPG, PNG, WebP)',
      fileTooLarge: 'फ़ाइल का आकार 10MB से कम होना चाहिए',
      analyzing: 'मिट्टी का विश्लेषण...',
      remove: 'हटाएं',
      retry: 'पुनः प्रयास',
      uploadAnother: 'दूसरी फोटो अपलोड करें',
      soilType: 'मिट्टी का प्रकार',
      nutrients: 'पोषक तत्व',
      ph: 'pH स्तर',
      moisture: 'नमी',
      organicMatter: 'कार्बनिक पदार्थ',
      confidence: 'विश्वास',
      analysisComplete: 'विश्लेषण पूरा',
      cropRecommendations: 'फसल सिफारिशें',
      viewRecommendations: 'सिफारिशें देखें'
    },
    pa: {
      title: 'ਮਿੱਟੀ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ',
      subtitle: 'ਵਿਸ਼ਲੇਸ਼ਣ ਲਈ ਆਪਣੀ ਮਿੱਟੀ ਦੀ ਫੋਟੋ ਲਓ ਜਾਂ ਅਪਲੋਡ ਕਰੋ',
      dragDrop: 'ਆਪਣੀ ਮਿੱਟੀ ਦੀ ਫੋਟੋ ਇੱਥੇ ਖਿੱਚੋ ਅਤੇ ਛੱਡੋ, ਜਾਂ ਬ੍ਰਾਉਜ਼ ਕਰਨ ਲਈ ਕਲਿਕ ਕਰੋ',
      or: 'ਜਾਂ',
      takePhoto: 'ਫੋਟੋ ਲਓ',
      browseFiles: 'ਫਾਈਲਾਂ ਬ੍ਰਾਉਜ਼ ਕਰੋ',
      supportedFormats: 'ਸਮਰਥਿਤ ਫਾਰਮੈਟ: JPG, PNG, WebP (ਵੱਧ ਤੋਂ ਵੱਧ 10MB)',
      uploadSuccess: 'ਫੋਟੋ ਸਫਲਤਾਪੂਰਵਕ ਅਪਲੋਡ!',
      uploadError: 'ਫੋਟੋ ਅਪਲੋਡ ਕਰਨ ਵਿੱਚ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
      invalidFileType: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ ਚਿੱਤਰ ਫਾਈਲ ਅਪਲੋਡ ਕਰੋ (JPG, PNG, WebP)',
      fileTooLarge: 'ਫਾਈਲ ਦਾ ਆਕਾਰ 10MB ਤੋਂ ਘੱਟ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ',
      analyzing: 'ਮਿੱਟੀ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ...',
      remove: 'ਹਟਾਓ',
      retry: 'ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼',
      uploadAnother: 'ਦੂਜੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ',
      soilType: 'ਮਿੱਟੀ ਦਾ ਪ੍ਰਕਾਰ',
      nutrients: 'ਪੋਸ਼ਕ ਤੱਤ',
      ph: 'pH ਪੱਧਰ',
      moisture: 'ਨਮੀ',
      organicMatter: 'ਕਾਰਬਨਿਕ ਪਦਾਰਥ',
      confidence: 'ਵਿਸ਼ਵਾਸ',
      analysisComplete: 'ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ',
      cropRecommendations: 'ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ',
      viewRecommendations: 'ਸਿਫਾਰਸ਼ਾਂ ਦੇਖੋ'
    }
  }

  const t = translations[language as keyof typeof translations] || translations.en

  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return t.invalidFileType
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB
      return t.fileTooLarge
    }
    return null
  }

  const createFilePreview = (file: File): UploadedFile => ({
    file,
    preview: URL.createObjectURL(file),
    id: Math.random().toString(36).substr(2, 9)
  })

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const validationError = validateFile(file)
    
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    const uploadedFile = createFilePreview(file)
    setUploadedFiles([uploadedFile])

    // Simulate upload progress
    setUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      await onUpload(file)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      setError(null)
      
      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 1000)
    } catch (err) {
      clearInterval(progressInterval)
      setError(t.uploadError)
      setUploading(false)
      setUploadProgress(0)
    }
  }, [onUpload, t.uploadError])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
  }

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter(f => f.id !== id)
    })
    setError(null)
  }

  const retryUpload = () => {
    if (uploadedFiles.length > 0) {
      handleFileSelect(new DataTransfer().files)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary mb-2">{t.title}</h3>
            <p className="text-sm sm:text-base text-muted-foreground">{t.subtitle}</p>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 sm:p-6 lg:p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="text-3xl sm:text-4xl">📸</div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                  {t.dragDrop}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t.supportedFormats}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  disabled={disabled}
                  className="text-xs sm:text-sm"
                >
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  {t.browseFiles}
                </Button>
                
                <span className="hidden sm:inline text-muted-foreground self-center text-xs sm:text-sm">
                  {t.or}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    cameraInputRef.current?.click()
                  }}
                  disabled={disabled}
                  className="text-xs sm:text-sm"
                >
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  {t.takePhoto}
                </Button>
              </div>
            </div>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
            disabled={disabled}
          />

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{t.analyzing}</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {uploadedFiles.map((uploadedFile) => (
                <div key={uploadedFile.id} className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={uploadedFile.preview}
                      alt="Soil preview"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      </div>
                    )}
                    {!uploading && uploadProgress === 100 && (
                      <div className="absolute -top-1 -right-1">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    {uploading && (
                      <div className="mt-1">
                        <Progress value={uploadProgress} className="w-full h-1" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    {!uploading && error && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={retryUpload}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        {t.retry}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFile(uploadedFile.id)}
                      disabled={uploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mock Analysis Results */}
      {uploadedFiles.length > 0 && !uploading && uploadProgress === 100 && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-green-600 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {t.analysisComplete}
                </h4>
                <Badge variant="secondary">AI Analysis</Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{t.soilType}</p>
                  <p className="font-semibold">Clay Loam</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{t.ph}</p>
                  <p className="font-semibold">6.8</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{t.moisture}</p>
                  <p className="font-semibold">Good</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">{t.confidence}</p>
                  <p className="font-semibold">92%</p>
                </div>
              </div>
              
              <Button className="w-full" variant="default">
                {t.viewRecommendations}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
