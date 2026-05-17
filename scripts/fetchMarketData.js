const https = require('https');
const http = require('http');
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

function fetchJsonFromUrl(url, redirectCount) {
  redirectCount = redirectCount || 0
  return new Promise(function(resolve, reject) {
    if (redirectCount > 5) {
      reject(new Error('Too many redirects'))
      return
    }
    const isHttps = url.startsWith('https')
    const lib = isHttps ? https : http
    const options = {
      headers: { 'User-Agent': 'BulletInvesting/1.0 contact@bulletinvesting.com' }
    }
    lib.get(url, options, function(res) {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(fetchJsonFromUrl(res.headers.location, redirectCount + 1))
        return
      }
      if (res.statusCode !== 200) {
        reject(new Error('HTTP ' + res.statusCode + ' for ' + url))
        return
      }
      let data = ''
      res.on('data', function(chunk) { data += chunk })
      res.on('end', function() {
        try { resolve(JSON.parse(data)) }
        catch(e) { reject(new Error('JSON parse error: ' + e.message)) }
      })
    }).on('error', reject)
  })
}

function fetchJsonEdgar(url) {
  return new Promise((resolve, reject) => {
    const options = { headers: { 'User-Agent': EDGAR_AGENT } };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('JSON parse error')); }
      });
    }).on('error', reject);
  });
}

function fetchTextEdgar(url) {
  return new Promise(function(resolve, reject) {
    const options = {
      headers: { 'User-Agent': EDGAR_AGENT }
    }
    https.get(url, options, function(res) {
      let data = ''
      res.on('data', function(chunk) { data += chunk })
      res.on('end', function() { resolve(data) })
    }).on('error', reject)
  })
}

function parseHoldingsFromXml(xmlText) {
  const results = []
  const tableRegex = /<infoTable>([\s\S]*?)<\/infoTable>/g
  let match
  while ((match = tableRegex.exec(xmlText)) !== null) {
    const block = match[1]
    function getTag(tag) {
      const m = block.match(new RegExp('<' + tag + '[^>]*>([^<]*)<\/' + tag + '>'))
      return m ? m[1].trim() : ''
    }
    const name = getTag('nameOfIssuer')
    const value = parseInt(getTag('value') || '0') * 1000
    const shares = parseInt(getTag('sshPrnamt') || '0')
    results.push({ name, value, shares, ticker: nameToTicker(name) })
  }
  return results
}

function fetchXmlEdgar(url) {
  return new Promise((resolve, reject) => {
    const options = { headers: { 'User-Agent': EDGAR_AGENT } };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => { resolve(data); });
    }).on('error', reject);
  });
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const options = { headers: { 'User-Agent': EDGAR_AGENT } };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => { resolve(data); });
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

const EDGAR_AGENT = 'BulletInvesting contact@bulletinvesting.com';

const INVESTORS = [
  { name: 'Warren Buffett',       fund: 'Berkshire Hathaway', cik: '0001067983' },
  { name: 'Bill Ackman',          fund: 'Pershing Square',    cik: '0001336528' },
  { name: 'Michael Burry',        fund: 'Scion',              cik: '0001649339' },
  { name: 'David Tepper',         fund: 'Appaloosa',          cik: '0001656456' },
  { name: 'Stanley Druckenmiller',fund: 'Duquesne',           cik: '0001536117' },
  { name: 'Cathie Wood',          fund: 'ARK',                cik: '0001579982' },
  { name: 'Ray Dalio',            fund: 'Bridgewater',        cik: '0001350694' },
];

