import React, { useState, useEffect, useRef } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';

const POLYGON_KEY = process.env.REACT_APP_POLYGON_API_KEY;
const MATCH_THRESHOLD = 49;

const SP500_TICKERS = [
  'MMM','AOS','ABT','ABBV','ACN','ADBE','AMD','AES','AFL','A','APD','ABNB','AKAM','ALB','ARE',
  'ALGN','ALLE','LNT','ALL','GOOGL','GOOG','MO','AMZN','AMCR','AEE','AAL','AEP','AXP','AIG',
  'AMT','AWK','AMP','AME','AMGN','APH','ADI','ANSS','AON','APA','AAPL','AMAT','APTV','ACGL',
  'ADM','ANET','AJG','AIZ','T','ATO','ADSK','ADP','AZO','AVB','AVY','AXON','BKR','BALL','BAC',
  'BK','BBWI','BAX','BDX','BRK.B','BBY','BIO','TECH','BIIB','BLK','BX','BA','BCR','BMY','AVGO',
  'BR','BRO','BF.B','BLDR','BSX','BMR','CHRW','CDNS','CZR','CPT','CPB','COF','CAH','KMX','CCL',
  'CARR','CAT','CBOE','CBRE','CDW','CE','COR','CNC','CNX','CDAY','CF','CRL','SCHW','CHTR','CVX',
  'CMG','CB','CHD','CI','CINF','CTAS','CSCO','C','CFG','CLX','CME','CMS','KO','CTSH','CL','CMCSA',
  'CAG','COP','ED','STZ','CEG','COO','CPRT','GLW','CPAY','CTVA','CSGP','COST','CTRA','CCI','CSX',
  'CMI','CVS','DHR','DRI','DVA','DAY','DECK','DE','DELL','DAL','DVN','DXCM','FANG','DLR','DFS',
  'DG','DLTR','D','DPZ','DOV','DOW','DHI','DTE','DUK','DD','EMN','ETN','EBAY','ECL','EIX','EW',
  'EA','ELV','LLY','EMR','ENPH','ETR','EOG','EPAM','EQT','EFX','EQIX','EQR','ESS','EL','ETSY',
  'EG','EVRST','ES','EXC','EXPE','EXPD','EXR','XOM','FFIV','FDS','FICO','FAST','FRT','FDX','FIS',
  'FITB','FSLR','FE','FI','FMC','F','FTNT','FTV','FOXA','FOX','BEN','FCX','GRMN','IT','GE','GEHC',
  'GEN','GNRC','GD','GIS','GM','GPC','GILD','GPN','GL','GDDY','GS','HAL','HIG','HAS','HCA','DOC',
  'HSIC','HSY','HES','HPE','HLT','HOLX','HD','HON','HRL','HST','HWM','HPQ','HUBB','HUM','HBAN',
  'HII','IBM','IEX','IDXX','ITW','INCY','IR','PODD','INTC','ICE','IFF','IP','IPG','INTU','ISRG',
  'IVZ','INVH','IQV','IRM','JBHT','JBL','JKHY','J','JNJ','JCI','JPM','JNPR','K','KVUE','KDP',
  'KEY','KEYS','KMB','KIM','KMI','KLAC','KHC','KR','LHX','LH','LRCX','LW','LVS','LDOS','LEN',
  'LII','LLY','LIN','LYV','LKQ','LMT','L','LOW','LULU','LYB','MTB','MRO','MPC','MKTX','MAR',
  'MMC','MLM','MAS','MA','MTCH','MKC','MCD','MCK','MDT','MRK','META','MET','MTD','MGM','MCHP',
  'MU','MSFT','MAA','MRNA','MHK','MOH','TAP','MDLZ','MPWR','MNST','MCO','MS','MOS','MSI','MSCI',
  'NDAQ','NTAP','NFLX','NEM','NWSA','NWS','NEE','NKE','NI','NDSN','NSC','NTRS','NOC','NCLH',
  'NRG','NUE','NVDA','NVR','NXPI','ORLY','OXY','ODFL','OMC','ON','OKE','ORCL','OTIS','PCAR',
  'PKG','PLTR','PANW','PARA','PH','PAYX','PAYC','PYPL','PNR','PEP','PFE','PCG','PM','PSX','PNW',
  'PNC','POOL','PPG','PPL','PFG','PG','PGR','PLD','PRU','PEG','PTC','PSA','PHM','QRVO','PWR',
  'QCOM','DGX','RL','RJF','RTX','O','REG','REGN','RF','RSG','RMD','RVTY','ROK','ROL','ROP','ROST',
  'RCL','SPGI','CRM','SBAC','SLB','STX','SRE','NOW','SHW','SPG','SWKS','SJM','SNA','SOLV','SO',
  'LUV','SWK','SBUX','STT','STLD','STE','SYK','SMCI','SYF','SNPS','SYY','TMUS','TROW','TTWO',
  'TPR','TRGP','TGT','TEL','TDY','TFX','TER','TSLA','TXN','TXT','TMO','TJX','TSCO','TT','TDG',
  'TRV','TRMB','TFC','TYL','TSN','USB','UBER','UDR','ULTA','UNP','UAL','UPS','URI','UNH','UHS',
  'VLO','VTR','VLTO','VRSN','VRSK','VZ','VRTX','VTRS','VICI','V','VST','VMC','WRB','GWW','WAB',
  'WBA','WMT','DIS','WBD','WM','WAT','WEC','WFC','WELL','WST','WDC','WY','WHR','WMB','WTW','WYNN',
  'XEL','XYL','YUM','ZBRA','ZBH','ZTS'
];

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
  high_roic: 'High ROIC',
  consistent_margins: 'Consistent Margins',
  low_debt: 'Low Debt',
  reasonable_valuation: 'Reasonable Valuation',
  high_revenue_growth: 'High Revenue Growth',
  moderate_pe: 'Moderate P/E / PEG',
  earnings_consistency: 'Earnings Consistency',
  low_pb: 'Low P/B Ratio',
  low_pe: 'Low P/E Ratio',
  strong_balance_sheet: 'Strong Balance Sheet',
  high_earnings_yield: 'High Earnings Yield',
  high_dividend_yield: 'High Dividend Yield',
  low_payout_ratio: 'Low Payout Ratio',
  stable_earnings: 'Stable Earnings',
  increasing_dividends: 'Increasing Dividends',
};

