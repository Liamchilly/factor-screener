import React from 'react';

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'markets', label: 'Markets' },
  { id: 'invest', label: 'Invest' },
  { id: 'insider', label: 'Insider Trades' },
  { id: 'learn', label: 'Learn' },
  { id: 'askai', label: 'Ask AI' },
];

function Navbar({ theme, isDark, setIsDark, activeTab, setActiveTab, pendingSearch, setPendingSearch, onSearch }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && pendingSearch.trim()) {
      onSearch(pendingSearch.trim());
      setPendingSearch('');
    }
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      height: '56px',
      background: theme.navBg,
      borderBottom: `1px solid ${theme.navBorder}`,
      boxShadow: theme.navShadow,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        color: theme.accent,
        fontWeight: '700',
        fontSize: '16px',
        letterSpacing: '-0.02em',
        flexShrink: 0,
        marginRight: '16px',
        whiteSpace: 'nowrap',
      }}>
        Bullet Investing
      </div>

      <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                color: isActive ? theme.accent : theme.textSecondary,
                background: 'none',
                border: 'none',
                borderBottom: isActive ? `2px solid ${theme.accent}` : '2px solid transparent',
                padding: '0 11px',
                height: '56px',
                fontSize: '13px',
                fontWeight: isActive ? '600' : '500',
                cursor: 'pointer',
                lineHeight: '56px',
                transition: 'color 0.15s ease',
                whiteSpace: 'nowrap',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 12px' }}>
        <input
          type="text"
          value={pendingSearch}
          onChange={e => setPendingSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search stocks..."
          style={{
            width: '240px',
            height: '32px',
            background: theme.inputBg,
            border: `1px solid ${theme.inputBorder}`,
            borderRadius: '20px',
            fontSize: '13px',
            padding: '0 14px',
            color: theme.text,
            outline: 'none',
            fontFamily: 'Inter, sans-serif',
          }}
        />
      </div>

      <button
        onClick={() => setIsDark(!isDark)}
        style={{
          width: '52px',
          height: '28px',
          borderRadius: '999px',
          background: isDark ? '#1e293b' : '#e2e8f0',
          border: `1px solid ${theme.border}`,
          position: 'relative',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
        }}
        aria-label="Toggle theme"
      >
        <span style={{
          position: 'absolute',
          top: '3px',
          left: '0',
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          background: isDark ? '#334155' : '#ffffff',
          transform: isDark ? 'translateX(26px)' : 'translateX(2px)',
          transition: 'transform 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }}>
          {isDark ? '🌙' : '☀️'}
        </span>
      </button>
    </nav>
  );
}

export default Navbar;
