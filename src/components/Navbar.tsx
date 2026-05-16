'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  ChevronDown,
  Home,
  ShoppingBag,
  Vote,
  BookOpen,
  MessageSquare,
  Lightbulb,
  User,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import LoginModal from './LoginModal'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Store', href: '/store' },
  { name: 'Vote', href: '/vote' },
  { name: 'Rules', href: '/rules' },
  { name: 'How to Join', href: '/how-to-join' },
]

const communityLinks = [
  { name: 'Blog', href: '/community/blog', icon: BookOpen },
  { name: 'Suggestions', href: '/community/suggestions', icon: Lightbulb },
  { name: 'Forum', href: '/community/forum', icon: MessageSquare },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [communityOpen, setCommunityOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const pathname = usePathname()
  const { user, profile, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setCommunityOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href
  const isCommunityActive = communityLinks.some((l) => pathname.startsWith(l.href))

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-4 border-dark-950 ${
          scrolled
            ? 'dark-panel'
            : 'bg-[var(--color-mc-nav)] border-b-4 border-dark-950'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-none overflow-hidden border-2 border-dark-950 group-hover:border-brass-400 transition-all">
                <Image
                  src="/logo.png"
                  alt="Poketod SMP"
                  fill
                  sizes="(max-width: 1024px) 40px, 48px"
                  className="object-cover"
                  priority
                />
              </div>
              <span className="font-heading font-bold text-lg lg:text-xl text-mc-primary text-shadow hidden sm:block">
                Poketod SMP
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 text-sm font-heading transition-all duration-200 border-2 ${
                      isActive(link.href)
                        ? 'border-dark-950 bg-dark-700 text-mc-primary box-shadow-[2px_2px_0_#06080b]'
                        : 'border-transparent text-dark-300 hover:text-white hover:bg-dark-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}

              {/* Community Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setCommunityOpen(!communityOpen)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-heading transition-all duration-200 border-2 ${
                    isCommunityActive
                      ? 'border-dark-950 bg-dark-700 text-mc-primary box-shadow-[2px_2px_0_#06080b]'
                      : 'border-transparent text-dark-300 hover:text-white hover:bg-dark-800'
                  }`}
                >
                  Community
                </button>

                <AnimatePresence>
                  {communityOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-52 bg-dark-900 border-4 border-dark-950 overflow-hidden shadow-xl"
                    >
                      {communityLinks.map((link) => {
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={`block px-4 py-3 text-sm font-heading transition-colors ${
                              isActive(link.href)
                                ? 'bg-dark-700 text-mc-primary border-l-4 border-mc-primary-dark'
                                : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                            }`}
                          >
                            {link.name}
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Auth Button (Desktop) */}
            <div className="hidden lg:flex items-center gap-3">
              {user && profile ? (
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 solid-panel border-2 border-dark-950">
                      <User size={16} className="text-mc-primary" />
                      <span className="text-sm font-heading text-white">
                        {profile.mc_nickname}
                      </span>
                    </div>
                    {profile.role === 'admin' && (
                      <Link href="/admin" className="badge badge-implemented text-[10px] py-0 hover:opacity-80 transition-opacity">
                        ADMIN
                      </Link>
                    )}
                  <button
                    onClick={signOut}
                    className="p-2 text-dark-300 hover:text-crimson-400 hover:bg-dark-800 transition-all border-2 border-transparent hover:border-dark-950"
                    aria-label="Sign out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="btn-primary text-sm px-5 py-2"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-dark-300 hover:text-white hover:bg-dark-800 transition-all border-2 border-transparent hover:border-dark-950"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="lg:hidden absolute top-[100%] right-0 w-80 min-h-screen bg-dark-900 border-l-4 border-dark-950 shadow-2xl"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-6 py-4 text-lg font-heading transition-all ${
                        isActive(link.href)
                          ? 'text-mc-primary'
                          : 'text-dark-300 hover:text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                ))}

                <p className="px-6 py-2 mt-4 text-xs font-semibold text-dark-400 uppercase tracking-wider">
                  Community
                </p>
                {communityLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-6 py-4 text-lg font-heading transition-all ${
                        isActive(link.href)
                          ? 'text-mc-primary'
                          : 'text-dark-300 hover:text-white'
                      }`}
                    >
                      {link.name}
                    </Link>
                ))}
                <div className="border-t-4 border-dark-950 my-4" />

                {user && profile ? (
                  <div className="px-6 py-4 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-mc-primary" />
                      <span className="text-sm font-heading text-white">
                        {profile?.mc_nickname}
                      </span>
                      {profile?.role === 'admin' && (
                        <Link href="/admin" className="badge badge-implemented text-[10px] py-0" onClick={() => setIsOpen(false)}>
                          ADMIN
                        </Link>
                      )}
                    </div>
                    <button
                      onClick={signOut}
                      className="text-lg text-crimson-400 font-heading text-left"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="px-6 py-4">
                    <button
                      onClick={() => {
                        setIsOpen(false)
                        setShowLogin(true)
                      }}
                      className="text-lg text-mc-primary font-heading text-left"
                    >
                      Login
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Close community dropdown on outside click */}
      {communityOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setCommunityOpen(false)}
        />
      )}

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  )
}
