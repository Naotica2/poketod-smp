import Link from 'next/link'
import { Heart, ExternalLink, MessageCircle, Shield, Cog } from 'lucide-react'

const footerLinks = {
  server: [
    { name: 'Home', href: '/' },
    { name: 'How to Join', href: '/how-to-join' },
    { name: 'Store', href: '/store' },
    { name: 'Vote', href: '/vote' },
    { name: 'Rules', href: '/rules' },
  ],
  community: [
    { name: 'Suggestions', href: '/community/suggestions' },
    { name: 'Forum', href: '/community/forum' },
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/terms?tab=privacy' },
  ],
}

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t-4 border-dark-950 bg-dark-900">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-heading font-bold text-xl text-mc-primary text-shadow mb-3">
              Poketod SMP
            </h3>
            <p className="text-dark-300 text-sm leading-relaxed max-w-sm">
              The ultimate Minecraft SMP focusing on Cobblemon. Catch, train, battle, and become the very best!
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://discord.gg/uEqdGs6w6F"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 solid-panel border-2 border-dark-950 text-dark-300 hover:text-mc-primary hover:bg-dark-800 transition-all"
                aria-label="Discord"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@poketodsmp"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 solid-panel border-2 border-dark-950 text-dark-300 hover:text-[#ff0000] hover:bg-dark-800 transition-all"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Server Links */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-white mb-3 uppercase tracking-wider">
              Server
            </h4>
            <ul className="space-y-2">
              {footerLinks.server.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-heading text-sm text-dark-300 hover:text-mc-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-white mb-3 uppercase tracking-wider">
              Community
            </h4>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-heading text-sm text-dark-300 hover:text-mc-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-white mb-3 uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-heading text-sm text-dark-300 hover:text-mc-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t-4 border-dark-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-heading text-xs text-dark-400">
            &copy; {new Date().getFullYear()} Poketod SMP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
