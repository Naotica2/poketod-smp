'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, User, Clock, CheckCircle, Loader2, MessageSquare, Send, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import LoginModal from '@/components/LoginModal'

interface Thread {
  id: string; title: string; content: string; is_pinned: boolean; is_locked: boolean
  reply_count: number; created_at: string
  profiles: { mc_nickname: string } | null
}
interface Reply {
  id: string; content: string; is_answer: boolean; created_at: string
  profiles: { mc_nickname: string } | null
}

const supabase = createClient()

export default function ThreadPage() {
  const params = useParams()
  const router = useRouter()
  const threadId = params.threadId as string
  const { user, profile } = useAuth()
  const [thread, setThread] = useState<Thread | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const [tRes, rRes] = await Promise.all([
      supabase.from('forum_threads').select('*, profiles(mc_nickname)').eq('id', threadId).single(),
      supabase.from('forum_replies').select('*, profiles(mc_nickname)').eq('thread_id', threadId).order('created_at'),
    ])
    if (tRes.data) setThread(tRes.data as Thread)
    if (rRes.data) setReplies(rRes.data as Reply[])
    setLoading(false)
  }, [supabase, threadId])

  useEffect(() => { load() }, [load])

  const submitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !replyText.trim()) return
    setSubmitting(true)
    await supabase.from('forum_replies').insert({ content: replyText, author_id: user.id, thread_id: threadId })
    setReplyText(''); setSubmitting(false); await load()
  }

  const deleteThread = async () => {
    if (!confirm('Are you sure you want to delete this entire thread?')) return
    await supabase.from('forum_threads').delete().eq('id', threadId)
    router.push('/community/forum')
  }

  const deleteReply = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reply?')) return
    await supabase.from('forum_replies').delete().eq('id', id)
    await load()
  }

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center"><Loader2 size={32} className="animate-spin text-mc-primary" /></div>
  )

  if (!thread) return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      <MessageSquare size={48} className="text-dark-400" />
      <p className="text-dark-300 text-lg">Thread not found</p>
      <Link href="/community/forum" className="btn-ghost text-sm">Back to Forum</Link>
    </div>
  )

  return (
    <div className="mc-bg min-h-screen">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Link href="/community/forum" className="inline-flex items-center gap-2 text-sm text-dark-300 hover:text-mc-primary transition-colors mb-6">
          <ArrowLeft size={16} /> Back to Forum
        </Link>

        {/* Thread */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="solid-card p-6 mb-6">
          <h1 className="font-heading font-bold text-xl sm:text-2xl text-white mb-4 text-shadow">{thread.title}</h1>
          <div className="flex items-center gap-4 text-xs text-dark-400 mb-4 pb-4 border-b border-white/5">
            <span className="flex items-center gap-1"><User size={12} />{thread.profiles?.mc_nickname ?? 'Unknown'}</span>
            <span className="flex items-center gap-1"><Clock size={12} />{fmtDate(thread.created_at)}</span>
            {profile?.role === 'admin' && (
              <button onClick={deleteThread} className="ml-auto flex items-center gap-1 text-crimson-400 font-bold hover:underline">
                <Trash2 size={12} /> Delete Thread
              </button>
            )}
          </div>
          <div className="text-dark-300 text-sm leading-relaxed whitespace-pre-wrap">{thread.content}</div>
        </motion.div>

        {/* Replies */}
        <div className="mb-6">
          <h2 className="font-heading font-bold text-lg text-white mb-4 flex items-center gap-2">
            <MessageSquare size={18} className="text-mc-brass" />
            Replies ({replies.length})
          </h2>
          {replies.length === 0 ? (
            <div className="solid-card p-6 text-center">
              <p className="text-dark-400 text-sm">No replies yet. Be the first to respond!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {replies.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className={`solid-card p-4 ${r.is_answer ? 'border-mc-primary bg-mc-primary/10' : ''}`}>
                  {r.is_answer && (
                    <div className="flex items-center gap-1 text-xs text-mc-primary font-bold mb-2">
                      <CheckCircle size={14} /> Accepted Answer
                    </div>
                  )}
                  <p className="text-dark-300 text-sm whitespace-pre-wrap mb-3">{r.content}</p>
                  <div className="flex items-center gap-3 text-xs text-dark-400">
                    <span className="flex items-center gap-1"><User size={11} />{r.profiles?.mc_nickname ?? 'Unknown'}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{fmtDate(r.created_at)}</span>
                    {profile?.role === 'admin' && (
                      <button onClick={() => deleteReply(r.id)} className="ml-auto text-crimson-400 font-bold hover:underline">
                        Delete
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Reply Form */}
        {thread.is_locked ? (
          <div className="solid-panel p-4 text-center text-dark-400 text-sm">This thread is locked.</div>
        ) : user ? (
          <form onSubmit={submitReply} className="solid-card p-4">
            <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write your reply..." className="input-mc min-h-[80px] resize-y mb-3" required />
            <div className="flex justify-end">
              <button type="submit" disabled={submitting || !replyText.trim()} className="btn-primary text-sm px-5 py-2 flex items-center gap-2 disabled:opacity-50">
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Reply
              </button>
            </div>
          </form>
        ) : (
          <div className="solid-panel p-4 text-center">
            <button onClick={() => setShowLogin(true)} className="text-mc-primary font-medium hover:underline text-sm">Log in</button>
            <span className="text-dark-300 text-sm"> to reply to this thread.</span>
          </div>
        )}
      </div>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  )
}
