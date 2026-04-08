import React, { useState, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Leads from './pages/Leads.jsx'
import Properties from './pages/Properties.jsx'
import Email from './pages/Email.jsx'
import Layout from './components/Layout.jsx'

export const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export const DataContext = createContext(null)
export const useData = () => useContext(DataContext)

const DEMO_LEADS = [
  { id: 1, name: 'Sarah Johnson', phone: '+20 100 123 4567', email: 'sarah@example.com', budget: 850000, type: 'Villa', status: 'New', date: '2026-04-01' },
  { id: 2, name: 'Ahmed Hassan', phone: '+20 112 987 6543', email: 'ahmed@example.com', budget: 450000, type: 'Apartment', status: 'Contacted', date: '2026-03-28' },
  { id: 3, name: 'Mona Khalil', phone: '+20 101 555 7890', email: 'mona@example.com', budget: 1200000, type: 'Penthouse', status: 'Closed', date: '2026-03-20' },
  { id: 4, name: 'Omar Farouk', phone: '+20 115 222 3344', email: 'omar@example.com', budget: 320000, type: 'Studio', status: 'New', date: '2026-04-05' },
]

const DEMO_PROPERTIES = [
  { id: 1, title: 'Luxury Villa — New Cairo', price: 9500000, location: 'New Cairo, Egypt', type: 'Villa', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', listed: '2026-03-15' },
  { id: 2, title: 'Modern Apartment — Zamalek', price: 3200000, location: 'Zamalek, Cairo', type: 'Apartment', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', listed: '2026-03-22' },
  { id: 3, title: 'Sea View Penthouse', price: 14500000, location: 'North Coast, Egypt', type: 'Penthouse', image: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800&q=80', listed: '2026-04-01' },
  { id: 4, title: 'Cozy Studio — Maadi', price: 1100000, location: 'Maadi, Cairo', type: 'Studio', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', listed: '2026-04-03' },
]

function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('crm_auth') === 'true'
  })

  const [leads, setLeads] = useState(() => {
    try { return JSON.parse(localStorage.getItem('crm_leads')) || DEMO_LEADS } catch { return DEMO_LEADS }
  })

  const [properties, setProperties] = useState(() => {
    try { return JSON.parse(localStorage.getItem('crm_properties')) || DEMO_PROPERTIES } catch { return DEMO_PROPERTIES }
  })

  const [messagesSent, setMessagesSent] = useState(() => {
    return parseInt(localStorage.getItem('crm_messages') || '0')
  })

  const login = () => {
    localStorage.setItem('crm_auth', 'true')
    setIsLoggedIn(true)
  }

  const logout = () => {
    localStorage.removeItem('crm_auth')
    setIsLoggedIn(false)
  }

  const saveLeads = (data) => {
    setLeads(data)
    localStorage.setItem('crm_leads', JSON.stringify(data))
  }

  const saveProperties = (data) => {
    setProperties(data)
    localStorage.setItem('crm_properties', JSON.stringify(data))
  }

  const incrementMessages = () => {
    const next = messagesSent + 1
    setMessagesSent(next)
    localStorage.setItem('crm_messages', String(next))
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      <DataContext.Provider value={{ leads, saveLeads, properties, saveProperties, messagesSent, incrementMessages }}>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#1a1a27', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '14px' },
              success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
            }}
          />
          <Routes>
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="leads" element={<Leads />} />
              <Route path="properties" element={<Properties />} />
              <Route path="email" element={<Email />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataContext.Provider>
    </AuthContext.Provider>
  )
}
