import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, MapPin, Tag, X } from 'lucide-react'
import { useData } from '../App.jsx'
import Modal from '../components/Modal.jsx'
import toast from 'react-hot-toast'

const TYPES = ['Apartment', 'Villa', 'Penthouse', 'Studio', 'Office', 'Land', 'Townhouse']
const EMPTY = { title: '', price: '', location: '', type: 'Apartment', image: '' }

const TYPE_COLOR = {
  Apartment: 'bg-blue-500/15 text-blue-400',
  Villa:     'bg-brand-500/15 text-brand-400',
  Penthouse: 'bg-purple-500/15 text-purple-400',
  Studio:    'bg-pink-500/15 text-pink-400',
  Office:    'bg-amber-500/15 text-amber-400',
  Land:      'bg-emerald-500/15 text-emerald-400',
  Townhouse: 'bg-teal-500/15 text-teal-400',
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'

export default function Properties() {
  const { properties, saveProperties } = useData()
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId]   = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [errors, setErrors]       = useState({})
  const [search, setSearch]       = useState('')
  const [typeFilter, setTypeFilter] = useState('All')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Required'
    if (!form.price || isNaN(Number(form.price))) e.price = 'Enter a valid price'
    if (!form.location.trim()) e.location = 'Required'
    return e
  }

  const handleSave = () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const newProp = {
      ...form,
      price: Number(form.price),
      id: Date.now(),
      listed: new Date().toISOString().slice(0, 10),
      image: form.image || PLACEHOLDER,
    }
    saveProperties([...properties, newProp])
    toast.success('Property added')
    setModalOpen(false)
    setForm(EMPTY)
  }

  const handleDelete = (id) => {
    saveProperties(properties.filter(p => p.id !== id))
    toast.success('Property removed')
    setDeleteId(null)
  }

  const filtered = properties.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All' || p.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="space-y-5 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Properties</h1>
          <p className="text-white/30 text-sm mt-1">{properties.length} listings</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setErrors({}); setModalOpen(true) }} className="btn-primary">
          <Plus size={16} /> Add Property
        </button>
      </motion.div>

      {/* Search + Filter */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="card flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title or location…"
          className="input-field flex-1"
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input-field min-w-[150px]">
          <option value="All">All Types</option>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center py-20 text-white/20 text-sm">
              No properties found
            </motion.div>
          ) : (
            filtered.map((prop, i) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ delay: i * 0.06 }}
                layout
                className="card p-0 overflow-hidden group cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={e => { e.target.src = PLACEHOLDER }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
                  <button
                    onClick={() => setDeleteId(prop.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm text-white/50 hover:text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                  <span className={`absolute bottom-3 left-3 badge ${TYPE_COLOR[prop.type] || 'bg-white/10 text-white/60'}`}>
                    {prop.type}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{prop.title}</h3>
                  <div className="flex items-center gap-1 text-white/30 text-xs mb-3">
                    <MapPin size={11} />
                    <span className="truncate">{prop.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-brand-400 font-bold text-base">
                      EGP {prop.price.toLocaleString()}
                    </p>
                    <p className="text-white/20 text-xs">{prop.listed}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add New Property">
        <div className="space-y-4">
          <div>
            <label className="label">Property Title</label>
            <input value={form.title} onChange={set('title')} placeholder="Luxury Villa — New Cairo" className={`input-field ${errors.title ? 'border-red-500/50' : ''}`} />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price (EGP)</label>
              <input value={form.price} onChange={set('price')} placeholder="5000000" type="number" className={`input-field ${errors.price ? 'border-red-500/50' : ''}`} />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="label">Type</label>
              <select value={form.type} onChange={set('type')} className="input-field">
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Location</label>
            <input value={form.location} onChange={set('location')} placeholder="New Cairo, Egypt" className={`input-field ${errors.location ? 'border-red-500/50' : ''}`} />
            {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
          </div>
          <div>
            <label className="label">Image URL (optional)</label>
            <input value={form.image} onChange={set('image')} placeholder="https://…" className="input-field" />
            <p className="text-white/20 text-xs mt-1">Leave blank to use a default image</p>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={() => setModalOpen(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
            <button onClick={handleSave} className="btn-primary flex-1 justify-center">Add Property</button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Remove Property" size="sm">
        <p className="text-white/50 text-sm mb-5">Remove this property listing? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1 justify-center">Cancel</button>
          <button onClick={() => handleDelete(deleteId)} className="btn-primary flex-1 justify-center bg-red-500 hover:bg-red-600">Remove</button>
        </div>
      </Modal>
    </div>
  )
}
