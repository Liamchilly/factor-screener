import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ theme, isDark, setIsDark }) {
  const location = useLocation();

  const tabs = [
    { path: '/', label: 'Strategy' },
    { path: '/factors', label: 'Factors' },
    { path: '/screener', label: 'Stock Screener' },
    { path: '/portfolio', label: 'My Portfolio' },
  ];

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      height: '56px',
      background: theme.navBg,
      borderBottom: `1px solid ${theme.navBorder}`,
      boxShadow: theme.navShadow,
      position: 'relative',
      zIndex: 10,
    }}>
      <div style={{
        color: theme.accent,
        fontWeight: '600',
        fontSize: '18px',
        letterSpacing: '-0.01em',
        flexShrink: 0,
      }}>
        FactorScreener
      </div>

      <div style={{ display: 'flex', gap: '4px' }}>
        {tabs.map(tab => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              style={{
                color: isActive ? theme.accent : theme.textSecondary,
                textDecoration: 'none',
                padding: '6px 14px',
                fontSize: '14px',
                fontWeight: '500',
                borderBottom: isActive ? `2px solid ${theme.accent}` : '2px solid transparent',
                lineHeight: '44px',
                transition: 'color 0.15s ease',
              }}
            >
              {tab.label}
            </Link>
          );
        })}
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
