import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon, InstagramIcon } from './SocialIcons'
import { siteConfig } from '../data/portfolio'

export default function Footer() {
  return (
    <footer className="border-t border-bg-border py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="font-pixel text-xs neon-text-green">
          JM<span className="animate-blink">_</span>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-5">
          <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
            className="text-pixel-dim hover:text-neon-green transition-colors">
            <GithubIcon size={17} />
          </a>
          <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
            className="text-pixel-dim hover:text-neon-cyan transition-colors">
            <LinkedinIcon size={17} />
          </a>
          <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
            className="text-pixel-dim hover:text-neon-pink transition-colors">
            <InstagramIcon size={17} />
          </a>
          <a href={`mailto:${siteConfig.email}`} aria-label="Email"
            className="text-pixel-dim hover:text-neon-green transition-colors">
            <Mail size={17} />
          </a>
        </div>

        {/* Credit */}
        <p className="font-retro text-lg text-pixel-dark text-center sm:text-right">
          © {new Date().getFullYear()} Jordan Mitacek
          <br />
          <span className="text-base">Built with React + Tailwind</span>
        </p>
      </div>
    </footer>
  )
}
