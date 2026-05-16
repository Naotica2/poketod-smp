'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  mc_nickname: string
  role: 'player' | 'admin'
  avatar_url: string | null
  created_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (nickname: string, password: string) => Promise<{ error: string | null }>
  signUp: (nickname: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const MC_NICKNAME_REGEX = /^[a-zA-Z0-9_]{3,16}$/
const EMAIL_DOMAIN = '@poketodsmp.local'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) {
      setProfile(data as Profile)
    }
  }, [supabase])

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        await fetchProfile(user.id)
      }
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase, fetchProfile])

  const signIn = async (nickname: string, password: string) => {
    if (!MC_NICKNAME_REGEX.test(nickname)) {
      return { error: 'Invalid nickname. Use 3-16 characters: letters, numbers, underscore only.' }
    }

    const email = nickname.toLowerCase() + EMAIL_DOMAIN
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return { error: 'Invalid nickname or password.' }
    }
    return { error: null }
  }

  const signUp = async (nickname: string, password: string) => {
    if (!MC_NICKNAME_REGEX.test(nickname)) {
      return { error: 'Invalid nickname. Use 3-16 characters: letters, numbers, underscore only.' }
    }

    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters.' }
    }

    const email = nickname.toLowerCase() + EMAIL_DOMAIN

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      if (error.message.includes('already registered')) {
        return { error: 'This nickname is already taken.' }
      }
      return { error: error.message }
    }

    // Create profile
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        mc_nickname: nickname,
        role: 'player',
      })

      if (profileError) {
        return { error: 'Account created but profile setup failed. Please try logging in.' }
      }
    }

    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
