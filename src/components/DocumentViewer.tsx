import { useState } from 'react'
import { FileText, Download, Eye, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DocumentViewerProps {
  document: {
    id: string
    name: string
    type: 'pdf' | 'text'
    url: string
    content?: string
    size?: number
    uploadedAt?: string
  }
  variant?: 'pdf' | 'text'
  className?: string
  onClose?: () => void
}

export default function DocumentViewer({ 
  document, 
  variant = 'pdf', 
  className = '',
  onClose 
}: DocumentViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleDownload = () => {
    const link = window.document.createElement('a')
    link.href = document.url
    link.download = document.name
    link.click()
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const DocumentHeader = () => (
    <div className="flex items-center justify-between p-4 bg-surface border-b border-gray-700">
      <div className="flex items-center space-x-3">
        <FileText className="w-5 h-5 text-accent" />
        <div>
          <h3 className="text-text_primary font-medium">{document.name}</h3>
          <p className="text-text_secondary text-sm">
            {formatFileSize(document.size)} • {formatDate(document.uploadedAt)}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleDownload}
          className="p-2 text-text_secondary hover:text-accent transition-colors rounded-md hover:bg-gray-700"
          title="Download document"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="p-2 text-text_secondary hover:text-accent transition-colors rounded-md hover:bg-gray-700"
          title="Toggle fullscreen"
        >
          <Eye className="w-4 h-4" />
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-text_secondary hover:text-red-400 transition-colors rounded-md hover:bg-gray-700"
            title="Close viewer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )

  const PDFViewer = () => (
    <div className="flex-1 bg-gray-900">
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          <span className="ml-3 text-text_secondary">Loading document...</span>
        </div>
      )}
      <iframe
        src={document.url}
        className="w-full h-full border-0"
        title={document.name}
        onLoad={() => setIsLoading(false)}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  )

  const TextViewer = () => (
    <div className="flex-1 p-6 bg-gray-900 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <pre className="text-text_primary whitespace-pre-wrap font-mono text-sm leading-relaxed">
          {document.content || 'No content available'}
        </pre>
      </div>
    </div>
  )

  const ViewerContent = () => (
    <div className={`flex flex-col bg-bg rounded-lg border border-gray-700 ${className}`}>
      <DocumentHeader />
      {variant === 'pdf' ? <PDFViewer /> : <TextViewer />}
    </div>
  )

  return (
    <>
      {/* Regular viewer */}
      {!isFullscreen && <ViewerContent />}
      
      {/* Fullscreen modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsFullscreen(false)
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full h-full max-w-7xl max-h-full"
            >
              <ViewerContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Export variants for easy usage
export const PDFViewer = (props: Omit<DocumentViewerProps, 'variant'>) => (
  <DocumentViewer {...props} variant="pdf" />
)

export const TextViewer = (props: Omit<DocumentViewerProps, 'variant'>) => (
  <DocumentViewer {...props} variant="text" />
)
