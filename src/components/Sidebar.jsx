import React from 'react';

const SIDEBAR_CONFIG = {
  markets: [
    { key: 'search', label: 'Search' },
    { key: 'watchlists', label: 'Watchlists' },
  ],
  invest: [
    { key: 'strategy', label: 'Strategy' },
    { key: 'factors', label: 'Factors' },
    { key: 'screener', label: 'Stock Screener' },
    { key: 'portfolio', label: 'My Portfolio' },
  ],
  insider: [
    { key: 'congress', label: 'Congress' },
    { key: 'big-investors', label: 'Big Investors' },
  ],
  learn: [
    { key: 'getting-started', label: 'Getting Started' },
    { key: 'etfs', label: 'ETFs' },
    { key: 'reading-charts', label: 'Reading Charts' },
    { key: 'understanding-risk', label: 'Understanding Risk' },
    { key: 'diversification', label: 'Diversification' },
    { key: 'how-markets-work', label: 'How Markets Work' },
    { key: 'index-funds', label: 'Index Funds' },
    { key: 'quiz', label: 'Quiz' },
    { key: 'glossary', label: 'Glossary' },
  ],
};

function Sidebar({ activeTab, activeSubPage, setActiveSubPage, theme }) {
  const items = SIDEBAR_CONFIG[activeTab];
  if (!items) return null;

  return (
    <div style={{
      width: '220px',
      minWidth: '220px',
      background: theme.bgCard,
      borderRight: `1px solid ${theme.border}`,
      minHeight: 'calc(100vh - 56px)',
      paddingTop: '16px',
      flexShrink: 0,
    }}>
      {items.map(item => {
        const isActive = activeSubPage === item.key;
        return (
          <div
            key={item.key}
            onClick={() => setActiveSubPage(item.key)}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              color: isActive ? theme.accent : theme.textSecondary,
              fontWeight: isActive ? '600' : '400',
              background: isActive ? theme.accentBg : 'transparent',
              borderLeft: isActive ? `3px solid ${theme.accent}` : '3px solid transparent',
              transition: 'background 0.1s ease, color 0.1s ease',
            }}
          >
            {item.label}
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;
