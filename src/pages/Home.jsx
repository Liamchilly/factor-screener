import React from 'react';
import WatchlistsPanel from '../components/WatchlistsPanel';
import marketData from '../data/marketData.json';

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

function MarketCard({ label, price, change, intraday, theme }) {
  const t = theme || {};
  const changeNum = change != null ? parseFloat(change) : null;
  const changeColor = changeNum === null ? t.textMuted : changeNum >= 0 ? '#16a34a' : '#dc2626';
  const sparkColor = changeColor;

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
        {label}
      </div>
      <div style={{ fontSize: '22px', fontWeight: '700', color: t.text, letterSpacing: '-0.02em' }}>
        {price != null ? `$${Number(price).toFixed(2)}` : '—'}
      </div>
      <div style={{ fontSize: '13px', fontWeight: '600', color: changeColor, marginBottom: '10px' }}>
        {changeNum === null ? '—' : `${changeNum >= 0 ? '+' : ''}${changeNum.toFixed(2)}%`}
      </div>
      <Sparkline data={intraday} color={sparkColor} />
    </div>
  );
}

function calcVixScore(price) {
  if (price === null) return null;
  if (price < 12) return 40;
  if (price < 15) return 32;
  if (price < 20) return 24;
  if (price < 25) return 16;
  if (price < 30) return 8;
  return 0;
}

function calcSpyScore(weekChange) {
  if (weekChange === null) return null;
  if (weekChange > 3) return 35;
  if (weekChange > 1) return 26;
  if (weekChange > 0) return 18;
  if (weekChange > -1) return 9;
  return 0;
}

function scoreLabel(score) {
  if (score === null) return { text: '—', color: null };
  if (score < 25) return { text: 'Extreme Fear', color: '#dc2626' };
  if (score < 40) return { text: 'Fear', color: '#f97316' };
  if (score < 60) return { text: 'Neutral', color: '#eab308' };
  if (score < 75) return { text: 'Greed', color: '#22c55e' };
  return { text: 'Extreme Greed', color: '#16a34a' };
}

