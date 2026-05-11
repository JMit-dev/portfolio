import { useState } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '../data/portfolio'
import { Send, Mail } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    // Opens mail client as a fallback — swap for a form backend (Formspree, EmailJS, etc.) if desired
    const subject = encodeURIComponent(`Message from ${form.name}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`
    setStatus('sent')
  }

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="section-heading"
        >
          Contact
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-retro text-xl text-pixel-dim mb-8 leading-relaxed"
        >
          My inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-pixel text-[9px] text-pixel-dim">Name</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-bg-card border-2 border-bg-border focus:border-neon-green outline-none px-3 py-2 font-retro text-lg text-pixel-light transition-colors"
                placeholder="Player 1"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-pixel text-[9px] text-pixel-dim">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="bg-bg-card border-2 border-bg-border focus:border-neon-green outline-none px-3 py-2 font-retro text-lg text-pixel-light transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-pixel text-[9px] text-pixel-dim">Message</label>
            <textarea
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="bg-bg-card border-2 border-bg-border focus:border-neon-green outline-none px-3 py-2 font-retro text-lg text-pixel-light transition-colors resize-none"
              placeholder="Enter your message..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" className="pixel-btn" disabled={status === 'sending'}>
              <Send size={13} />
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>
            <a href={`mailto:${siteConfig.email}`} className="pixel-btn pixel-btn-cyan">
              <Mail size={13} />
              {siteConfig.email}
            </a>
          </div>

          {status === 'sent' && (
            <p className="font-pixel text-[9px] text-neon-green">&gt; Message queued! Opening mail client...</p>
          )}
        </motion.form>
      </div>
    </section>
  )
}
