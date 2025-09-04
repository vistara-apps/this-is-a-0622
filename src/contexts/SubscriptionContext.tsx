import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SubscriptionContextType {
  tier: 'free' | 'pro' | 'artist'
  usage: {
    searches: number
    maxSearches: number
    clearances: number
    maxClearances: number
  }
  upgradeTier: (newTier: 'pro' | 'artist') => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<'free' | 'pro' | 'artist'>('pro')
  const [usage, setUsage] = useState({
    searches: 45,
    maxSearches: tier === 'free' ? 10 : 1000,
    clearances: 12,
    maxClearances: tier === 'free' ? 3 : 100
  })

  const upgradeTier = async (newTier: 'pro' | 'artist') => {
    // Mock upgrade - replace with Stripe integration
    setTier(newTier)
    setUsage(prev => ({
      ...prev,
      maxSearches: newTier === 'free' ? 10 : 1000,
      maxClearances: newTier === 'free' ? 3 : 100
    }))
  }

  return (
    <SubscriptionContext.Provider value={{
      tier,
      usage,
      upgradeTier
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}