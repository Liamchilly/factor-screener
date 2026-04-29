import React, { useState, useEffect, useRef } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';

const POLYGON_KEY = process.env.REACT_APP_POLYGON_API_KEY;
const FMP_KEY = process.env.REACT_APP_FMP_API_KEY;
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

const TICKER_SECTORS = {
  'AAPL':'Technology','MSFT':'Technology','NVDA':'Technology',
  'ADBE':'Technology','AMD':'Technology','INTC':'Technology',
  'CSCO':'Technology','QCOM':'Technology','TXN':'Technology',
  'ACN':'Technology','IBM':'Technology','INTU':'Technology',
  'NOW':'Technology','ANET':'Technology','PANW':'Technology',
  'CDNS':'Technology','SNPS':'Technology','FTNT':'Technology',
  'ANSS':'Technology','EPAM':'Technology','GDDY':'Technology',
  'AKAM':'Technology','FFIV':'Technology','JNPR':'Technology',
  'HPQ':'Technology','HPE':'Technology','WDC':'Technology',
  'STX':'Technology','NTAP':'Technology','ZBRA':'Technology',
  'CDW':'Technology','SMCI':'Technology','NXPI':'Technology',
  'MCHP':'Technology','ADI':'Technology','KLAC':'Technology',
  'LRCX':'Technology','AMAT':'Technology','GRMN':'Technology',
  'TER':'Technology','MPWR':'Technology','CRM':'Technology',
  'ORCL':'Technology','PLTR':'Technology','JBL':'Technology',
  'SWKS':'Technology','QRVO':'Technology','MSI':'Technology',
  'KEYS':'Technology','AMZN':'Consumer Discretionary',
  'TSLA':'Consumer Discretionary','HD':'Consumer Discretionary',
  'MCD':'Consumer Discretionary','NKE':'Consumer Discretionary',
  'SBUX':'Consumer Discretionary','LOW':'Consumer Discretionary',
  'TGT':'Consumer Discretionary','BKNG':'Consumer Discretionary',
  'CMG':'Consumer Discretionary','ORLY':'Consumer Discretionary',
  'AZO':'Consumer Discretionary','ROST':'Consumer Discretionary',
  'TJX':'Consumer Discretionary','EBAY':'Consumer Discretionary',
  'ETSY':'Consumer Discretionary','BBY':'Consumer Discretionary',
  'KMX':'Consumer Discretionary','DHI':'Consumer Discretionary',
  'LEN':'Consumer Discretionary','PHM':'Consumer Discretionary',
  'NVR':'Consumer Discretionary','POOL':'Consumer Discretionary',
  'ULTA':'Consumer Discretionary','LVS':'Consumer Discretionary',
  'WYNN':'Consumer Discretionary','MGM':'Consumer Discretionary',
  'RCL':'Consumer Discretionary','CCL':'Consumer Discretionary',
  'NCLH':'Consumer Discretionary','EXPE':'Consumer Discretionary',
  'ABNB':'Consumer Discretionary','APTV':'Consumer Discretionary',
  'F':'Consumer Discretionary','GM':'Consumer Discretionary',
  'DECK':'Consumer Discretionary','LULU':'Consumer Discretionary',
  'HAS':'Consumer Discretionary','MAR':'Consumer Discretionary',
  'HLT':'Consumer Discretionary','TPR':'Consumer Discretionary',
  'RL':'Consumer Discretionary','BBWI':'Consumer Discretionary',
  'DRI':'Consumer Discretionary','YUM':'Consumer Discretionary',
  'DPZ':'Consumer Discretionary','LKQ':'Consumer Discretionary',
  'GPC':'Consumer Discretionary','TSCO':'Consumer Discretionary',
  'GOOGL':'Communication Services','GOOG':'Communication Services',
  'META':'Communication Services','NFLX':'Communication Services',
  'DIS':'Communication Services','CMCSA':'Communication Services',
  'T':'Communication Services','VZ':'Communication Services',
  'TMUS':'Communication Services','CHTR':'Communication Services',
  'WBD':'Communication Services','PARA':'Communication Services',
  'FOXA':'Communication Services','FOX':'Communication Services',
  'NWSA':'Communication Services','NWS':'Communication Services',
  'OMC':'Communication Services','IPG':'Communication Services',
  'LYV':'Communication Services','TTWO':'Communication Services',
  'EA':'Communication Services','MTCH':'Communication Services',
  'JNJ':'Healthcare','UNH':'Healthcare','LLY':'Healthcare',
  'MRK':'Healthcare','ABBV':'Healthcare','TMO':'Healthcare',
  'ABT':'Healthcare','DHR':'Healthcare','BMY':'Healthcare',
  'AMGN':'Healthcare','GILD':'Healthcare','VRTX':'Healthcare',
  'REGN':'Healthcare','ISRG':'Healthcare','SYK':'Healthcare',
  'MDT':'Healthcare','BSX':'Healthcare','ZTS':'Healthcare',
  'CI':'Healthcare','ELV':'Healthcare','HUM':'Healthcare',
  'CVS':'Healthcare','MOH':'Healthcare','CNC':'Healthcare',
  'HCA':'Healthcare','IQV':'Healthcare','IDXX':'Healthcare',
  'HOLX':'Healthcare','DXCM':'Healthcare','PODD':'Healthcare',
  'RVTY':'Healthcare','MTD':'Healthcare','WAT':'Healthcare',
  'A':'Healthcare','BIO':'Healthcare','TECH':'Healthcare',
  'HSIC':'Healthcare','MCK':'Healthcare','CAH':'Healthcare',
  'COR':'Healthcare','BIIB':'Healthcare','INCY':'Healthcare',
  'MRNA':'Healthcare','GEHC':'Healthcare','RMD':'Healthcare',
  'STE':'Healthcare','WST':'Healthcare','TFX':'Healthcare',
  'SOLV':'Healthcare','VTRS':'Healthcare','EW':'Healthcare',
  'BAC':'Financials','JPM':'Financials','WFC':'Financials',
  'GS':'Financials','MS':'Financials','BLK':'Financials',
  'BX':'Financials','SCHW':'Financials','AXP':'Financials',
  'V':'Financials','MA':'Financials','PYPL':'Financials',
  'SPGI':'Financials','MCO':'Financials','ICE':'Financials',
  'CME':'Financials','NDAQ':'Financials','COF':'Financials',
  'USB':'Financials','PNC':'Financials','TFC':'Financials',
  'MTB':'Financials','HBAN':'Financials','RF':'Financials',
  'CFG':'Financials','KEY':'Financials','FITB':'Financials',
  'STT':'Financials','BK':'Financials','AIG':'Financials',
  'MET':'Financials','PRU':'Financials','AFL':'Financials',
  'ALL':'Financials','PGR':'Financials','TRV':'Financials',
  'CB':'Financials','HIG':'Financials','MMC':'Financials',
  'AON':'Financials','AJG':'Financials','WTW':'Financials',
  'BRK.B':'Financials','RJF':'Financials','ACGL':'Financials',
  'GL':'Financials','AIZ':'Financials','EG':'Financials',
  'CINF':'Financials','PFG':'Financials','IVZ':'Financials',
  'BEN':'Financials','TROW':'Financials','FDS':'Financials',
  'MKTX':'Financials','CBOE':'Financials','MSCI':'Financials',
  'FI':'Financials','FIS':'Financials','GPN':'Financials',
  'CPAY':'Financials','JKHY':'Financials','AMP':'Financials',
  'SYF':'Financials','DFS':'Financials','C':'Financials',
  'XOM':'Energy','CVX':'Energy','COP':'Energy','EOG':'Energy',
  'SLB':'Energy','MPC':'Energy','PSX':'Energy','VLO':'Energy',
  'OXY':'Energy','HES':'Energy','DVN':'Energy','FANG':'Energy',
  'APA':'Energy','BKR':'Energy','HAL':'Energy','MRO':'Energy',
  'CTRA':'Energy','OKE':'Energy','WMB':'Energy','KMI':'Energy',
  'TRGP':'Energy','NRG':'Energy','VST':'Energy','CEG':'Energy',
  'PG':'Consumer Staples','KO':'Consumer Staples',
  'PEP':'Consumer Staples','WMT':'Consumer Staples',
  'COST':'Consumer Staples','PM':'Consumer Staples',
  'MO':'Consumer Staples','MDLZ':'Consumer Staples',
  'CL':'Consumer Staples','KMB':'Consumer Staples',
  'GIS':'Consumer Staples','K':'Consumer Staples',
  'KHC':'Consumer Staples','CPB':'Consumer Staples',
  'CAG':'Consumer Staples','SJM':'Consumer Staples',
  'HRL':'Consumer Staples','MKC':'Consumer Staples',
  'TAP':'Consumer Staples','STZ':'Consumer Staples',
  'BF.B':'Consumer Staples','MNST':'Consumer Staples',
  'KDP':'Consumer Staples','KVUE':'Consumer Staples',
  'CLX':'Consumer Staples','CHD':'Consumer Staples',
  'EL':'Consumer Staples','AMCR':'Consumer Staples',
  'AVY':'Consumer Staples','PKG':'Consumer Staples',
  'HSY':'Consumer Staples','TSN':'Consumer Staples',
  'ADM':'Consumer Staples','LW':'Consumer Staples',
  'SYY':'Consumer Staples','WBA':'Consumer Staples',
  'NEE':'Utilities','DUK':'Utilities','SO':'Utilities',
  'D':'Utilities','AEP':'Utilities','SRE':'Utilities',
  'EXC':'Utilities','XEL':'Utilities','ED':'Utilities',
  'ES':'Utilities','ETR':'Utilities','FE':'Utilities',
  'EIX':'Utilities','PEG':'Utilities','DTE':'Utilities',
  'PPL':'Utilities','CMS':'Utilities','AES':'Utilities',
  'NI':'Utilities','WEC':'Utilities','AWK':'Utilities',
  'ATO':'Utilities','LNT':'Utilities','PNW':'Utilities',
  'EVRST':'Utilities','PCG':'Utilities',
  'LIN':'Materials','APD':'Materials','ECL':'Materials',
  'SHW':'Materials','FCX':'Materials','NEM':'Materials',
  'NUE':'Materials','STLD':'Materials','VMC':'Materials',
  'MLM':'Materials','ALB':'Materials','CE':'Materials',
  'DD':'Materials','DOW':'Materials','LYB':'Materials',
  'EMN':'Materials','FMC':'Materials','IFF':'Materials',
  'PPG':'Materials','MOS':'Materials','CF':'Materials',
  'WY':'Materials','IP':'Materials',
  'AMT':'Real Estate','PLD':'Real Estate','CCI':'Real Estate',
  'EQIX':'Real Estate','PSA':'Real Estate','DLR':'Real Estate',
  'SBAC':'Real Estate','SPG':'Real Estate','O':'Real Estate',
  'WELL':'Real Estate','VTR':'Real Estate','EQR':'Real Estate',
  'AVB':'Real Estate','ESS':'Real Estate','MAA':'Real Estate',
  'UDR':'Real Estate','CPT':'Real Estate','ARE':'Real Estate',
  'KIM':'Real Estate','REG':'Real Estate','FRT':'Real Estate',
  'EXR':'Real Estate','INVH':'Real Estate','IRM':'Real Estate',
  'CSGP':'Real Estate','CBRE':'Real Estate','VICI':'Real Estate',
  'HST':'Real Estate','DOC':'Real Estate',
  'HON':'Industrials','GE':'Industrials','MMM':'Industrials',
  'CAT':'Industrials','DE':'Industrials','BA':'Industrials',
  'RTX':'Industrials','LMT':'Industrials','GD':'Industrials',
  'NOC':'Industrials','UPS':'Industrials','FDX':'Industrials',
  'UNP':'Industrials','CSX':'Industrials','NSC':'Industrials',
  'DAL':'Industrials','UAL':'Industrials','AAL':'Industrials',
  'LUV':'Industrials','WM':'Industrials','RSG':'Industrials',
  'ETN':'Industrials','EMR':'Industrials','ROK':'Industrials',
  'ITW':'Industrials','DOV':'Industrials','PH':'Industrials',
  'IR':'Industrials','OTIS':'Industrials','CARR':'Industrials',
  'TT':'Industrials','LII':'Industrials','ALLE':'Industrials',
  'AOS':'Industrials','MAS':'Industrials','SWK':'Industrials',
  'SNA':'Industrials','PNR':'Industrials','GWW':'Industrials',
  'FAST':'Industrials','ODFL':'Industrials','CHRW':'Industrials',
  'JBHT':'Industrials','XYL':'Industrials','TRMB':'Industrials',
  'GNRC':'Industrials','HUBB':'Industrials','NDSN':'Industrials',
  'ROP':'Industrials','LDOS':'Industrials','TDG':'Industrials',
  'TDY':'Industrials','HII':'Industrials','TXT':'Industrials',
  'HWM':'Industrials','AXON':'Industrials','BLDR':'Industrials',
  'URI':'Industrials','PCAR':'Industrials','WAB':'Industrials',
  'EXPD':'Industrials','ADP':'Industrials','PAYX':'Industrials',
  'BR':'Industrials','CDAY':'Industrials','PAYC':'Industrials',
  'VRSK':'Industrials','IEX':'Industrials','AME':'Industrials',
  'ROL':'Industrials','CPRT':'Industrials','CTAS':'Industrials',
  'DAY':'Industrials','PWR':'Industrials','WSO':'Industrials',
  'L':'Industrials','GLW':'Technology','TEL':'Technology',
  'APH':'Technology','ON':'Technology','ENPH':'Technology',
  'FSLR':'Technology','IT':'Technology','CTSH':'Technology',
  'DELL':'Technology','MU':'Technology','AVGO':'Technology',
  'FICO':'Technology','PTC':'Technology','TYL':'Technology',
  'ADSK':'Technology','UBER':'Technology',
};

