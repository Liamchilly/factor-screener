import React, { useState, useEffect, useRef } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';
import WatchlistsPanel from '../components/WatchlistsPanel';

const POLYGON_KEY = process.env.REACT_APP_POLYGON_API_KEY;
const FMP_KEY = process.env.REACT_APP_FMP_API_KEY;

function CandlestickChart({ ticker, theme }) {
  const ref = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = createChart(ref.current, {
      width: ref.current.clientWidth,
      height: 300,
      layout: { background: { color: theme?.bgCard || '#0f172a' }, textColor: theme?.textSecondary || '#94a3b8' },
      grid: { vertLines: { color: theme?.border || '#1e293b' }, horzLines: { color: theme?.border || '#1e293b' } },
      rightPriceScale: { borderColor: theme?.border || '#1e293b' },
      timeScale: { borderColor: theme?.border || '#1e293b', timeVisible: true },
    });
    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#4ade80', downColor: '#f87171',
      borderUpColor: '#4ade80', borderDownColor: '#f87171',
      wickUpColor: '#4ade80', wickDownColor: '#f87171',
    });
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    const from = oneYearAgo.toISOString().split('T')[0];
    const to = today.toISOString().split('T')[0];
    fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=365&apiKey=${POLYGON_KEY}`)
      .then(r => r.json())
      .then(data => {
        if (!data.results?.length) { setError('No chart data.'); return; }
        series.setData(data.results.map(b => ({ time: b.t / 1000, open: b.o, high: b.h, low: b.l, close: b.c })));
        chart.timeScale().fitContent();
      })
      .catch(() => setError('Failed to load chart.'));
    const onResize = () => { if (ref.current) chart.applyOptions({ width: ref.current.clientWidth }); };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); chart.remove(); };
  }, [ticker]); // eslint-disable-line react-hooks/exhaustive-deps

  if (error) return <div style={{ color: theme?.textSecondary, fontSize: '13px' }}>{error}</div>;
  return <div ref={ref} style={{ width: '100%' }} />;
}

function StatCard({ label, value, theme }) {
  const t = theme || {};
  return (
    <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '12px 16px' }}>
      <div style={{ fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '18px', fontWeight: '700', color: t.text }}>{value}</div>
    </div>
  );
}

function fmtCap(n) {
  if (!n) return 'N/A';
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n}`;
}

