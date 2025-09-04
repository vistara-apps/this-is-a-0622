import React, { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  userId: string
  email: string
  subscriptionTier: 'free' | 'pro' | 'artist'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    userId: '1',
    email: 'demo@sampleflow.com',
    subscriptionTier: 'pro'
  })

  const login = async (email: string, password: string) => {
    // Mock login - replace with actual API call
    setUser({
      userId: '1',
      email,
      subscriptionTier: 'pro'
    })
  }

  const logout = () => {
    setUser(null)
  }

  const signup = async (email: string, password: string) => {
    // Mock signup - replace with actual API call
    setUser({
      userId: Date.now().toString(),
      email,
      subscriptionTier: 'free'
    })
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      signup
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}