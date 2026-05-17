'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, ChevronUp, ChevronDown, Filter, Clock, User, Loader2, X, Lightbulb, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import LoginModal from '@/components/LoginModal'

interface Suggestion {
  id: string; title: string; content: string; author_id: string
  status: 'pending' | 'planned' | 'implemented' | 'rejected'
  vote_count: number; created_at: string
  profiles: { mc_nickname: string } | null
}

const statusFilters = [
  { value: 'all', label: 'All' }, { value: 'pending', label: 'Pending' },
  { value: 'planned', label: 'Planned' }, { value: 'implemented', label: 'Implemented' },
]

const badgeClass: Record<string, string> = {
  pending: 'badge-pending', planned: 'badge-planned',
  implemented: 'badge-implemented', rejected: 'badge-rejected',
}

const supabase = createClient()

export default function SuggestionsPage() {
  const { user, profile } = useAuth()
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [userVotes, setUserVotes] = useState<{ suggestion_id: string; vote_type: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('suggestions').select('*, profiles(mc_nickname)').order('vote_count', { ascending: false })
    if (data) setSuggestions(data as Suggestion[])
    setLoading(false)
  }, [])

  const loadVotes = useCallback(async () => {
    if (!user) return
    const { data } = await supabase.from('votes').select('suggestion_id, vote_type').eq('user_id', user.id)
    if (data) setUserVotes(data)
  }, [user])

  useEffect(() => { load() }, [load])
  useEffect(() => { loadVotes() }, [loadVotes])

  const vote = async (sid: string, type: 'up' | 'down') => {
    if (!user) { setShowLogin(true); return }
    const existing = userVotes.find(v => v.suggestion_id === sid)
    if (existing) {
      if (existing.vote_type === type) {
        await supabase.from('votes').delete().eq('user_id', user.id).eq('suggestion_id', sid)
      } else {
        await supabase.from('votes').update({ vote_type: type }).eq('user_id', user.id).eq('suggestion_id', sid)
      }
    } else {
      await supabase.from('votes').insert({ user_id: user.id, suggestion_id: sid, vote_type: type })
    }
    loadVotes()
    load()
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { setShowLogin(true); return }
    setSubmitting(true)
    const { error } = await supabase.from('suggestions').insert({ title, content, author_id: user.id, status: 'pending' })
    if (error) {
      alert(`Gagal mengirim saran: ${error.message}`)
      console.error(error)
      setSubmitting(false)
      return
    }
    setTitle(''); setContent(''); setShowForm(false); setSubmitting(false); load()
  }

  const deleteSuggestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this suggestion?')) return
    await supabase.from('suggestions').delete().eq('id', id)
    load()
  }

  const filtered = suggestions.filter(s => {
    const ms = s.title.toLowerCase().includes(search.toLowerCase()) || s.content.toLowerCase().includes(search.toLowerCase())
    return ms && (filter === 'all' || s.status === filter)
  })

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="mc-bg min-h-screen">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-mc-primary text-shadow mb-2">Suggestions</h1>
              <p className="text-dark-300">Share your ideas and vote on features you want to see.</p>
            </div>
            <button onClick={() => user ? setShowForm(true) : setShowLogin(true)} className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={18} /> New Suggestion
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
            <input type="text" placeholder="Search suggestions..." value={search} onChange={e => setSearch(e.target.value)} className="input-mc pl-icon" />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter size={16} className="text-dark-400 shrink-0" />
            {statusFilters.map(f => (
              <button key={f.value} onClick={() => setFilter(f.value)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${filter === f.value ? 'bg-mc-primary text-white border-dark-950 shadow-[2px_2px_0_#06080b]' : 'solid-card text-dark-300 hover:text-white'}`}>{f.label}</button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-6">
              <form onSubmit={submit} className="solid-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-semibold text-lg text-white">New Suggestion</h3>
                  <button type="button" onClick={() => setShowForm(false)} className="p-1 text-dark-300 hover:text-white"><X size={18} /></button>
                </div>
                <div className="space-y-4">
                  <input type="text" placeholder="Suggestion title" value={title} onChange={e => setTitle(e.target.value)} className="input-mc" required maxLength={100} />
                  <textarea placeholder="Describe your idea..." value={content} onChange={e => setContent(e.target.value)} className="input-mc min-h-[120px] resize-y" required maxLength={2000} />
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm px-4 py-2">Cancel</button>
                    <button type="submit" disabled={submitting || !title.trim() || !content.trim()} className="btn-primary text-sm px-6 py-2 flex items-center gap-2 disabled:opacity-50">
                      {submitting && <Loader2 size={14} className="animate-spin" />} Submit
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-mc-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Lightbulb size={48} className="mx-auto mb-4 text-dark-400" />
            <p className="text-dark-300 text-lg mb-2">No suggestions found</p>
            <p className="text-dark-400 text-sm">{search || filter !== 'all' ? 'Try adjusting your filters' : 'Be the first to share an idea!'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((s, i) => {
              const uv = userVotes.find(v => v.suggestion_id === s.id)
              return <SuggestionCard key={s.id} s={s} i={i} uv={uv} vote={vote} isAdmin={profile?.role === 'admin'} onDelete={() => deleteSuggestion(s.id)} />
            })}
          </div>
        )}

        {!user && (
          <div className="mt-8 solid-panel p-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-mc-brass shrink-0 mt-0.5" />
            <p className="text-sm text-dark-300 font-bold">
              <button onClick={() => setShowLogin(true)} className="text-mc-primary font-bold hover:underline">Log in</button> to submit suggestions and vote.
            </p>
          </div>
        )}
      </div>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  )
}

function SuggestionCard({ s, i, uv, vote, isAdmin, onDelete }: { s: Suggestion, i: number, uv: { vote_type: string } | undefined, vote: (id: string, type: 'up'|'down') => void, isAdmin?: boolean, onDelete?: () => void }) {
  const [expanded, setExpanded] = useState(false)
  
  // Check if content is long enough to need expansion (roughly 150 chars)
  const isLong = s.content.length > 150

  const badgeClass: Record<string, string> = {
    pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    planned: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    completed: 'bg-green-500/15 text-green-400 border-green-500/30',
    declined: 'bg-red-500/15 text-red-400 border-red-500/30',
  }

  const fmtDate = (d: string) => {
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="solid-card p-4 sm:p-5 flex gap-4">
      <div className="flex flex-col items-center gap-0.5 shrink-0">
        <button onClick={() => vote(s.id, 'up')} className={`p-1 rounded-md transition-all ${uv?.vote_type === 'up' ? 'text-mc-primary bg-mc-primary-dark/15' : 'text-dark-400 hover:text-mc-primary'}`}><ChevronUp size={20} /></button>
        <span className={`text-sm font-bold ${s.vote_count > 0 ? 'text-mc-primary' : s.vote_count < 0 ? 'text-crimson-400' : 'text-dark-300'}`}>{s.vote_count}</span>
        <button onClick={() => vote(s.id, 'down')} className={`p-1 rounded-md transition-all ${uv?.vote_type === 'down' ? 'text-crimson-400 bg-crimson-500/15' : 'text-dark-400 hover:text-crimson-400'}`}><ChevronDown size={20} /></button>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1 flex-wrap">
          <h3 className="font-heading font-semibold text-white text-base">{s.title}</h3>
          <span className={`badge ${badgeClass[s.status]}`}>{s.status}</span>
        </div>
        <div className="mb-3">
          <p className={`text-dark-300 text-sm whitespace-pre-wrap break-words ${!expanded && isLong ? 'line-clamp-2' : ''}`}>
            {s.content}
          </p>
          {isLong && (
            <button onClick={() => setExpanded(!expanded)} className="text-mc-primary text-xs font-bold hover:underline mt-1">
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-dark-400">
          <span className="flex items-center gap-1"><User size={12} />{s.profiles?.mc_nickname ?? 'Unknown'}</span>
          <span className="flex items-center gap-1"><Clock size={12} />{fmtDate(s.created_at)}</span>
          {isAdmin && (
            <button onClick={onDelete} className="ml-auto text-crimson-400 font-bold hover:underline">
              Delete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
