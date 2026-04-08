import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Pencil, Trash2, Filter } from 'lucide-react'
import { useData } from '../App.jsx'
import Modal from '../components/Modal.jsx'
import Table from '../components/Table.jsx'
import toast from 'react-hot-toast'

const STATUSES  = ['New', 'Contacted', 'Closed']
const TYPES     = ['Apartment', 'Villa', 'Penthouse', 'Studio', 'Office', 'Land']

const STATUS_STYLE = {
  New:       'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  Contacted: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  Closed:    'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
}

const EMPTY = { name: '', phone: '', email: '', budget: '', type: 'Apartment', status: 'New' }

export default function Leads() {
  const { leads, saveLeads } = useData()
  const [modalOpen, setModalOpen]   = useState(false)
  const [deleteId, setDeleteId]     = useState(null)
  const [editing, setEditing]       = useState(null)
  const [form, setForm]             = useState(EMPTY)
  const [errors, setErrors]         = useState({})
  const [search, setSearch]         = useState('')
  const [filterStatus, setFilter]   = useState('All')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.phone.trim()) e.phone = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.budget || isNaN(Number(form.budget))) e.budget = 'Enter a valid number'
    return e
  }

  const openAdd = () => { setEditing(null); setForm(EMPTY); setErrors({}); setModalOpen(true) }
  const openEdit = (lead) => { setEditing(lead.id); setForm({ ...lead, budget: String(lead.budget) }); setErrors({}); setModalOpen(true) }

  const handleSave = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    if (editing) {
      saveLeads(leads.map(l => l.id === editing ? { ...l, ...form, budget: Number(form.budget) } : l))
      toast.success('Lead updated')
    } else {
      const newLead = { ...form, budget: Number(form.budget), id: Date.now(), date: new Date().toISOString().slice(0, 10) }
      saveLeads([...leads, newLead])
      toast.success('Lead added')
    }
    setModalOpen(false)
  }

  const handleDelete = (id) => {
    saveLeads(leads.filter(l => l.id !== id))
    toast.success('Lead deleted')
    setDeleteId(null)
  }

  const filtered = useMemo(() => {
    return leads.filter(l => {
      const matchSearch = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase())
      const matchStatus = filterStatus === 'All' || l.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [leads, search, filterStatus])

  const columns = [
    { key: 'name',   label: 'Name',   render: (v, row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 text-xs font-bold flex-shrink-0">
          {v.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-white text-sm font-medium">{v}</p>
          <p className="text-white/30 text-xs">{row.email}</p>
        </div>
      </div>
    )},
    { key: 'phone',  label: 'Phone',  render: v => <span className="text-white/50 text-sm">{v}</span> },
    { key: 'budget', label: 'Budget', render: v => <span className="text-white/70 text-sm">EGP {Number(v).toLocaleString()}</span> },
    { key: 'type',   label: 'Type',   render: v => <span className="text-white/50 text-sm">{v}</span> },
    { key: 'status', label: 'Status', render: v => <span className={`badge ${STATUS_STYLE[v]}`}>{v}</span> },
    { key: 'id',     label: 'Actions', render: (_, row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg text-white/30 hover:text-brand-400 hover:bg-brand-500/10 transition-colors">
          <Pencil size={14} />
        </button>
        <button onClick={() => setDeleteId(row.id)} className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    )},
  ]

  return (
    <div className="space-y-5 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Leads</h1>
          <p className="text-white/30 text-sm mt-1">{leads.length} leads total</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add Lead
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="card flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="input-field pl-10"
          />
        </div>
        <div className="relative">
          <Filter size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
          <select value={filterStatus} onChange={e => setFilter(e.target.value)} className="input-field pl-10 pr-8 min-w-[140px]">
            <option value="All">All Statuses</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </motion.div>

      {/* Status summary pills */}
      <div className="flex gap-3 flex-wrap">
        {['All', ...STATUSES].map(s => {
          const count = s === 'All' ? leads.length : leads.filter(l => l.status === s).length
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${filterStatus === s ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/8'}`}
            >
              {s} <span className="opacity-60 ml-1">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card">
        <Table columns={columns} data={filtered} emptyMessage="No leads match your search" />
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Lead' : 'Add New Lead'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input value={form.name} onChange={set('name')} placeholder="Sarah Johnson" className={`input-field ${errors.name ? 'border-red-500/50' : ''}`} />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="label">Phone</label>
              <input value={form.phone} onChange={set('phone')} placeholder="+20 100 000 0000" className={`input-field ${errors.phone ? 'border-red-500/50' : ''}`} />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input value={form.email} onChange={set('email')} placeholder="client@email.com" className={`input-field ${errors.email ? 'border-red-500/50' : ''}`} />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Budget (EGP)</label>
              <input value={form.budget} onChange={set('budget')} placeholder="500000" type="number" className={`input-field ${errors.budget ? 'border-red-500/50' : ''}`} />
              {errors.budget && <p className="text-red-400 text-xs mt-1">{errors.budget}</p>}
            </div>
            <div>
              <label className="label">Property Type</label>
              <select value={form.type} onChange={set('type')} className="input-field">
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Status</label>
            <select value={form.status} onChange={set('status')} className="input-field">
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
            <button onClick={handleSave} className="btn-primary flex-1 justify-center">{editing ? 'Save Changes' : 'Add Lead'}</button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Lead" size="sm">
        <p className="text-white/50 text-sm mb-5">Are you sure you want to delete this lead? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1 justify-center">Cancel</button>
          <button onClick={() => handleDelete(deleteId)} className="btn-primary flex-1 justify-center bg-red-500 hover:bg-red-600">Delete</button>
        </div>
      </Modal>
    </div>
  )
}