function FearAndGreed({ score, vixPrice, spyWeekChange, theme }) {
  const t = theme || {};

  const vixScore = calcVixScore(vixPrice);
  const spyScore = calcSpyScore(spyWeekChange);

  const { text: label, color: gaugeColor } = scoreLabel(score);
  const color = gaugeColor || t.textMuted;

  const W = 280;
  const H = 118;
  const cx = 140;
  const cy = 112;
  const R = 92;
  const strokeW = 15;

  const arcPoint = (s, radius) => {
    const angleDeg = 180 - (s / 100) * 180;
    const rad = angleDeg * Math.PI / 180;
    return {
      x: +(cx + radius * Math.cos(rad)).toFixed(3),
      y: +(cy - radius * Math.sin(rad)).toFixed(3),
    };
  };

  const bgStart = { x: cx - R, y: cy };
  const bgEnd = { x: cx + R, y: cy };
  const scorePt = score !== null ? arcPoint(score, R) : null;
  const needlePt = score !== null ? arcPoint(score, R - 22) : null;

  const zoneColors = ['#dc2626', '#f97316', '#eab308', '#22c55e', '#16a34a'];
  const zoneBands = [0, 20, 40, 60, 80, 100];

  return (
    <div style={{
      background: t.bgCard,
      border: `1px solid ${t.border}`,
      borderRadius: '10px',
      padding: '28px 32px',
      boxShadow: t.shadow,
      display: 'flex',
      alignItems: 'center',
      gap: '40px',
      flexWrap: 'wrap',
    }}>
      <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
          {zoneColors.map((zc, i) => {
            const p0 = arcPoint(zoneBands[i], R);
            const p1 = arcPoint(zoneBands[i + 1], R);
            return (
              <path key={i} d={`M ${p0.x} ${p0.y} A ${R} ${R} 0 0 0 ${p1.x} ${p1.y}`}
                fill="none" stroke={zc} strokeWidth={strokeW} strokeLinecap="butt" opacity="0.18" />
            );
          })}
          <path d={`M ${bgStart.x} ${bgStart.y} A ${R} ${R} 0 0 0 ${bgEnd.x} ${bgEnd.y}`}
            fill="none" stroke={t.border} strokeWidth={strokeW} strokeLinecap="round" opacity="0.6" />
          {scorePt && score > 0 && (
            <path d={`M ${bgStart.x} ${bgStart.y} A ${R} ${R} 0 0 0 ${scorePt.x} ${scorePt.y}`}
              fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round" />
          )}
          {needlePt && (
            <>
              <line x1={cx} y1={cy} x2={needlePt.x} y2={needlePt.y} stroke={t.text} strokeWidth="2.5" strokeLinecap="round" />
              <circle cx={cx} cy={cy} r="5" fill={t.text} />
            </>
          )}
          <text x={bgStart.x - 6} y={cy + 18} textAnchor="end" fontSize="9" fontWeight="600" fill={t.textMuted} fontFamily="Inter, sans-serif">FEAR</text>
          <text x={bgEnd.x + 6} y={cy + 18} textAnchor="start" fontSize="9" fontWeight="600" fill={t.textMuted} fontFamily="Inter, sans-serif">GREED</text>
        </svg>
        <div style={{ textAlign: 'center', marginTop: '4px' }}>
          <div style={{ fontSize: '44px', fontWeight: '800', color, letterSpacing: '-0.04em', lineHeight: 1 }}>
            {score ?? '—'}
          </div>
          <div style={{ fontSize: '13px', fontWeight: '700', color, marginTop: '4px', letterSpacing: '0.01em' }}>
            {label}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '2px' }}>
          Fear &amp; Greed Index
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: t.bgTertiary, borderRadius: '8px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: t.textSecondary }}>VIX Proxy (VIXY)</div>
            <div style={{ fontSize: '11px', color: t.textMuted, marginTop: '1px' }}>40% weight</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: t.text }}>
              {vixPrice !== null ? `$${Number(vixPrice).toFixed(2)}` : '—'}
            </div>
            <div style={{ fontSize: '11px', color: t.textMuted }}>
              {vixScore !== null ? `${vixScore} pts` : '—'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: t.bgTertiary, borderRadius: '8px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: t.textSecondary }}>SPY 5-Day Change</div>
            <div style={{ fontSize: '11px', color: t.textMuted, marginTop: '1px' }}>35% weight</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '16px', fontWeight: '700', color: spyWeekChange === null ? t.textMuted : spyWeekChange >= 0 ? '#16a34a' : '#dc2626' }}>
              {spyWeekChange !== null ? `${spyWeekChange >= 0 ? '+' : ''}${Number(spyWeekChange).toFixed(2)}%` : '—'}
            </div>
            <div style={{ fontSize: '11px', color: t.textMuted }}>
              {spyScore !== null ? `${spyScore} pts` : '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FedCpiCards({ theme }) {
  const t = theme || {};
  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <div style={{
        flex: 1, minWidth: '200px',
        background: t.bgCard, border: `1px solid ${t.border}`,
        borderRadius: '10px', padding: '20px 24px',
        boxShadow: t.shadow,
      }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
          Fed Funds Rate
        </div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: t.text, letterSpacing: '-0.02em', marginBottom: '4px' }}>
          4.33%
        </div>
        <div style={{ fontSize: '12px', color: t.textSecondary, marginBottom: '4px' }}>
          Target range: 4.25% – 4.50%
        </div>
        <div style={{ fontSize: '11px', color: t.textMuted }}>
          Set by Federal Reserve · Updated manually
        </div>
      </div>
      <div style={{
        flex: 1, minWidth: '200px',
        background: t.bgCard, border: `1px solid ${t.border}`,
        borderRadius: '10px', padding: '20px 24px',
        boxShadow: t.shadow,
      }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
          Inflation Rate (CPI)
        </div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: t.text, letterSpacing: '-0.02em', marginBottom: '4px' }}>
          2.4%
        </div>
        <div style={{ fontSize: '12px', color: t.textSecondary, marginBottom: '4px' }}>
          Year-over-year · March 2025
        </div>
        <div style={{ fontSize: '11px', color: t.textMuted }}>
          U.S. Bureau of Labor Statistics · Updated monthly
        </div>
      </div>
    </div>
  );
}

