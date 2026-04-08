import React from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Bell, Search } from 'lucide-react'

const TITLES = {
  '/':           'Dashboard',
  '/leads':      'Leads Management',
  '/properties': 'Properties',
  '/email':      'Email & Contact',
}

export default function Navbar({ onMenuClick }) {
  const { pathname } = useLocation()
  const title = TITLES[pathname] || 'CRM'

  return (
    <header className="flex items-center justify-between px-4 md:px-6 lg:px-8 h-16 border-b border-white/5 bg-dark-900/80 backdrop-blur-xl flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-white font-semibold text-base md:text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="text-white/40 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors">
          <Search size={18} />
        </button>
        <button className="relative text-white/40 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 text-xs font-bold ml-1">
          BA
        </div>
      </div>
    </header>
  )
}