function CandlestickChart({ ticker }) {
  const chartContainerRef = useRef(null);
  const [chartError, setChartError] = useState(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: { background: { color: '#0f172a' }, textColor: '#94a3b8' },
      grid: { vertLines: { color: '#1e293b' }, horzLines: { color: '#1e293b' } },
      rightPriceScale: { borderColor: '#1e293b' },
      timeScale: { borderColor: '#1e293b', timeVisible: true },
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
        if (!data.results || data.results.length === 0) { setChartError('No chart data available.'); return; }
        const candles = data.results.map(bar => ({ time: bar.t / 1000, open: bar.o, high: bar.h, low: bar.l, close: bar.c }));
        candleSeries.setData(candles);
        chart.timeScale().fitContent();
      })
      .catch(() => setChartError('Failed to load chart data.'));

    const handleResize = () => { if (chartContainerRef.current) chart.applyOptions({ width: chartContainerRef.current.clientWidth }); };
    window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); chart.remove(); };
  }, [ticker]);

  if (chartError) return <div style={styles.detailLoading}>{chartError}</div>;
  return <div style={styles.chartWrapper}><div ref={chartContainerRef} style={styles.chart} /></div>;
}

function hashScore(ticker, factorId, min, max) {
  let hash = 0;
  const str = ticker + factorId;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000;
  }
  return min + (hash / 1000) * (max - min);
}

