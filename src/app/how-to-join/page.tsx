'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Monitor, Smartphone, Download, CheckCircle, ChevronRight, Image as ImageIcon } from 'lucide-react'

type Platform = 'desktop' | 'mobile'
type DesktopLauncher = 'legacy' | 'prism'
type MobileLauncher = 'zalith' | 'pojav'

type LauncherKey = DesktopLauncher | MobileLauncher

type TutorialStep = {
  title: string
  description?: string
  list?: string[]
  images?: string[]
  showDownloads?: boolean
}

const tutorialData: Record<LauncherKey, {
  name: string
  downloadLink: string
  modpackLink: string
  showModpackDownload?: boolean
  steps: TutorialStep[]
}> = {
  legacy: {
    name: "Legacy Launcher",
    downloadLink: "https://llaun.ch/en",
    modpackLink: "https://modrinth.com/modpack/poketod-smp",
    showModpackDownload: true, // Ganti ke false jika ingin menyembunyikan tombol download modpack untuk launcher ini
    steps: [
      {
        title: "Download Legacy Launcher & Modpack",
        description: "First, you need to download the Legacy Launcher and our official Poketod SMP modpack .mrpack file.",
        showDownloads: true
      },
      {
        title: "MRPACK to Zip Convert",
        list: [
          "Search MRPACK to Zip Converter on Google",
          "Choose whichever converted website you prefer, but in this tutorial I’m using mrpackzip.com",
          "Please upload the poketod smp.mrpack file to convert it to a ZIP file",
          "Wait until the converted of the .mrpack file for poketod SMP is complete",
          "Once the converted is complete, please download the .zip file"
        ],
        images: ["legacystep4.png", "legacystep5.png"]
      },
      {
        title: "Install the Version",
        list: [
          "Open Legacy Launcher.",
          "Install minecraft version Fabric 1.21.1",
          "Wait until the installation is complete",
          "The screenshot shows that Neoforge 1.21.1 is installed, but trust me, you need to download Fabric 1.21.1, not Neoforge 1.21.1"
        ],
        images: ["legacystep2.jpeg"]
      },
      {
        title: "Install the Modpack",
        list: [
          "Click on hamburger icon",
          "Click open mods folder",
          "Unzip the .zip file you downloaded earlier during the steps for the MrPack to ZIP converter",
          "and move all the contents of the mods folder which you extracted from .zip to the mods folder in the Minecraft Legacy Launcher version Neoforge 1.21.1"
        ],
        images: ["legacystep1.jpeg", "legacystep3.jpeg"]
      }
    ]
  },
  prism: {
    name: "Prism Launcher",
    downloadLink: "https://prismlauncher.org/",
    modpackLink: "https://modrinth.com/modpack/poketod-smp",
    showModpackDownload: true, // Ganti ke false jika ingin menyembunyikan tombol download modpack untuk launcher ini
    steps: [
      {
        title: "Download Prism Launcher & Modpack",
        description: "First, download Prism Launcher and our official Poketod SMP modpack .mrpack file.",
        showDownloads: true
      },
      {
        title: "Install via Prism",
        list: [
          "Open Prism Launcher.",
          "Click Add Instance in the top left.",
          "Select Modrinth on the left side.",
          "Search for “Poketod SMP” in the search bar",
          "Then click on the Poketod SMP modpack when it appears",
          "and click OK"
        ],
        images: ["prismstep1.png", "prismstep2.png"]
      }
    ]
  },
  zalith: {
    name: "Zalith Launcher",
    downloadLink: "#",
    modpackLink: "https://modrinth.com/modpack/poketod-smp",
    showModpackDownload: true, // Ganti ke false jika ingin menyembunyikan tombol download modpack untuk launcher ini
    steps: [
      {
        title: "Download Zalith & Modpack",
        description: "Download Zalith for your Android device and the Poketod SMP modpack .mrpack file.",
        showDownloads: true
      },
      {
        title: "Setup Zalith",
        list: [
          "Open Zalith Launcher.",
          "Go to settings and select 'Import Modpack' or 'Install Client'.",
          "Locate the downloaded zip file in your files.",
          "Wait for the installation process to complete and tap Play."
        ]
      }
    ]
  },
  pojav: {
    name: "Pojav/Mojo Launcher",
    downloadLink: "#",
    modpackLink: "https://modrinth.com/modpack/poketod-smp",
    showModpackDownload: true, // Ganti ke false jika ingin menyembunyikan tombol download modpack untuk launcher ini
    steps: [
      {
        title: "Download Pojav/Mojo & Modpack",
        description: "Download Pojav Launcher from the Play Store and our modpack zip file.",
        showDownloads: true
      },
      {
        title: "Select Instance",
        list: [
          "Open Mojo Launcher and select “Create New Instance”",
          "Scroll down until you find “Create Modpack Instance”"
        ],
        images: ["mojostep1.jpg", "mojostep2.jpg"]
      },
      {
        title: "Installation Modpack",
        list: [
          "Click the “Import Local Modpack” button",
          "Find the location of the poketod smp.mrpack file that you downloaded earlier",
          "Once you find it, click on the poketod smp.mrpack file",
          "Wait until the .mrpack file has been successfully imported",
          "Once the import is complete, please return to the main ( home ) page",
          "Make sure you've selected the Poketod SMP modpack, then click the “Play” button"
        ],
        images: ["mojostep3.jpg", "mojostep4.jpg"]
      }
    ]
  }
}

