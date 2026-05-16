'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Shield, MessageSquare, Lightbulb, Trash2, Loader2, RefreshCw } from 'lucide-react'

const supabase = createClient()

type Tab = 'suggestions' | 'forum'

interface Suggestion {
  id: string
  title: string
  content: string
  status: string
  vote_count: number
  created_at: string
  profiles: { mc_nickname: string } | null
}

interface Thread {
  id: string
  title: string
  reply_count: number
  created_at: string
  profiles: { mc_nickname: string } | null
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('suggestions')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    if (activeTab === 'suggestions') {
      const { data } = await supabase
        .from('suggestions')
        .select('*, profiles(mc_nickname)')
        .order('created_at', { ascending: false })
      if (data) setSuggestions(data as Suggestion[])
    } else {
      const { data } = await supabase
        .from('forum_threads')
        .select('*, profiles(mc_nickname)')
        .order('created_at', { ascending: false })
      if (data) setThreads(data as Thread[])
    }
    setLoading(false)
  }, [activeTab])

  useEffect(() => {
    loadData()
  }, [loadData])

  const updateSuggestionStatus = async (id: string, status: string) => {
    await supabase.from('suggestions').update({ status }).eq('id', id)
    loadData()
  }

  const deleteSuggestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this suggestion?')) return
    await supabase.from('suggestions').delete().eq('id', id)
    loadData()
  }

  const deleteThread = async (id: string) => {
    if (!confirm('Are you sure you want to delete this thread and ALL its replies?')) return
    await supabase.from('forum_threads').delete().eq('id', id)
    loadData()
  }

  return (
    <div className="mc-bg min-h-screen pb-20">
      {/* Header */}
      <div className="relative z-10 pt-12 sm:pt-20 pb-12 px-4 text-center border-b-4 border-dark-950 bg-dark-900/50">
        <Shield size={48} className="mx-auto mb-4 text-mc-primary" />
        <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white text-shadow mb-4">
          Admin Dashboard
        </h1>
        <p className="text-dark-300 max-w-2xl mx-auto text-lg font-bold">
          Manage server content, moderate suggestions, and keep the community safe.
        </p>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`flex items-center gap-2 px-6 py-3 font-heading transition-all border-4 ${
                activeTab === 'suggestions'
                  ? 'bg-mc-primary border-dark-950 text-white shadow-[4px_4px_0_#0a0d14]'
                  : 'bg-dark-800 border-transparent text-dark-300 hover:text-white'
              }`}
            >
              <Lightbulb size={20} /> Suggestions
            </button>
            <button
              onClick={() => setActiveTab('forum')}
              className={`flex items-center gap-2 px-6 py-3 font-heading transition-all border-4 ${
                activeTab === 'forum'
                  ? 'bg-mc-primary border-dark-950 text-white shadow-[4px_4px_0_#0a0d14]'
                  : 'bg-dark-800 border-transparent text-dark-300 hover:text-white'
              }`}
            >
              <MessageSquare size={20} /> Forum Threads
            </button>
          </div>
          <button onClick={loadData} className="btn-ghost flex items-center gap-2 text-sm px-4 py-2">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-mc-primary" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {activeTab === 'suggestions' && suggestions.map(s => (
                <div key={s.id} className="solid-panel p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-2 border-dark-950">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-white text-lg truncate">{s.title}</h3>
                    <p className="text-dark-300 text-sm mb-2 truncate">{s.content}</p>
                    <div className="flex items-center gap-3 text-xs text-dark-400 font-bold">
                      <span>By: {s.profiles?.mc_nickname}</span>
                      <span>Votes: {s.vote_count}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                    <select
                      value={s.status}
                      onChange={(e) => updateSuggestionStatus(s.id, e.target.value)}
                      className="input-mc text-sm py-2 bg-dark-900"
                    >
                      <option value="pending">Pending</option>
                      <option value="planned">Planned</option>
                      <option value="implemented">Implemented</option>
                      <option value="declined">Declined</option>
                    </select>
                    <button
                      onClick={() => deleteSuggestion(s.id)}
                      className="p-2 bg-crimson-500/20 text-crimson-400 hover:bg-crimson-500 hover:text-white border-2 border-crimson-500 transition-colors"
                      title="Delete Suggestion"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}

              {activeTab === 'forum' && threads.map(t => (
                <div key={t.id} className="solid-panel p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-2 border-dark-950">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-white text-lg truncate">{t.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-dark-400 font-bold mt-1">
                      <span>By: {t.profiles?.mc_nickname}</span>
                      <span>Replies: {t.reply_count}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <button
                      onClick={() => deleteThread(t.id)}
                      className="p-2 bg-crimson-500/20 text-crimson-400 hover:bg-crimson-500 hover:text-white border-2 border-crimson-500 transition-colors flex items-center gap-2"
                      title="Delete Thread"
                    >
                      <Trash2 size={18} /> <span className="text-sm font-bold sm:hidden">Delete Thread</span>
                    </button>
                  </div>
                </div>
              ))}

              {((activeTab === 'suggestions' && suggestions.length === 0) || 
                (activeTab === 'forum' && threads.length === 0)) && (
                <div className="text-center py-20 text-dark-400 font-bold">
                  No data found.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
