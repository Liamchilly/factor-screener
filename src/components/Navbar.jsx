import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const tabs = [
    { path: '/', label: 'Strategy' },
    { path: '/factors', label: 'Factors' },
    { path: '/screener', label: 'Stock Screener' },
    { path: '/portfolio', label: 'My Portfolio' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>FactorScreener</div>
      <div style={styles.tabs}>
        {tabs.map(tab => (
          <Link
            key={tab.path}
            to={tab.path}
            style={{
              ...styles.tab,
              ...(location.pathname === tab.path ? styles.activeTab : {})
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 32px',
    height: '60px',
    background: '#0f172a',
    borderBottom: '1px solid #1e293b',
  },
  brand: {
    color: '#4ade80',
    fontWeight: '700',
    fontSize: '18px',
    marginRight: '40px',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
  },
  tab: {
    color: '#94a3b8',
    textDecoration: 'none',
    padding: '6px 16px',
    borderRadius: '6px',
    fontSize: '14px',
  },
  activeTab: {
    color: '#f1f5f9',
    background: '#1e293b',
  },
};

export default Navbar;