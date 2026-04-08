import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { Send, CheckCircle, AlertCircle, Mail, User, MessageSquare, Info } from 'lucide-react'
import { useData } from '../App.jsx'
import toast from 'react-hot-toast'

/* ─────────────────────────────────────────────
   REPLACE these three values with your own
   from https://dashboard.emailjs.com
───────────────────────────────────────────── */
const EMAILJS_SERVICE_ID  = 'service_e7fgwcr'
const EMAILJS_TEMPLATE_ID = 'template_xkjnttn'
const EMAILJS_PUBLIC_KEY  = 'sJwMGQfJFuKSbZYmd'
/* ─────────────────────────────────────────────*/

const EMPTY = { name: '', reply_to: '', message: '' }
const HISTORY_KEY = 'crm_email_history'

function getNow() {
  return new Date().toLocaleString('en-GB', {
    weekday: 'short', year: 'numeric', month: 'short',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function Email() {
  const formRef = useRef(null)
  const { incrementMessages } = useData()

  const [form, setForm]     = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [errMsg, setErrMsg] = useState('')

  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [] } catch { return [] }
  })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim())     e.name     = 'Client name is required'
    if (!form.reply_to.trim()) e.reply_to = 'Client email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.reply_to)) e.reply_to = 'Invalid email address'
    if (!form.message.trim())  e.message  = 'Message is required'
    else if (form.message.trim().length < 10) e.message = 'Message is too short'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStatus('loading')
    setErrMsg('')

    // Auto-fill the hidden {{time}} field right before sending
    const timeInput = formRef.current.querySelector('[name="time"]')
    if (timeInput) timeInput.value = getNow()

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      )
      setStatus('success')
      incrementMessages()
      toast.success('Email sent successfully!')

      const entry = { ...form, sentAt: getNow() }
      const updated = [entry, ...history].slice(0, 10)
      setHistory(updated)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
      setForm(EMPTY)
    } catch (err) {
      setStatus('error')
      const msg = err?.text || err?.message || 'Failed to send. Check your EmailJS credentials.'
      setErrMsg(msg)
      toast.error('Email failed to send')
    }
  }

  const isDemo = EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID'

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Email & Contact</h1>
        <p className="text-white/30 text-sm mt-1">Send emails to clients via EmailJS</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="card lg:col-span-3"
        >
          {isDemo && (
            <div className="flex gap-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 mb-5 text-amber-400 text-xs">
              <Info size={15} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-0.5">EmailJS not configured yet</p>
                <p className="opacity-70">
                  Replace <code className="bg-white/10 px-1 rounded">YOUR_SERVICE_ID</code>,{' '}
                  <code className="bg-white/10 px-1 rounded">YOUR_TEMPLATE_ID</code>, and{' '}
                  <code className="bg-white/10 px-1 rounded">YOUR_PUBLIC_KEY</code> at the top of{' '}
                  <code className="bg-white/10 px-1 rounded">Email.jsx</code>
                </p>
              </div>
            </div>
          )}

          <h2 className="text-white font-semibold text-sm mb-5 flex items-center gap-2">
            <Mail size={16} className="text-brand-400" />
            Compose Message
          </h2>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Hidden field — maps to {{time}} in the EmailJS template, auto-set on submit */}
            <input type="hidden" name="time" />

            {/* Maps to {{name}} in template */}
            <div>
              <label className="label">Client Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  name="name"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Sarah Johnson"
                  className={`input-field pl-10 ${errors.name ? 'border-red-500/50' : ''}`}
                />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* reply_to sets the Reply-To email header in EmailJS */}
            <div>
              <label className="label">Client Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  name="reply_to"
                  type="email"
                  value={form.reply_to}
                  onChange={set('reply_to')}
                  placeholder="client@email.com"
                  className={`input-field pl-10 ${errors.reply_to ? 'border-red-500/50' : ''}`}
                />
              </div>
              {errors.reply_to && <p className="text-red-400 text-xs mt-1">{errors.reply_to}</p>}
            </div>

            {/* Maps to {{message}} in template */}
            <div>
              <label className="label">Message</label>
              <div className="relative">
                <MessageSquare size={15} className="absolute left-3.5 top-3.5 text-white/20" />
                <textarea
                  name="message"
                  value={form.message}
                  onChange={set('message')}
                  placeholder="Write your message here…"
                  rows={5}
                  className={`input-field pl-10 resize-none ${errors.message ? 'border-red-500/50' : ''}`}
                />
              </div>
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
              <p className="text-white/20 text-xs mt-1 text-right">{form.message.length} chars</p>
            </div>

            {status === 'success' && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 text-emerald-400 text-sm">
                <CheckCircle size={16} />
                Email sent successfully!
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 text-red-400 text-sm">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{errMsg}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-primary w-full justify-center py-3"
            >
              {status === 'loading' ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending…
                </span>
              ) : (
                <><Send size={15} /> Send Email</>
              )}
            </button>
          </form>
        </motion.div>

        {/* ── Sidebar ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Template Variables Reference */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="card">
            <h3 className="text-white text-sm font-semibold mb-3">Template Variables</h3>
            <div className="space-y-1">
              {[
                { variable: '{{name}}',    source: 'Client Name field' },
                { variable: '{{time}}',    source: 'Auto-filled on send' },
                { variable: '{{message}}', source: 'Message field' },
              ].map(({ variable, source }) => (
                <div key={variable} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <code className="text-brand-400 text-xs bg-brand-500/10 px-2 py-0.5 rounded font-mono">{variable}</code>
                  <span className="text-white/30 text-xs">{source}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Setup Guide */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card">
            <h3 className="text-white text-sm font-semibold mb-3">EmailJS Setup</h3>
            <ol className="space-y-2.5 text-xs text-white/40">
              {[
                'Go to dashboard.emailjs.com',
                'Create a free account',
                'Add an Email Service (Gmail, Outlook…)',
                'Create a Template — paste your HTML',
                'Ensure template uses {{name}}, {{time}}, {{message}}',
                'Copy Service ID, Template ID & Public Key',
                'Paste them at the top of Email.jsx',
              ].map((step, i) => (
                <li key={i} className="flex gap-2.5 items-start">
                  <span className="w-4 h-4 rounded-full bg-brand-500/20 text-brand-400 text-[10px] flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Sent History */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="card">
            <h3 className="text-white text-sm font-semibold mb-3">Recent Sent</h3>
            {history.length === 0 ? (
              <p className="text-white/20 text-xs">No emails sent yet</p>
            ) : (
              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {history.map((h, i) => (
                  <div key={i} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                    <p className="text-white/70 text-xs font-medium">{h.name}</p>
                    <p className="text-white/30 text-xs truncate">{h.reply_to}</p>
                    <p className="text-white/20 text-xs mt-0.5">{h.sentAt}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  )
}