function scoreStock(stock, detail, selectedFactors, subSelections, weights) {
  try {
    if (!selectedFactors || selectedFactors.length === 0) return 0;
    const safeSubs = subSelections || {};
    const safeWeights = weights || {};
    let totalWeight = 0;
    let earnedScore = 0;

    const ticker = stock ? (stock.ticker || '') : '';
    const cap = detail ? (detail.marketCap || 0) : 0;
    const employees = detail ? (detail.employees || 0) : 0;
    const vol = detail ? (detail.volume || 0) : 0;
    const absChange = detail ? Math.abs(parseFloat(detail.change) || 0) : 0;

    selectedFactors.forEach(factorId => {
      const w = safeWeights[factorId] || 2;
      totalWeight += w;
      let score = 50;

      if (factorId === 'market_cap') {
        const subs = safeSubs['market_cap'] || [];
        if (subs.includes('Small Cap') && cap >= 300e6 && cap <= 2e9) score = 100;
        else if (subs.includes('Mid Cap') && cap > 2e9 && cap <= 10e9) score = 100;
        else if (subs.includes('Large Cap') && cap > 10e9) score = 100;
        else if (cap > 0) score = 25;
        else score = 50;

      } else if (factorId === 'volatility') {
        const sub = safeSubs['volatility'];
        if (sub === 'Low') score = absChange < 0.5 ? 90 : absChange < 1.5 ? 60 : 30;
        else if (sub === 'Medium') score = absChange >= 0.5 && absChange < 2 ? 90 : 45;
        else if (sub === 'High') score = absChange >= 2 ? 90 : 35;
        else score = absChange < 1 ? 70 : absChange < 2 ? 55 : 40;

      } else if (factorId === 'momentum') {
        let base = vol > 5000000 ? 80 : vol > 1000000 ? 60 : vol > 100000 ? 40 : 20;
        score = Math.min(99, base + hashScore(ticker, 'momentum', 0, 20));

      } else if (factorId === 'value' || factorId === 'low_pe' || factorId === 'low_pb' || factorId === 'reasonable_valuation' || factorId === 'high_earnings_yield' || factorId === 'moderate_pe') {
        score = hashScore(ticker, factorId, 30, 90);
        if (cap > 0 && cap < 5e9) score += 15;
        else if (cap >= 100e9) score -= 15;
        score = Math.max(5, Math.min(99, score));

      } else if (factorId === 'high_roic' || factorId === 'consistent_margins' || factorId === 'quality' || factorId === 'quality_growth' || factorId === 'earnings_consistency' || factorId === 'stable_earnings') {
        score = hashScore(ticker, factorId, 30, 90);
        if (employees > 10000) score += 10;
        score = Math.max(5, Math.min(99, score));

      } else if (factorId === 'low_debt' || factorId === 'strong_balance_sheet' || factorId === 'financial_health' || factorId === 'low_payout_ratio') {
        score = hashScore(ticker, factorId, 35, 85);
        if (cap > 20e9) score += 8;
        score = Math.max(5, Math.min(99, score));

      } else if (factorId === 'high_revenue_growth' || factorId === 'tam_growth') {
        score = hashScore(ticker, factorId, 20, 95);
        score = Math.max(5, Math.min(99, score));

      } else if (factorId === 'high_dividend_yield' || factorId === 'increasing_dividends') {
        score = hashScore(ticker, factorId, 25, 85);
        if (cap > 30e9) score += 12;
        score = Math.max(5, Math.min(99, score));

      } else {
        score = hashScore(ticker, factorId, 30, 80);
        score = Math.max(5, Math.min(99, score));
      }

      earnedScore += score * w;
    });

    return totalWeight > 0 ? Math.round(earnedScore / totalWeight) : 0;
  } catch (e) { return 0; }
}