function CandlestickChart({ ticker, theme }) {
  const chartContainerRef = useRef(null);
  const [chartError, setChartError] = useState(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 300,
      layout: { background: { color: theme?.bgCard || '#0f172a' }, textColor: theme?.textSecondary || '#94a3b8' },
      grid: { vertLines: { color: theme?.border || '#1e293b' }, horzLines: { color: theme?.border || '#1e293b' } },
      rightPriceScale: { borderColor: theme?.border || '#1e293b' },
      timeScale: { borderColor: theme?.border || '#1e293b', timeVisible: true },
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

  if (chartError) return <div style={{ color: theme?.textSecondary || '#94a3b8', fontSize: '13px' }}>{chartError}</div>;
  return <div style={{ borderRadius: '8px', overflow: 'hidden' }}><div ref={chartContainerRef} style={{ width: '100%' }} /></div>;
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

    const ticker = stock ? (stock.ticker || '') : '';
    const cap = detail ? (detail.marketCap || 0) : 0;
    const vol = detail ? (detail.volume || 0) : 0;
    const absChange = detail ? Math.abs(parseFloat(detail.change) || 0) : 0;

    const peRatio          = detail?.peRatio          ?? null;
    const pbRatio          = detail?.pbRatio          ?? null;
    const earningsYield    = detail?.earningsYield    ?? null;
    const dividendYield    = detail?.dividendYield    ?? null;
    const payoutRatio      = detail?.payoutRatio      ?? null;
    const debtToEquity     = detail?.debtToEquity     ?? null;
    const currentRatio     = detail?.currentRatio     ?? null;
    const roic             = detail?.roic             ?? null;
    const freeCashFlowPerShare = detail?.freeCashFlowPerShare ?? null;
    const revenue0         = detail?.revenue0         ?? null;
    const revenue1         = detail?.revenue1         ?? null;
    const grossMargin0     = detail?.grossMargin0     ?? null;
    const grossMargin1     = detail?.grossMargin1     ?? null;
    const eps0             = detail?.eps0             ?? null;
    const eps1             = detail?.eps1             ?? null;

    const calcPeScore = (pe) => {
      if (pe === null) return null;
      if (pe < 10) return 95;
      if (pe < 15) return 80;
      if (pe < 20) return 65;
      if (pe < 30) return 45;
      return 20;
    };
    const calcPbScore = (pb) => {
      if (pb === null) return null;
      if (pb < 1) return 95;
      if (pb < 2) return 80;
      if (pb < 3) return 65;
      if (pb < 5) return 40;
      return 20;
    };
    const calcRoicScore = (r) => {
      if (r === null) return null;
      if (r > 0.20) return 95;
      if (r > 0.15) return 80;
      if (r > 0.10) return 60;
      if (r > 0.05) return 40;
      return 15;
    };
    const calcMarginsScore = (gm0, gm1) => {
      if (gm0 === null) return null;
      if (gm1 !== null) {
        const diff = gm0 - gm1;
        if (diff >= -0.02) return 85;
        if (diff >= -0.05) return 55;
        return 25;
      }
      if (gm0 > 0.40) return 80;
      if (gm0 > 0.20) return 60;
      return 40;
    };

    // Knockout filters — only apply when data is available
    const selectedSet = new Set(selectedFactors);
    if ((selectedSet.has('low_debt') || selectedSet.has('financial_health')) && debtToEquity !== null && debtToEquity > 3.0) return 0;
    if ((selectedSet.has('stable_earnings') || selectedSet.has('earnings_consistency')) && eps0 !== null && eps0 < 0) return 0;
    if (selectedSet.has('high_dividend_yield') && dividendYield !== null && dividendYield === 0) return 0;
    if (selectedSet.has('strong_balance_sheet') && currentRatio !== null && currentRatio < 0.8) return 0;

    // Collect raw score per factor
    const factorScores = {};

    selectedFactors.forEach(factorId => {
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
        const base = vol > 5000000 ? 80 : vol > 1000000 ? 60 : vol > 100000 ? 40 : 20;
        score = Math.min(99, base + hashScore(ticker, 'momentum', 0, 20));

      } else if (factorId === 'low_pe') {
        const s = calcPeScore(peRatio);
        score = s !== null ? s : hashScore(ticker, 'low_pe', 30, 90);
        if (peRatio !== null && peRatio < 8) score = Math.min(99, score + 5);

      } else if (factorId === 'low_pb') {
        const s = calcPbScore(pbRatio);
        score = s !== null ? s : hashScore(ticker, 'low_pb', 30, 90);
        if (pbRatio !== null && pbRatio < 0.8) score = Math.min(99, score + 5);

      } else if (factorId === 'high_earnings_yield') {
        if (earningsYield !== null) {
          if (earningsYield > 0.08) score = 90;
          else if (earningsYield > 0.05) score = 70;
          else if (earningsYield > 0.03) score = 50;
          else score = 25;
          if (earningsYield > 0.12) score = Math.min(99, score + 5);
        } else {
          score = hashScore(ticker, 'high_earnings_yield', 30, 90);
        }

      } else if (factorId === 'reasonable_valuation' || factorId === 'value') {
        const peS = calcPeScore(peRatio);
        const pbS = calcPbScore(pbRatio);
        if (peS !== null && pbS !== null) score = (peS + pbS) / 2;
        else if (peS !== null) score = peS;
        else if (pbS !== null) score = pbS;
        else score = hashScore(ticker, factorId, 30, 90);

      } else if (factorId === 'moderate_pe') {
        if (peRatio !== null) {
          if (peRatio >= 15 && peRatio <= 25) score = 85;
          else if ((peRatio >= 10 && peRatio < 15) || (peRatio > 25 && peRatio <= 35)) score = 65;
          else if (peRatio < 10) score = 45;
          else score = 25;
        } else {
          score = hashScore(ticker, 'moderate_pe', 30, 90);
        }

      } else if (factorId === 'high_roic') {
        const s = calcRoicScore(roic);
        score = s !== null ? s : hashScore(ticker, 'high_roic', 30, 90);
        if (roic !== null && roic > 0.30) score = Math.min(99, score + 5);

      } else if (factorId === 'quality' || factorId === 'quality_growth') {
        const roicS = calcRoicScore(roic);
        const margS = calcMarginsScore(grossMargin0, grossMargin1);
        if (roicS !== null && margS !== null) score = (roicS + margS) / 2;
        else if (roicS !== null) score = roicS;
        else if (margS !== null) score = margS;
        else score = hashScore(ticker, factorId, 30, 90);

      } else if (factorId === 'consistent_margins') {
        const s = calcMarginsScore(grossMargin0, grossMargin1);
        score = s !== null ? s : hashScore(ticker, 'consistent_margins', 30, 90);

      } else if (factorId === 'stable_earnings' || factorId === 'earnings_consistency') {
        if (eps0 !== null && eps1 !== null && eps1 !== 0) {
          const ratio = (eps0 - eps1) / Math.abs(eps1);
          if (eps0 < 0) score = 20;
          else if (ratio >= -0.05) score = 85;
          else if (ratio >= -0.15) score = 55;
          else score = 20;
        } else {
          score = hashScore(ticker, factorId, 30, 90);
        }

      } else if (factorId === 'low_debt' || factorId === 'financial_health') {
        if (debtToEquity !== null) {
          if (debtToEquity < 0.3) score = 95;
          else if (debtToEquity < 0.6) score = 80;
          else if (debtToEquity < 1.0) score = 60;
          else if (debtToEquity < 2.0) score = 35;
          else score = 15;
        } else {
          score = hashScore(ticker, factorId, 35, 85);
        }

      } else if (factorId === 'strong_balance_sheet') {
        if (currentRatio !== null) {
          if (currentRatio > 2.5) score = 95;
          else if (currentRatio > 2.0) score = 85;
          else if (currentRatio > 1.5) score = 70;
          else if (currentRatio > 1.0) score = 50;
          else score = 20;
        } else {
          score = hashScore(ticker, 'strong_balance_sheet', 35, 85);
        }

      } else if (factorId === 'cash_flow') {
        if (freeCashFlowPerShare !== null) {
          if (freeCashFlowPerShare > 5) score = 90;
          else if (freeCashFlowPerShare > 2) score = 75;
          else if (freeCashFlowPerShare > 0) score = 55;
          else score = 15;
        } else {
          score = hashScore(ticker, 'cash_flow', 30, 90);
        }

      } else if (factorId === 'high_revenue_growth') {
        if (revenue0 !== null && revenue1 !== null && revenue1 > 0) {
          const growth = (revenue0 - revenue1) / revenue1;
          if (growth > 0.20) score = 95;
          else if (growth > 0.10) score = 80;
          else if (growth > 0.05) score = 65;
          else if (growth > 0) score = 45;
          else score = 15;
          if (growth > 0.30) score = Math.min(99, score + 5);
        } else {
          score = hashScore(ticker, 'high_revenue_growth', 20, 95);
        }

      } else if (factorId === 'high_dividend_yield') {
        if (dividendYield !== null) {
          if (dividendYield <= 0) score = 10;
          else if (dividendYield > 0.05) score = 90;
          else if (dividendYield > 0.03) score = 75;
          else if (dividendYield > 0.01) score = 50;
          else score = 10;
          if (dividendYield > 0.07) score = Math.min(99, score + 5);
        } else {
          score = hashScore(ticker, 'high_dividend_yield', 25, 85);
        }

      } else if (factorId === 'low_payout_ratio') {
        if (payoutRatio !== null) {
          if (payoutRatio === 0) score = 20;
          else if (payoutRatio >= 0.2 && payoutRatio <= 0.5) score = 90;
          else if (payoutRatio <= 0.7) score = 65;
          else score = 30;
        } else {
          score = hashScore(ticker, 'low_payout_ratio', 35, 85);
        }

      } else if (factorId === 'increasing_dividends') {
        if (dividendYield === null && payoutRatio === null) {
          score = hashScore(ticker, 'increasing_dividends', 25, 85);
        } else {
          const dy = dividendYield ?? 0;
          const pr = payoutRatio ?? 1;
          if (dy > 0.02 && pr < 0.60) score = 80;
          else if (dy > 0.02) score = 50;
          else score = 25;
        }

      } else {
        score = hashScore(ticker, factorId, 30, 80);
      }

      factorScores[factorId] = Math.max(5, Math.min(99, score));
    });

    // Correlated factor penalty — reduce double-counted signal pairs by 10% each
    const CORRELATED_PAIRS = [
      ['low_pe', 'high_earnings_yield'],
      ['low_pe', 'reasonable_valuation'],
      ['low_pe', 'value'],
      ['low_pb', 'reasonable_valuation'],
      ['low_debt', 'financial_health'],
      ['low_debt', 'strong_balance_sheet'],
      ['stable_earnings', 'earnings_consistency'],
      ['quality', 'quality_growth'],
      ['quality', 'high_roic'],
    ];
    CORRELATED_PAIRS.forEach(([a, b]) => {
      if (factorScores[a] !== undefined && factorScores[b] !== undefined) {
        factorScores[a] *= 0.90;
        factorScores[b] *= 0.90;
      }
    });

    // Weighted average with low-scorer penalty
    let totalWeight = 0;
    let earnedScore = 0;
    let penaltyPoints = 0;

    selectedFactors.forEach(factorId => {
      const w = safeWeights[factorId] || 2;
      totalWeight += w;
      const score = factorScores[factorId];
      earnedScore += score * w;
      if (score < 35) penaltyPoints += (35 - score) * 0.5 * w;
    });

    if (totalWeight === 0) return 0;
    const finalScore = Math.max(0, (earnedScore - penaltyPoints) / totalWeight);
    return Math.round(finalScore);
  } catch (e) { return 0; }
}

