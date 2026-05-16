import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})


export const metadata: Metadata = {
  title: {
    default: 'Poketod SMP: Cobblemon × Create Aeronautics',
    template: '%s | Poketod SMP',
  },
  description:
    'Join Poketod SMP a unique Minecraft server blending Cobblemon with Create Aeronautics. Catch Pokémon, build steampunk machines, and explore with friends!',
  keywords: ['Minecraft', 'SMP', 'Cobblemon', 'Create Aeronautics', 'Pokémon', 'Steampunk', 'Server'],
  openGraph: {
    title: 'Poketod SMP: Cobblemon × Create Aeronautics',
    description: 'Catch, Build, Fly. Join the ultimate hybrid Minecraft experience.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-dark-900 text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 pt-16 lg:pt-20">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
