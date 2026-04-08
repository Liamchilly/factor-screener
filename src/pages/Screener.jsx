import React, { useState, useEffect, useRef } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';

const POLYGON_KEY = process.env.REACT_APP_POLYGON_API_KEY;

const FACTOR_LABELS = {
  market_cap: 'Market Cap',
  value: 'Value',
  quality_growth: 'Quality Growth',
  quality: 'Quality & Profitability',
  financial_health: 'Financial Health',
  cash_flow: 'Cash Flow Health',
  momentum: 'Momentum',
  volatility: 'Volatility',
  moat: 'Business Moat',
  tam_growth: 'TAM Expansion',
  insider: 'Insider & Institutional Conviction',
  accounting_quality: 'Accounting Quality',
  high_risk: 'High Risk Exposure',
  esg: 'ESG Compliance',
};

function CandlestickChart({ ticker }) {
  const chartContainerRef = useRef(null);
  const [chartError, setChartError] = useState(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: {
        background: { color: '#0f172a' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: '#1e293b' },
        horzLines: { color: '#1e293b' },
      },
      rightPriceScale: {
        borderColor: '#1e293b',
      },
      timeScale: {
        borderColor: '#1e293b',
        timeVisible: true,
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#4ade80',
      downColor: '#f87171',
      borderUpColor: '#4ade80',
      borderDownColor: '#f87171',
      wickUpColor: '#4ade80',
      wickDownColor: '#f87171',
    });

    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    const fromDate = oneYearAgo.toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];

    fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${fromDate}/${toDate}?adjusted=true&sort=asc&limit=365&apiKey=${POLYGON_KEY}`)
      .then(res => res.json())
      .then(data => {
        if (!data.results || data.results.length === 0) {
          setChartError('No chart data available for this stock.');
          return;
        }
        const candles = data.results.map(bar => ({
          time: bar.t / 1000,
          open: bar.o,
          high: bar.h,
          low: bar.l,
          close: bar.c,
        }));
        candleSeries.setData(candles);
        chart.timeScale().fitContent();
      })
      .catch(() => setChartError('Failed to load chart data.'));

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [ticker]);

  if (chartError) {
    return <div style={styles.detailLoading}>{chartError}</div>;
  }

  return (
    <div style={styles.chartWrapper}>
      <div ref={chartContainerRef} style={styles.chart} />
    </div>
  );
}

function Screener({ selectedFactors, subSelections, portfolio, setPortfolio }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [stockDetails, setStockDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState({});

  useEffect(() => {
    if (!selectedFactors || selectedFactors.length === 0) return;
    fetchStocks();
  }, [selectedFactors]);

  const fetchStocks = async () => {
    setLoading(true);
    setError(null);
    setExpanded(null);
    setStockDetails({});
    try {
      const url = `https://api.polygon.io/v3/reference/tickers?market=stocks&active=true&type=CS&order=asc&sort=ticker&limit=50&apiKey=${POLYGON_KEY}`;
      const res = await fetch(url);
      const text = await res.text();
      const data = JSON.parse(text);
      if (data.status === 'ERROR' || !data.results) {
        throw new Error(data.error || 'No results returned');
      }
      setStocks(data.results);
    } catch (err) {
      setError('Failed to load stocks. Error: ' + err.message);
    }
    setLoading(false);
  };

  const fetchStockDetails = async (ticker) => {
    if (stockDetails[ticker]) return;
    setDetailsLoading(prev => ({ ...prev, [ticker]: true }));
    try {
      const detailRes = await fetch(`https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${POLYGON_KEY}`);
      const priceRes = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_KEY}`);
      const detailData = await detailRes.json();
      const priceData = await priceRes.json();
      const detail = detailData.results || {};
      const price = priceData.results?.[0] || {};
      setStockDetails(prev => ({
        ...prev,
        [ticker]: {
          description: detail.description || null,
          sector: detail.sic_description || null,
          employees: detail.total_employees || null,
          website: detail.homepage_url || null,
          marketCap: detail.market_cap || null,
          close: price.c || null,
          open: price.o || null,
          high: price.h || null,
          low: price.l || null,
          volume: price.v || null,
          change: price.c && price.o ? (((price.c - price.o) / price.o) * 100).toFixed(2) : null,
        },
      }));
    } catch (err) {
      setStockDetails(prev => ({ ...prev, [ticker]: { error: true } }));
    }
    setDetailsLoading(prev => ({ ...prev, [ticker]: false }));
  };

  const toggleExpand = (ticker) => {
    if (expanded === ticker) {
      setExpanded(null);
    } else {
      setExpanded(ticker);
      fetchStockDetails(ticker);
    }
  };

  const addToPortfolio = (stock, e) => {
    e.stopPropagation();
    const already = portfolio.find(p => p.ticker === stock.ticker);
    if (!already) {
      setPortfolio(prev => [...prev, { ...stock, allocation: 0 }]);
    }
  };

  const isInPortfolio = (ticker) => portfolio.some(p => p.ticker === ticker);

  const formatMarketCap = (num) => {
    if (!num) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num}`;
  };

  const formatExchange = (ex) => {
    if (ex === 'XNAS') return 'NASDAQ';
    if (ex === 'XNYS') return 'NYSE';
    return ex || 'N/A';
  };

  if (!selectedFactors || selectedFactors.length === 0) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Stock Screener</h1>
        <div style={styles.emptyState}>
          <p style={styles.emptyText}>No factors selected yet.</p>
          <p style={styles.emptySubtext}>Go to the Strategy tab, select your factors, and click View Matching Stocks.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Stock Screener</h1>
          <p style={styles.subtitle}>Showing stocks that match your selected factors. Click a row for details.</p>
        </div>
        <button onClick={fetchStocks} style={styles.refreshBtn}>Refresh</button>
      </div>

      <div style={styles.factorTags}>
        {selectedFactors.map(f => (
          <span key={f} style={styles.tag}>
            {FACTOR_LABELS[f] || f}
            {subSelections[f] && (
              <span style={styles.tagSub}>
                {Array.isArray(subSelections[f]) ? ` - ${subSelections[f].join(', ')}` : ` - ${subSelections[f]}`}
              </span>
            )}
          </span>
        ))}
      </div>

      {loading && <div style={styles.status}>Loading matching stocks...</div>}
      {error && <div style={styles.errorBox}>{error}</div>}

      {!loading && !error && stocks.length === 0 && (
        <div style={styles.status}>No stocks matched your filters. Try adjusting your factors.</div>
      )}

      {!loading && stocks.length > 0 && (
        <div style={styles.tableWrapper}>
          <div style={styles.tableHeader}>
            <span style={styles.col1}>Ticker</span>
            <span style={styles.col2}>Company</span>
            <span style={styles.col3}>Exchange</span>
            <span style={styles.col4}>Listed Since</span>
            <span style={styles.col5}></span>
          </div>

          {stocks.map(stock => {
            const detail = stockDetails[stock.ticker];
            const isExpanded = expanded === stock.ticker;
            const isLoadingDetail = detailsLoading[stock.ticker];

            return (
              <div key={stock.ticker}>
                <div
                  style={{
                    ...styles.tableRow,
                    ...(isExpanded ? styles.tableRowExpanded : {}),
                  }}
                  onClick={() => toggleExpand(stock.ticker)}
                >
                  <span style={styles.col1}>
                    <span style={styles.ticker}>{stock.ticker}</span>
                  </span>
                  <span style={styles.col2}>{stock.name}</span>
                  <span style={styles.col3}>{formatExchange(stock.primary_exchange)}</span>
                  <span style={styles.col4}>{stock.list_date || 'N/A'}</span>
                  <span style={styles.col5}>
                    <button
                      onClick={(e) => addToPortfolio(stock, e)}
                      style={{
                        ...styles.addBtn,
                        ...(isInPortfolio(stock.ticker) ? styles.addBtnAdded : {}),
                      }}
                    >
                      {isInPortfolio(stock.ticker) ? 'Added' : '+ Portfolio'}
                    </button>
                  </span>
                </div>

                {isExpanded && (
                  <div style={styles.expandedRow}>
                    {isLoadingDetail && (
                      <div style={styles.detailLoading}>Loading details...</div>
                    )}
                    {!isLoadingDetail && detail && !detail.error && (
                      <div>
                        <div style={styles.detailGrid}>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Last Close</span>
                            <span style={styles.detailValue}>
                              {detail.close ? '$' + detail.close.toFixed(2) : 'N/A'}
                            </span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Day Open</span>
                            <span style={styles.detailValue}>
                              {detail.open ? '$' + detail.open.toFixed(2) : 'N/A'}
                            </span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Day High</span>
                            <span style={styles.detailValue}>
                              {detail.high ? '$' + detail.high.toFixed(2) : 'N/A'}
                            </span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Day Low</span>
                            <span style={styles.detailValue}>
                              {detail.low ? '$' + detail.low.toFixed(2) : 'N/A'}
                            </span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Day Change</span>
                            <span style={{
                              ...styles.detailValue,
                              color: detail.change > 0 ? '#4ade80' : detail.change < 0 ? '#f87171' : '#f1f5f9',
                            }}>
                              {detail.change ? (detail.change > 0 ? '+' : '') + detail.change + '%' : 'N/A'}
                            </span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Volume</span>
                            <span style={styles.detailValue}>
                              {detail.volume ? detail.volume.toLocaleString() : 'N/A'}
                            </span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Market Cap</span>
                            <span style={styles.detailValue}>
                              {formatMarketCap(detail.marketCap)}
                            </span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Sector</span>
                            <span style={styles.detailValue}>
                              {detail.sector || 'N/A'}
                            </span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Employees</span>
                            <span style={styles.detailValue}>
                              {detail.employees ? detail.employees.toLocaleString() : 'N/A'}
                            </span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Website</span>
                            <span style={styles.detailValue}>
                              {detail.website || 'N/A'}
                            </span>
                          </div>
                        </div>

                        {detail.description && (
                          <p style={styles.description}>
                            {detail.description.length > 400
                              ? detail.description.slice(0, 400) + '...'
                              : detail.description}
                          </p>
                        )}

                        <div style={styles.chartSection}>
                          <p style={styles.chartTitle}>1 Year Price History</p>
                          <CandlestickChart ticker={stock.ticker} />
                        </div>
                      </div>
                    )}
                    {!isLoadingDetail && detail && detail.error && (
                      <div style={styles.detailLoading}>Could not load details for this stock.</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
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
  refreshBtn: {
    background: 'transparent',
    border: '1px solid #334155',
    color: '#94a3b8',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  factorTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '32px',
  },
  tag: {
    background: '#0f2a1a',
    border: '1px solid #4ade80',
    color: '#4ade80',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  tagSub: {
    color: '#86efac',
    fontWeight: '400',
  },
  status: {
    color: '#94a3b8',
    fontSize: '15px',
    padding: '40px 0',
    textAlign: 'center',
  },
  errorBox: {
    background: '#2a0f0f',
    border: '1px solid #ef4444',
    color: '#fca5a5',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '14px',
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
  tableWrapper: {
    border: '1px solid #1e293b',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '90px 1fr 120px 130px 140px',
    padding: '12px 20px',
    background: '#0f172a',
    borderBottom: '1px solid #1e293b',
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '90px 1fr 120px 130px 140px',
    padding: '16px 20px',
    borderBottom: '1px solid #1e293b',
    cursor: 'pointer',
    alignItems: 'center',
    background: '#0a0f1e',
    transition: 'background 0.1s ease',
  },
  tableRowExpanded: {
    background: '#0f172a',
  },
  ticker: {
    fontWeight: '700',
    color: '#4ade80',
    fontSize: '14px',
  },
  col1: { display: 'flex', alignItems: 'center' },
  col2: { fontSize: '14px', color: '#f1f5f9', paddingRight: '16px' },
  col3: { fontSize: '13px', color: '#94a3b8' },
  col4: { fontSize: '13px', color: '#94a3b8' },
  col5: { display: 'flex', justifyContent: 'flex-end' },
  addBtn: {
    background: 'transparent',
    border: '1px solid #4ade80',
    color: '#4ade80',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  addBtnAdded: {
    background: '#0f2a1a',
    color: '#86efac',
    border: '1px solid #86efac',
    cursor: 'default',
  },
  expandedRow: {
    background: '#0f172a',
    borderBottom: '1px solid #1e293b',
    padding: '24px 20px 24px 90px',
  },
  detailLoading: {
    color: '#94a3b8',
    fontSize: '13px',
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  detailLabel: {
    fontSize: '11px',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  detailValue: {
    fontSize: '15px',
    color: '#f1f5f9',
    fontWeight: '600',
  },
  description: {
    fontSize: '13px',
    color: '#94a3b8',
    lineHeight: '1.7',
    margin: '0 0 24px 0',
    borderTop: '1px solid #1e293b',
    paddingTop: '16px',
  },
  chartSection: {
    borderTop: '1px solid #1e293b',
    paddingTop: '16px',
  },
  chartTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '12px',
  },
  chartWrapper: {
    borderRadius: '8px',
    overflow: 'hidden',
  },
  chart: {
    width: '100%',
  },
};

export default Screener;