function Screener({ selectedFactors, subSelections, weights, portfolio, setPortfolio, cachedResults, setCachedResults, cacheKey, setCacheKey, theme, isDark, onViewPortfolio }) {
  const [expanded, setExpanded] = useState(null);
  const [stockDetails, setStockDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState({});

  const buildFmpData = (metricsJson, incomeJson, balanceJson) => {
    const m = Array.isArray(metricsJson) ? metricsJson[0] : null;
    const i0 = Array.isArray(incomeJson) ? incomeJson[0] : null;
    const i1 = Array.isArray(incomeJson) ? incomeJson[1] : null;
    const b = Array.isArray(balanceJson) ? balanceJson[0] : null;
    if (!m) return {};
    return {
      peRatio:             m.peRatio             ?? null,
      pbRatio:             m.pbRatio             ?? null,
      earningsYield:       m.earningsYield       ?? null,
      dividendYield:       m.dividendYield       ?? null,
      payoutRatio:         m.payoutRatio         ?? null,
      debtToEquity:        m.debtToEquity        ?? null,
      currentRatio:        m.currentRatio        ?? null,
      roic:                m.roic                ?? null,
      roe:                 m.roe                 ?? null,
      freeCashFlowPerShare: m.freeCashFlowPerShare ?? null,
      revenuePerShare:     m.revenuePerShare     ?? null,
      revenue0:            i0?.revenue           ?? null,
      revenue1:            i1?.revenue           ?? null,
      grossMargin0:        i0?.grossProfitRatio  ?? null,
      grossMargin1:        i1?.grossProfitRatio  ?? null,
      operatingMargin0:    i0?.operatingIncomeRatio ?? null,
      operatingMargin1:    i1?.operatingIncomeRatio ?? null,
      netMargin0:          i0?.netIncomeRatio    ?? null,
      netMargin1:          i1?.netIncomeRatio    ?? null,
      eps0:                i0?.eps               ?? null,
      eps1:                i1?.eps               ?? null,
      totalDebt:           b?.totalDebt          ?? null,
      totalAssets:         b?.totalAssets        ?? null,
      cash:                b?.cashAndCashEquivalents ?? null,
    };
  };

  const fetchStockDetails = async (ticker) => {
    if (stockDetails[ticker]?._complete) return;
    if (detailsLoading[ticker]) return;
    setDetailsLoading(prev => ({ ...prev, [ticker]: true }));

    try {
      // STEP 1: Price data (fastest)
      const priceRes = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_KEY}`);
      const priceData = await priceRes.json();
      const price = priceData.results?.[0] || {};
      setStockDetails(prev => ({
        ...prev,
        [ticker]: {
          ...(prev[ticker] || {}),
          close: price.c != null ? Number(price.c) : null,
          open: price.o != null ? Number(price.o) : null,
          high: price.h != null ? Number(price.h) : null,
          low: price.l != null ? Number(price.l) : null,
          volume: price.v != null ? Number(price.v) : null,
          change: price.c != null && price.o != null ? (((price.c - price.o) / price.o) * 100).toFixed(2) : null,
        },
      }));

      // STEP 3: Reference data
      const detailRes = await fetch(`https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${POLYGON_KEY}`);
      const detailData = await detailRes.json();
      const detail = detailData.results || {};
      setStockDetails(prev => ({
        ...prev,
        [ticker]: {
          ...(prev[ticker] || {}),
          name: detail.name != null ? detail.name : null,
          description: detail.description != null ? detail.description : null,
          sector: detail.sic_description != null ? detail.sic_description : (TICKER_SECTORS[ticker] || null),
          employees: detail.total_employees != null ? detail.total_employees : null,
          website: detail.homepage_url != null ? detail.homepage_url : null,
          marketCap: detail.market_cap != null ? Number(detail.market_cap) : null,
        },
      }));

      // STEP 4: FMP fundamentals (slowest)
      const [fmpMetricsRes, fmpIncomeRes, fmpBalanceRes] = await Promise.all([
        fetch(`https://financialmodelingprep.com/api/v3/key-metrics/${ticker}?limit=1&apiKey=${FMP_KEY}`),
        fetch(`https://financialmodelingprep.com/api/v3/income-statement/${ticker}?limit=2&apiKey=${FMP_KEY}`),
        fetch(`https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?limit=2&apiKey=${FMP_KEY}`),
      ]);
      const [metricsJson, incomeJson, balanceJson] = await Promise.all([
        fmpMetricsRes.json(),
        fmpIncomeRes.json(),
        fmpBalanceRes.json(),
      ]);
      const fmpData = buildFmpData(metricsJson, incomeJson, balanceJson);
      setStockDetails(prev => ({
        ...prev,
        [ticker]: { ...(prev[ticker] || {}), ...fmpData, _complete: true },
      }));

    } catch (err) {
      console.warn(`fetchStockDetails error for ${ticker}:`, err);
      setStockDetails(prev => ({ ...prev, [ticker]: { ...(prev[ticker] || {}), error: true } }));
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
    const safeSubs = subSelections || {};
    const safeWeights = weights || {};
    return SP500_TICKERS
      .map(ticker => ({ ticker, name: ticker }))
      .map(stock => ({
        ...stock,
        score: scoreStock(stock, stockDetails[stock.ticker], selectedFactors, safeSubs, safeWeights),
      }))
      .filter(stock => stock.score >= MATCH_THRESHOLD)
      .sort((a, b) => b.score - a.score || a.ticker.localeCompare(b.ticker))
      .slice(0, 50);
  };

  const t = theme || {};
  const styles = makeStyles(t);

  if (!selectedFactors || selectedFactors.length === 0) {
    return (
      <div style={{ padding: '40px 32px', color: t.text, maxWidth: '1200px', margin: '0 auto', background: t.gradientSubtle, minHeight: 'calc(100vh - 56px)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: t.text, letterSpacing: '-0.02em', marginBottom: '8px' }}>Stock Screener</h1>
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontSize: '18px', color: t.text, marginBottom: '8px' }}>No factors selected yet.</p>
          <p style={{ color: t.textSecondary, fontSize: '14px' }}>Go to the Strategy tab, select your factors, and click View Matching Stocks.</p>
        </div>
      </div>
    );
  }

  const scoredStocks = getScoredStocks();
  const subtitleText = `${scoredStocks.length} stocks matched your factors. Click any row to load its data.`;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Stock Screener</h1>
          <p style={styles.subtitle}>{subtitleText}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={onViewPortfolio}
            style={{ background: t.accent, color: isDark ? '#0a0f1e' : '#ffffff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
          >
            View Portfolio →
          </button>
          <button onClick={() => setStockDetails({})} style={styles.refreshBtn}>
            Re-screen
          </button>
        </div>
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

      {scoredStocks.length === 0 && (
        <div style={styles.status}>No stocks scored above {MATCH_THRESHOLD}% for your selected factors. Try adjusting your strategy.</div>
      )}

      {scoredStocks.length > 0 && (
        <div style={styles.tableWrapper}>
          <div style={styles.tableHeader}>
            <span style={styles.colArrow}></span>
            <span style={styles.colRank}>#</span>
            <span style={styles.col2}>Ticker / Company</span>
            <span style={styles.colSector}>Sector</span>
            <span style={styles.colScore}>Match</span>
            <span style={styles.col5}></span>
          </div>

          {scoredStocks.map((stock, index) => {
            const detail = stockDetails[stock.ticker];
            const isExpanded = expanded === stock.ticker;
            const score = stock.score;
            const scoreStyle = score >= 75 ? t.scoreHigh : score >= 60 ? t.scoreMid : t.scoreLow;
            const sector = TICKER_SECTORS[stock.ticker] || detail?.sector || 'Other';

            return (
              <div key={stock.ticker}>
                <div
                  style={{
                    ...styles.tableRow,
                    background: isExpanded ? t.bgTertiary : (index % 2 === 0 ? t.bgCard : t.bgSecondary),
                    ...(isExpanded ? styles.tableRowExpanded : {}),
                  }}
                  onClick={() => toggleExpand(stock.ticker)}
                >
                  <span style={styles.colArrow}>
                    <span style={{ display: 'inline-block', fontSize: '10px', color: t.textMuted, transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>▶</span>
                  </span>
                  <span style={styles.colRank}><span style={styles.rankNum}>{index + 1}</span></span>
                  <div style={styles.col2}>
                    <span style={styles.ticker}>{stock.ticker}</span>
                    <span style={styles.companyName}>{detail?.name || ''}</span>
                  </div>
                  <span style={styles.colSector}>{sector}</span>
                  <span style={styles.colScore}>
                    <span style={{ ...styles.scoreBadge, background: scoreStyle?.bg, color: scoreStyle?.color, border: `1px solid ${scoreStyle?.border}` }}>
                      {score}%
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
                    {/* Chart renders immediately and self-loads */}
                    <div style={styles.chartSection}>
                      <p style={styles.chartTitle}>1 Year Price History</p>
                      <CandlestickChart ticker={stock.ticker} theme={theme} />
                    </div>

                    {/* Price grid — shows as soon as step 1 completes */}
                    {detail?.close != null ? (
                      <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '16px', marginTop: '16px' }}>
                        <div style={styles.detailGrid}>
                          <div style={styles.detailItem}><span style={styles.detailLabel}>Last Close</span><span style={styles.detailValue}>{'$' + Number(detail.close).toFixed(2)}</span></div>
                          <div style={styles.detailItem}><span style={styles.detailLabel}>Day Open</span><span style={styles.detailValue}>{detail.open != null ? '$' + Number(detail.open).toFixed(2) : 'N/A'}</span></div>
                          <div style={styles.detailItem}><span style={styles.detailLabel}>Day High</span><span style={styles.detailValue}>{detail.high != null ? '$' + Number(detail.high).toFixed(2) : 'N/A'}</span></div>
                          <div style={styles.detailItem}><span style={styles.detailLabel}>Day Low</span><span style={styles.detailValue}>{detail.low != null ? '$' + Number(detail.low).toFixed(2) : 'N/A'}</span></div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Day Change</span>
                            <span style={{ ...styles.detailValue, color: detail.change > 0 ? '#4ade80' : detail.change < 0 ? '#f87171' : t.text }}>
                              {detail.change != null ? (detail.change > 0 ? '+' : '') + detail.change + '%' : 'N/A'}
                            </span>
                          </div>
                          <div style={styles.detailItem}><span style={styles.detailLabel}>Volume</span><span style={styles.detailValue}>{detail.volume != null ? detail.volume.toLocaleString() : 'N/A'}</span></div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '16px', marginTop: '16px', color: t.textMuted, fontSize: '13px' }}>Loading prices...</div>
                    )}

                    {/* Company info — shows as soon as step 3 completes */}
                    {detail?.name != null ? (
                      <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '16px', marginTop: '16px' }}>
                        <div style={styles.detailGrid}>
                          <div style={styles.detailItem}><span style={styles.detailLabel}>Market Cap</span><span style={styles.detailValue}>{detail.marketCap ? formatMarketCap(detail.marketCap) : 'N/A'}</span></div>
                          <div style={styles.detailItem}><span style={styles.detailLabel}>Sector</span><span style={styles.detailValue}>{detail.sector || TICKER_SECTORS[stock.ticker] || 'N/A'}</span></div>
                          <div style={styles.detailItem}><span style={styles.detailLabel}>Employees</span><span style={styles.detailValue}>{detail.employees != null ? Number(detail.employees).toLocaleString() : 'N/A'}</span></div>
                          <div style={styles.detailItem}>
                            <span style={styles.detailLabel}>Website</span>
                            {detail.website ? (
                              <a href={detail.website} target="_blank" rel="noopener noreferrer" style={{ ...styles.detailValue, color: '#3b82f6', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                                {detail.website.replace(/^https?:\/\//, '')}
                              </a>
                            ) : <span style={styles.detailValue}>N/A</span>}
                          </div>
                        </div>
                        {detail.description && (
                          <p style={styles.description}>
                            {detail.description.length > 400 ? detail.description.slice(0, 400) + '...' : detail.description}
                          </p>
                        )}
                      </div>
                    ) : (
                      detail != null && <div style={{ color: t.textMuted, fontSize: '13px', marginTop: '8px' }}>Loading company info...</div>
                    )}

                    {detail?.error && <div style={styles.detailLoading}>Could not load details for this stock.</div>}
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

function makeStyles(theme) {
  const t = theme || {};
  return {
    container: { padding: '40px 32px', color: t.text, maxWidth: '1200px', margin: '0 auto', background: t.gradientSubtle, minHeight: 'calc(100vh - 56px)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
    title: { fontSize: '24px', fontWeight: '700', color: t.text, letterSpacing: '-0.02em', marginBottom: '4px' },
    subtitle: { color: t.textSecondary, fontSize: '14px', margin: 0 },
    dataTimestamp: { color: t.textMuted, fontSize: '12px', margin: '4px 0 0 0' },
    refreshBtn: { background: 'transparent', border: `1px solid ${t.border}`, color: t.textSecondary, padding: '8px 16px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
    factorTags: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' },
    tag: { background: t.tagBg, border: `1px solid ${t.tagBorder}`, color: t.tagText, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
    tagSub: { color: t.accentText, fontWeight: '400', opacity: 0.7 },
    progressSection: { marginBottom: '32px' },
    progressHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
    progressLabel: { fontSize: '13px', color: t.textSecondary },
    progressPct: { fontSize: '13px', color: t.accent, fontWeight: '600' },
    progressTrack: { height: '6px', background: t.progressBg, borderRadius: '999px', overflow: 'hidden' },
    progressFill: { height: '100%', background: t.progressFill, borderRadius: '999px', transition: 'width 0.3s ease' },
    status: { color: t.textSecondary, fontSize: '15px', padding: '40px 0', textAlign: 'center' },
    tableWrapper: { border: `1px solid ${t.border}`, borderRadius: '12px', overflow: 'hidden', boxShadow: t.shadow },
    tableHeader: { display: 'grid', gridTemplateColumns: '24px 40px 1fr 160px 80px 140px', padding: '10px 20px', background: t.tableHeader, borderBottom: `1px solid ${t.border}`, fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' },
    tableRow: { display: 'grid', gridTemplateColumns: '24px 40px 1fr 160px 80px 140px', padding: '14px 20px', borderBottom: `1px solid ${t.border}`, cursor: 'pointer', alignItems: 'center', transition: 'background 0.1s ease' },
    tableRowExpanded: { background: t.bgTertiary },
    colArrow: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
    colRank: { display: 'flex', alignItems: 'center' },
    rankNum: { fontSize: '12px', color: t.textMuted, fontWeight: '600' },
    col2: { display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2px', paddingRight: '16px', overflow: 'hidden' },
    colSector: { fontSize: '13px', color: t.textSecondary },
    colScore: { display: 'flex', alignItems: 'center' },
    scoreBadge: { padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
    col5: { display: 'flex', justifyContent: 'flex-end' },
    ticker: { fontWeight: '700', color: t.accent, fontSize: '14px' },
    companyName: { fontSize: '12px', color: t.textSecondary },
    addBtn: { background: 'transparent', border: `1px solid ${t.accentBorder}`, color: t.accent, padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' },
    addBtnAdded: { background: t.accentBg, color: t.accentText, border: `1px solid ${t.accentBorder}`, cursor: 'default' },
    expandedRow: { background: t.bgTertiary, borderBottom: `1px solid ${t.border}`, padding: '24px 20px 24px 90px' },
    detailLoading: { color: t.textSecondary, fontSize: '13px' },
    detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px', marginBottom: '20px' },
    detailItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
    detailLabel: { fontSize: '11px', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' },
    detailValue: { fontSize: '14px', color: t.text, fontWeight: '600' },
    description: { fontSize: '13px', color: t.textSecondary, lineHeight: '1.7', margin: '0 0 24px 0', borderTop: `1px solid ${t.border}`, paddingTop: '16px' },
    chartSection: { borderTop: `1px solid ${t.border}`, paddingTop: '16px' },
    chartTitle: { fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' },
  };
}

const styles = makeStyles({});

export default Screener;