const MOVER_SECTORS = {
  'AAPL':'Technology','MSFT':'Technology','NVDA':'Technology','AMZN':'Consumer Discretionary',
  'GOOGL':'Communication Services','META':'Communication Services','TSLA':'Consumer Discretionary',
  'JPM':'Financials','V':'Financials','UNH':'Healthcare','XOM':'Energy','LLY':'Healthcare',
  'JNJ':'Healthcare','MA':'Financials','PG':'Consumer Staples','HD':'Consumer Discretionary',
  'MRK':'Healthcare','COST':'Consumer Staples','ABBV':'Healthcare','BAC':'Financials',
  'CVX':'Energy','PEP':'Consumer Staples','KO':'Consumer Staples','WMT':'Consumer Staples',
  'NFLX':'Communication Services','TMO':'Healthcare','CSCO':'Technology','ACN':'Technology',
  'ADBE':'Technology','CRM':'Technology','ABT':'Healthcare','MCD':'Consumer Discretionary',
  'NKE':'Consumer Discretionary','DHR':'Healthcare','TXN':'Technology','NEE':'Utilities',
  'PM':'Consumer Staples','QCOM':'Technology','IBM':'Technology','AMD':'Technology',
  'AMGN':'Healthcare','GE':'Industrials','HON':'Industrials','CAT':'Industrials',
  'SBUX':'Consumer Discretionary','GS':'Financials','INTU':'Technology','BKNG':'Consumer Discretionary',
  'SPGI':'Financials','BLK':'Financials','ORCL':'Technology','PYPL':'Financials',
  'AXP':'Financials','MS':'Financials','LOW':'Consumer Discretionary','TGT':'Consumer Discretionary',
  'F':'Consumer Discretionary','GM':'Consumer Discretionary','BA':'Industrials','RTX':'Industrials',
  'LMT':'Industrials','UPS':'Industrials','FDX':'Industrials','T':'Communication Services',
  'VZ':'Communication Services','DIS':'Communication Services','CMCSA':'Communication Services',
  'GILD':'Healthcare','VRTX':'Healthcare','ISRG':'Healthcare','WFC':'Financials',
  'USB':'Financials','PNC':'Financials','SLB':'Energy','COP':'Energy',
};

