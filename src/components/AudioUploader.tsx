import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Music, X } from 'lucide-react'

interface AudioUploaderProps {
  onFileUpload: (file: File) => void
  isAnalyzing: boolean
  uploadedFile: File | null
  variant?: 'default' | 'dragAndDrop'
}

export default function AudioUploader({ 
  onFileUpload, 
  isAnalyzing, 
  uploadedFile,
  variant = 'dragAndDrop'
}: AudioUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0])
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.flac', '.aac', '.m4a']
    },
    multiple: false,
    disabled: isAnalyzing
  })

  const clearFile = () => {
    // This would need to be handled by parent component
  }

  if (variant === 'default') {
    return (
      <div className="space-y-4">
        <input
          {...getInputProps()}
          disabled={isAnalyzing}
        />
        <button
          {...getRootProps()}
          disabled={isAnalyzing}
          className="w-full bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Upload className="w-5 h-5" />
          <span>{uploadedFile ? 'Change File' : 'Upload Audio File'}</span>
        </button>
        
        {uploadedFile && (
          <div className="flex items-center justify-between bg-surface/50 rounded-lg p-4 border border-white/10">
            <div className="flex items-center space-x-3">
              <Music className="w-5 h-5 text-primary" />
              <span className="text-text-primary">{uploadedFile.name}</span>
              <span className="text-text-secondary text-sm">
                ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            {!isAnalyzing && (
              <button onClick={clearFile} className="text-text-secondary hover:text-red-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
          isDragActive
            ? 'border-primary bg-primary/5'
            : uploadedFile
            ? 'border-green-500 bg-green-500/5'
            : 'border-white/20 hover:border-white/40'
        } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          {uploadedFile ? (
            <div className="flex items-center justify-center space-x-3">
              <Music className="w-12 h-12 text-green-500" />
              <div className="text-left">
                <p className="font-semibold text-text-primary">{uploadedFile.name}</p>
                <p className="text-text-secondary">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <Upload className={`w-12 h-12 mx-auto ${isDragActive ? 'text-primary' : 'text-text-secondary'}`} />
          )}
          
          <div>
            <p className="text-lg font-medium text-text-primary">
              {uploadedFile
                ? isAnalyzing
                  ? 'Analyzing...'
                  : 'File uploaded successfully'
                : isDragActive
                ? 'Drop your audio file here'
                : 'Drag & drop your audio file here'
              }
            </p>
            {!uploadedFile && (
              <p className="text-text-secondary mt-2">
                or click to browse files
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 text-sm text-text-secondary">
            <span className="bg-white/10 px-2 py-1 rounded">MP3</span>
            <span className="bg-white/10 px-2 py-1 rounded">WAV</span>
            <span className="bg-white/10 px-2 py-1 rounded">FLAC</span>
            <span className="bg-white/10 px-2 py-1 rounded">AAC</span>
          </div>
        </div>
      </div>
    </div>
  )
}