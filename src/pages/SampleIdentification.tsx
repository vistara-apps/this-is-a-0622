import { useState } from 'react'
import { Upload, Search, Music, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import AudioUploader from '../components/AudioUploader'
import SampleInfoCard from '../components/SampleInfoCard'

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

export default function SampleIdentification() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [samples, setSamples] = useState<Sample[]>([])
  const [analysisComplete, setAnalysisComplete] = useState(false)

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file)
    setIsAnalyzing(true)
    setSamples([])
    setAnalysisComplete(false)

    // Simulate analysis with mock data
    setTimeout(() => {
      const mockSamples: Sample[] = [
        {
          id: '1',
          originalTrack: 'Funky Drummer',
          artist: 'James Brown',
          identifiedOwner: 'Universal Music Group',
          confidence: 0.95,
          clearanceStatus: 'unknown',
          startTime: 32.5,
          endTime: 36.2
        },
        {
          id: '2',
          originalTrack: 'Amen Break',
          artist: 'The Winstons',
          identifiedOwner: 'Color-Red Music',
          confidence: 0.88,
          clearanceStatus: 'cleared',
          startTime: 58.1,
          endTime: 64.3
        },
        {
          id: '3',
          originalTrack: 'Apache',
          artist: 'Incredible Bongo Band',
          identifiedOwner: 'MGM Records',
          confidence: 0.92,
          clearanceStatus: 'pending',
          startTime: 125.7,
          endTime: 129.4
        }
      ]
      
      setSamples(mockSamples)
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }, 3000)
  }

  const handleClearSample = (sampleId: string) => {
    setSamples(prev => prev.map(sample => 
      sample.id === sampleId 
        ? { ...sample, clearanceStatus: 'pending' }
        : sample
    ))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Sample Identification</h1>
        <p className="text-text-secondary mt-2">
          Upload your track to identify samples and discover their copyright owners.
        </p>
      </div>

      {/* Upload Section */}
      <AudioUploader
        onFileUpload={handleFileUpload}
        isAnalyzing={isAnalyzing}
        uploadedFile={uploadedFile}
      />

      {/* Analysis Status */}
      {uploadedFile && (
        <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
          <div className="flex items-center space-x-4">
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <div>
                  <h3 className="font-semibold text-text-primary">Analyzing Audio</h3>
                  <p className="text-text-secondary">Identifying samples using AI fingerprinting...</p>
                </div>
              </>
            ) : analysisComplete ? (
              <>
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="font-semibold text-text-primary">Analysis Complete</h3>
                  <p className="text-text-secondary">Found {samples.length} potential samples</p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Results */}
      {samples.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-text-primary">Identified Samples</h2>
          <div className="grid gap-6">
            {samples.map((sample) => (
              <SampleInfoCard
                key={sample.id}
                sample={sample}
                onClearSample={handleClearSample}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
        <h3 className="flex items-center space-x-2 font-semibold text-blue-400 mb-3">
          <AlertCircle className="w-5 h-5" />
          <span>Tips for Better Results</span>
        </h3>
        <ul className="space-y-2 text-text-secondary">
          <li>• Upload high-quality audio files (WAV, FLAC preferred)</li>
          <li>• Ensure samples are clearly audible in the mix</li>
          <li>• Longer samples (4+ seconds) are easier to identify</li>
          <li>• Remove excessive effects that might obscure the original sample</li>
        </ul>
      </div>
    </div>
  )
}