export default function HowToJoinPage() {
  const [platform, setPlatform] = useState<Platform>('desktop')
  const [desktopLauncher, setDesktopLauncher] = useState<DesktopLauncher>('legacy')
  const [mobileLauncher, setMobileLauncher] = useState<MobileLauncher>('zalith')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const activeLauncher = platform === 'desktop' ? desktopLauncher : mobileLauncher

  return (
    <div className="mc-bg min-h-screen pb-20">
      {/* Header */}
      <div className="relative z-10 pt-12 sm:pt-20 pb-12 px-4 text-center border-b-4 border-dark-950 bg-dark-900/50">
        <h1 className="font-heading font-bold text-4xl sm:text-5xl text-mc-primary text-shadow mb-4">
          How to Join
        </h1>
        <p className="text-dark-300 max-w-2xl mx-auto text-lg font-bold">
          Follow the tutorial below to install the necessary mods and join Poketod SMP. Select your platform to get started!
        </p>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-12">
        {/* Platform Selector */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center">
          <button
            onClick={() => setPlatform('desktop')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 font-heading text-xl transition-all border-4 ${platform === 'desktop'
                ? 'bg-mc-primary border-dark-950 text-white shadow-[4px_4px_0_#0a0d14] -translate-y-1'
                : 'bg-dark-800 border-transparent text-dark-300 hover:text-white hover:bg-dark-700'
              }`}
          >
            <Monitor size={24} />
            Desktop
          </button>
          <button
            onClick={() => setPlatform('mobile')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-3 px-8 py-4 font-heading text-xl transition-all border-4 ${platform === 'mobile'
                ? 'bg-mc-primary border-dark-950 text-white shadow-[4px_4px_0_#0a0d14] -translate-y-1'
                : 'bg-dark-800 border-transparent text-dark-300 hover:text-white hover:bg-dark-700'
              }`}
          >
            <Smartphone size={24} />
            Mobile
          </button>
        </div>

        {/* Launcher Selector */}
        <AnimatePresence mode="wait">
          <motion.div
            key={platform}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2 mb-8 justify-center"
          >
            {platform === 'desktop' ? (
              <>
                <button
                  onClick={() => setDesktopLauncher('legacy')}
                  className={`px-6 py-2 font-heading transition-all border-2 ${desktopLauncher === 'legacy' ? 'bg-dark-700 text-mc-primary border-dark-950' : 'bg-transparent text-dark-400 border-transparent hover:text-white'
                    }`}
                >
                  Legacy Launcher
                </button>
                <button
                  onClick={() => setDesktopLauncher('prism')}
                  className={`px-6 py-2 font-heading transition-all border-2 ${desktopLauncher === 'prism' ? 'bg-dark-700 text-mc-primary border-dark-950' : 'bg-transparent text-dark-400 border-transparent hover:text-white'
                    }`}
                >
                  Prism Launcher
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setMobileLauncher('zalith')}
                  className={`px-6 py-2 font-heading transition-all border-2 ${mobileLauncher === 'zalith' ? 'bg-dark-700 text-mc-primary border-dark-950' : 'bg-transparent text-dark-400 border-transparent hover:text-white'
                    }`}
                >
                  Zalith
                </button>
                <button
                  onClick={() => setMobileLauncher('pojav')}
                  className={`px-6 py-2 font-heading transition-all border-2 ${mobileLauncher === 'pojav' ? 'bg-dark-700 text-mc-primary border-dark-950' : 'bg-transparent text-dark-400 border-transparent hover:text-white'
                    }`}
                >
                  Pojav/Mojo
                </button>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Tutorial Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLauncher}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* Dynamic Steps Mapping */}
            {tutorialData[activeLauncher].steps.map((step, index) => (
              <div key={index} className="solid-card p-6 sm:p-8 relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-mc-primary border-4 border-dark-950 flex items-center justify-center font-heading text-xl shadow-[2px_2px_0_#0a0d14]">
                  {index + 1}
                </div>
                <h2 className="font-heading font-bold text-2xl text-white mb-4 mt-2">
                  {step.title}
                </h2>

                {step.description && (
                  <p className="text-dark-300 font-bold mb-6">
                    {step.description}
                  </p>
                )}

                {step.showDownloads && (
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <a href={tutorialData[activeLauncher].downloadLink} className="btn-primary flex items-center justify-center gap-2 px-6 py-3 text-sm">
                      <Download size={18} /> Download {tutorialData[activeLauncher].name}
                    </a>
                    {tutorialData[activeLauncher].showModpackDownload !== false && (
                      <a href={tutorialData[activeLauncher].modpackLink} className="btn-ghost flex items-center justify-center gap-2 px-6 py-3 text-sm">
                        <Download size={18} /> Download Modpack
                      </a>
                    )}
                  </div>
                )}

                {step.list && (
                  <div className="text-dark-300 font-bold space-y-3 mb-6">
                    {step.description ? null : <p>Follow these steps to complete the installation:</p>}
                    <ul className="list-disc pl-5 space-y-2 text-dark-300">
                      {step.list.map((listItem, i) => (
                        <li key={i}>{listItem}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {step.images && step.images.length > 0 && (
                  <div className={`mt-4 grid gap-4 ${step.images.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {step.images.map((img, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden border-4 border-dark-950 shadow-lg relative cursor-zoom-in" onClick={() => setSelectedImage(img)}>
                        <img src={img} alt={`Step ${index + 1} Image ${idx + 1}`} className="w-full h-auto object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Final Step: Connect to Server */}
            <div className="solid-card p-6 sm:p-8 relative">
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-mc-primary border-4 border-dark-950 flex items-center justify-center font-heading text-xl shadow-[2px_2px_0_#0a0d14]">
                {tutorialData[activeLauncher].steps.length + 1}
              </div>
              <h2 className="font-heading font-bold text-2xl text-white mb-4 mt-2">
                Connect to the Server
              </h2>
              <p className="text-dark-300 font-bold mb-6">
                Launch the game, go to Multiplayer, click "Add Server", and enter the following IP address to join us!
              </p>

              <div className="bg-dark-900 border-4 border-dark-950 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <span className="font-heading text-xl text-white">mc.poketod.my.id</span>
              </div>

            </div>

            {/* Final CTA */}
            <div className="text-center pt-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-mc-primary/20 mb-4">
                <CheckCircle size={32} className="text-mc-primary" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-white mb-2">You're All Set!</h3>
              <p className="text-dark-300 font-bold mb-6 max-w-md mx-auto">
                If you encounter any issues during installation, feel free to ask for help in our Discord server.
              </p>
              <a href="https://discord.gg/uEqdGs6w6F" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2">
                Join Discord Support <ChevronRight size={18} />
              </a>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark-950/90 p-4 cursor-zoom-out"
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage}
              alt="Zoomed"
              className="max-w-full max-h-[90vh] object-contain border-4 border-dark-900 shadow-2xl rounded-xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