const NAME_TO_TICKER = {
  'APPLE': 'AAPL', 'APPLE INC': 'AAPL', 'APPLE INC.': 'AAPL',
  'MICROSOFT': 'MSFT', 'MICROSOFT CORP': 'MSFT', 'MICROSOFT CORPORATION': 'MSFT',
  'AMAZON': 'AMZN', 'AMAZON.COM INC': 'AMZN', 'AMAZON COM INC': 'AMZN',
  'ALPHABET INC': 'GOOGL', 'ALPHABET': 'GOOGL',
  'NVIDIA': 'NVDA', 'NVIDIA CORP': 'NVDA', 'NVIDIA CORPORATION': 'NVDA',
  'META PLATFORMS': 'META', 'META PLATFORMS INC': 'META',
  'TESLA': 'TSLA', 'TESLA INC': 'TSLA',
  'BERKSHIRE HATHAWAY': 'BRK.B', 'BERKSHIRE HATHAWAY INC': 'BRK.B',
  'JPMORGAN CHASE': 'JPM', 'JPMORGAN CHASE & CO': 'JPM',
  'JOHNSON & JOHNSON': 'JNJ',
  'VISA': 'V', 'VISA INC': 'V',
  'UNITEDHEALTH': 'UNH', 'UNITEDHEALTH GROUP': 'UNH', 'UNITEDHEALTH GROUP INC': 'UNH',
  'EXXON MOBIL': 'XOM', 'EXXON MOBIL CORP': 'XOM',
  'MASTERCARD': 'MA', 'MASTERCARD INC': 'MA',
  'PROCTER & GAMBLE': 'PG', 'PROCTER AND GAMBLE': 'PG',
  'HOME DEPOT': 'HD', 'HOME DEPOT INC': 'HD',
  'COCA-COLA': 'KO', 'COCA COLA': 'KO', 'COCA-COLA CO': 'KO',
  'ABBVIE': 'ABBV', 'ABBVIE INC': 'ABBV',
  'CHEVRON': 'CVX', 'CHEVRON CORP': 'CVX',
  'MERCK': 'MRK', 'MERCK & CO': 'MRK',
  'BANK OF AMERICA': 'BAC', 'BANK OF AMERICA CORP': 'BAC',
  'PEPSICO': 'PEP', 'PEPSICO INC': 'PEP',
  'COSTCO': 'COST', 'COSTCO WHOLESALE': 'COST', 'COSTCO WHOLESALE CORP': 'COST',
  'BROADCOM': 'AVGO', 'BROADCOM INC': 'AVGO',
  'ELI LILLY': 'LLY', 'ELI LILLY AND COMPANY': 'LLY',
  'WELLS FARGO': 'WFC', 'WELLS FARGO & COMPANY': 'WFC',
  'WALMART': 'WMT', 'WALMART INC': 'WMT',
  'AMERICAN EXPRESS': 'AXP', 'AMERICAN EXPRESS CO': 'AXP',
  'OCCIDENTAL PETROLEUM': 'OXY',
  "MOODY'S": 'MCO', "MOODY'S CORP": 'MCO',
  'HP INC': 'HPQ',
  'CITIGROUP': 'C', 'CITIGROUP INC': 'C',
  'KRAFT HEINZ': 'KHC', 'KRAFT HEINZ CO': 'KHC',
  'SNOWFLAKE': 'SNOW', 'SNOWFLAKE INC': 'SNOW',
  'AMAZON.COM': 'AMZN',
  'TAIWAN SEMICONDUCTOR': 'TSM',
  'NETFLIX': 'NFLX', 'NETFLIX INC': 'NFLX',
  'ADOBE': 'ADBE', 'ADOBE INC': 'ADBE',
  'SALESFORCE': 'CRM', 'SALESFORCE INC': 'CRM',
  'BOOKING HOLDINGS': 'BKNG',
  'HILTON': 'HLT', 'HILTON WORLDWIDE': 'HLT',
};

function normalizeName(name) {
  return name.toUpperCase().replace(/[.,]/g, '').replace(/\s+/g, ' ').trim();
}

function nameToTicker(name) {
  if (!name) return '—';
  const norm = normalizeName(name);
  if (NAME_TO_TICKER[norm]) return NAME_TO_TICKER[norm];
  const stripped = norm.replace(/ (INC|CORP|CO|LTD|LLC|GROUP|HOLDING|HOLDINGS|INTERNATIONAL|WORLDWIDE)$/, '').trim();
  return NAME_TO_TICKER[stripped] || '—';
}

