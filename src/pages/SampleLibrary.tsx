import React, { useState } from 'react'
import { Play, Download, Tag, Filter, Search, Heart, Headphones } from 'lucide-react'

interface Sample {
  id: string
  title: string
  artist: string
  genre: string
  mood: string
  bpm: number
  key: string
  duration: string
  clearanceType: 'royalty-free' | 'easy-clear' | 'pre-negotiated'
  price: string
  tags: string[]
  audioUrl: string
  liked: boolean
}

export default function SampleLibrary() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedMood, setSelectedMood] = useState('all')
  const [selectedClearance, setSelectedClearance] = useState('all')

  const samples: Sample[] = [
    {
      id: '1',
      title: 'Vinyl Soul Loop',
      artist: 'SampleFlow Studios',
      genre: 'Soul',
      mood: 'Chill',
      bpm: 95,
      key: 'Am',
      duration: '0:08',
      clearanceType: 'royalty-free',
      price: 'Free',
      tags: ['vintage', 'warm', 'lo-fi'],
      audioUrl: '',
      liked: false
    },
    {
      id: '2',
      title: 'Jazz Piano Stab',
      artist: 'Metro Sounds',
      genre: 'Jazz',
      mood: 'Smooth',
      bpm: 120,
      key: 'Gm',
      duration: '0:04',
      clearanceType: 'easy-clear',
      price: '$25',
      tags: ['piano', 'jazz', 'classic'],
      audioUrl: '',
      liked: true
    },
    {
      id: '3',
      title: 'Funk Bass Line',
      artist: 'Groove Collective',
      genre: 'Funk',
      mood: 'Energetic',
      bpm: 110,
      key: 'E',
      duration: '0:12',
      clearanceType: 'pre-negotiated',
      price: '$50',
      tags: ['bass', 'funk', 'groovy'],
      audioUrl: '',
      liked: false
    },
    {
      id: '4',
      title: 'Trap Hi-Hat Roll',
      artist: 'Beat Factory',
      genre: 'Hip-Hop',
      mood: 'Hard',
      bpm: 140,
      key: 'N/A',
      duration: '0:02',
      clearanceType: 'royalty-free',
      price: 'Free',
      tags: ['trap', 'percussion', 'modern'],
      audioUrl: '',
      liked: false
    }
  ]

  const [filteredSamples, setFilteredSamples] = useState(samples)
  const [likedSamples, setLikedSamples] = useState(new Set(['2']))

  const genres = ['all', 'Hip-Hop', 'Soul', 'Jazz', 'Funk', 'Electronic', 'Rock']
  const moods = ['all', 'Chill', 'Energetic', 'Smooth', 'Hard', 'Emotional', 'Dark']
  const clearanceTypes = ['all', 'royalty-free', 'easy-clear', 'pre-negotiated']

  const getClearanceColor = (type: string) => {
    switch (type) {
      case 'royalty-free':
        return 'bg-green-500/20 text-green-400'
      case 'easy-clear':
        return 'bg-blue-500/20 text-blue-400'
      case 'pre-negotiated':
        return 'bg-purple-500/20 text-purple-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const toggleLike = (sampleId: string) => {
    setLikedSamples(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sampleId)) {
        newSet.delete(sampleId)
      } else {
        newSet.add(sampleId)
      }
      return newSet
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Sample Library</h1>
        <p className="text-text-secondary mt-2">
          Discover pre-vetted samples with clear usage rights and simplified licensing.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-surface/50 rounded-lg p-6 border border-white/10 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
          <input
            type="text"
            placeholder="Search samples, artists, genres..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-text-secondary text-sm mb-2">Genre</label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-text-secondary text-sm mb-2">Mood</label>
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
            >
              {moods.map(mood => (
                <option key={mood} value={mood}>
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-text-secondary text-sm mb-2">Clearance</label>
            <select
              value={selectedClearance}
              onChange={(e) => setSelectedClearance(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:border-primary"
            >
              {clearanceTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sample Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {samples.map((sample) => (
          <div key={sample.id} className="bg-surface/50 rounded-lg border border-white/10 overflow-hidden group hover:border-white/20 transition-all">
            {/* Waveform Preview */}
            <div className="h-24 bg-gradient-to-r from-primary/20 to-accent/20 relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors">
                  <Play className="w-6 h-6 text-white" />
                </button>
              </div>
              {/* Mock waveform */}
              <div className="flex items-end space-x-1 opacity-50">
                {Array.from({ length: 40 }, (_, i) => (
                  <div
                    key={i}
                    className="bg-white/60 rounded-sm"
                    style={{
                      height: `${Math.random() * 40 + 10}px`,
                      width: '2px'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-text-primary">{sample.title}</h3>
                  <p className="text-text-secondary text-sm">{sample.artist}</p>
                </div>
                <button
                  onClick={() => toggleLike(sample.id)}
                  className={`transition-colors ${
                    likedSamples.has(sample.id) ? 'text-red-500' : 'text-text-secondary hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${likedSamples.has(sample.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {sample.tags.map((tag) => (
                  <span key={tag} className="bg-white/10 text-text-secondary px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-text-secondary">BPM:</span>
                  <span className="text-text-primary ml-1">{sample.bpm}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Key:</span>
                  <span className="text-text-primary ml-1">{sample.key}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Genre:</span>
                  <span className="text-text-primary ml-1">{sample.genre}</span>
                </div>
                <div>
                  <span className="text-text-secondary">Duration:</span>
                  <span className="text-text-primary ml-1">{sample.duration}</span>
                </div>
              </div>

              {/* Clearance Type */}
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${getClearanceColor(sample.clearanceType)}`}>
                <Tag className="w-3 h-3" />
                <span className="text-xs font-medium">
                  {sample.clearanceType.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="font-semibold text-text-primary">{sample.price}</span>
                <div className="flex space-x-2">
                  <button className="bg-white/10 hover:bg-white/20 text-text-primary p-2 rounded-lg transition-colors">
                    <Headphones className="w-4 h-4" />
                  </button>
                  <button className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Get</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Your Own */}
      <div className="bg-surface/50 rounded-lg p-8 border border-white/10 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Contribute Your Samples
          </h3>
          <p className="text-text-secondary mb-6">
            Have pre-cleared samples? Share them with the community and earn from downloads.
          </p>
          <button className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Submit Samples
          </button>
        </div>
      </div>
    </div>
  )
}