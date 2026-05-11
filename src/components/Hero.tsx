import { motion } from 'framer-motion'
import { Mail, FileText, ChevronDown } from 'lucide-react'
import { GithubIcon, LinkedinIcon, InstagramIcon } from './SocialIcons'
import { siteConfig } from '../data/portfolio'

export default function Hero() {
  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-14 relative overflow-hidden">
      {/* Decorative glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex-shrink-0"
        >
          <div className="relative w-52 sm:w-64 lg:w-72">
            {/* Pixel-art border frame */}
            <div className="absolute inset-0 border-2 border-neon-green translate-x-3 translate-y-3 opacity-40" />
            <div className="absolute inset-0 border-2 border-neon-cyan translate-x-6 translate-y-6 opacity-20" />
            <img
              src="/portrait.png"
              alt="Jordan Mitacek"
              className="relative w-full object-cover object-top border-2 border-neon-green"
              style={{
                imageRendering: 'auto',
                aspectRatio: '3/4',
                boxShadow: '0 0 24px rgba(0,255,135,0.2)',
              }}
            />
            {/* Online indicator */}
            <div className="absolute -bottom-3 left-4 flex items-center gap-2 bg-bg-card border border-bg-border px-3 py-1">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
              <span className="font-pixel text-[8px] text-neon-green">ONLINE</span>
            </div>
          </div>
        </motion.div>

        {/* Text content */}
        <div className="flex-1 text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-pixel text-xs text-pixel-dim mb-3"
          >
            &gt; Hi, my name is
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="font-pixel text-4xl sm:text-5xl lg:text-6xl neon-text-green mb-4 leading-tight"
          >
            Jordan.
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-pixel text-sm sm:text-base lg:text-lg text-neon-cyan mb-6"
          >
            I build low-level systems
            <span className="animate-blink">_</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="font-retro text-xl sm:text-2xl text-pixel-dim max-w-lg mb-8 leading-relaxed"
          >
            Student Assistant at Brookhaven National Laboratory. B.S. Computer Science. I like building things — from control systems to CPU emulators to games.
          </motion.p>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap items-center gap-3 justify-center lg:justify-start"
          >
            <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="pixel-btn">
              <GithubIcon size={13} /> GitHub
            </a>
            <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="pixel-btn pixel-btn-cyan">
              <LinkedinIcon size={13} /> LinkedIn
            </a>
            <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="pixel-btn pixel-btn-pink">
              <InstagramIcon size={13} /> Instagram
            </a>
            <a href={`mailto:${siteConfig.email}`} className="pixel-btn">
              <Mail size={13} /> Email
            </a>
            <a href={siteConfig.social.resume} target="_blank" rel="noopener noreferrer" className="pixel-btn">
              <FileText size={13} /> Resume
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-pixel-dim hover:text-neon-green transition-colors flex flex-col items-center gap-1"
      >
        <span className="font-pixel text-[8px]">scroll</span>
        <ChevronDown size={18} className="animate-bounce" />
      </motion.button>
    </section>
  )
}
