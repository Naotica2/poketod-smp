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
    default: 'Poketod SMP: The Ultimate Cobblemon Server',
    template: '%s | Poketod SMP',
  },
  description:
    'Join Poketod SMP, the ultimate Minecraft Cobblemon server. Catch Pokémon, battle in Gyms, and become a Pokémon Master!',
  keywords: ['Minecraft', 'SMP', 'Cobblemon', 'Pokémon', 'Mega Evolution', 'Server'],
  openGraph: {
    title: 'Poketod SMP: The Ultimate Cobblemon Server',
    description: 'Catch, Train, Battle. Join the ultimate Cobblemon SMP experience.',
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
