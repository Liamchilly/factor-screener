import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Strategy from './pages/Strategy';
import Factors from './pages/Factors';
import Screener from './pages/Screener';
import Portfolio from './pages/Portfolio';

export const ThemeContext = React.createContext();
export const useTheme = () => React.useContext(ThemeContext);

const lightTheme = {
  bg: '#f8f9fb',
  bgSecondary: '#ffffff',
  bgTertiary: '#f1f5f9',
  bgCard: '#ffffff',
  bgCardHover: '#f8fafc',
  border: '#e2e8f0',
  borderStrong: '#cbd5e1',
  text: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  accent: '#166534',
  accentBright: '#16a34a',
  accentBg: '#f0fdf4',
  accentBorder: '#bbf7d0',
  accentText: '#166534',
  navBg: '#ffffff',
  navBorder: '#e2e8f0',
  navShadow: '0 1px 3px rgba(0,0,0,0.08)',
  tableHeader: '#f8fafc',
  tableRowHover: '#f8fafc',
  tableRowAlt: '#ffffff',
  scoreHigh: { bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
  scoreMid: { bg: '#fefce8', color: '#854d0e', border: '#fde68a' },
  scoreLow: { bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
  tagBg: '#f0fdf4',
  tagBorder: '#bbf7d0',
  tagText: '#166534',
  inputBg: '#ffffff',
  inputBorder: '#e2e8f0',
  shadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  shadowMd: '0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.04)',
  progressBg: '#e2e8f0',
  progressFill: '#16a34a',
  gradientSubtle: 'linear-gradient(135deg, #f8f9fb 0%, #f0f7f4 100%)',
};

const darkTheme = {
  bg: '#0a0f1e',
  bgSecondary: '#0f172a',
  bgTertiary: '#1e293b',
  bgCard: '#0f172a',
  bgCardHover: '#1e293b',
  border: '#1e293b',
  borderStrong: '#334155',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#475569',
  accent: '#4ade80',
  accentBright: '#4ade80',
  accentBg: '#0f2a1a',
  accentBorder: '#4ade80',
  accentText: '#4ade80',
  navBg: '#0f172a',
  navBorder: '#1e293b',
  navShadow: 'none',
  tableHeader: '#0f172a',
  tableRowHover: '#1e293b',
  tableRowAlt: '#0a0f1e',
  scoreHigh: { bg: '#0f2a1a', color: '#4ade80', border: '#4ade80' },
  scoreMid: { bg: '#1a1a0f', color: '#facc15', border: '#facc15' },
  scoreLow: { bg: '#1a0f0f', color: '#f87171', border: '#f87171' },
  tagBg: '#0f2a1a',
  tagBorder: '#4ade80',
  tagText: '#4ade80',
  inputBg: '#1e293b',
  inputBorder: '#334155',
  shadow: '0 1px 3px rgba(0,0,0,0.3)',
  shadowMd: '0 4px 6px rgba(0,0,0,0.4)',
  progressBg: '#1e293b',
  progressFill: '#4ade80',
  gradientSubtle: 'linear-gradient(135deg, #0a0f1e 0%, #0f1f14 100%)',
};

function AppInner() {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  const [selectedFactors, setSelectedFactors] = useState([]);
  const [subSelections, setSubSelections] = useState({});
  const [weights, setWeights] = useState({});
  const [portfolio, setPortfolio] = useState([]);
  const [portfolioTotal, setPortfolioTotal] = useState(0);
  const [cachedResults, setCachedResults] = useState(null);
  const [cacheKey, setCacheKey] = useState(null);
  const [factorsKey, setFactorsKey] = useState(0);
  const [initialFactors, setInitialFactors] = useState([]);
  const [initialSubSelections, setInitialSubSelections] = useState({});
  const [initialWeights, setInitialWeights] = useState({});
  const navigate = useNavigate();

  const handleViewStocks = (factors, subs, w) => {
    setSelectedFactors(factors || []);
    setSubSelections(subs || {});
    setWeights(w || {});
    navigate('/screener');
  };

  const handleViewPortfolio = () => navigate('/portfolio');

  const handleSelectStrategy = (factors, subs, initialW) => {
    setInitialFactors(factors || []);
    setInitialSubSelections(subs || {});
    setInitialWeights(initialW || {});
    setFactorsKey(prev => prev + 1);
    navigate('/factors');
  };

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, theme }}>
      <div style={{ background: isDark ? '#0a0f1e' : '#f8f9fb', minHeight: '100vh' }}>
        <Navbar theme={theme} isDark={isDark} setIsDark={setIsDark} />
        <Routes>
          <Route path="/" element={<Strategy onSelectStrategy={handleSelectStrategy} theme={theme} />} />
          <Route
            path="/factors"
            element={
              <Factors
                key={factorsKey}
                initialFactors={initialFactors}
                initialSubSelections={initialSubSelections}
                initialWeights={initialWeights}
                onViewStocks={handleViewStocks}
                theme={theme}
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
                theme={theme}
                isDark={isDark}
                onViewPortfolio={handleViewPortfolio}
              />
            }
          />
          <Route
            path="/portfolio"
            element={<Portfolio portfolio={portfolio} setPortfolio={setPortfolio} portfolioTotal={portfolioTotal} setPortfolioTotal={setPortfolioTotal} theme={theme} isDark={isDark} />}
          />
        </Routes>
      </div>
    </ThemeContext.Provider>
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
