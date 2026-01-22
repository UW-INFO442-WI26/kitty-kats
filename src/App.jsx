import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import About from './About'
import Home from './Home';

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
