import { useState } from 'react'
import { Upload, AlertTriangle, CheckCircle, FileText, Send } from 'lucide-react'
import DMCAAlert from '../components/DMCAAlert'

interface DMCANotice {
  id: string
  platform: string
  track: string
  dateReceived: string
  status: 'received' | 'responding' | 'resolved' | 'rejected'
  claimant: string
  description: string
}

export default function DMCAProtection() {
  const [notices] = useState<DMCANotice[]>([
    {
      id: '1',
      platform: 'YouTube',
      track: 'Summer_Vibes_Remix.mp3',
      dateReceived: '2024-01-20',
      status: 'received',
      claimant: 'Major Records Inc.',
      description: 'Claims unauthorized use of "Summer Breeze" sample'
    },
    {
      id: '2',
      platform: 'SoundCloud',
      track: 'Beat_Collection_Vol1.wav',
      dateReceived: '2024-01-15',
      status: 'resolved',
      claimant: 'Independent Artist',
      description: 'Disputed sample usage - resolved with proof of clearance'
    }
  ])

  const [selectedNotice, setSelectedNotice] = useState<DMCANotice | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-500/20 text-green-400'
      case 'responding':
        return 'bg-blue-500/20 text-blue-400'
      case 'rejected':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-yellow-500/20 text-yellow-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-4 h-4" />
      case 'responding':
        return <Send className="w-4 h-4" />
      case 'rejected':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">DMCA Protection</h1>
        <p className="text-text-secondary mt-2">
          Handle takedown notices and protect your work with proper documentation.
        </p>
      </div>

      {/* Active Alerts */}
      {notices.filter(n => n.status === 'received').map((notice) => (
        <DMCAAlert
          key={notice.id}
          variant="received"
          notice={notice}
          onResolve={() => setSelectedNotice(notice)}
        />
      ))}

      {/* Upload Notice */}
      <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Upload DMCA Notice</h2>
        <p className="text-text-secondary mb-4">
          Received a takedown notice? Upload it here to get guidance and generate a response.
        </p>
        
        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors cursor-pointer">
          <Upload className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <p className="text-text-primary font-medium mb-2">Upload DMCA Notice</p>
          <p className="text-text-secondary text-sm">
            Drag & drop your notice file or click to browse
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <span className="bg-white/10 px-2 py-1 rounded text-xs text-text-secondary">PDF</span>
            <span className="bg-white/10 px-2 py-1 rounded text-xs text-text-secondary">DOC</span>
            <span className="bg-white/10 px-2 py-1 rounded text-xs text-text-secondary">EMAIL</span>
          </div>
        </div>
      </div>

      {/* Notice History */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-text-primary">Notice History</h2>
        
        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice.id} className="bg-surface/50 rounded-lg p-6 border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{notice.track}</h3>
                  <p className="text-text-secondary">Platform: {notice.platform}</p>
                  <p className="text-text-secondary text-sm">
                    Claimant: {notice.claimant}
                  </p>
                </div>
                
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(notice.status)}`}>
                  {getStatusIcon(notice.status)}
                  <span className="text-sm font-medium capitalize">{notice.status}</span>
                </div>
              </div>

              <p className="text-text-secondary mb-4">{notice.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-text-secondary text-sm">
                  Received: {new Date(notice.dateReceived).toLocaleDateString()}
                </span>
                
                <div className="flex space-x-3">
                  <button className="bg-white/10 hover:bg-white/20 text-text-primary px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>View Notice</span>
                  </button>
                  
                  {notice.status === 'received' && (
                    <button
                      onClick={() => setSelectedNotice(notice)}
                      className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Respond
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Response Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-text-primary">
                Respond to DMCA Notice
              </h3>
              <button
                onClick={() => setSelectedNotice(null)}
                className="text-text-secondary hover:text-text-primary"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-blue-400 mb-2">Automated Response Suggestions</h4>
                <p className="text-text-secondary text-sm">
                  Based on your cleared samples, we've found relevant documentation that can help dispute this claim.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-text-primary font-medium mb-2">
                    Response Type
                  </label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-text-primary">
                    <option>Counter-Notification (I have rights)</option>
                    <option>Fair Use Claim</option>
                    <option>Mistaken Identity</option>
                    <option>Request Clarification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-text-primary font-medium mb-2">
                    Supporting Documentation
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-text-primary">License Agreement - Summer Breeze Sample</span>
                      <button className="ml-auto text-primary hover:text-primary/80">Attach</button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-text-primary font-medium mb-2">
                    Additional Comments
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary"
                    placeholder="Add any additional information to support your response..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-white/10">
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="bg-white/10 hover:bg-white/20 text-text-primary px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  Submit Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legal Resources */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
        <h3 className="font-semibold text-purple-400 mb-3">DMCA Response Resources</h3>
        <ul className="space-y-2 text-text-secondary">
          <li>• <strong>Counter-Notification:</strong> Use when you have proper licensing or fair use applies</li>
          <li>• <strong>Fair Use Defense:</strong> Educational, commentary, parody, or transformative use cases</li>
          <li>• <strong>Documentation:</strong> Always provide licensing agreements and usage proof</li>
          <li>• <strong>Response Time:</strong> Most platforms require responses within 10-14 business days</li>
        </ul>
      </div>
    </div>
  )
}
