import React, { useState } from 'react'
import { X, Download, Send, FileText } from 'lucide-react'

interface LicenseFormProps {
  variant: 'request' | 'confirmation'
  onClose: () => void
}

export default function LicenseForm({ variant, onClose }: LicenseFormProps) {
  const [formData, setFormData] = useState({
    sampleTrack: '',
    originalTrack: '',
    artist: '',
    rightsHolder: '',
    licenseType: 'commercial',
    usageDescription: '',
    proposedFee: '',
    contactEmail: '',
    additionalNotes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('License request:', formData)
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="bg-surface/50 rounded-lg border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-text-primary">
            {variant === 'request' ? 'Create License Request' : 'License Confirmation'}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-text-primary font-medium mb-2">
              Your Track Name
            </label>
            <input
              type="text"
              name="sampleTrack"
              value={formData.sampleTrack}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
              placeholder="e.g., My_New_Beat.mp3"
              required
            />
          </div>

          <div>
            <label className="block text-text-primary font-medium mb-2">
              Original Track
            </label>
            <input
              type="text"
              name="originalTrack"
              value={formData.originalTrack}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
              placeholder="e.g., Funky Drummer"
              required
            />
          </div>

          <div>
            <label className="block text-text-primary font-medium mb-2">
              Original Artist
            </label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
              placeholder="e.g., James Brown"
              required
            />
          </div>

          <div>
            <label className="block text-text-primary font-medium mb-2">
              Rights Holder
            </label>
            <input
              type="text"
              name="rightsHolder"
              value={formData.rightsHolder}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
              placeholder="e.g., Universal Music Group"
              required
            />
          </div>

          <div>
            <label className="block text-text-primary font-medium mb-2">
              License Type
            </label>
            <select
              name="licenseType"
              value={formData.licenseType}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="commercial">Commercial Use</option>
              <option value="non-commercial">Non-Commercial Use</option>
              <option value="sync">Sync License</option>
              <option value="mechanical">Mechanical License</option>
            </select>
          </div>

          <div>
            <label className="block text-text-primary font-medium mb-2">
              Contact Email
            </label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-text-primary font-medium mb-2">
            Usage Description
          </label>
          <textarea
            name="usageDescription"
            value={formData.usageDescription}
            onChange={handleChange}
            rows={4}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
            placeholder="Describe how you plan to use the sample..."
            required
          />
        </div>

        <div>
          <label className="block text-text-primary font-medium mb-2">
            Proposed License Fee (Optional)
          </label>
          <input
            type="text"
            name="proposedFee"
            value={formData.proposedFee}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
            placeholder="e.g., $500 or negotiable"
          />
        </div>

        <div>
          <label className="block text-text-primary font-medium mb-2">
            Additional Notes
          </label>
          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
            placeholder="Any additional information or special requests..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t border-white/10">
          <div className="flex space-x-3">
            <button
              type="button"
              className="bg-white/10 hover:bg-white/20 text-text-primary px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Save as Draft</span>
            </button>
            
            <button
              type="button"
              className="bg-white/10 hover:bg-white/20 text-text-primary px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Generate Request</span>
          </button>
        </div>
      </form>
    </div>
  )
}