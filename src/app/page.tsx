'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  Copy,
  Check,
  Sparkles,
  Cog,
  Sword,
  Users,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  BookOpen,
  Calendar,
  User,
  ChevronRight,
  ChevronDown,
  Compass,
} from 'lucide-react'
import blogData from '@/data/blog.json'

const SERVER_IP = 'mc.poketod.games'

const features = [
  {
    icon: Sparkles,
    title: 'Cobblemon',
    description:
      'Catch, train, and battle over 300+ Pokémon in a stunning open world. Trade with friends, complete your Pokédex, and become the ultimate trainer.',
    colorClass: 'bg-mc-primary-dark',
  },
  {
    icon: Cog,
    title: 'Create Aeronautics',
    description:
      'Engineer incredible steampunk machines, airships, and contraptions. From automated factories to flying fortresses — your imagination is the limit.',
    colorClass: 'bg-brass-400',
  },
  {
    icon: Sword,
    title: 'SMP Experience',
    description:
      'Join a thriving community with custom economy, land claiming, quests, and events. Build your legacy in a world that evolves with its players.',
    colorClass: 'bg-crimson-500',
  },
]

export default function HomePage() {
  const [copied, setCopied] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const recentBlogs = [...blogData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 2)

  const copyIP = async () => {
    try {
      await navigator.clipboard.writeText(SERVER_IP)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const input = document.createElement('input')
      input.value = SERVER_IP
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="mc-bg">
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4"
          >
            <span className="text-white text-shadow">Poketod SMP</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-heading text-lg sm:text-xl text-dark-300 max-w-2xl mx-auto mb-8 leading-relaxed font-bold bg-dark-900/80 p-4 border-4 border-dark-950 shadow-[4px_4px_0_#06080b]"
          >
            Where <span className="text-mc-primary text-shadow">Cobblemon</span> meets{' '}
            <span className="text-mc-brass text-shadow">Create Aeronautics</span>. Catch Pokémon,
            engineer steampunk machines, and forge your adventure.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="map-panel p-6 max-w-fit mx-auto"
          >
            <h3 className="font-heading font-bold text-lg mb-4 text-[#4a3018]">JOIN THE SERVER</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Copy IP Button */}
              <button
                onClick={copyIP}
                className={`btn-primary font-heading px-8 py-4 text-xl`}
                id="copy-ip-btn"
              >
                <span className="flex items-center gap-3">
                  {copied ? (
                    <>
                      <Check size={20} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={20} />
                      {SERVER_IP}
                    </>
                  )}
                </span>
              </button>

              {/* Discord Button */}
              <a
                href="https://discord.gg/poketodsmp"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost font-heading flex items-center gap-2 px-6 py-4 text-xl"
              >
                <Users size={20} />
                Join Discord
              </a>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ========== FEATURES SECTION ========== */}
      <section className="relative z-10 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-mc-brass text-shadow mb-4">
            What Makes Us Unique
          </h2>
          <p className="text-dark-300 max-w-2xl mx-auto bg-dark-900/80 p-4 border-4 border-dark-950 shadow-[4px_4px_0_#06080b]">
            Three worlds collide to create an unforgettable Minecraft experience.
            Explore what awaits you on Poketod SMP.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="solid-card p-6 lg:p-8 flex flex-col items-center text-center group"
              >
                <div
                  className={`w-16 h-16 border-4 border-dark-950 shadow-[4px_4px_0_#06080b] ${feature.colorClass} flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:shadow-[4px_12px_0_#06080b] transition-all`}
                >
                  <Icon size={32} className="text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-white text-shadow mb-3">
                  {feature.title}
                </h3>
                <p className="font-sans text-dark-300 text-sm leading-relaxed font-bold">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ========== FAQ SECTION ========== */}
      <section className="relative z-10 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 border-b-4 border-dark-950 pb-4 text-center"
        >
          <h2 className="font-heading font-bold text-3xl text-mc-brass text-shadow">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: "What is Poketod SMP?",
              a: "We are a unique Minecraft server blending Cobblemon (Pokémon) and Create Aeronautics (Steampunk Airships) for an ultimate adventure."
            },
            {
              q: "How do I join the server?",
              a: "You need Minecraft Java Edition and our custom modpack. Copy the IP 'mc.poketod.games' and join our Discord for the easy installation guide!"
            },
            {
              q: "Can cracked/offline Minecraft accounts join?",
              a: "Yes! Our server supports both offline (cracked) and premium accounts for Minecraft Java Edition."
            },
            {
              q: "Is the server free to play?",
              a: "Yes! The server is 100% free to play forever. We only offer optional cosmetic ranks and perks in our store to support hosting costs."
            },
            {
              q: "Can I play on Minecraft Bedrock?",
              a: "Currently, Poketod SMP is strictly for Java Edition only due to the complex mods and mechanics we use."
            }
          ].map((faq, i) => (
            <div key={i} className="solid-panel border-2 border-dark-950 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left transition-colors hover:bg-dark-800"
              >
                <h3 className="font-heading font-bold text-lg text-mc-primary">
                  {faq.q}
                </h3>
                <ChevronDown
                  size={20}
                  className={`text-mc-primary transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-6 pt-0 font-sans text-dark-300 text-sm font-bold leading-relaxed border-t-2 border-dark-950/30">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ========== BLOG PREVIEW SECTION ========== */}
      <section className="relative z-10 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8 border-b-4 border-dark-950 pb-4"
        >
          <div>
            <h2 className="font-heading font-bold text-3xl text-mc-brass text-shadow flex items-center gap-3">
              Recent News
            </h2>
          </div>
          <Link href="/community/blog" className="btn-ghost text-sm hidden sm:flex items-center gap-2">
            View All <ArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {recentBlogs.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="solid-card p-6 flex flex-col group hover:-translate-y-1 transition-transform"
            >
              <h3 className="font-heading font-bold text-xl text-white mb-2 group-hover:text-mc-primary transition-colors line-clamp-1">
                <Link href={`/community/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>
              <div className="flex items-center gap-3 text-xs font-bold text-dark-400 mb-4">
                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><User size={12} /> {post.author}</span>
              </div>
              <p className="text-dark-300 text-sm mb-4 line-clamp-2 flex-1 font-sans">
                {post.excerpt}
              </p>
              <Link href={`/community/blog/${post.slug}`} className="text-mc-primary text-sm font-bold flex items-center gap-1 hover:underline">
                Read Post <ChevronRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-6 sm:hidden">
          <Link href="/community/blog" className="btn-ghost w-full text-sm flex items-center justify-center gap-2">
            View All <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="solid-card p-8 sm:p-12 relative overflow-hidden"
          >
            <div className="relative z-10">
              <Compass size={48} className="mx-auto mb-4 text-mc-primary" />
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white text-shadow mb-4">
                Ready to Begin Your Adventure?
              </h2>
              <p className="text-dark-300 bg-dark-900/80 p-4 border-2 border-dark-950 shadow-[2px_2px_0_#06080b] max-w-xl mx-auto mb-8 font-bold">
                Join hundreds of players in a world where Pokémon roam wild and steampunk
                machines fill the skies. Your journey starts here.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={copyIP} className="btn-primary font-heading px-8 py-3 text-lg flex items-center gap-2">
                  <Copy size={18} />
                  Copy Server IP
                </button>
                <Link href="/community/suggestions" className="btn-ghost font-heading px-6 py-3 text-lg flex items-center gap-2">
                  Explore Community
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
