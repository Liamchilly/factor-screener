import React, { useState, useCallback } from 'react';

const POLYGON_KEY = process.env.REACT_APP_POLYGON_API_KEY;
const LS_KEY = 'bullet_watchlists';

function loadWatchlists() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveWatchlists(lists) {
  localStorage.setItem(LS_KEY, JSON.stringify(lists));
}

function WatchlistsPanel({ theme }) {
  const t = theme || {};
  const [watchlists, setWatchlists] = useState(loadWatchlists);
  const [expanded, setExpanded] = useState({});
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [addTicker, setAddTicker] = useState({});
  const [priceCache, setPriceCache] = useState({});

  const persist = (updated) => {
    setWatchlists(updated);
    saveWatchlists(updated);
  };

  const createWatchlist = () => {
    if (!newName.trim()) return;
    const updated = [...watchlists, { id: Date.now().toString(), name: newName.trim(), tickers: [] }];
    persist(updated);
    setNewName('');
    setCreating(false);
  };

  const deleteWatchlist = (id, name) => {
    if (!window.confirm(`Delete watchlist "${name}"?`)) return;
    persist(watchlists.filter(w => w.id !== id));
  };

  const addTickerToWatchlist = (id) => {
    const ticker = (addTicker[id] || '').trim().toUpperCase();
    if (!ticker) return;
    const updated = watchlists.map(w =>
      w.id === id && !w.tickers.includes(ticker)
        ? { ...w, tickers: [...w.tickers, ticker] }
        : w
    );
    persist(updated);
    setAddTicker(prev => ({ ...prev, [id]: '' }));
  };

  const removeTicker = (id, ticker) => {
    const updated = watchlists.map(w =>
      w.id === id ? { ...w, tickers: w.tickers.filter(t => t !== ticker) } : w
    );
    persist(updated);
  };

  const fetchPrices = useCallback(async (tickers) => {
    const missing = tickers.filter(t => !priceCache[t]);
    if (missing.length === 0) return;
    const results = await Promise.allSettled(
      missing.map(ticker =>
        fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_KEY}`)
          .then(r => r.json())
          .then(data => ({ ticker, data: data.results?.[0] || null }))
      )
    );
    const updates = {};
    results.forEach(r => {
      if (r.status === 'fulfilled' && r.value.data) {
        const d = r.value.data;
        updates[r.value.ticker] = {
          price: d.c,
          change: d.c && d.o ? (((d.c - d.o) / d.o) * 100).toFixed(2) : null,
        };
      } else if (r.status === 'fulfilled') {
        updates[r.value.ticker] = null;
      }
    });
    setPriceCache(prev => ({ ...prev, ...updates }));
  }, [priceCache]);

  const toggleExpand = (id, tickers) => {
    const isOpen = !expanded[id];
    setExpanded(prev => ({ ...prev, [id]: isOpen }));
    if (isOpen && tickers.length > 0) fetchPrices(tickers);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: t.text, margin: 0, letterSpacing: '-0.02em' }}>
          My Watchlists
        </h2>
        <button
          onClick={() => setCreating(true)}
          style={{
            background: t.accent,
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          + New Watchlist
        </button>
      </div>

      {creating && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') createWatchlist(); if (e.key === 'Escape') { setCreating(false); setNewName(''); } }}
            placeholder="Watchlist name..."
            style={{
              flex: 1,
              padding: '8px 12px',
              background: t.inputBg,
              border: `1px solid ${t.inputBorder}`,
              borderRadius: '8px',
              color: t.text,
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
          />
          <button onClick={createWatchlist} style={{ background: t.accent, color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: '600' }}>✓</button>
          <button onClick={() => { setCreating(false); setNewName(''); }} style={{ background: t.bgTertiary, color: t.textSecondary, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '8px 14px', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {watchlists.length === 0 && !creating && (
        <div style={{ color: t.textMuted, fontSize: '14px', padding: '32px 0', textAlign: 'center' }}>
          No watchlists yet. Create one to start tracking stocks.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {watchlists.map(wl => {
          const isOpen = !!expanded[wl.id];
          return (
            <div key={wl.id} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '10px', overflow: 'hidden', boxShadow: t.shadow }}>
              <div
                onClick={() => toggleExpand(wl.id, wl.tickers)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 18px',
                  cursor: 'pointer',
                  background: isOpen ? t.bgTertiary : 'transparent',
                }}
              >
                <span style={{
                  display: 'inline-block',
                  fontSize: '10px',
                  color: t.textMuted,
                  transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  marginRight: '10px',
                }}>▶</span>
                <span style={{ fontWeight: '600', fontSize: '15px', color: t.text, flex: 1 }}>{wl.name}</span>
                <span style={{ fontSize: '12px', color: t.textMuted, marginRight: '12px' }}>{wl.tickers.length} stock{wl.tickers.length !== 1 ? 's' : ''}</span>
                <button
                  onClick={e => { e.stopPropagation(); deleteWatchlist(wl.id, wl.name); }}
                  style={{ background: 'transparent', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '14px', padding: '2px 6px' }}
                  title="Delete watchlist"
                >
                  🗑
                </button>
              </div>

              {isOpen && (
                <div style={{ borderTop: `1px solid ${t.border}` }}>
                  {wl.tickers.length > 0 && (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: t.tableHeader }}>
                          {['Ticker', 'Price', 'Day Change'].map(h => (
                            <th key={h} style={{ padding: '8px 16px', fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left' }}>{h}</th>
                          ))}
                          <th style={{ width: '32px' }} />
                        </tr>
                      </thead>
                      <tbody>
                        {wl.tickers.map((ticker, i) => {
                          const info = priceCache[ticker];
                          const change = info?.change != null ? parseFloat(info.change) : null;
                          return (
                            <tr key={ticker} style={{ background: i % 2 === 0 ? t.bgCard : t.bgSecondary, borderTop: `1px solid ${t.border}` }}>
                              <td style={{ padding: '10px 16px', fontWeight: '700', color: t.accent, fontSize: '14px' }}>{ticker}</td>
                              <td style={{ padding: '10px 16px', fontSize: '14px', color: t.text }}>
                                {info === undefined ? <span style={{ color: t.textMuted, fontSize: '12px' }}>Loading...</span>
                                  : info === null ? <span style={{ color: t.textMuted }}>—</span>
                                  : `$${Number(info.price).toFixed(2)}`}
                              </td>
                              <td style={{ padding: '10px 16px', fontSize: '14px', fontWeight: '600', color: change === null ? t.textMuted : change >= 0 ? '#16a34a' : '#dc2626' }}>
                                {change === null ? '—' : `${change >= 0 ? '+' : ''}${change}%`}
                              </td>
                              <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                                <button
                                  onClick={() => removeTicker(wl.id, ticker)}
                                  style={{ background: 'transparent', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '13px' }}
                                >✕</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}

                  <div style={{ padding: '10px 16px', display: 'flex', gap: '8px', borderTop: wl.tickers.length > 0 ? `1px solid ${t.border}` : 'none' }}>
                    <input
                      type="text"
                      value={addTicker[wl.id] || ''}
                      onChange={e => setAddTicker(prev => ({ ...prev, [wl.id]: e.target.value.toUpperCase() }))}
                      onKeyDown={e => { if (e.key === 'Enter') addTickerToWatchlist(wl.id); }}
                      placeholder="Add ticker..."
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        background: t.inputBg,
                        border: `1px solid ${t.inputBorder}`,
                        borderRadius: '6px',
                        color: t.text,
                        fontSize: '13px',
                        outline: 'none',
                        fontFamily: 'Inter, sans-serif',
                        textTransform: 'uppercase',
                      }}
                    />
                    <button
                      onClick={() => addTickerToWatchlist(wl.id)}
                      style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}`, color: t.accentText, borderRadius: '6px', padding: '6px 12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WatchlistsPanel;
