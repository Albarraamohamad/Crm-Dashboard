import React from 'react'
import { motion } from 'framer-motion'
import { Users, Building2, Mail, TrendingUp, Clock, CheckCircle, Phone, Star } from 'lucide-react'
import { StatCard } from '../components/Card.jsx'
import { useData } from '../App.jsx'

const STATUS_COLOR = {
  New:       'bg-blue-500/15 text-blue-400 border-blue-500/20',
  Contacted: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Closed:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
}

export default function Dashboard() {
  const { leads, properties, messagesSent } = useData()
  const activeClients = leads.filter(l => l.status !== 'Closed').length

  const recent = [...leads].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  const activity = [
    { icon: Users,        text: `New lead: ${leads[leads.length - 1]?.name || '—'}`,     time: 'Just now',    color: 'text-blue-400' },
    { icon: Building2,    text: `Property added: ${properties[properties.length - 1]?.title || '—'}`, time: '2h ago', color: 'text-brand-400' },
    { icon: Mail,         text: 'Email campaign sent to 12 clients',                     time: '5h ago',      color: 'text-purple-400' },
    { icon: CheckCircle,  text: 'Lead Mona Khalil marked as Closed',                     time: '1d ago',      color: 'text-emerald-400' },
    { icon: Phone,        text: 'Follow-up call scheduled with Ahmed Hassan',            time: '2d ago',      color: 'text-amber-400' },
  ]

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <h1 className="page-title">Good morning, Barraa 👋</h1>
        <p className="text-white/30 text-sm mt-1">Here's what's happening with your business today.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}     label="Total Leads"       value={leads.length}     trend={`+${Math.ceil(leads.length * 0.12)} this month`} color="blue"   delay={0} />
        <StatCard icon={Star}      label="Active Clients"    value={activeClients}    trend="Currently in pipeline"                            color="brand"  delay={0.05} />
        <StatCard icon={Building2} label="Properties Listed" value={properties.length} trend="Across all locations"                           color="purple" delay={0.1} />
        <StatCard icon={Mail}      label="Messages Sent"     value={messagesSent}     trend="Via EmailJS"                                      color="green"  delay={0.15} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
          className="card lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold text-sm">Recent Leads</h2>
            <span className="text-white/20 text-xs">{leads.length} total</span>
          </div>
          <div className="space-y-3">
            {recent.map((lead, i) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 text-xs font-bold">
                    {lead.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{lead.name}</p>
                    <p className="text-white/30 text-xs">{lead.type} · EGP {lead.budget.toLocaleString()}</p>
                  </div>
                </div>
                <span className={`badge border ${STATUS_COLOR[lead.status]}`}>
                  {lead.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}
          className="card"
        >
          <div className="flex items-center gap-2 mb-5">
            <Clock size={15} className="text-white/30" />
            <h2 className="text-white font-semibold text-sm">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {activity.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex gap-3 items-start"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon size={13} className={item.color} />
                </div>
                <div>
                  <p className="text-white/70 text-xs leading-snug">{item.text}</p>
                  <p className="text-white/20 text-xs mt-0.5">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}
        className="card bg-gradient-to-r from-brand-500/10 via-purple-500/5 to-dark-800/50 border border-brand-500/10"
      >
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <div>
            <p className="text-white/30 text-xs mb-1">Conversion Rate</p>
            <p className="text-white font-bold text-xl">
              {leads.length ? Math.round((leads.filter(l => l.status === 'Closed').length / leads.length) * 100) : 0}%
            </p>
          </div>
          <div>
            <p className="text-white/30 text-xs mb-1">Avg. Budget</p>
            <p className="text-white font-bold text-xl">
              EGP {leads.length ? Math.round(leads.reduce((s, l) => s + l.budget, 0) / leads.length).toLocaleString() : 0}
            </p>
          </div>
          <div>
            <p className="text-white/30 text-xs mb-1">Top Property Type</p>
            <p className="text-white font-bold text-xl">Apartment</p>
          </div>
          <div>
            <p className="text-white/30 text-xs mb-1">New This Week</p>
            <p className="text-white font-bold text-xl">{leads.filter(l => l.status === 'New').length}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <p className="text-emerald-400 text-sm font-medium">System Active</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
