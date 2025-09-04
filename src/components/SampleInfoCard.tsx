import React from 'react'
import { Music, User, Building2, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

interface Sample {
  id: string
  originalTrack: string
  artist: string
  identifiedOwner: string
  confidence: number
  clearanceStatus: 'unknown' | 'cleared' | 'pending' | 'denied'
  startTime: number
  endTime: number
}

interface SampleInfoCardProps {
  sample: Sample
  onClearSample: (sampleId: string) => void
  variant?: 'idle' | 'identified' | 'cleared'
}

export default function SampleInfoCard({ 
  sample, 
  onClearSample,
  variant = 'identified'
}: SampleInfoCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'cleared':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'denied':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cleared':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'denied':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-surface/50 rounded-lg p-6 border border-white/10 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <Music className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary text-lg">{sample.originalTrack}</h3>
            <div className="flex items-center space-x-2 text-text-secondary">
              <User className="w-4 h-4" />
              <span>{sample.artist}</span>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(sample.clearanceStatus)}`}>
          {getStatusIcon(sample.clearanceStatus)}
          <span className="text-sm font-medium capitalize">{sample.clearanceStatus}</span>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-text-secondary text-sm">Copyright Owner</p>
          <div className="flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-text-secondary" />
            <span className="text-text-primary">{sample.identifiedOwner}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-text-secondary text-sm">Time Range</p>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-text-secondary" />
            <span className="text-text-primary">
              {formatTime(sample.startTime)} - {formatTime(sample.endTime)}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-text-secondary text-sm">Confidence</p>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  sample.confidence >= 0.9 ? 'bg-green-500' :
                  sample.confidence >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${sample.confidence * 100}%` }}
              />
            </div>
            <span className="text-text-primary font-medium">
              {Math.round(sample.confidence * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
        {sample.clearanceStatus === 'unknown' && (
          <button
            onClick={() => onClearSample(sample.id)}
            className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Start Clearance Process
          </button>
        )}
        
        <button className="bg-white/10 hover:bg-white/20 text-text-primary px-4 py-2 rounded-lg font-medium transition-colors">
          View Details
        </button>
        
        <button className="bg-white/10 hover:bg-white/20 text-text-primary px-4 py-2 rounded-lg font-medium transition-colors">
          Listen to Sample
        </button>
      </div>
    </div>
  )
}