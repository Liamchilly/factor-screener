import React, { useState, useEffect } from 'react';
import WatchlistsPanel from '../components/WatchlistsPanel';

const POLYGON_KEY = process.env.REACT_APP_POLYGON_API_KEY;

const MARKET_INDICES = [
  { ticker: 'SPY', label: 'S&P 500' },
  { ticker: 'QQQ', label: 'Nasdaq' },
  { ticker: 'DIA', label: 'Dow Jones' },
  { ticker: 'VTHR', label: 'Russell 3000' },
  { ticker: 'VIXY', label: 'VIX' },
];

function Sparkline({ data, color }) {
  if (!data || data.length < 2) return <div style={{ height: '48px' }} />;
  const values = data.map(d => d.c);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const W = 200;
  const H = 48;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * W;
    const y = H - 4 - ((v - min) / range) * (H - 8);
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MarketCard({ index, theme }) {
  const t = theme || {};
  const [data, setData] = useState(null);
  const [intraday, setIntraday] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    Promise.allSettled([
      fetch(`https://api.polygon.io/v2/aggs/ticker/${index.ticker}/prev?adjusted=true&apiKey=${POLYGON_KEY}`).then(r => r.json()),
      fetch(`https://api.polygon.io/v2/aggs/ticker/${index.ticker}/range/5/minute/${today}/${today}?adjusted=true&sort=asc&limit=100&apiKey=${POLYGON_KEY}`).then(r => r.json()),
    ]).then(([prevRes, intradayRes]) => {
      if (prevRes.status === 'fulfilled') {
        const r = prevRes.value.results?.[0];
        if (r) setData({ price: r.c, change: r.c && r.o ? (((r.c - r.o) / r.o) * 100).toFixed(2) : null });
      }
      if (intradayRes.status === 'fulfilled') {
        setIntraday(intradayRes.value.results || null);
      }
      setLoading(false);
    });
  }, [index.ticker]);

  const change = data?.change != null ? parseFloat(data.change) : null;
  const changeColor = change === null ? t.textMuted : change >= 0 ? '#16a34a' : '#dc2626';
  const sparkColor = change === null ? t.textMuted : change >= 0 ? '#16a34a' : '#dc2626';

  return (
    <div style={{
      background: t.bgCard,
      border: `1px solid ${t.border}`,
      borderRadius: '10px',
      padding: '16px 20px',
      boxShadow: t.shadow,
      flex: '1',
      minWidth: '150px',
    }}>
      <div style={{ fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
        {index.label}
      </div>
      {loading ? (
        <div style={{ color: t.textMuted, fontSize: '13px' }}>Loading…</div>
      ) : (
        <>
          <div style={{ fontSize: '22px', fontWeight: '700', color: t.text, letterSpacing: '-0.02em' }}>
            {data?.price != null ? `$${Number(data.price).toFixed(2)}` : '—'}
          </div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: changeColor, marginBottom: '10px' }}>
            {change === null ? '—' : `${change >= 0 ? '+' : ''}${change}%`}
          </div>
          <Sparkline data={intraday} color={sparkColor} />
        </>
      )}
    </div>
  );
}

function Home({ theme, isDark }) {
  const t = theme || {};

  return (
    <div style={{
      padding: '40px 32px',
      maxWidth: '1200px',
      margin: '0 auto',
      color: t.text,
      background: t.gradientSubtle,
      minHeight: 'calc(100vh - 56px)',
    }}>
      <WatchlistsPanel theme={theme} />

      <div style={{ height: '1px', background: t.border, margin: '40px 0' }} />

      <h2 style={{ fontSize: '20px', fontWeight: '700', color: t.text, margin: '0 0 20px 0', letterSpacing: '-0.02em' }}>
        Market Overview
      </h2>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {MARKET_INDICES.map(idx => (
          <MarketCard key={idx.ticker} index={idx} theme={theme} />
        ))}
      </div>
    </div>
  );
}

export default Home;
