import Hero from '../components/Hero'
import About from '../components/About'
import Experience from '../components/Experience'
import Education from '../components/Education'
import Projects from '../components/Projects'
import Games from '../components/Games'
import Achievements from '../components/Achievements'
import BlogPreview from '../components/BlogPreview'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Index() {
  return (
    <main>
      <Hero />
      <About />
      <Experience />
      <Education />
      <Projects />
      <Games />
      <Achievements />
      <BlogPreview />
      <Contact />
      <Footer />
    </main>
  )
}
