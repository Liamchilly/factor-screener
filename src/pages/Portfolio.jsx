import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = [
  '#4ade80', '#38bdf8', '#f472b6', '#fb923c', '#a78bfa',
  '#facc15', '#34d399', '#60a5fa', '#f87171', '#c084fc',
  '#86efac', '#7dd3fc', '#fda4af', '#fdba74', '#d8b4fe',
];

function Portfolio({ portfolio, setPortfolio, portfolioTotal, setPortfolioTotal, theme, isDark }) {
  const totalValue = portfolioTotal || 0;
  const setTotalValue = setPortfolioTotal;

  const t = theme || {};

  const getTotal = () => {
    return portfolio.reduce((sum, stock) => {
      return sum + (Number(stock.allocation || 0));
    }, 0);
  };

  const handleAllocationChange = (ticker, value) => {
    const num = Math.max(0, Number(value) || 0);
    setPortfolio(prev => prev.map(p =>
      p.ticker === ticker ? { ...p, allocation: num } : p
    ));
  };

  const removeStock = (ticker) => {
    const confirmed = window.confirm(`Are you sure you want to remove ${ticker} from your portfolio?`);
    if (!confirmed) return;
    setPortfolio(prev => prev.filter(s => s.ticker !== ticker));
  };

  const autoBalance = () => {
    if (portfolio.length === 0 || totalValue <= 0) return;
    const equal = Math.floor(totalValue / portfolio.length);
    const remainder = totalValue - equal * portfolio.length;
    setPortfolio(prev => prev.map((s, i) => ({
      ...s,
      allocation: i === 0 ? equal + remainder : equal,
    })));
  };

  const total = getTotal();
  const remaining = totalValue - total;
  const isBalanced = totalValue > 0 && total === totalValue;

  const calcPct = (dollars) => {
    if (!totalValue || totalValue <= 0) return '—';
    return (dollars / totalValue * 100).toFixed(1) + '%';
  };

  const formatDollars = (num) => {
    if (!num && num !== 0) return '$0';
    return '$' + Math.round(num).toLocaleString();
  };

  const pieData = portfolio
    .filter(stock => Number(stock.allocation || 0) > 0)
    .map(stock => ({
      name: stock.ticker,
      value: Number(stock.allocation || 0),
    }));

  if (portfolio.length === 0) {
    return (
      <div style={{ padding: '40px 32px', color: t.text, maxWidth: '1200px', margin: '0 auto', background: t.gradientSubtle, minHeight: 'calc(100vh - 56px)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: t.text, letterSpacing: '-0.02em', marginBottom: '8px' }}>My Portfolio</h1>
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontSize: '18px', color: t.text, marginBottom: '8px' }}>Your portfolio is empty.</p>
          <p style={{ color: t.textSecondary, fontSize: '14px' }}>Go to the Stock Screener tab and click "+ Portfolio" on stocks you want to track.</p>
        </div>
      </div>
    );
  }

  const totalAllocColor = isBalanced ? '#16a34a' : (total > totalValue && totalValue > 0) ? '#ef4444' : '#d97706';
  const remainingColor = totalValue > 0 ? (remaining < 0 ? '#ef4444' : remaining === 0 ? '#16a34a' : t.textSecondary) : t.textMuted;

  return (
    <div style={{ padding: '40px 32px', color: t.text, maxWidth: '1200px', margin: '0 auto', background: t.gradientSubtle, minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: t.text, letterSpacing: '-0.02em', margin: '0 0 4px 0' }}>My Portfolio</h1>
          <p style={{ color: t.textSecondary, fontSize: '14px', margin: 0 }}>
            Enter your total portfolio value, then set dollar amounts for each stock.
          </p>
        </div>
        <button onClick={autoBalance} style={{
          background: 'transparent',
          border: `1px solid ${t.accentBorder}`,
          color: t.accentText,
          padding: '8px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
        }}>
          Auto Balance
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '32px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '10px', boxShadow: t.shadow, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: t.text }}>Total Portfolio Value</label>
            <div style={{ display: 'flex', alignItems: 'center', background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: '8px', padding: '8px 12px', gap: '4px' }}>
              <span style={{ color: t.accentText, fontSize: '16px', fontWeight: '700' }}>$</span>
              <input
                type="number"
                min="0"
                value={totalValue || ''}
                onChange={(e) => setTotalValue(Math.max(0, Number(e.target.value) || 0))}
                style={{ background: 'transparent', border: 'none', color: t.text, fontSize: '18px', fontWeight: '700', width: '140px', outline: 'none', textAlign: 'right' }}
                placeholder="0"
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: t.bgTertiary, border: `1px solid ${t.border}`, padding: '14px 20px', borderRadius: '10px' }}>
            <span style={{ fontSize: '14px', color: t.textSecondary, flex: 1 }}>Total Allocated</span>
            <span style={{ fontSize: '20px', fontWeight: '700', color: totalAllocColor }}>{formatDollars(total)}</span>
            {totalValue > 0 && !isBalanced && (
              <span style={{ fontSize: '12px', color: t.textMuted }}>
                {total > totalValue ? `${formatDollars(total - totalValue)} over` : `${formatDollars(remaining)} remaining`}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {portfolio.map((stock, index) => {
              const allocation = Number(stock.allocation || 0);
              const color = COLORS[index % COLORS.length];
              const pct = calcPct(allocation);

              return (
                <div key={stock.ticker} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: t.bgCard, border: `1px solid ${t.border}`, boxShadow: t.shadow, padding: '16px 20px', borderRadius: '10px', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '700', color: t.accent }}>{stock.ticker}</span>
                      <span style={{ fontSize: '12px', color: t.textMuted }}>{stock.name || stock.ticker}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: t.accentText, opacity: 0.7, minWidth: '48px', textAlign: 'right' }}>{pct}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => handleAllocationChange(stock.ticker, allocation - 500)}
                        style={{ background: t.bgTertiary, border: `1px solid ${t.border}`, color: t.textSecondary, width: '28px', height: '28px', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >−</button>
                      <div style={{ display: 'flex', alignItems: 'center', background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: '6px', padding: '4px 8px', gap: '2px' }}>
                        <span style={{ color: t.textMuted, fontSize: '13px' }}>$</span>
                        <input
                          type="number"
                          min="0"
                          value={allocation || ''}
                          onChange={(e) => handleAllocationChange(stock.ticker, e.target.value)}
                          style={{ background: 'transparent', border: 'none', color: t.text, fontSize: '15px', fontWeight: '600', width: '80px', textAlign: 'right', outline: 'none' }}
                          placeholder="0"
                        />
                      </div>
                      <button
                        onClick={() => handleAllocationChange(stock.ticker, allocation + 500)}
                        style={{ background: t.bgTertiary, border: `1px solid ${t.border}`, color: t.textSecondary, width: '28px', height: '28px', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >+</button>
                    </div>
                    <button
                      onClick={() => removeStock(stock.ticker)}
                      style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', width: '28px', height: '28px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >✕</button>
                  </div>
                </div>
              );
            })}
          </div>

          {isBalanced && (
            <div style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}`, color: t.accentText, padding: '12px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', textAlign: 'center' }}>
              ✓ Portfolio fully allocated at {formatDollars(totalValue)}
            </div>
          )}

          <div style={{ background: t.bgTertiary, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '16px 20px' }}>
            <p style={{ fontSize: '12px', color: t.textMuted, lineHeight: '1.6', margin: 0 }}>
              This portfolio is for planning purposes only. Allocations shown here are targets to guide your own investment decisions on a separate brokerage platform. This is not investment advice.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '24px' }}>
          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '12px', boxShadow: t.shadow, padding: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 16px 0' }}>
              Allocation Breakdown
            </p>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={340}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={80}
                    outerRadius={130}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[portfolio.findIndex(s => s.ticker === entry.name) % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Allocated']}
                    contentStyle={{
                      background: t.bgCard,
                      border: `1px solid ${t.border}`,
                      borderRadius: '8px',
                      color: t.text,
                      boxShadow: t.shadowMd,
                    }}
                  />
                  <Legend
                    formatter={(value) => <span style={{ color: t.textSecondary, fontSize: '12px' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ color: t.textMuted, fontSize: '13px', textAlign: 'center', padding: '60px 20px' }}>
                Set allocations on the left to see your breakdown.
              </div>
            )}
          </div>

          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '12px', boxShadow: t.shadow, padding: '20px' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 16px 0' }}>
              Summary
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Stocks', value: portfolio.length, color: t.text },
                { label: 'Allocated', value: formatDollars(total), color: totalAllocColor },
                { label: 'Remaining', value: totalValue > 0 ? formatDollars(Math.max(0, remaining)) : '—', color: remainingColor },
                {
                  label: 'Largest Position',
                  value: pieData.length > 0 ? (() => { const top = [...pieData].sort((a, b) => b.value - a.value)[0]; return `${top.name} ($${top.value.toLocaleString()})`; })() : 'N/A',
                  color: t.text,
                },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '11px', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
                  <span style={{ fontSize: '15px', color, fontWeight: '600' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
