import { useState } from 'react'
import { FileCheck, Download, Send, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import LicenseForm from '../components/LicenseForm'

interface ClearanceRequest {
  id: string
  sampleTrack: string
  originalTrack: string
  artist: string
  rightsHolder: string
  status: 'draft' | 'sent' | 'negotiating' | 'approved' | 'denied'
  requestDate: string
  licenseType: string
  fee?: string
}

export default function ClearanceProcess() {
  const [activeTab, setActiveTab] = useState<'new' | 'pending' | 'completed'>('new')
  const [showForm, setShowForm] = useState(false)

  const requests: ClearanceRequest[] = [
    {
      id: '1',
      sampleTrack: 'Beat_Final_v2.mp3',
      originalTrack: 'Funky Drummer',
      artist: 'James Brown',
      rightsHolder: 'Universal Music Group',
      status: 'negotiating',
      requestDate: '2024-01-15',
      licenseType: 'Commercial Use',
      fee: '$2,500'
    },
    {
      id: '2',
      sampleTrack: 'Remix_Track_01.wav',
      originalTrack: 'Apache',
      artist: 'Incredible Bongo Band',
      rightsHolder: 'MGM Records',
      status: 'approved',
      requestDate: '2024-01-10',
      licenseType: 'Non-Commercial',
      fee: '$500'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'negotiating':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'sent':
        return <Send className="w-5 h-5 text-blue-500" />
      case 'denied':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <FileCheck className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400'
      case 'negotiating':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'sent':
        return 'bg-blue-500/20 text-blue-400'
      case 'denied':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Clearance Process</h1>
          <p className="text-text-secondary mt-2">
            Manage your sample clearance requests and documentation.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <FileCheck className="w-5 h-5" />
          <span>New Clearance Request</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <nav className="flex space-x-8">
          {[
            { id: 'new', label: 'New Request', count: 0 },
            { id: 'pending', label: 'Pending', count: 1 },
            { id: 'completed', label: 'Completed', count: 1 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-primary/20' : 'bg-white/10'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'new' && (
        <div className="space-y-6">
          {showForm ? (
            <LicenseForm 
              variant="request"
              onClose={() => setShowForm(false)}
            />
          ) : (
            <div className="bg-surface/50 rounded-lg p-12 text-center border border-white/10">
              <FileCheck className="w-16 h-16 text-text-secondary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Start a New Clearance Request
              </h3>
              <p className="text-text-secondary mb-6">
                Create a professional license request for your identified samples.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Create Request
              </button>
            </div>
          )}
        </div>
      )}

      {(activeTab === 'pending' || activeTab === 'completed') && (
        <div className="space-y-6">
          {requests
            .filter(req => 
              activeTab === 'pending' 
                ? ['sent', 'negotiating'].includes(req.status)
                : ['approved', 'denied'].includes(req.status)
            )
            .map((request) => (
              <div key={request.id} className="bg-surface/50 rounded-lg p-6 border border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {request.originalTrack} by {request.artist}
                    </h3>
                    <p className="text-text-secondary">
                      Used in: {request.sampleTrack}
                    </p>
                    <p className="text-text-secondary text-sm">
                      Rights Holder: {request.rightsHolder}
                    </p>
                  </div>
                  
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    <span className="text-sm font-medium capitalize">{request.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-text-secondary text-sm">Request Date</p>
                    <p className="text-text-primary">{new Date(request.requestDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary text-sm">License Type</p>
                    <p className="text-text-primary">{request.licenseType}</p>
                  </div>
                  {request.fee && (
                    <div>
                      <p className="text-text-secondary text-sm">License Fee</p>
                      <p className="text-text-primary font-semibold">{request.fee}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                  <button className="bg-white/10 hover:bg-white/20 text-text-primary px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download Request</span>
                  </button>
                  
                  {request.status === 'approved' && (
                    <button className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download License</span>
                    </button>
                  )}
                  
                  <button className="bg-white/10 hover:bg-white/20 text-text-primary px-4 py-2 rounded-lg font-medium transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Getting Started Guide */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
        <h3 className="font-semibold text-blue-400 mb-3">Clearance Process Guide</h3>
        <ol className="space-y-2 text-text-secondary">
          <li>1. Create a professional license request using our templates</li>
          <li>2. Submit the request to the rights holder via email or their preferred method</li>
          <li>3. Track negotiations and responses in the platform</li>
          <li>4. Upload signed license agreements for secure storage</li>
          <li>5. Reference cleared samples in future DMCA disputes</li>
        </ol>
      </div>
    </div>
  )
}
