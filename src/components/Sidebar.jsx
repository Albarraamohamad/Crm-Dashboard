import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Building2, Mail,
  X, LogOut, TrendingUp
} from 'lucide-react'
import { useAuth } from '../App.jsx'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/',           label: 'Dashboard',   icon: LayoutDashboard, end: true },
  { to: '/leads',      label: 'Leads',       icon: Users },
  { to: '/properties', label: 'Properties',  icon: Building2 },
  { to: '/email',      label: 'Email',       icon: Mail },
]

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full w-64 glass border-r border-white/5 px-3 py-5">
      {/* Logo */}
      <div className="flex items-center justify-between px-2 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-tight">YourWay</p>
            <p className="text-white/30 text-xs">Real Estate CRM</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white p-1">
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        <p className="text-white/20 text-xs font-semibold uppercase tracking-widest px-3 mb-3">Menu</p>
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/5 pt-4 mt-4">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 text-xs font-bold">
            BA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">Barraa</p>
            <p className="text-white/30 text-xs truncate">Admin</p>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-link w-full text-red-400/70 hover:text-red-400 hover:bg-red-500/5">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed left-0 top-0 h-full z-30 lg:hidden"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
