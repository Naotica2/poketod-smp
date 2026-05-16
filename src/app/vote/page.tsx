'use client'

import { motion } from 'framer-motion'
import { Vote, Cog, Wrench } from 'lucide-react'
import Link from 'next/link'

export default function VotePage() {
  return (
    <div className="mc-bg min-h-screen flex items-center justify-center">
      <div className="relative z-10 max-w-lg mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="solid-card p-8 sm:p-12">
          {/* Floating Icon */}
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10 w-20 h-20 border-4 border-dark-950 shadow-[4px_4px_0_#06080b] bg-mc-primary flex items-center justify-center"
            >
              <Vote size={40} className="text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]" />
            </motion.div>
          </div>

          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-mc-primary text-shadow mb-3">Vote</h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 solid-panel border-2 border-yellow-500 bg-yellow-500/10 mb-4">
            <Wrench size={14} className="text-yellow-400" />
            <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wider">Under Maintenance</span>
          </div>
          <p className="text-dark-300 text-sm leading-relaxed mb-6">
            Our voting system is being set up with exciting rewards. 
            Soon you&apos;ll be able to vote daily and earn exclusive in-game items!
          </p>
          <Link href="/" className="btn-ghost text-sm inline-flex items-center gap-2">
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
