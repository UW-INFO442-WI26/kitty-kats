import { BrowserRouter, Routes, Route } from 'react-router';
import About from './pages/About'
import Home from './pages/Home';
import Modules from './pages/Modules';
import ModuleOverview from './pages/ModuleOverview';
import Quiz from './pages/Quiz';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import Profile from './pages/Profile';
import Resources from './pages/Resources'; 
import Flashcards from './pages/Flashcards';


function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/module/:id" element={<ModuleOverview />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/resources" element={<Resources/>} />
            <Route path="/flashcards" element={<Flashcards/>} />
            <Route path="/flashcards/:id" element={<Flashcards/>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
