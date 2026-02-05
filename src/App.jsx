import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router';
import About from './pages/About'
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
