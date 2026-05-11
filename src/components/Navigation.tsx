import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { siteConfig } from '../data/portfolio'
import { Menu, X, FileText } from 'lucide-react'
import { GithubIcon, LinkedinIcon, InstagramIcon } from './SocialIcons'

const navItems = [
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Education', href: '/#education' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Games', href: '/#games' },
  { label: 'Blog', href: '/blog' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    if (href.startsWith('/#') && location.pathname === '/') {
      const id = href.slice(2)
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? 'bg-bg/95 backdrop-blur-sm border-b border-bg-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            to="/"
            className="font-pixel text-xs neon-text-green hover:animate-pulse transition-all"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            JM<span className="animate-blink">_</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) =>
              item.href.startsWith('/#') ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="nav-link"
                  onClick={(e) => {
                    if (location.pathname === '/') {
                      e.preventDefault()
                      handleNavClick(item.href)
                    }
                  }}
                >
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} to={item.href} className="nav-link">
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* Social + Resume */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pixel-dim hover:text-neon-green transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon size={16} />
            </a>
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pixel-dim hover:text-neon-cyan transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={16} />
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pixel-dim hover:text-neon-pink transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon size={16} />
            </a>
            <a
              href={siteConfig.social.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-btn text-[9px] py-2 px-3 ml-2"
            >
              <FileText size={11} />
              Resume
            </a>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden text-pixel-dim hover:text-neon-green transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-bg-secondary border-b border-bg-border px-4 pb-4">
          <div className="flex flex-col gap-4 pt-4">
            {navItems.map((item) =>
              item.href.startsWith('/#') ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="nav-link text-left"
                  onClick={(e) => {
                    if (location.pathname === '/') {
                      e.preventDefault()
                      handleNavClick(item.href)
                    } else {
                      setMenuOpen(false)
                    }
                  }}
                >
                  &gt; {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="nav-link text-left"
                  onClick={() => setMenuOpen(false)}
                >
                  &gt; {item.label}
                </Link>
              )
            )}
            <div className="flex items-center gap-4 pt-2 border-t border-bg-border">
              <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="text-pixel-dim hover:text-neon-green transition-colors">
                <GithubIcon size={16} />
              </a>
              <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-pixel-dim hover:text-neon-cyan transition-colors">
                <LinkedinIcon size={16} />
              </a>
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="text-pixel-dim hover:text-neon-pink transition-colors">
                <InstagramIcon size={16} />
              </a>
              <a href={siteConfig.social.resume} target="_blank" rel="noopener noreferrer" className="pixel-btn text-[9px] py-2 px-3">
                <FileText size={11} /> Resume
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
