import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Strategy from './pages/Strategy';
import Screener from './pages/Screener';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <BrowserRouter>
      <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Strategy />} />
          <Route path="/screener" element={<Screener />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;