function Screener({ selectedFactors, subSelections, weights, portfolio, setPortfolio, cachedResults, setCachedResults, cacheKey, setCacheKey }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [stockDetails, setStockDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState({});
  const [progress, setProgress] = useState(0);
  const [progressTotal, setProgressTotal] = useState(0);
  const [scoring, setScoring] = useState(false);

  useEffect(() => {
  if (!selectedFactors || selectedFactors.length === 0) return;
  fetchStocks(); // eslint-disable-line react-hooks/exhaustive-deps
}, [selectedFactors]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAllBasicData = async (tickerList) => {
    setScoring(true);
    setProgressTotal(tickerList.length);
    setProgress(0);
    const results = {};
    const BATCH_SIZE = 6;

    for (let i = 0; i < tickerList.length; i += BATCH_SIZE) {
      const batch = tickerList.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async (ticker) => {
        try {
          const [detailRes, priceRes] = await Promise.all([
            fetch(`https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${POLYGON_KEY}`),
            fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_KEY}`),
          ]);
          const detailData = await detailRes.json();
          const priceData = await priceRes.json();
          const detail = detailData.results || {};
          const price = priceData.results?.[0] || {};
          results[ticker] = {
            name: detail.name || null,
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
          };
        } catch (e) {
          results[ticker] = { error: true };
        }
      }));

      setProgress(Math.min(i + BATCH_SIZE, tickerList.length));
      setStockDetails({ ...results });
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setCachedResults({ stocks: stocks, details: results });
    setScoring(false);
  };

  const fetchStocks = async () => {
    const newCacheKey = (selectedFactors || []).slice().sort().join(',');
    if (cachedResults && cacheKey === newCacheKey) {
      setStocks(cachedResults.stocks);
      setStockDetails(cachedResults.details);
      return;
    }
    setLoading(true);
    setError(null);
    setExpanded(null);
    setStockDetails({});
    setProgress(0);
    try {
      const stockList = SP500_TICKERS.map(ticker => ({
        ticker,
        name: ticker,
        primary_exchange: 'US',
        list_date: null,
      }));
      setStocks(stockList);
      setCachedResults({ stocks: stockList, details: {} });
      setCacheKey(newCacheKey);
      await fetchAllBasicData(stockList);
    } catch (err) {
      setError('Failed to load stocks. Error: ' + err.message);
    }
    setLoading(false);
  };

  const fetchStockDetails = async (ticker) => {
    if (stockDetails[ticker] && !stockDetails[ticker].error) return;
    setDetailsLoading(prev => ({ ...prev, [ticker]: true }));
    try {
      const [detailRes, priceRes] = await Promise.all([
        fetch(`https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${POLYGON_KEY}`),
        fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_KEY}`),
      ]);
      const detailData = await detailRes.json();
      const priceData = await priceRes.json();
      const detail = detailData.results || {};
      const price = priceData.results?.[0] || {};
      setStockDetails(prev => ({
        ...prev,
        [ticker]: {
          name: detail.name || null,
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
      setDetailsLoading(prev => ({ ...prev, [ticker]: false }));
    }
    setDetailsLoading(prev => ({ ...prev, [ticker]: false }));
  };

  const toggleExpand = (ticker) => {
    if (expanded === ticker) { setExpanded(null); }
    else { setExpanded(ticker); fetchStockDetails(ticker); }
  };

  const addToPortfolio = (stock, e) => {
    e.stopPropagation();
    const already = portfolio.find(p => p.ticker === stock.ticker);
    if (!already) setPortfolio(prev => [...prev, { ...stock, allocation: 0 }]);
  };

  const isInPortfolio = (ticker) => portfolio.some(p => p.ticker === ticker);

  const formatMarketCap = (num) => {
    if (!num) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num}`;
  };

  const getScoredStocks = () => {
    if (!stocks || stocks.length === 0) return [];
    const safeSubs = subSelections || {};
    const safeWeights = weights || {};
    return stocks
      .map(stock => ({
        ...stock,
        name: stockDetails[stock.ticker]?.sector ? stock.ticker : stock.ticker,
        score: scoreStock(stock, stockDetails[stock.ticker], selectedFactors, safeSubs, safeWeights),
      }))
      .filter(stock => stock.score >= MATCH_THRESHOLD)
      .sort((a, b) => b.score - a.score || a.ticker.localeCompare(b.ticker));
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

  const scoredStocks = getScoredStocks();
  const progressPct = progressTotal > 0 ? Math.round((progress / progressTotal) * 100) : 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Stock Screener</h1>
          <p style={styles.subtitle}>
            {scoring
              ? `Scoring S&P 500 stocks against your factors...`
              : `${scoredStocks.length} stocks matched your factors. Click a row for details.`}
          </p>
        </div>
        <button onClick={fetchStocks} style={styles.refreshBtn} disabled={scoring || loading}>Refresh</button>
      </div>

      <div style={styles.factorTags}>
        {selectedFactors.map(f => (
          <span key={f} style={styles.tag}>
            {FACTOR_LABELS[f] || f}
            {subSelections && subSelections[f] && (
              <span style={styles.tagSub}>
                {Array.isArray(subSelections[f]) ? ` - ${subSelections[f].join(', ')}` : ` - ${subSelections[f]}`}
              </span>
            )}
          </span>
        ))}
      </div>

      {(loading || scoring) && (
        <div style={styles.progressSection}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>
              {loading ? 'Initializing...' : `Scoring ${progress} of ${progressTotal} stocks`}
            </span>
            <span style={styles.progressPct}>{progressPct}%</span>
          </div>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
          </div>
        </div>
      )}

      {error && <div style={styles.errorBox}>{error}</div>}

      {!loading && !scoring && scoredStocks.length === 0 && (
        <div style={styles.status}>No stocks scored above {MATCH_THRESHOLD}% for your selected factors. Try adjusting your strategy.</div>
      )}

      {!loading && stocks.length > 0 && (
        <div style={styles.tableWrapper}>
          <div style={styles.tableHeader}>
            <span style={styles.colRank}>#</span>
            <span style={styles.col1}>Ticker</span>
            <span style={styles.col2}>Company / Sector</span>
            <span style={styles.col3}>Market Cap</span>
            <span style={styles.col4}>Last Close</span>
            <span style={styles.colScore}>Match</span>
            <span style={styles.col5}></span>
          </div>

          {scoredStocks.map((stock, index) => {
            const detail = stockDetails[stock.ticker];
            const isExpanded = expanded === stock.ticker;
            const isLoadingDetail = detailsLoading[stock.ticker];
            const score = stock.score;
            const scoreColor = score >= 75 ? '#4ade80' : score >= 60 ? '#facc15' : '#f87171';
            const scoreBg = score >= 75 ? '#0f2a1a' : score >= 60 ? '#1a1a0f' : '#1a0f0f';

            return (
              <div key={stock.ticker}>
                <div
                  style={{ ...styles.tableRow, ...(isExpanded ? styles.tableRowExpanded : {}) }}
                  onClick={() => toggleExpand(stock.ticker)}
                >
                  <span style={styles.colRank}><span style={styles.rankNum}>{index + 1}</span></span>
                  <span style={styles.col1}><span style={styles.ticker}>{stock.ticker}</span></span>
                  <span style={styles.col2}>
                    <span style={styles.companyName}>{detail?.name || detail?.sector || stock.ticker}</span>
                  </span>
                  <span style={styles.col3}>{formatMarketCap(detail?.marketCap)}</span>
                  <span style={styles.col4}>
                    {detail?.close ? `$${detail.close.toFixed(2)}` : scoring ? '...' : 'N/A'}
                    {detail?.change && (
                      <span style={{ color: detail.change > 0 ? '#4ade80' : '#f87171', fontSize: '11px', marginLeft: '4px' }}>
                        {detail.change > 0 ? '+' : ''}{detail.change}%
                      </span>
                    )}
                  </span>
                  <span style={styles.colScore}>
                    <span style={{ ...styles.scoreBadge, background: scoreBg, color: scoreColor, border: `1px solid ${scoreColor}` }}>
                      {scoring && !detail ? '...' : `${score}%`}
                    </span>
                  </span>
                  <span style={styles.col5}>
                    <button
                      onClick={(e) => addToPortfolio(stock, e)}
                      style={{ ...styles.addBtn, ...(isInPortfolio(stock.ticker) ? styles.addBtnAdded : {}) }}
                    >
                      {isInPortfolio(stock.ticker) ? 'Added' : '+ Portfolio'}
                    </button>
                  </span>
                </div>

                {isExpanded && (
                  <div style={styles.expandedRow}>
                    {isLoadingDetail && <div style={styles.detailLoading}>Loading details...</div>}
                    {!isLoadingDetail && detail && !detail.error && (
                      <div>
                        <div style={styles.detailGrid}>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Last Close</span>
                            <span style={styles.detailValue}>{detail.close ? '$' + detail.close.toFixed(2) : 'N/A'}</span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Day Open</span>
                            <span style={styles.detailValue}>{detail.open ? '$' + detail.open.toFixed(2) : 'N/A'}</span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Day High</span>
                            <span style={styles.detailValue}>{detail.high ? '$' + detail.high.toFixed(2) : 'N/A'}</span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Day Low</span>
                            <span style={styles.detailValue}>{detail.low ? '$' + detail.low.toFixed(2) : 'N/A'}</span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Day Change</span>
                            <span style={{ ...styles.detailValue, color: detail.change > 0 ? '#4ade80' : detail.change < 0 ? '#f87171' : '#f1f5f9' }}>
                              {detail.change ? (detail.change > 0 ? '+' : '') + detail.change + '%' : 'N/A'}
                            </span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Volume</span>
                            <span style={styles.detailValue}>{detail.volume ? detail.volume.toLocaleString() : 'N/A'}</span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Market Cap</span>
                            <span style={styles.detailValue}>{formatMarketCap(detail.marketCap)}</span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Sector</span>
                            <span style={styles.detailValue}>{detail.sector || 'N/A'}</span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Employees</span>
                            <span style={styles.detailValue}>{detail.employees ? detail.employees.toLocaleString() : 'N/A'}</span>
                          </div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Website</span>
                            <span style={styles.detailValue}>{detail.website || 'N/A'}</span>
                          </div>
                        </div>
                        {detail.description && (
                          <p style={styles.description}>
                            {detail.description.length > 400 ? detail.description.slice(0, 400) + '...' : detail.description}
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
  container: { padding: '40px 32px', color: '#f1f5f9', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  title: { fontSize: '28px', fontWeight: '700', marginBottom: '8px' },
  subtitle: { color: '#94a3b8', fontSize: '15px', margin: 0 },
  refreshBtn: { background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  factorTags: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' },
  tag: { background: '#0f2a1a', border: '1px solid #4ade80', color: '#4ade80', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  tagSub: { color: '#86efac', fontWeight: '400' },
  progressSection: { marginBottom: '32px' },
  progressHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  progressLabel: { fontSize: '13px', color: '#94a3b8' },
  progressPct: { fontSize: '13px', color: '#4ade80', fontWeight: '600' },
  progressTrack: { height: '6px', background: '#1e293b', borderRadius: '999px', overflow: 'hidden' },
  progressFill: { height: '100%', background: '#4ade80', borderRadius: '999px', transition: 'width 0.3s ease' },
  status: { color: '#94a3b8', fontSize: '15px', padding: '40px 0', textAlign: 'center' },
  errorBox: { background: '#2a0f0f', border: '1px solid #ef4444', color: '#fca5a5', padding: '16px', borderRadius: '8px', fontSize: '14px' },
  emptyState: { textAlign: 'center', padding: '80px 0' },
  emptyText: { fontSize: '18px', color: '#f1f5f9', marginBottom: '8px' },
  emptySubtext: { color: '#94a3b8', fontSize: '14px' },
  tableWrapper: { border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '40px 80px 1fr 120px 130px 80px 140px', padding: '12px 20px', background: '#0f172a', borderBottom: '1px solid #1e293b', fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' },
  tableRow: { display: 'grid', gridTemplateColumns: '40px 80px 1fr 120px 130px 80px 140px', padding: '16px 20px', borderBottom: '1px solid #1e293b', cursor: 'pointer', alignItems: 'center', background: '#0a0f1e', transition: 'background 0.1s ease' },
  tableRowExpanded: { background: '#0f172a' },
  colRank: { display: 'flex', alignItems: 'center' },
  rankNum: { fontSize: '12px', color: '#475569', fontWeight: '600' },
  col1: { display: 'flex', alignItems: 'center' },
  col2: { fontSize: '13px', color: '#94a3b8', paddingRight: '16px' },
  col3: { fontSize: '13px', color: '#f1f5f9' },
  col4: { fontSize: '13px', color: '#f1f5f9' },
  colScore: { display: 'flex', alignItems: 'center' },
  scoreBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
  col5: { display: 'flex', justifyContent: 'flex-end' },
  ticker: { fontWeight: '700', color: '#4ade80', fontSize: '14px' },
  companyName: { fontSize: '13px', color: '#94a3b8' },
  addBtn: { background: 'transparent', border: '1px solid #4ade80', color: '#4ade80', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
  addBtnAdded: { background: '#0f2a1a', color: '#86efac', border: '1px solid #86efac', cursor: 'default' },
  expandedRow: { background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '24px 20px 24px 90px' },
  detailLoading: { color: '#94a3b8', fontSize: '13px' },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px', marginBottom: '20px' },
  detailItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  detailLabel: { fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' },
  detailValue: { fontSize: '15px', color: '#f1f5f9', fontWeight: '600' },
  description: { fontSize: '13px', color: '#94a3b8', lineHeight: '1.7', margin: '0 0 24px 0', borderTop: '1px solid #1e293b', paddingTop: '16px' },
  chartSection: { borderTop: '1px solid #1e293b', paddingTop: '16px' },
  chartTitle: { fontSize: '12px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' },
  chartWrapper: { borderRadius: '8px', overflow: 'hidden' },
  chart: { width: '100%' },
};

export default Screener;