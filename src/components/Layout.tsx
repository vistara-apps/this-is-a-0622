import React, { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Music, 
  Search, 
  FileCheck, 
  Shield, 
  Library,
  Settings,
  User,
  Bell
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const { user } = useAuth()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Music },
    { name: 'Identify', href: '/identify', icon: Search },
    { name: 'Clearance', href: '/clearance', icon: FileCheck },
    { name: 'DMCA', href: '/dmca', icon: Shield },
    { name: 'Library', href: '/library', icon: Library },
  ]

  return (
    <div className="min-h-screen bg-bg">
      {/* Navigation */}
      <nav className="bg-surface/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-text-primary">SampleFlow</span>
              </Link>
              
              <div className="hidden md:flex space-x-6">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/20 text-primary'
                          : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-text-primary hidden sm:block">
                  {user?.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}