import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Strategy from './pages/Strategy';
import Factors from './pages/Factors';
import Screener from './pages/Screener';
import Portfolio from './pages/Portfolio';

function AppInner() {
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [subSelections, setSubSelections] = useState({});
  const [weights, setWeights] = useState({});
  const [portfolio, setPortfolio] = useState([]);
  const [cachedResults, setCachedResults] = useState(null);
  const [cacheKey, setCacheKey] = useState(null);
  const [factorsKey, setFactorsKey] = useState(0);
  const [initialFactors, setInitialFactors] = useState([]);
  const [initialSubSelections, setInitialSubSelections] = useState({});
  const navigate = useNavigate();

  const handleViewStocks = (factors, subs, w) => {
    setSelectedFactors(factors || []);
    setSubSelections(subs || {});
    setWeights(w || {});
    navigate('/screener');
  };

  const handleSelectStrategy = (factors, subs) => {
    setInitialFactors(factors || []);
    setInitialSubSelections(subs || {});
    setFactorsKey(prev => prev + 1);
    navigate('/factors');
  };

  return (
    <div style={{ background: '#0a0f1e', minHeight: '100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Strategy onSelectStrategy={handleSelectStrategy} />} />
        <Route
          path="/factors"
          element={
            <Factors
              key={factorsKey}
              initialFactors={initialFactors}
              initialSubSelections={initialSubSelections}
              onViewStocks={handleViewStocks}
            />
          }
        />
        <Route
          path="/screener"
          element={
            <Screener
              selectedFactors={selectedFactors}
              subSelections={subSelections || {}}
              weights={weights || {}}
              portfolio={portfolio}
              setPortfolio={setPortfolio}
              cachedResults={cachedResults}
              setCachedResults={setCachedResults}
              cacheKey={cacheKey}
              setCacheKey={setCacheKey}
            />
          }
        />
        <Route
          path="/portfolio"
          element={<Portfolio portfolio={portfolio} setPortfolio={setPortfolio} />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;
