import React from 'react'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'overlay' | 'inline'
  message?: string
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  message,
  className = ''
}) => {
  const spinnerElement = (
    <Loader2 
      className={`animate-spin text-accent ${sizeClasses[size]} ${className}`}
    />
  )

  if (variant === 'overlay') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-surface rounded-lg p-6 flex flex-col items-center space-y-4">
          {spinnerElement}
          {message && (
            <p className="text-text_primary text-sm">{message}</p>
          )}
        </div>
      </motion.div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center space-x-2">
        {spinnerElement}
        {message && (
          <span className="text-text_secondary text-sm">{message}</span>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      {spinnerElement}
      {message && (
        <p className="text-text_secondary text-sm text-center">{message}</p>
      )}
    </div>
  )
}

// Specialized loading components
export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="min-h-screen bg-bg flex items-center justify-center">
    <LoadingSpinner size="lg" message={message} />
  </div>
)

export const SectionLoader: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex items-center justify-center py-12">
    <LoadingSpinner size="md" message={message} />
  </div>
)

export const ButtonLoader: React.FC<{ message?: string }> = ({ message }) => (
  <LoadingSpinner size="sm" variant="inline" message={message} />
)

export const OverlayLoader: React.FC<{ message?: string }> = ({ message = 'Processing...' }) => (
  <LoadingSpinner variant="overlay" size="lg" message={message} />
)

// Progress indicator with steps
interface ProgressLoaderProps {
  steps: string[]
  currentStep: number
  message?: string
}

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({
  steps,
  currentStep,
  message
}) => {
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="flex flex-col items-center space-y-6 p-8">
      <LoadingSpinner size="lg" />
      
      {message && (
        <p className="text-text_primary text-lg font-medium">{message}</p>
      )}
      
      <div className="w-full max-w-md">
        <div className="flex justify-between text-sm text-text_secondary mb-2">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-accent h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        
        <p className="text-text_secondary text-sm mt-2 text-center">
          {steps[currentStep]}
        </p>
      </div>
    </div>
  )
}

// Skeleton loader for content
interface SkeletonLoaderProps {
  lines?: number
  className?: string
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  lines = 3,
  className = ''
}) => {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-700 rounded"
          style={{
            width: `${Math.random() * 40 + 60}%`
          }}
        />
      ))}
    </div>
  )
}

// Card skeleton loader
export const CardSkeletonLoader: React.FC = () => (
  <div className="bg-surface rounded-lg border border-gray-700 p-6 animate-pulse">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 bg-gray-700 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-700 rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-3 bg-gray-700 rounded" />
      <div className="h-3 bg-gray-700 rounded w-5/6" />
      <div className="h-3 bg-gray-700 rounded w-4/6" />
    </div>
  </div>
)

// Table skeleton loader
export const TableSkeletonLoader: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4
}) => (
  <div className="animate-pulse">
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {/* Header */}
      {Array.from({ length: columns }).map((_, index) => (
        <div key={`header-${index}`} className="h-4 bg-gray-700 rounded" />
      ))}
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) =>
        Array.from({ length: columns }).map((_, colIndex) => (
          <div
            key={`row-${rowIndex}-col-${colIndex}`}
            className="h-4 bg-gray-700 rounded"
            style={{
              width: `${Math.random() * 30 + 70}%`
            }}
          />
        ))
      )}
    </div>
  </div>
)

export default LoadingSpinner
