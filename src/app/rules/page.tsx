'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, ChevronDown, ChevronRight, AlertTriangle, Ban, MessageSquare, Swords, Building, Globe } from 'lucide-react'

const rules = [
  {
    category: 'General Rules',
    icon: Shield,
    color: 'text-mc-primary',
    items: [
      { text: 'Be respectful to all players and staff members.', severity: 'warning' },
      { text: 'No hacking, cheating, or exploiting bugs/glitches.', severity: 'critical' },
      { text: 'Do not share personal information of yourself or others.', severity: 'critical' },
      { text: 'Follow the instructions of staff members at all times.', severity: 'warning' },
      { text: 'No advertising other servers or services.', severity: 'warning' },
      { text: 'Use common sense — if it feels wrong, it probably is.', severity: 'info' },
    ],
  },
  {
    category: 'Chat Rules',
    icon: MessageSquare,
    color: 'text-mc-primary',
    items: [
      { text: 'No spamming, excessive caps, or flooding the chat.', severity: 'warning' },
      { text: 'No hate speech, discrimination, or harassment.', severity: 'critical' },
      { text: 'Keep discussions civil — no toxic behavior.', severity: 'warning' },
      { text: 'English is the primary language in global chat.', severity: 'info' },
      { text: 'No inappropriate content or NSFW material.', severity: 'critical' },
    ],
  },
  {
    category: 'PvP Rules',
    icon: Swords,
    color: 'text-crimson-400',
    items: [
      { text: 'PvP is only allowed in designated PvP zones.', severity: 'warning' },
      { text: 'No spawn camping or trapping players.', severity: 'warning' },
      { text: 'Cobblemon battles must be consensual between both parties.', severity: 'info' },
      { text: 'No using exploits or mods to gain unfair PvP advantages.', severity: 'critical' },
    ],
  },
  {
    category: 'Building Rules',
    icon: Building,
    color: 'text-white',
    items: [
      { text: 'No griefing or destroying other players\' builds.', severity: 'critical' },
      { text: 'Claim your land to protect your builds.', severity: 'info' },
      { text: 'No offensive or inappropriate builds.', severity: 'warning' },
      { text: 'Keep the environment clean — no floating trees or 1x1 towers.', severity: 'info' },
      { text: 'Redstone/Create machines must not cause excessive lag.', severity: 'warning' },
    ],
  },
  {
    category: 'Server & Community',
    icon: Globe,
    color: 'text-mc-primary',
    items: [
      { text: 'Do not attempt to crash or lag the server.', severity: 'critical' },
      { text: 'Report bugs through the proper channels (Forum or Discord).', severity: 'info' },
      { text: 'Alt accounts are limited to 1 per player.', severity: 'warning' },
      { text: 'Scamming or stealing from other players is prohibited.', severity: 'critical' },
      { text: 'AFK farms must comply with server guidelines.', severity: 'info' },
    ],
  },
]

const severityIcon: Record<string, { icon: typeof AlertTriangle; color: string }> = {
  critical: { icon: Ban, color: 'text-crimson-400' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400' },
  info: { icon: Shield, color: 'text-mc-primary' },
}

export default function RulesPage() {
  const [openCat, setOpenCat] = useState<number | null>(0)

  return (
    <div className="mc-bg min-h-screen">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Shield size={40} className="mx-auto mb-4 text-mc-primary" />
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-mc-primary text-shadow mb-3">Server Rules</h1>
          <p className="text-dark-300 max-w-2xl mx-auto">
            These rules exist to ensure a fair and enjoyable experience for everyone. Violating them may result in warnings, mutes, or bans.
          </p>
        </motion.div>

        <div className="space-y-3">
          {rules.map((section, si) => {
            const Icon = section.icon
            const isOpen = openCat === si
            return (
              <motion.div key={section.category} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.08 }}>
                <button onClick={() => setOpenCat(isOpen ? null : si)}
                  className="w-full solid-card p-4 flex items-center gap-3 text-left mb-2">
                  <Icon size={20} className={section.color} />
                  <span className="font-heading font-semibold text-white flex-1">{section.category}</span>
                  <span className="text-xs text-dark-400 font-bold mr-2">{section.items.length} rules</span>
                  {isOpen ? <ChevronDown size={18} className="text-dark-300" /> : <ChevronRight size={18} className="text-dark-300" />}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden">
                      <div className="pl-4 pr-2 py-3 space-y-2">
                        {section.items.map((rule, ri) => {
                          const Sev = severityIcon[rule.severity]
                          return (
                            <div key={ri} className="flex items-start gap-3 p-3 solid-panel border-2 border-dark-950">
                              <span className="text-dark-400 text-sm font-bold shrink-0 w-6 text-right">{ri + 1}.</span>
                              <Sev.icon size={14} className={`${Sev.color} shrink-0 mt-0.5`} />
                              <p className="text-dark-300 font-bold text-sm">{rule.text}</p>
                            </div>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 solid-card p-5 text-center">
          <p className="text-dark-300 font-bold text-sm">
            By playing on Poketod SMP, you agree to follow these rules. Staff decisions are final.
            For questions, visit our <a href="https://discord.gg/poketodsmp" className="text-mc-primary hover:underline">Discord</a>.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
