import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = [
  '#4ade80', '#38bdf8', '#f472b6', '#fb923c', '#a78bfa',
  '#facc15', '#34d399', '#60a5fa', '#f87171', '#c084fc',
  '#86efac', '#7dd3fc', '#fda4af', '#fdba74', '#d8b4fe',
];

function Portfolio({ portfolio, setPortfolio }) {
  const [allocations, setAllocations] = useState({});
  const [totalValue, setTotalValue] = useState(0);

  const getTotal = () => {
    return portfolio.reduce((sum, stock) => {
      return sum + (Number(allocations[stock.ticker] || 0));
    }, 0);
  };

  const handleAllocationChange = (ticker, value) => {
    const num = Math.max(0, Number(value) || 0);
    setAllocations(prev => ({ ...prev, [ticker]: num }));
  };

  const removeStock = (ticker) => {
    setPortfolio(prev => prev.filter(s => s.ticker !== ticker));
    setAllocations(prev => {
      const updated = { ...prev };
      delete updated[ticker];
      return updated;
    });
  };

  const autoBalance = () => {
    if (portfolio.length === 0 || totalValue <= 0) return;
    const equal = Math.floor(totalValue / portfolio.length);
    const remainder = totalValue - equal * portfolio.length;
    const newAllocations = {};
    portfolio.forEach((stock, i) => {
      newAllocations[stock.ticker] = i === 0 ? equal + remainder : equal;
    });
    setAllocations(newAllocations);
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
    .filter(stock => Number(allocations[stock.ticker] || 0) > 0)
    .map(stock => ({
      name: stock.ticker,
      value: Number(allocations[stock.ticker] || 0),
    }));

  if (portfolio.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>My Portfolio</h1>
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>Your portfolio is empty.</p>
          <p style={styles.emptySubtext}>Go to the Stock Screener tab and click "+ Portfolio" on stocks you want to track.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.title}>My Portfolio</h1>
          <p style={styles.subtitle}>
            Enter your total portfolio value, then set dollar amounts for each stock.
          </p>
        </div>
        <button onClick={autoBalance} style={styles.balanceBtn}>
          Auto Balance
        </button>
      </div>

      <div style={styles.layout}>
        <div style={styles.leftPanel}>
          <div style={styles.totalValueCard}>
            <label style={styles.totalValueLabel}>Total Portfolio Value</label>
            <div style={styles.totalValueInputWrapper}>
              <span style={styles.dollarPrefix}>$</span>
              <input
                type="number"
                min="0"
                value={totalValue || ''}
                onChange={(e) => setTotalValue(Math.max(0, Number(e.target.value) || 0))}
                style={styles.totalValueInput}
                placeholder="0"
              />
            </div>
          </div>

          <div style={styles.totalBar}>
            <span style={styles.totalLabel}>Total Allocated</span>
            <span style={{
              ...styles.totalAmountDisplay,
              color: isBalanced ? '#4ade80' : (total > totalValue && totalValue > 0) ? '#f87171' : '#facc15',
            }}>
              {formatDollars(total)}
            </span>
            {totalValue > 0 && !isBalanced && (
              <span style={styles.totalHint}>
                {total > totalValue
                  ? `${formatDollars(total - totalValue)} over`
                  : `${formatDollars(remaining)} remaining`}
              </span>
            )}
          </div>

          <div style={styles.stockList}>
            {portfolio.map((stock, index) => {
              const allocation = Number(allocations[stock.ticker] || 0);
              const color = COLORS[index % COLORS.length];
              const pct = calcPct(allocation);

              return (
                <div key={stock.ticker} style={styles.stockRow}>
                  <div style={styles.stockLeft}>
                    <div style={{ ...styles.colorDot, background: color }} />
                    <div style={styles.stockInfo}>
                      <span style={styles.stockTicker}>{stock.ticker}</span>
                      <span style={styles.stockName}>{stock.name || stock.ticker}</span>
                    </div>
                  </div>

                  <div style={styles.stockRight}>
                    <span style={styles.calcPct}>{pct}</span>
                    <div style={styles.allocationControl}>
                      <button
                        onClick={() => handleAllocationChange(stock.ticker, allocation - 500)}
                        style={styles.stepBtn}
                      >
                        −
                      </button>
                      <div style={styles.inputWrapper}>
                        <span style={styles.dollarSymbol}>$</span>
                        <input
                          type="number"
                          min="0"
                          value={allocation || ''}
                          onChange={(e) => handleAllocationChange(stock.ticker, e.target.value)}
                          style={styles.allocationInput}
                          placeholder="0"
                        />
                      </div>
                      <button
                        onClick={() => handleAllocationChange(stock.ticker, allocation + 500)}
                        style={styles.stepBtn}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeStock(stock.ticker)}
                      style={styles.removeBtn}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {isBalanced && (
            <div style={styles.balancedBanner}>
              ✓ Portfolio fully allocated at {formatDollars(totalValue)}
            </div>
          )}

          <div style={styles.disclaimer}>
            <p style={styles.disclaimerText}>
              This portfolio is for planning purposes only. Allocations shown here are targets to guide your own investment decisions on a separate brokerage platform. This is not investment advice.
            </p>
          </div>
        </div>

        <div style={styles.rightPanel}>
          <div style={styles.chartCard}>
            <p style={styles.chartTitle}>Allocation Breakdown</p>
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
                      background: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                    }}
                  />
                  <Legend
                    formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={styles.chartEmpty}>
                Set allocations on the left to see your breakdown.
              </div>
            )}
          </div>

          <div style={styles.summaryCard}>
            <p style={styles.chartTitle}>Summary</p>
            <div style={styles.summaryGrid}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Stocks</span>
                <span style={styles.summaryValue}>{portfolio.length}</span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Allocated</span>
                <span style={{
                  ...styles.summaryValue,
                  color: isBalanced ? '#4ade80' : (total > totalValue && totalValue > 0) ? '#f87171' : '#facc15',
                }}>
                  {formatDollars(total)}
                </span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Remaining</span>
                <span style={{
                  ...styles.summaryValue,
                  color: totalValue > 0
                    ? (remaining < 0 ? '#f87171' : remaining === 0 ? '#4ade80' : '#94a3b8')
                    : '#475569',
                }}>
                  {totalValue > 0 ? formatDollars(Math.max(0, remaining)) : '—'}
                </span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Largest Position</span>
                <span style={styles.summaryValue}>
                  {pieData.length > 0
                    ? (() => {
                        const top = [...pieData].sort((a, b) => b.value - a.value)[0];
                        return `${top.name} ($${top.value.toLocaleString()})`;
                      })()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 32px',
    color: '#f1f5f9',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '40px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '15px',
    margin: 0,
  },
  balanceBtn: {
    background: 'transparent',
    border: '1px solid #4ade80',
    color: '#4ade80',
    padding: '8px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 420px',
    gap: '32px',
    alignItems: 'start',
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  totalValueCard: {
    background: '#1e293b',
    borderRadius: '10px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  totalValueLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  totalValueInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '8px 12px',
    gap: '4px',
  },
  dollarPrefix: {
    color: '#4ade80',
    fontSize: '16px',
    fontWeight: '700',
  },
  totalValueInput: {
    background: 'transparent',
    border: 'none',
    color: '#f1f5f9',
    fontSize: '18px',
    fontWeight: '700',
    width: '140px',
    outline: 'none',
    textAlign: 'right',
  },
  totalBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#1e293b',
    padding: '14px 20px',
    borderRadius: '10px',
  },
  totalLabel: {
    fontSize: '14px',
    color: '#94a3b8',
    flex: 1,
  },
  totalAmountDisplay: {
    fontSize: '20px',
    fontWeight: '700',
  },
  totalHint: {
    fontSize: '12px',
    color: '#475569',
  },
  stockList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  stockRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#1e293b',
    padding: '16px 20px',
    borderRadius: '10px',
    gap: '16px',
  },
  stockLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  colorDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  stockInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  stockTicker: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#4ade80',
  },
  stockName: {
    fontSize: '12px',
    color: '#475569',
  },
  stockRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  calcPct: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#4ade80',
    opacity: 0.7,
    minWidth: '48px',
    textAlign: 'right',
  },
  allocationControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stepBtn: {
    background: '#0f172a',
    border: '1px solid #334155',
    color: '#94a3b8',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '6px',
    padding: '4px 8px',
    gap: '2px',
  },
  dollarSymbol: {
    color: '#475569',
    fontSize: '13px',
  },
  allocationInput: {
    background: 'transparent',
    border: 'none',
    color: '#f1f5f9',
    fontSize: '15px',
    fontWeight: '600',
    width: '80px',
    textAlign: 'right',
    outline: 'none',
  },
  removeBtn: {
    background: 'transparent',
    border: '1px solid #334155',
    color: '#475569',
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balancedBanner: {
    background: '#0f2a1a',
    border: '1px solid #4ade80',
    color: '#4ade80',
    padding: '12px 20px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
  },
  disclaimer: {
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '10px',
    padding: '16px 20px',
  },
  disclaimerText: {
    fontSize: '12px',
    color: '#475569',
    lineHeight: '1.6',
    margin: 0,
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    position: 'sticky',
    top: '24px',
  },
  chartCard: {
    background: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
  },
  chartTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '16px',
    margin: '0 0 16px 0',
  },
  chartEmpty: {
    color: '#475569',
    fontSize: '13px',
    textAlign: 'center',
    padding: '60px 20px',
  },
  summaryCard: {
    background: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  summaryLabel: {
    fontSize: '11px',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  summaryValue: {
    fontSize: '15px',
    color: '#f1f5f9',
    fontWeight: '600',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 0',
  },
  emptyText: {
    fontSize: '18px',
    color: '#f1f5f9',
    marginBottom: '8px',
  },
  emptySubtext: {
    color: '#94a3b8',
    fontSize: '14px',
  },
};

export default Portfolio;
