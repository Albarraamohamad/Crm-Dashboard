import React from 'react'
import { motion } from 'framer-motion'

export function StatCard({ icon: Icon, label, value, trend, color = 'brand', delay = 0 }) {
  const colors = {
    brand:  { bg: 'bg-brand-500/10',  border: 'border-brand-500/20',  text: 'text-brand-400',  icon: 'bg-brand-500/15' },
    blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   text: 'text-blue-400',   icon: 'bg-blue-500/15' },
    green:  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: 'bg-emerald-500/15' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', icon: 'bg-purple-500/15' },
  }
  const c = colors[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`card ${c.bg} border ${c.border}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend && <p className="text-xs text-white/30 mt-1">{trend}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl ${c.icon} flex items-center justify-center`}>
          <Icon size={20} className={c.text} />
        </div>
      </div>
    </motion.div>
  )
}

export default function Card({ children, className = '', delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={`card ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