function WeeklyMovers({ gainers, losers, theme }) {
  const t = theme || {};

  const MoverRow = ({ item }) => (
    <div style={{
      background: t.bgCard,
      border: `1px solid ${t.border}`,
      borderRadius: '8px',
      padding: '12px 16px',
      marginBottom: '8px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div>
        <div style={{ fontWeight: '700', fontSize: '14px', color: t.accent }}>
          {item.ticker}
        </div>
        <div style={{ fontSize: '11px', color: t.textMuted, marginTop: '2px' }}>
          {item.sector || MOVER_SECTORS[item.ticker] || ''}
        </div>
      </div>
      <div style={{ fontWeight: '700', fontSize: '14px', color: item.weeklyChange >= 0 ? '#16a34a' : '#dc2626' }}>
        {item.weeklyChange >= 0 ? '+' : ''}{Number(item.weeklyChange).toFixed(2)}%
      </div>
    </div>
  );

  if (!gainers.length && !losers.length) return (
    <div style={{ color: t.textMuted, fontSize: '13px', textAlign: 'center', padding: '20px' }}>
      No weekly mover data yet — run npm run update-data
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#16a34a', marginBottom: '12px' }}>
            📈 Weekly Gainers
          </div>
          {gainers.map(s => <MoverRow key={s.ticker} item={s} />)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#dc2626', marginBottom: '12px' }}>
            📉 Weekly Losers
          </div>
          {losers.map(s => <MoverRow key={s.ticker} item={s} />)}
        </div>
      </div>
      <div style={{ fontSize: '11px', color: t.textMuted, textAlign: 'center', marginTop: '12px' }}>
        Weekly performance · S&P 500 sample · Polygon.io free tier
      </div>
    </div>
  );
}

const SECTORS = [
  { name: 'Technology', tickers: ['AAPL','MSFT','NVDA','GOOGL','META'] },
  { name: 'Healthcare', tickers: ['UNH','LLY','JNJ','ABBV','MRK'] },
  { name: 'Financials', tickers: ['JPM','BAC','WFC','GS','MS'] },
  { name: 'Energy', tickers: ['XOM','CVX','COP','SLB','EOG'] },
  { name: 'Consumer', tickers: ['AMZN','WMT','PG','KO','MCD'] },
];

function SectorMovement({ sectorMovement, theme }) {
  const t = theme || {};

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      {SECTORS.map(sector => {
        const changes = sector.tickers.map(tk => sectorMovement[tk]?.change).filter(c => c != null);
        const avg = changes.length > 0 ? changes.reduce((a, b) => a + b, 0) / changes.length : 0;
        const isUp = avg >= 0;

        return (
          <div key={sector.name} style={{
            flex: '1',
            minWidth: '180px',
            background: t.bgCard,
            border: `1px solid ${t.border}`,
            borderRadius: '10px',
            padding: '16px 20px',
            boxShadow: t.shadow,
          }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: t.accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              {sector.name}
            </div>
            {sector.tickers.map(ticker => {
              const d = sectorMovement[ticker];
              const chg = d?.change ?? null;
              return (
                <div key={ticker} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', fontSize: '13px', color: t.text }}>{ticker}</span>
                  <span style={{ fontWeight: '600', fontSize: '13px', color: chg === null ? t.textMuted : chg >= 0 ? '#16a34a' : '#dc2626' }}>
                    {chg === null ? '—' : `${chg >= 0 ? '+' : ''}${Number(chg).toFixed(2)}%`}
                  </span>
                </div>
              );
            })}
            <div style={{
              marginTop: '10px', display: 'inline-block', fontSize: '11px', fontWeight: '600',
              padding: '2px 10px', borderRadius: '20px',
              background: isUp ? '#f0fdf4' : '#fef2f2',
              color: isUp ? '#16a34a' : '#dc2626',
              border: `1px solid ${isUp ? '#bbf7d0' : '#fecaca'}`,
            }}>
              {isUp ? '↑ Sector Up' : '↓ Sector Down'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Home({ theme, isDark }) {
  const t = theme || {};
  const { indices, weeklyMovers, sectorMovement, fearGreed, lastUpdated } = marketData;

  const isPlaceholder = lastUpdated === '2025-01-01T00:00:00.000Z';
  const formattedDate = isPlaceholder ? null : new Date(lastUpdated).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div style={{ color: t.text, background: t.gradientSubtle, minHeight: 'calc(100vh - 56px)' }}>
      {/* Data freshness banner */}
      <div style={{
        padding: '8px 32px',
        background: t.bgTertiary,
        borderBottom: `1px solid ${t.border}`,
        textAlign: 'center',
        fontSize: '12px',
        color: isPlaceholder ? '#f97316' : t.textMuted,
      }}>
        {isPlaceholder
          ? 'Market data not yet loaded · Run: npm run update-data'
          : `Market data as of ${formattedDate} · Updated weekly`}
      </div>

      <div style={{
        padding: '40px 32px',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}>
        <WatchlistsPanel theme={theme} />

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {MARKET_INDICES.map(idx => {
            const d = indices[idx.ticker] || {};
            return (
              <MarketCard
                key={idx.ticker}
                label={idx.label}
                price={d.price}
                change={d.change}
                intraday={d.intraday || []}
                theme={theme}
              />
            );
          })}
        </div>

        <FearAndGreed
          score={fearGreed.score}
          vixPrice={fearGreed.vixPrice}
          spyWeekChange={fearGreed.spyWeekChange}
          theme={theme}
        />

        <FedCpiCards theme={theme} />

        <WeeklyMovers
          gainers={weeklyMovers.gainers || []}
          losers={weeklyMovers.losers || []}
          theme={theme}
        />

        <SectorMovement sectorMovement={sectorMovement || {}} theme={theme} />
      </div>
    </div>
  );
}

export default Home;
