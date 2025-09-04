import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SubscriptionProvider } from './contexts/SubscriptionContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import SampleIdentification from './pages/SampleIdentification'
import ClearanceProcess from './pages/ClearanceProcess'
import DMCAProtection from './pages/DMCAProtection'
import SampleLibrary from './pages/SampleLibrary'
import Pricing from './pages/Pricing'

function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/identify" element={<SampleIdentification />} />
            <Route path="/clearance" element={<ClearanceProcess />} />
            <Route path="/dmca" element={<DMCAProtection />} />
            <Route path="/library" element={<SampleLibrary />} />
            <Route path="/pricing" element={<Pricing />} />
          </Routes>
        </Layout>
      </SubscriptionProvider>
    </AuthProvider>
  )
}

export default App