function parseHoldings(xmlText) {
  const results = [];
  const tableRegex = /<infoTable>([\s\S]*?)<\/infoTable>/g;
  let match;
  while ((match = tableRegex.exec(xmlText)) !== null) {
    const block = match[1];
    const getName = tag => {
      const m = block.match(new RegExp(`<${tag}[^>]*>([^<]*)<\/${tag}>`));
      return m ? m[1].trim() : '';
    };
    const name = getName('nameOfIssuer');
    const value = parseInt(getName('value') || '0') * 1000;
    const shares = parseInt(getName('sshPrnamt') || '0');
    results.push({ name, value, shares, ticker: nameToTicker(name) });
  }
  return results;
}

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
  'AAPL','MSFT','NVDA','GOOGL','META','AMD','ADBE','CRM','NOW','INTU',
  'CSCO','IBM','ORCL','QCOM','TXN','ADI','AMAT','KLAC','LRCX','PANW',
  'ANET','PLTR','INTC','GLW','TEL',
  'JPM','BAC','WFC','GS','MS','C','USB','PNC','V','MA',
  'AXP','PYPL','BLK','SCHW','SPGI','MCO','PGR','CB','MET','AFL',
  'UNH','LLY','JNJ','MRK','ABBV','BMY','PFE','AMGN','GILD','VRTX',
  'MDT','ABT','SYK','BSX','ISRG','DHR','TMO','CVS','HUM','REGN',
  'AMZN','HD','LOW','TGT','MCD','SBUX','CMG','NKE','TSLA','BKNG',
  'MAR','HLT','F','GM','LULU',
  'WMT','COST','PG','KO','PEP','MO','PM','KMB','CL','GIS','HSY','MKC',
  'LMT','RTX','GD','NOC','BA','CAT','DE','HON','EMR','ETN',
  'UPS','FDX','UNP','GE','MMM',
  'XOM','CVX','COP','EOG','OXY','DVN','SLB','HAL','WMB','OKE',
  'NEE','DUK','SO','AEP','D','EXC','SRE','XEL',
  'AMT','PLD','EQIX','CCI','SPG','PSA','O','WELL',
  'NFLX','DIS','CMCSA','T','VZ','TMUS','CHTR','PARA','OMC','NDAQ',
  'LIN','APD','ECL','SHW','FCX','NEM','NUE',
]

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
  console.log('='.repeat(50));
  console.log('Bullet Investing — Weekly Data Fetch Script');
  console.log('='.repeat(50));
  console.log('');
  console.log('Estimated total time: 45-60 minutes')
  console.log('Steps:')
  console.log('  1. Market indices      (~2 min)')
  console.log('  2. SPY weekly change   (~15 sec)')
  console.log('  3. Fear & Greed        (instant)')
  console.log('  4. Sector stocks       (~6 min)')
  console.log('  5. Weekly movers       (~17 min)')
  console.log('  5b. Congressional trades (~1 min)')
  console.log('  5c. Big investor 13Fs  (~5 min)')
  console.log('  6. Stock fundamentals  (~25 min for 150 stocks)')
  console.log('')
  console.log('Leave this terminal open.')
  console.log('='.repeat(50));
  console.log('');

  const today = new Date().toISOString().split('T')[0];

  const output = {
    lastUpdated: new Date().toISOString(),
    indices: {},
    weeklyMovers: { gainers: [], losers: [] },
    sectorMovement: {},
    fearGreed: { vixPrice: null, spyWeekChange: null, score: null },
    stocks: {},
    congressTrades: [],
    bigInvestors: {},
  };

  // ── STEP 1: INDEX PREV + INTRADAY ──────────────────────────────────────────
  console.log('── Step 1/8: Fetching market indices...');
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
    await sleep(13000);
  }

  // ── STEP 2: SPY WEEKLY CHANGE ──────────────────────────────────────────────
  console.log('── Step 2/8: Fetching SPY weekly change...');
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
  await sleep(13000);

  // ── STEP 3: FEAR & GREED SCORE ─────────────────────────────────────────────
  const vixScore = calcVixScore(output.fearGreed.vixPrice);
  const spyScore = calcSpyScore(output.fearGreed.spyWeekChange);
  const totalWeight = (vixScore !== null ? 40 : 0) + (spyScore !== null ? 35 : 0);
  output.fearGreed.score = totalWeight > 0
    ? Math.round(((vixScore ?? 0) + (spyScore ?? 0)) / totalWeight * 100)
    : null;
  console.log(`── Step 3/8: Fear & Greed score: ${output.fearGreed.score}`);

  // ── STEP 4: SECTOR STOCKS ──────────────────────────────────────────────────
  console.log('── Step 4/8: Fetching sector stocks (25 tickers)...');
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
    await sleep(13000);
  }

  // ── STEP 5: WEEKLY MOVERS ─────────────────────────────────────────────────
  console.log('── Step 5/8: Fetching weekly movers (75 tickers)...');
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
    await sleep(13000);
  }
  moverResults.sort((a, b) => b.weeklyChange - a.weeklyChange);
  output.weeklyMovers.gainers = moverResults.slice(0, 5);
  output.weeklyMovers.losers = moverResults.slice(-5).reverse();
  console.log(`  Top gainer: ${output.weeklyMovers.gainers[0]?.ticker} (${output.weeklyMovers.gainers[0]?.weeklyChange?.toFixed(2)}%)`);

  // ── STEP 5b: CONGRESSIONAL TRADES ─────────────────────────────────────────
  console.log('── Step 5b/8: Fetching congressional trades...');
  try {
    const data = await fetchJsonFromUrl(
      'https://house-stock-watcher-data.s3-us-east-2.amazonaws.com/data/all_transactions.json'
    );
    const sorted = data
      .filter(d => d.ticker && d.ticker !== '--')
      .sort((a, b) => (b.transaction_date || '').localeCompare(a.transaction_date || ''))
      .slice(0, 500);
    output.congressTrades = sorted;
    console.log('  Congressional trades fetched:', sorted.length, 'records');
  } catch (e) {
    console.warn('  Failed congressional trades:', e.message);
    output.congressTrades = [];
  }
  await sleep(2000);

  // ── STEP 5c: BIG INVESTOR 13F FILINGS ────────────────────────────────────
  console.log('── Step 5c: Fetching big investor 13F filings...')
  for (const investor of INVESTORS) {
    console.log('  Fetching 13F for:', investor.name)
    try {
      const paddedCik = investor.cik.replace(/^0+/, '').padStart(10, '0')
      const cikNum = investor.cik.replace(/^0+/, '')

      // Step A: Get submissions
      const subData = await fetchJsonEdgar(
        'https://data.sec.gov/submissions/CIK' + paddedCik + '.json'
      )
      await sleep(1000)

      // Step B: Find latest 13F-HR
      const forms = subData.filings.recent.form
      const accNums = subData.filings.recent.accessionNumber
      const dates = subData.filings.recent.filingDate
      let latestIdx = -1
      for (let i = 0; i < forms.length; i++) {
        if (forms[i] === '13F-HR') { latestIdx = i; break }
      }
      if (latestIdx === -1) {
        throw new Error('No 13F-HR found for ' + investor.name)
      }
      const accNum = accNums[latestIdx]
      const filingDate = dates[latestIdx]
      const accNumFlat = accNum.replace(/-/g, '')

      // Step C: Get directory listing as HTML text
      const dirUrl = 'https://www.sec.gov/Archives/edgar/data/' +
        cikNum + '/' + accNumFlat + '/'
      const htmlText = await fetchTextEdgar(dirUrl)
      await sleep(1000)

      // Step D: Find XML file from directory listing
      const hrefMatches = htmlText.match(/href="([^"]+\.xml)"/gi) || []
      const xmlFiles = hrefMatches
        .map(function(m) {
          const match = m.match(/href="([^"]+)"/i)
          return match ? match[1] : null
        })
        .filter(Boolean)
        .filter(function(f) {
          const lower = f.toLowerCase()
          return !lower.includes('xsl') &&
                 !lower.includes('form13f') &&
                 f !== 'primary_doc.xml'
        })

      if (xmlFiles.length === 0) {
        throw new Error('No XML file found in directory for ' + investor.name)
      }

      // Build full XML URL
      let xmlUrl = xmlFiles[0]
      if (!xmlUrl.startsWith('http')) {
        xmlUrl = 'https://www.sec.gov' + (xmlUrl.startsWith('/') ? '' : '/') + xmlUrl
      }

      // Step E: Fetch and parse XML
      const xmlText = await fetchTextEdgar(xmlUrl)
      await sleep(1000)

      let holdings = parseHoldingsFromXml(xmlText)
      if (holdings.length === 0) {
        throw new Error('No holdings parsed from XML for ' + investor.name)
      }

      // Step F: Calculate percentages and take top 20
      const total = holdings.reduce(function(s, h) { return s + h.value }, 0)
      holdings = holdings
        .map(function(h) {
          return Object.assign({}, h, {
            pct: total > 0 ? ((h.value / total) * 100).toFixed(1) : '0.0'
          })
        })
        .sort(function(a, b) { return b.value - a.value })
        .slice(0, 20)

      output.bigInvestors[investor.cik] = {
        name: investor.name,
        fund: investor.fund,
        filingDate: filingDate,
        rows: holdings,
        total: total,
      }
      console.log('  Success:', investor.name, '-', holdings.length, 'holdings')

    } catch(e) {
      console.warn('  Failed', investor.name + ':', e.message)
      output.bigInvestors[investor.cik] = { error: true }
    }
    await sleep(3000)
  }

  // ── STEP 6: STOCK FUNDAMENTALS ─────────────────────────────────────────────
  console.log('── Step 6/6: Fetching stock fundamentals (150 curated tickers, ~45 min)...')
  for (let i = 0; i < SP500_TICKERS.length; i++) {
    const ticker = SP500_TICKERS[i]
    if ((i + 1) % 25 === 0) console.log(`  Stock fundamentals: ${i + 1}/${SP500_TICKERS.length} complete...`)

    const stockEntry = {}

    // Polygon price call
    let priceResult = null
    try {
      priceResult = await fetchJson(
        `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${POLYGON_KEY}`
      )
    } catch(e) {
      console.warn(`  Price fetch failed for ${ticker}:`, e.message)
    }
    await sleep(13000)

    // Polygon reference call
    let refResult = null
    try {
      refResult = await fetchJson(
        `https://api.polygon.io/v3/reference/tickers/${ticker}?apiKey=${POLYGON_KEY}`
      )
    } catch(e) {
      console.warn(`  Reference fetch failed for ${ticker}:`, e.message)
    }
    await sleep(2000)

    // FMP calls in parallel (no strict rate limit on free tier)
    const [metricsRes, incomeRes, balanceRes] = await Promise.allSettled([
      fetchJson(`https://financialmodelingprep.com/api/v3/key-metrics/${ticker}?limit=1&apiKey=${FMP_KEY}`),
      fetchJson(`https://financialmodelingprep.com/api/v3/income-statement/${ticker}?limit=2&apiKey=${FMP_KEY}`),
      fetchJson(`https://financialmodelingprep.com/api/v3/balance-sheet-statement/${ticker}?limit=2&apiKey=${FMP_KEY}`),
    ])
    await sleep(2000)

    // Process price data
    if (priceResult) {
      const r = priceResult.results?.[0]
      if (r) {
        stockEntry.close = r.c ?? null
        stockEntry.open = r.o ?? null
        stockEntry.high = r.h ?? null
        stockEntry.low = r.l ?? null
        stockEntry.volume = r.v ?? null
        stockEntry.change = r.c && r.o
          ? +((( r.c - r.o) / r.o) * 100).toFixed(2) : null
      }
    }

    // Process reference data
    if (refResult) {
      const d = refResult.results || {}
      stockEntry.name = d.name ?? null
      stockEntry.description = d.description ?? null
      stockEntry.sector = d.sic_description ?? SECTOR_MAP[ticker] ?? null
      stockEntry.employees = d.total_employees ?? null
      stockEntry.website = d.homepage_url ?? null
      stockEntry.marketCap = d.market_cap != null
        ? Number(d.market_cap) : null
    } else {
      stockEntry.sector = SECTOR_MAP[ticker] ?? null
    }

    // Process FMP data
    const fmp = buildFmpData(
      metricsRes.status === 'fulfilled' ? metricsRes.value : null,
      incomeRes.status === 'fulfilled' ? incomeRes.value : null,
      balanceRes.status === 'fulfilled' ? balanceRes.value : null,
    )
    Object.assign(stockEntry, fmp)
    stockEntry._complete = true

    output.stocks[ticker] = stockEntry
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