function SearchPage({ theme, initialQuery }) {
  const t = theme || {};
  const [query, setQuery] = useState(initialQuery || '');
  const [inputVal, setInputVal] = useState(initialQuery || '');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const search = async (ticker) => {
    if (!ticker) return;
    const upper = ticker.toUpperCase().trim();
    setLoading(true);
    setNotFound(false);
    setData(null);
    try {
      const [prevRes, refRes] = await Promise.allSettled([
        fetch(`https://api.polygon.io/v2/aggs/ticker/${upper}/prev?adjusted=true&apiKey=${POLYGON_KEY}`).then(r => r.json()),
        fetch(`https://api.polygon.io/v3/reference/tickers/${upper}?apiKey=${POLYGON_KEY}`).then(r => r.json()),
      ]);

      const prev = prevRes.status === 'fulfilled' ? prevRes.value.results?.[0] : null;
      const ref = refRes.status === 'fulfilled' ? refRes.value.results : null;

      if (!prev && !ref) { setNotFound(true); setLoading(false); return; }

      const price = prev?.c;
      const change = prev?.c && prev?.o ? (((prev.c - prev.o) / prev.o) * 100).toFixed(2) : null;
      const volume = prev?.v;

      const partial = {
        ticker: upper,
        price, change, volume,
        name: ref?.name || upper,
        description: ref?.description || null,
        sector: ref?.sic_description || null,
        website: ref?.homepage_url || null,
        marketCap: ref?.market_cap || null,
      };
      setData(partial);
      setQuery(upper);

      if (FMP_KEY) {
        const [metricsRes, divRes, earningsRes] = await Promise.allSettled([
          fetch(`https://financialmodelingprep.com/api/v3/key-metrics/${upper}?limit=1&apiKey=${FMP_KEY}`).then(r => r.json()),
          fetch(`https://financialmodelingprep.com/api/v3/stock_dividend/${upper}?apiKey=${FMP_KEY}`).then(r => r.json()),
          fetch(`https://financialmodelingprep.com/api/v3/earning_calendar?symbol=${upper}&apiKey=${FMP_KEY}`).then(r => r.json()),
        ]);

        const metrics = metricsRes.status === 'fulfilled' && Array.isArray(metricsRes.value) ? metricsRes.value[0] : null;
        const divData = divRes.status === 'fulfilled' && Array.isArray(divRes.value) ? divRes.value : [];
        const earningsData = earningsRes.status === 'fulfilled' && Array.isArray(earningsRes.value) ? earningsRes.value : [];

        const avgVol = metrics?.averageVolume || null;
        const divPerShare = divData[0]?.dividend || null;
        const divFreq = divData[0]?.frequency || null;
        const today = new Date().toISOString().split('T')[0];
        const nextEarnings = earningsData.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0]?.date || null;

        setData(prev => ({
          ...prev,
          avgVolume: avgVol,
          divPerShare,
          divFreq,
          nextEarnings,
        }));
      }
    } catch (e) {
      setNotFound(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialQuery) search(initialQuery); // eslint-disable-line react-hooks/exhaustive-deps
  }, [initialQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKey = (e) => {
    if (e.key === 'Enter') search(inputVal);
  };

  const change = data?.change != null ? parseFloat(data.change) : null;
  const changeColor = change === null ? t.textMuted : change >= 0 ? '#16a34a' : '#dc2626';

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
        <input
          type="text"
          value={inputVal}
          onChange={e => setInputVal(e.target.value.toUpperCase())}
          onKeyDown={handleKey}
          placeholder="Enter ticker symbol..."
          style={{
            width: '260px',
            padding: '10px 16px',
            background: t.inputBg,
            border: `1px solid ${t.inputBorder}`,
            borderRadius: '8px',
            color: t.text,
            fontSize: '14px',
            outline: 'none',
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase',
          }}
        />
        <button
          onClick={() => search(inputVal)}
          style={{ background: t.accent, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
        >
          Search
        </button>
      </div>

      {loading && <div style={{ color: t.textMuted, fontSize: '14px' }}>Loading…</div>}

      {notFound && !loading && query && (
        <div style={{ color: t.textSecondary, fontSize: '14px', padding: '40px 0' }}>
          No results found for <strong>'{query}'</strong>. Please check the ticker symbol and try again.
        </div>
      )}

      {data && !loading && (
        <>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: t.text, letterSpacing: '-0.02em', margin: '0 0 4px 0' }}>
            {data.ticker} <span style={{ fontSize: '16px', fontWeight: '400', color: t.textSecondary }}>{data.name}</span>
          </h1>
          {data.sector && <div style={{ fontSize: '13px', color: t.textMuted, marginBottom: '20px' }}>{data.sector}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', marginBottom: '28px' }}>
            <StatCard label="Price" value={data.price ? `$${Number(data.price).toFixed(2)}` : '—'} theme={theme} />
            <StatCard label="Day Change" value={
              <span style={{ color: changeColor }}>{change === null ? '—' : `${change >= 0 ? '+' : ''}${change}%`}</span>
            } theme={theme} />
            <StatCard label="Market Cap" value={fmtCap(data.marketCap)} theme={theme} />
            <StatCard label="Volume" value={data.volume ? Number(data.volume).toLocaleString() : '—'} theme={theme} />
            <StatCard label="Avg Volume" value={data.avgVolume ? Number(data.avgVolume).toLocaleString() : '—'} theme={theme} />
            <StatCard label="Div / Share" value={data.divPerShare != null ? `$${Number(data.divPerShare).toFixed(2)}` : '—'} theme={theme} />
            <StatCard label="Div Frequency" value={data.divFreq || '—'} theme={theme} />
            <StatCard label="Next Earnings" value={data.nextEarnings || '—'} theme={theme} />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
              1 Year Price History
            </div>
            <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '10px', overflow: 'hidden', padding: '4px' }}>
              <CandlestickChart ticker={data.ticker} theme={theme} />
            </div>
          </div>

          {data.description && (
            <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '20px 24px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>About</div>
              <p style={{ fontSize: '14px', color: t.textSecondary, lineHeight: '1.7', margin: '0 0 12px 0' }}>
                {data.description.length > 600 ? data.description.slice(0, 600) + '…' : data.description}
              </p>
              {data.website && (
                <a href={data.website} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', color: t.accent }}>
                  {data.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Markets({ theme, activeSubPage, searchQuery }) {
  if (activeSubPage === 'watchlists') {
    return (
      <div style={{ padding: '40px 32px', maxWidth: '1200px', margin: '0 auto', minHeight: 'calc(100vh - 56px)', background: theme?.gradientSubtle }}>
        <WatchlistsPanel theme={theme} />
      </div>
    );
  }
  return <SearchPage theme={theme} initialQuery={searchQuery} key={searchQuery} />;
}

export default Markets;
