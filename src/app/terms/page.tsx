'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Shield, Scale } from 'lucide-react'

const tabs = [
  { id: 'tos', label: 'Terms of Service', icon: FileText },
  { id: 'privacy', label: 'Privacy Policy', icon: Shield },
  { id: 'legal', label: 'Legal Disclosures', icon: Scale },
]

const content: Record<string, { title: string; sections: { heading: string; text: string }[] }> = {
  tos: {
    title: 'Terms of Service',
    sections: [
      { heading: '1. Acceptance of Terms', text: 'By accessing and using Poketod SMP services, including our Minecraft server, website, and community platforms, you agree to be bound by these Terms of Service. If you do not agree, you must discontinue use immediately.' },
      { heading: '2. Eligibility', text: 'You must be at least 12 years of age to use our services. If you are under 18, you must have parental or guardian consent. We reserve the right to terminate accounts that violate this requirement.' },
      { heading: '3. Account Responsibility', text: 'You are responsible for maintaining the security of your account credentials. Any activity under your account is your responsibility. Do not share your password or account access with others.' },
      { heading: '4. Server Rules', text: 'All players must adhere to the server rules as outlined on the Rules page. Violations may result in warnings, temporary bans, or permanent bans at the discretion of staff.' },
      { heading: '5. Purchases & Donations', text: 'All purchases on the store are considered donations and are non-refundable. Virtual items have no real-world monetary value. We reserve the right to modify or remove any virtual items.' },
      { heading: '6. Content', text: 'You retain ownership of content you create on the server. However, by using our services, you grant us a license to use, display, and distribute user content for server operations and promotion.' },
      { heading: '7. Modifications', text: 'We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of the updated terms.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      { heading: '1. Information We Collect', text: 'We collect your Minecraft nickname, IP address (for security), and any information you voluntarily provide. We do not collect real names, emails, or sensitive personal data beyond what Minecraft provides.' },
      { heading: '2. How We Use Information', text: 'Your information is used to provide server services, prevent abuse, enforce rules, and improve the player experience. We do not sell or share your data with third parties.' },
      { heading: '3. Data Storage', text: 'Player data is stored securely in encrypted databases. We implement industry-standard security measures to protect your information.' },
      { heading: '4. Cookies', text: 'Our website uses essential cookies for authentication and session management. No third-party tracking cookies are used.' },
      { heading: '5. Data Retention', text: 'We retain your data for as long as your account is active. You may request deletion of your data by contacting staff through Discord.' },
      { heading: '6. Children\'s Privacy', text: 'We do not knowingly collect information from children under 12. If we discover such data has been collected, it will be deleted promptly.' },
    ],
  },
  legal: {
    title: 'Legal Disclosures',
    sections: [
      { heading: 'Minecraft', text: 'Poketod SMP is not affiliated with, endorsed by, or associated with Mojang Studios, Microsoft Corporation, or any of their subsidiaries. Minecraft is a registered trademark of Mojang Studios.' },
      { heading: 'Cobblemon Mod', text: 'The Cobblemon mod is a community-created modification. We are not affiliated with their development team.' },
      { heading: 'Liability', text: 'Poketod SMP is provided "as is" without warranties. We are not liable for any damages, data loss, or interruptions arising from the use of our services.' },
      { heading: 'Dispute Resolution', text: 'Any disputes shall be resolved through direct communication with server administration via Discord. We encourage peaceful resolution of all conflicts.' },
    ],
  },
}

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState('tos')
  const data = content[activeTab]

  return (
    <div className="mc-bg min-h-screen">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <Scale size={40} className="mx-auto mb-4 text-brass-400" />
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-mc-brass text-shadow mb-3">Terms & Legal</h1>
          <p className="text-dark-300">Important information about using Poketod SMP services.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-none text-sm font-bold whitespace-nowrap transition-all border-4 ${activeTab === tab.id ? 'bg-mc-primary border-dark-950 text-white shadow-[4px_4px_0_#06080b]' : 'solid-card text-dark-300 hover:text-white'}`}>
                <Icon size={16} /> {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="solid-card p-6 sm:p-8">
          <h2 className="font-heading font-bold text-2xl text-white mb-6 pb-4 border-b-4 border-dark-950">{data.title}</h2>
          <div className="space-y-6">
            {data.sections.map((s, i) => (
              <div key={i}>
                <h3 className="font-heading font-bold text-lg text-white mb-2">{s.heading}</h3>
                <p className="text-dark-300 font-bold text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-4 border-t-4 border-dark-950">
            <p className="text-xs font-bold text-dark-400">Last updated: May 2026. Questions? Contact us on Discord.</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
