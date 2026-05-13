const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env from project root before reading env vars
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const eq = trimmed.indexOf('=');
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && !process.env[key]) process.env[key] = val;
  });
}

const POLYGON_KEY = process.env.REACT_APP_POLYGON_API_KEY || 'YOUR_KEY_HERE';
const FMP_KEY = process.env.REACT_APP_FMP_API_KEY || 'YOUR_KEY_HERE';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error for ${url}: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getTradingDaysAgo(n) {
  const date = new Date();
  let count = 0;
  while (count < n) {
    date.setDate(date.getDate() - 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) count++;
  }
  return date.toISOString().split('T')[0];
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

const INDEX_LABELS = {
  SPY: 'S&P 500', QQQ: 'Nasdaq', DIA: 'Dow Jones', VTHR: 'Russell 3000', VIXY: 'VIX',
};

const SECTOR_MAP = {
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
  'EOG':'Energy','MMM':'Industrials','DE':'Industrials','GD':'Industrials',
  'NOC':'Industrials','UNP':'Industrials','CSX':'Industrials','NSC':'Industrials',
  'DAL':'Industrials','UAL':'Industrials','WM':'Industrials','ETN':'Industrials',
  'EMR':'Industrials','ITW':'Industrials','PH':'Industrials','CARR':'Industrials',
  'OTIS':'Industrials','ADP':'Industrials','PAYX':'Industrials','CTAS':'Industrials',
  'ADSK':'Technology','MU':'Technology','AVGO':'Technology','DELL':'Technology',
  'FICO':'Technology','PTC':'Technology','UBER':'Technology','CTSH':'Technology',
  'GLW':'Technology','TEL':'Technology','APH':'Technology','ON':'Technology',
  'ENPH':'Technology','FSLR':'Technology','IT':'Technology',
  'LIN':'Materials','APD':'Materials','ECL':'Materials','SHW':'Materials',
  'FCX':'Materials','NEM':'Materials','NUE':'Materials','DOW':'Materials',
  'AMT':'Real Estate','PLD':'Real Estate','CCI':'Real Estate','EQIX':'Real Estate',
  'PSA':'Real Estate','DLR':'Real Estate','SPG':'Real Estate','O':'Real Estate',
  'WELL':'Real Estate','EQR':'Real Estate',
  'DUK':'Utilities','SO':'Utilities','D':'Utilities','AEP':'Utilities',
  'SRE':'Utilities','EXC':'Utilities','XEL':'Utilities','PCG':'Utilities',
  'MO':'Consumer Staples','MDLZ':'Consumer Staples','CL':'Consumer Staples',
  'KMB':'Consumer Staples','GIS':'Consumer Staples','HSY':'Consumer Staples',
  'TSN':'Consumer Staples','SYY':'Consumer Staples',
  'REGN':'Healthcare','SYK':'Healthcare','MDT':'Healthcare','BSX':'Healthcare',
  'ZTS':'Healthcare','CI':'Healthcare','ELV':'Healthcare','HUM':'Healthcare',
  'CVS':'Healthcare','HCA':'Healthcare','BIIB':'Healthcare','MRNA':'Healthcare',
  'C':'Financials','COF':'Financials','AIG':'Financials','MET':'Financials',
  'PRU':'Financials','AFL':'Financials','PGR':'Financials','TRV':'Financials',
  'CB':'Financials','MMC':'Financials','AON':'Financials','BRK.B':'Financials',
  'BK':'Financials','STT':'Financials','SCHW':'Financials','BX':'Financials',
  'BLK':'Financials','MCO':'Financials','ICE':'Financials','CME':'Financials',
  'MPC':'Energy','PSX':'Energy','VLO':'Energy','OXY':'Energy','HAL':'Energy',
  'BKR':'Energy','WMB':'Energy','OKE':'Energy',
};

const MOVER_TICKERS = [
  'AAPL','MSFT','NVDA','AMZN','GOOGL','META','TSLA','JPM','V','UNH',
  'XOM','LLY','JNJ','MA','PG','HD','MRK','COST','ABBV','BAC',
  'CVX','PEP','KO','WMT','NFLX','TMO','CSCO','ACN','ADBE','CRM',
  'ABT','MCD','NKE','DHR','TXN','NEE','PM','QCOM','IBM','AMD',
  'AMGN','GE','HON','CAT','SBUX','GS','INTU','BKNG','SPGI','BLK',
  'ORCL','PYPL','AXP','MS','LOW','TGT','F','GM','BA','RTX',
  'LMT','UPS','FDX','T','VZ','DIS','CMCSA','GILD','VRTX','ISRG',
  'WFC','USB','PNC','SLB','COP',
];

const SECTOR_STOCKS = [
  'AAPL','MSFT','NVDA','GOOGL','META',
  'UNH','LLY','JNJ','ABBV','MRK',
  'JPM','BAC','WFC','GS','MS',
  'XOM','CVX','COP','SLB','EOG',
  'AMZN','WMT','PG','KO','MCD',
];

const SP500_TICKERS = [
  'MMM','AOS','ABT','ABBV','ACN','ADBE','AMD','AES','AFL','A','APD','ABNB','AKAM','ALB','ARE',
  'ALGN','ALLE','LNT','ALL','GOOGL','GOOG','MO','AMZN','AMCR','AEE','AAL','AEP','AXP','AIG',
  'AMT','AWK','AMP','AME','AMGN','APH','ADI','ANSS','AON','APA','AAPL','AMAT','APTV','ACGL',
  'ADM','ANET','AJG','AIZ','T','ATO','ADSK','ADP','AZO','AVB','AVY','AXON','BKR','BALL','BAC',
  'BK','BBWI','BAX','BDX','BRK.B','BBY','BIO','TECH','BIIB','BLK','BX','BA','BMY','AVGO',
  'BR','BRO','BF.B','BLDR','BSX','CHRW','CDNS','CZR','CPT','CPB','COF','CAH','KMX','CCL',
  'CARR','CAT','CBOE','CBRE','CDW','CE','COR','CNC','CDAY','CF','CRL','SCHW','CHTR','CVX',
  'CMG','CB','CHD','CI','CINF','CTAS','CSCO','C','CFG','CLX','CME','CMS','KO','CTSH','CL','CMCSA',
  'CAG','COP','ED','STZ','CEG','COO','CPRT','GLW','CPAY','CTVA','CSGP','COST','CTRA','CCI','CSX',
  'CMI','CVS','DHR','DRI','DVA','DAY','DECK','DE','DELL','DAL','DVN','DXCM','FANG','DLR','DFS',
  'DG','DLTR','D','DPZ','DOV','DOW','DHI','DTE','DUK','DD','EMN','ETN','EBAY','ECL','EIX','EW',
  'EA','ELV','LLY','EMR','ENPH','ETR','EOG','EPAM','EQT','EFX','EQIX','EQR','ESS','EL','ETSY',
  'EG','ES','EXC','EXPE','EXPD','EXR','XOM','FFIV','FDS','FICO','FAST','FRT','FDX','FIS',
  'FITB','FSLR','FE','FI','FMC','F','FTNT','FTV','FOXA','FOX','BEN','FCX','GRMN','IT','GE','GEHC',
  'GEN','GNRC','GD','GIS','GM','GPC','GILD','GPN','GL','GDDY','GS','HAL','HIG','HAS','HCA','DOC',
  'HSIC','HSY','HES','HPE','HLT','HOLX','HD','HON','HRL','HST','HWM','HPQ','HUBB','HUM','HBAN',
  'HII','IBM','IEX','IDXX','ITW','INCY','IR','PODD','INTC','ICE','IFF','IP','IPG','INTU','ISRG',
  'IVZ','INVH','IQV','IRM','JBHT','JBL','JKHY','J','JNJ','JCI','JPM','JNPR','K','KVUE','KDP',
  'KEY','KEYS','KMB','KIM','KMI','KLAC','KHC','KR','LHX','LH','LRCX','LW','LVS','LDOS','LEN',
  'LII','LIN','LYV','LKQ','LMT','L','LOW','LULU','LYB','MTB','MRO','MPC','MKTX','MAR',
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
  'XEL','XYL','YUM','ZBRA','ZBH','ZTS',
];

function buildFmpData(metricsJson, incomeJson, balanceJson) {
  const m = Array.isArray(metricsJson) ? metricsJson[0] : null;
  const i0 = Array.isArray(incomeJson) ? incomeJson[0] : null;
  const i1 = Array.isArray(incomeJson) ? incomeJson[1] : null;
  const b = Array.isArray(balanceJson) ? balanceJson[0] : null;
  if (!m) return {};
  return {
    peRatio:              m.peRatio              ?? null,
    pbRatio:              m.pbRatio              ?? null,
    earningsYield:        m.earningsYield        ?? null,
    dividendYield:        m.dividendYield        ?? null,
    payoutRatio:          m.payoutRatio          ?? null,
    debtToEquity:         m.debtToEquity         ?? null,
    currentRatio:         m.currentRatio         ?? null,
    roic:                 m.roic                 ?? null,
    roe:                  m.roe                  ?? null,
    freeCashFlowPerShare: m.freeCashFlowPerShare  ?? null,
    revenuePerShare:      m.revenuePerShare       ?? null,
    revenue0:             i0?.revenue            ?? null,
    revenue1:             i1?.revenue            ?? null,
    grossMargin0:         i0?.grossProfitRatio   ?? null,
    grossMargin1:         i1?.grossProfitRatio   ?? null,
    operatingMargin0:     i0?.operatingIncomeRatio ?? null,
    operatingMargin1:     i1?.operatingIncomeRatio ?? null,
    netMargin0:           i0?.netIncomeRatio     ?? null,
    netMargin1:           i1?.netIncomeRatio     ?? null,
    eps0:                 i0?.eps               ?? null,
    eps1:                 i1?.eps               ?? null,
    totalDebt:            b?.totalDebt           ?? null,
    totalAssets:          b?.totalAssets         ?? null,
    cash:                 b?.cashAndCashEquivalents ?? null,
  };
}

async function main() {
  console.log('Starting full data fetch. Estimated time: 30-40 minutes.');
  console.log('Do not close this terminal window.');
  console.log('');

  const today = new Date().toISOString().split('T')[0];

  const output = {
    lastUpdated: new Date().toISOString(),
    indices: {},
    weeklyMovers: { gainers: [], losers: [] },
    sectorMovement: {},
    fearGreed: { vixPrice: null, spyWeekChange: null, score: null },
    stocks: {},
  };

  // ── STEP 1: INDEX PREV + INTRADAY ──────────────────────────────────────────
  console.log('── Step 1/6: Fetching market indices...');
  for (const ticker of ['SPY', 'QQQ', 'DIA', 'VTHR', 'VIXY']) {
    console.log(`  Fetching index: ${ticker}...`);
    try {
      const [prevData, intradayData] = await Promise.allSettled([
        fetchJson(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_KEY}`),
        fetchJson(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/5/minute/${today}/${today}?adjusted=true&sort=asc&limit=100&apiKey=${POLYGON_KEY}`),
      ]);
      const r = prevData.status === 'fulfilled' ? prevData.value.results?.[0] : null;
      const intraday = intradayData.status === 'fulfilled'
        ? (intradayData.value.results || []).map(b => ({ t: b.t, c: b.c }))
        : [];
      output.indices[ticker] = {
        label: INDEX_LABELS[ticker] || ticker,
        price: r?.c ?? null,
        change: r?.c && r?.o ? +((( r.c - r.o) / r.o) * 100).toFixed(2) : null,
        intraday,
      };
      if (ticker === 'VIXY' && r?.c) output.fearGreed.vixPrice = r.c;
    } catch (e) {
      console.warn(`  Failed index ${ticker}:`, e.message);
      output.indices[ticker] = { label: INDEX_LABELS[ticker] || ticker, price: null, change: null, intraday: [] };
    }
    await sleep(2000);
  }

  // ── STEP 2: SPY WEEKLY CHANGE ──────────────────────────────────────────────
  console.log('── Step 2/6: Fetching SPY weekly change...');
  try {
    const startDate = getTradingDaysAgo(7);
    const spyWeekData = await fetchJson(
      `https://api.polygon.io/v2/aggs/ticker/SPY/range/1/day/${startDate}/${today}?adjusted=true&sort=asc&limit=10&apiKey=${POLYGON_KEY}`
    );
    const results = spyWeekData.results;
    if (results && results.length >= 2) {
      output.fearGreed.spyWeekChange = ((results[results.length - 1].c - results[0].c) / results[0].c) * 100;
    }
  } catch (e) {
    console.warn('  Failed SPY weekly:', e.message);
  }
  await sleep(2000);

  // ── STEP 3: FEAR & GREED SCORE ─────────────────────────────────────────────
  const vixScore = calcVixScore(output.fearGreed.vixPrice);
  const spyScore = calcSpyScore(output.fearGreed.spyWeekChange);
  const totalWeight = (vixScore !== null ? 40 : 0) + (spyScore !== null ? 35 : 0);
  output.fearGreed.score = totalWeight > 0
    ? Math.round(((vixScore ?? 0) + (spyScore ?? 0)) / totalWeight * 100)
    : null;
  console.log(`── Step 3/6: Fear & Greed score: ${output.fearGreed.score}`);

  // ── STEP 4: SECTOR STOCKS ──────────────────────────────────────────────────
  console.log('── Step 4/6: Fetching sector stocks (25 tickers)...');
  for (let i = 0; i < SECTOR_STOCKS.length; i++) {
    const ticker = SECTOR_STOCKS[i];
    console.log(`  Fetching sector stock ${i + 1}/${SECTOR_STOCKS.length}: ${ticker}...`);
    try {
      const data = await fetchJson(
        `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_KEY}`
      );
      const r = data.results?.[0];
      if (r && r.o) {
        output.sectorMovement[ticker] = {
          change: +((r.c - r.o) / r.o * 100).toFixed(4),
          close: r.c,
        };
      } else {
        output.sectorMovement[ticker] = { change: null, close: null };
      }
    } catch (e) {
      console.warn(`  Failed sector ${ticker}:`, e.message);
      output.sectorMovement[ticker] = { change: null, close: null };
    }
    await sleep(2000);
  }

  // ── STEP 5: WEEKLY MOVERS ─────────────────────────────────────────────────
  console.log('── Step 5/6: Fetching weekly movers (75 tickers)...');
  const startDate5 = getTradingDaysAgo(7);
  const moverResults = [];
  for (let i = 0; i < MOVER_TICKERS.length; i++) {
    const ticker = MOVER_TICKERS[i];
    if ((i + 1) % 10 === 0) console.log(`  Weekly movers progress: ${i + 1}/${MOVER_TICKERS.length}...`);
    try {
      const data = await fetchJson(
        `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${startDate5}/${today}?adjusted=true&sort=asc&limit=10&apiKey=${POLYGON_KEY}`
      );
      const pts = data.results;
      if (pts && pts.length >= 2) {
        const weeklyChange = (pts[pts.length - 1].c - pts[0].c) / pts[0].c * 100;
        moverResults.push({ ticker, weeklyChange, sector: SECTOR_MAP[ticker] || '' });
      }
    } catch (e) {
      console.warn(`  Failed mover ${ticker}:`, e.message);
    }
    await sleep(2000);
  }
  moverResults.sort((a, b) => b.weeklyChange - a.weeklyChange);
  output.weeklyMovers.gainers = moverResults.slice(0, 5);
  output.weeklyMovers.losers = moverResults.slice(-5).reverse();
  console.log(`  Top gainer: ${output.weeklyMovers.gainers[0]?.ticker} (${output.weeklyMovers.gainers[0]?.weeklyChange?.toFixed(2)}%)`);

  // ── STEP 6: STOCK FUNDAMENTALS ─────────────────────────────────────────────
  console.log('── Step 6/6: Fetching stock fundamentals (500 tickers, ~30 min)...');
  for (let i = 0; i < SP500_TICKERS.length; i++) {
    const ticker = SP500_TICKERS[i];
    if ((i + 1) % 25 === 0) console.log(`  Stock fundamentals: ${i + 1}/${SP500_TICKERS.length} complete...`);
    const stockEntry = {};
    try {
      const [priceRes, refRes, metricsRes, incomeRes, balanceRes] = await Promise.allSettled([
        fetchJson(`https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_KEY}`),
        fetchJson(`https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${POLYGON_KEY}`),
        fetchJson(`https://financialmodelingprep.com/api/v3/key-metrics/${ticker}?limit=1&apiKey=${FMP_KEY}`),
        fetchJson(`https://financialmodelingprep.com/api/v3/income-statement/${ticker}?limit=2&apiKey=${FMP_KEY}`),
        fetchJson(`https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?limit=2&apiKey=${FMP_KEY}`),
      ]);

      // Price
      if (priceRes.status === 'fulfilled') {
        const r = priceRes.value.results?.[0];
        if (r) {
          stockEntry.close = r.c ?? null;
          stockEntry.open = r.o ?? null;
          stockEntry.high = r.h ?? null;
          stockEntry.low = r.l ?? null;
          stockEntry.volume = r.v ?? null;
          stockEntry.change = r.c && r.o ? +((( r.c - r.o) / r.o) * 100).toFixed(2) : null;
        }
      }

      // Reference
      if (refRes.status === 'fulfilled') {
        const d = refRes.value.results || {};
        stockEntry.name = d.name ?? null;
        stockEntry.description = d.description ?? null;
        stockEntry.sector = d.sic_description ?? SECTOR_MAP[ticker] ?? null;
        stockEntry.employees = d.total_employees ?? null;
        stockEntry.website = d.homepage_url ?? null;
        stockEntry.marketCap = d.market_cap != null ? Number(d.market_cap) : null;
      } else {
        stockEntry.sector = SECTOR_MAP[ticker] ?? null;
      }

      // FMP fundamentals
      const fmp = buildFmpData(
        metricsRes.status === 'fulfilled' ? metricsRes.value : null,
        incomeRes.status === 'fulfilled' ? incomeRes.value : null,
        balanceRes.status === 'fulfilled' ? balanceRes.value : null,
      );
      Object.assign(stockEntry, fmp);
      stockEntry._complete = true;

    } catch (e) {
      console.warn(`  Failed fundamentals ${ticker}:`, e.message);
      stockEntry._complete = false;
    }
    output.stocks[ticker] = stockEntry;
    await sleep(3000);
  }

  // ── WRITE OUTPUT ───────────────────────────────────────────────────────────
  const outputPath = path.join(__dirname, '../src/data/marketData.json');
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log('');
  console.log('Done! Data written to src/data/marketData.json');
  console.log('Run: git add . && git commit -m "weekly data update" && git push origin main');
}

main().catch(e => { console.error('Fatal error:', e); process.exit(1); });
