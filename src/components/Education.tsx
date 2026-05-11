import { motion } from 'framer-motion'
import { education } from '../data/portfolio'
import { GraduationCap, ExternalLink } from 'lucide-react'


export default function Education() {
  return (
    <section id="education" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="section-heading"
        >
          Education
        </motion.h2>

        <div className="grid sm:grid-cols-2 gap-6">
          {education.map((edu, i) => (
            <motion.div
              key={edu.school}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`pixel-card p-6 ${i === 0 ? 'pixel-card' : 'pixel-card-cyan'}`}
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 border-2 flex items-center justify-center mb-4 ${
                  i === 0 ? 'border-neon-green text-neon-green' : 'border-neon-cyan text-neon-cyan'
                }`}
              >
                <GraduationCap size={18} />
              </div>

              {/* Degree */}
              <div
                className={`font-pixel text-[10px] mb-2 ${
                  i === 0 ? 'text-neon-green' : 'text-neon-cyan'
                }`}
              >
                {edu.degree}
              </div>

              {/* School */}
              <a
                href={edu.schoolUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-retro text-xl text-pixel-light hover:text-neon-green transition-colors mb-1 group"
              >
                {edu.school}
                <ExternalLink size={12} className="opacity-0 group-hover:opacity-100" />
              </a>

              {/* Period */}
              <div className="font-mono text-xs text-pixel-dark mb-3">{edu.period}</div>

              {/* GPA + Note + Focus */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="badge badge-yellow">GPA {edu.gpa}</span>
                </div>
                <p className="font-retro text-lg text-pixel-dim leading-snug">{edu.focus}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
