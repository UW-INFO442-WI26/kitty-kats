import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router';
import './App.css'
import About from './pages/About'
import Home from './pages/Home';

function App() {
  return (
    <>
      <BrowserRouter>
        <nav>
          <Link to="/">Home</Link> | <Link to="/about">About</Link>
        </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
