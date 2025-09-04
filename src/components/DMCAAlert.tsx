import React from 'react'
import { AlertTriangle, CheckCircle, Clock, Shield, ExternalLink } from 'lucide-react'

interface DMCANotice {
  id: string
  platform: string
  track: string
  dateReceived: string
  status: 'received' | 'responding' | 'resolved' | 'rejected'
  claimant: string
  description: string
}

interface DMCAAlertProps {
  variant: 'received' | 'resolved'
  notice: DMCANotice
  onResolve: () => void
}

export default function DMCAAlert({ variant, notice, onResolve }: DMCAAlertProps) {
  if (variant === 'resolved') {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-green-400 mb-2">
              DMCA Notice Resolved
            </h3>
            <p className="text-text-secondary">
              The dispute for "{notice.track}" has been successfully resolved with proper documentation.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
      <div className="flex items-start space-x-4">
        <AlertTriangle className="w-6 h-6 text-red-500 mt-1" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-red-400">
              New DMCA Takedown Notice
            </h3>
            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-medium">
              Action Required
            </span>
          </div>
          
          <div className="space-y-2 mb-4">
            <p className="text-text-primary">
              <strong>Track:</strong> {notice.track}
            </p>
            <p className="text-text-primary">
              <strong>Platform:</strong> {notice.platform}
            </p>
            <p className="text-text-primary">
              <strong>Claimant:</strong> {notice.claimant}
            </p>
            <p className="text-text-secondary">
              {notice.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onResolve}
              className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>Generate Response</span>
            </button>
            
            <button className="bg-white/10 hover:bg-white/20 text-text-primary px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <ExternalLink className="w-4 h-4" />
              <span>View on {notice.platform}</span>
            </button>
            
            <button className="bg-white/10 hover:bg-white/20 text-text-primary px-4 py-2 rounded-lg font-medium transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}