'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageCircle, Sparkles, Cog, HelpCircle, Bug, Coffee, Plus, Pin, Lock, Clock, User, MessageSquare, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import LoginModal from '@/components/LoginModal'

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  MessageCircle, Sparkles, Cog, HelpCircle, Bug, Coffee,
}

interface Category { id: string; name: string; slug: string; description: string; icon: string; sort_order: number }
interface Thread {
  id: string; title: string; content: string; author_id: string; category_id: string
  is_pinned: boolean; is_locked: boolean; reply_count: number
  created_at: string; updated_at: string
  profiles: { mc_nickname: string } | null
}

const supabase = createClient()

export default function ForumPage() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [threads, setThreads] = useState<Thread[]>([])
  const [selectedCat, setSelectedCat] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadCats = useCallback(async () => {
    const { data } = await supabase.from('forum_categories').select('*').order('sort_order')
    if (data) setCategories(data)
  }, [supabase])

  const loadThreads = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('forum_threads').select('*, profiles(mc_nickname)').order('is_pinned', { ascending: false }).order('updated_at', { ascending: false })
    if (selectedCat) q = q.eq('category_id', selectedCat)
    const { data } = await q.limit(50)
    if (data) setThreads(data as Thread[])
    setLoading(false)
  }, [supabase, selectedCat])

  useEffect(() => { loadCats() }, [loadCats])
  useEffect(() => { loadThreads() }, [loadThreads])

  const submitThread = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !selectedCat) return
    setSubmitting(true)
    await supabase.from('forum_threads').insert({ title: newTitle, content: newContent, author_id: user.id, category_id: selectedCat })
    setNewTitle(''); setNewContent(''); setShowNew(false); setSubmitting(false)
    await loadThreads()
  }

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const selCatName = categories.find(c => c.id === selectedCat)?.name

  return (
    <div className="mc-bg min-h-screen">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-mc-primary text-shadow mb-2">Forum</h1>
          <p className="text-dark-300">Ask questions, share knowledge, and discuss with the community.</p>
        </motion.div>

        {/* Categories Grid */}
        {!selectedCat ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, i) => {
              const Icon = iconMap[cat.icon] || MessageCircle
              return (
                <motion.button key={cat.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  onClick={() => setSelectedCat(cat.id)}
                  className="solid-card p-5 text-left group">
                  <div className="w-12 h-12 border-4 border-dark-950 shadow-[4px_4px_0_#06080b] bg-dark-800 flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform">
                    <Icon size={24} className="text-mc-primary text-shadow" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-white mb-1">{cat.name}</h3>
                  <p className="text-dark-300 text-sm line-clamp-2">{cat.description}</p>
                </motion.button>
              )
            })}
          </div>
        ) : (
          <>
            {/* Thread List View */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setSelectedCat(null)} className="btn-ghost text-sm px-3 py-1.5">All Categories</button>
                <span className="text-dark-400">/</span>
                <span className="text-white font-medium">{selCatName}</span>
              </div>
              <button onClick={() => user ? setShowNew(!showNew) : setShowLogin(true)} className="btn-primary flex items-center gap-2 text-sm">
                <Plus size={16} /> New Thread
              </button>
            </div>

            {showNew && (
              <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={submitThread} className="solid-card p-6 mb-6 space-y-4">
                <h3 className="font-heading font-bold text-lg text-white">New Thread</h3>
                <input type="text" placeholder="Thread title" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="input-mc" required maxLength={150} />
                <textarea placeholder="Write your message..." value={newContent} onChange={e => setNewContent(e.target.value)} className="input-mc min-h-[120px] resize-y" required />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowNew(false)} className="btn-ghost text-sm px-4 py-2">Cancel</button>
                  <button type="submit" disabled={submitting} className="btn-primary text-sm px-6 py-2 flex items-center gap-2 disabled:opacity-50">
                    {submitting && <Loader2 size={14} className="animate-spin" />} Post Thread
                  </button>
                </div>
              </motion.form>
            )}

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-mc-primary" /></div>
            ) : threads.length === 0 ? (
              <div className="text-center py-20">
                <MessageSquare size={48} className="mx-auto mb-4 text-dark-400" />
                <p className="text-dark-300 text-lg">No threads yet</p>
                <p className="text-dark-400 text-sm">Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {threads.map((t, i) => (
                  <motion.div key={t.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <Link href={`/community/forum/${t.id}`} className="solid-card p-4 flex items-start gap-4 block hover:-translate-y-1 transition-transform">
                      <div className="flex flex-col items-center shrink-0 pt-1">
                        <MessageSquare size={18} className="text-dark-400" />
                        <span className="text-xs text-dark-400 font-bold mt-1">{t.reply_count}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {t.is_pinned && <Pin size={14} className="text-mc-brass" />}
                          {t.is_locked && <Lock size={14} className="text-dark-400" />}
                          <h3 className="font-heading font-bold text-sm text-white truncate">{t.title}</h3>
                        </div>
                        <p className="text-dark-300 text-xs line-clamp-1 mb-2">{t.content}</p>
                        <div className="flex items-center gap-3 text-xs text-dark-400">
                          <span className="flex items-center gap-1"><User size={11} />{t.profiles?.mc_nickname ?? 'Unknown'}</span>
                          <span className="flex items-center gap-1"><Clock size={11} />{fmtDate(t.created_at)}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  )
}
