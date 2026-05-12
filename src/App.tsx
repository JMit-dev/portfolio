import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Index from './pages/Index'
import BlogList from './pages/BlogList'
import BlogPost from './pages/BlogPost'
import ProjectsList from './pages/ProjectsList'
import GamesList from './pages/GamesList'
import Admin from './pages/Admin'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/games" element={<GamesList />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
