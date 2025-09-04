import { Link } from 'react-router-dom'
import { 
  Upload, 
  Search, 
  FileCheck, 
  Shield, 
  TrendingUp,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { useSubscription } from '../contexts/SubscriptionContext'

const recentActivity = [
  { id: 1, type: 'identification', track: 'Beat_Final_v2.mp3', status: 'completed', time: '2 hours ago' },
  { id: 2, type: 'clearance', track: 'Remix_Track_01.wav', status: 'pending', time: '1 day ago' },
  { id: 3, type: 'dmca', track: 'Summer_Vibes.mp3', status: 'resolved', time: '3 days ago' },
]

const chartData = [
  { name: 'Jan', searches: 12, clearances: 4 },
  { name: 'Feb', searches: 19, clearances: 7 },
  { name: 'Mar', searches: 25, clearances: 9 },
  { name: 'Apr', searches: 32, clearances: 12 },
  { name: 'May', searches: 41, clearances: 15 },
  { name: 'Jun', searches: 45, clearances: 18 },
]

export default function Dashboard() {
  const { tier, usage } = useSubscription()

  const quickActions = [
    {
      title: 'Identify Samples',
      description: 'Upload a track to identify samples',
      icon: Search,
      href: '/identify',
      color: 'bg-blue-500'
    },
    {
      title: 'Start Clearance',
      description: 'Begin the clearance process',
      icon: FileCheck,
      href: '/clearance',
      color: 'bg-green-500'
    },
    {
      title: 'Handle DMCA',
      description: 'Manage takedown notices',
      icon: Shield,
      href: '/dmca',
      color: 'bg-red-500'
    },
    {
      title: 'Browse Library',
      description: 'Explore pre-cleared samples',
      icon: Upload,
      href: '/library',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-2">
          Welcome back! Here's your sample clearance activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Searches Used</p>
              <p className="text-2xl font-bold text-text-primary">
                {usage.searches}/{usage.maxSearches}
              </p>
            </div>
            <Search className="w-8 h-8 text-primary" />
          </div>
          <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${(usage.searches / usage.maxSearches) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Clearances</p>
              <p className="text-2xl font-bold text-text-primary">{usage.clearances}</p>
            </div>
            <FileCheck className="w-8 h-8 text-accent" />
          </div>
        </div>

        <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Success Rate</p>
              <p className="text-2xl font-bold text-text-primary">94%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Plan</p>
              <p className="text-2xl font-bold text-text-primary capitalize">{tier}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="group bg-surface/50 rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">{action.title}</h3>
              <p className="text-text-secondary text-sm">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Chart */}
        <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Activity Overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Line 
                  type="monotone" 
                  dataKey="searches" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="clearances" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-3 rounded-lg bg-white/5">
                <div className="flex-shrink-0">
                  {item.type === 'identification' && <Search className="w-5 h-5 text-blue-500" />}
                  {item.type === 'clearance' && <FileCheck className="w-5 h-5 text-green-500" />}
                  {item.type === 'dmca' && <Shield className="w-5 h-5 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-medium truncate">{item.track}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-text-secondary text-xs">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
