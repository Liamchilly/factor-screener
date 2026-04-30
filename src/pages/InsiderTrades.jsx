import React, { useState, useEffect, useMemo } from 'react';

const EDGAR_AGENT = 'BulletInvesting contact@bulletinvesting.com';

const CONGRESS_URL = 'https://house-stock-watcher-data.s3-us-east-2.amazonaws.com/data/all_transactions.json';

const INVESTORS = [
  { name: 'Warren Buffett', fund: 'Berkshire Hathaway', cik: '0001067983' },
  { name: 'Bill Ackman', fund: 'Pershing Square', cik: '0001336528' },
  { name: 'Michael Burry', fund: 'Scion', cik: '0001649339' },
  { name: 'David Tepper', fund: 'Appaloosa', cik: '0001656456' },
  { name: 'Stanley Druckenmiller', fund: 'Duquesne', cik: '0001536117' },
  { name: 'Cathie Wood', fund: 'ARK', cik: '0001579982' },
  { name: 'Ray Dalio', fund: 'Bridgewater', cik: '0001350694' },
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
  'MOODY\'S': 'MCO', "MOODY'S CORP": 'MCO',
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

function CongressPage({ theme }) {
  const t = theme || {};
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterTicker, setFilterTicker] = useState('');
  const [filterRep, setFilterRep] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterParty, setFilterParty] = useState('All');

  useEffect(() => {
    fetch(CONGRESS_URL)
      .then(r => r.json())
      .then(data => {
        const sorted = data
          .filter(d => d.ticker && d.ticker !== '--')
          .sort((a, b) => (b.transaction_date || '').localeCompare(a.transaction_date || ''))
          .slice(0, 500);
        setRows(sorted);
        setLoading(false);
      })
      .catch(() => { setError('Could not load congressional data.'); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    return rows
      .filter(r => !filterTicker || (r.ticker || '').toUpperCase().includes(filterTicker.toUpperCase()))
      .filter(r => !filterRep || (r.representative || '').toLowerCase().includes(filterRep.toLowerCase()))
      .filter(r => filterType === 'All' || (r.type || '').toLowerCase().includes(filterType.toLowerCase()))
      .filter(r => {
        if (filterParty === 'All') return true;
        const p = (r.party || '').toLowerCase();
        if (filterParty === 'Democrat') return p.startsWith('d');
        if (filterParty === 'Republican') return p.startsWith('r');
        return true;
      })
      .slice(0, 100);
  }, [rows, filterTicker, filterRep, filterType, filterParty]);

  const partyPill = (party) => {
    const p = (party || '').toLowerCase();
    const isDem = p.startsWith('d');
    return (
      <span style={{
        background: isDem ? '#1e3a5f' : '#5f1e1e',
        color: isDem ? '#60a5fa' : '#f87171',
        fontSize: '11px',
        fontWeight: '700',
        padding: '2px 8px',
        borderRadius: '20px',
        letterSpacing: '0.04em',
      }}>
        {isDem ? 'D' : 'R'}
      </span>
    );
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: t.text, letterSpacing: '-0.02em', margin: '0 0 4px 0' }}>Congressional Trades</h1>
      <p style={{ fontSize: '12px', color: t.textMuted, margin: '0 0 24px 0' }}>
        Data sourced from public congressional disclosure filings. Disclosures may be delayed up to 45 days.
      </p>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { val: filterTicker, set: setFilterTicker, ph: 'Filter by ticker...', upper: true },
          { val: filterRep, set: setFilterRep, ph: 'Filter by representative...', upper: false },
        ].map(({ val, set, ph, upper }) => (
          <input key={ph} type="text" value={val} onChange={e => set(upper ? e.target.value.toUpperCase() : e.target.value)} placeholder={ph}
            style={{ padding: '8px 12px', background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: '8px', color: t.text, fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif', minWidth: '200px' }} />
        ))}
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          style={{ padding: '8px 12px', background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: '8px', color: t.text, fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif' }}>
          {['All', 'Purchase', 'Sale'].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <select value={filterParty} onChange={e => setFilterParty(e.target.value)}
          style={{ padding: '8px 12px', background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: '8px', color: t.text, fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif' }}>
          {['All', 'Democrat', 'Republican'].map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      {loading && <div style={{ color: t.textMuted, fontSize: '14px', padding: '40px 0' }}>Loading congressional trades…</div>}
      {error && <div style={{ color: t.textSecondary, fontSize: '14px', padding: '40px 0' }}>{error}</div>}

      {!loading && !error && (
        <div style={{ border: `1px solid ${t.border}`, borderRadius: '12px', overflow: 'hidden', boxShadow: t.shadow }}>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 50px 80px 160px 120px 160px', padding: '10px 16px', background: t.tableHeader, borderBottom: `1px solid ${t.border}` }}>
            {['Date', 'Representative', '', 'Ticker', 'Company', 'Type', 'Amount'].map(h => (
              <span key={h} style={{ fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
            ))}
          </div>
          {filtered.map((row, i) => {
            const isBuy = (row.type || '').toLowerCase().includes('purchase');
            const tradeColor = isBuy ? '#16a34a' : '#dc2626';
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 50px 80px 160px 120px 160px', padding: '11px 16px', background: i % 2 === 0 ? t.bgCard : t.bgSecondary, borderBottom: `1px solid ${t.border}`, alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: t.textMuted }}>{row.transaction_date || '—'}</span>
                <span style={{ fontSize: '13px', color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.representative || '—'}</span>
                <span>{partyPill(row.party)}</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: tradeColor }}>{row.ticker}</span>
                <span style={{ fontSize: '12px', color: t.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.asset_description || '—'}</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: tradeColor }}>{isBuy ? 'Purchase' : 'Sale'}</span>
                <span style={{ fontSize: '12px', color: t.textSecondary }}>{row.amount || '—'}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BigInvestorsPage({ theme }) {
  const t = theme || {};
  const [selected, setSelected] = useState(0);
  const [holdings, setHoldings] = useState({});
  const [loadingIdx, setLoadingIdx] = useState(null);
  const [errors, setErrors] = useState({});

  const fetchHoldings = async (investor, idx) => {
    if (holdings[idx] || loadingIdx === idx) return;
    setLoadingIdx(idx);
    try {
      const paddedCik = investor.cik.replace(/^0+/, '').padStart(10, '0');
      const cikNum = investor.cik.replace(/^0+/, '');
      const subUrl = `https://data.sec.gov/submissions/CIK${paddedCik}.json`;
      const subRes = await fetch(subUrl, { headers: { 'User-Agent': EDGAR_AGENT } });
      if (!subRes.ok) throw new Error('EDGAR unavailable');
      const subData = await subRes.json();

      const forms = subData.filings.recent.form;
      const accNums = subData.filings.recent.accessionNumber;
      const dates = subData.filings.recent.filingDate;

      let latestIdx = -1;
      for (let i = 0; i < forms.length; i++) {
        if (forms[i] === '13F-HR') { latestIdx = i; break; }
      }
      if (latestIdx === -1) throw new Error('No 13F-HR filing found');

      const accNum = accNums[latestIdx];
      const filingDate = dates[latestIdx];
      const accNumFlat = accNum.replace(/-/g, '');

      const indexUrl = `https://data.sec.gov/Archives/edgar/data/${cikNum}/${accNumFlat}/${accNum}-index.json`;
      const indexRes = await fetch(indexUrl, { headers: { 'User-Agent': EDGAR_AGENT } });
      if (!indexRes.ok) throw new Error('Index fetch failed');
      const indexData = await indexRes.json();

      const items = indexData.directory?.item || [];
      const xmlFile = items.find(f =>
        f.name.endsWith('.xml') &&
        !f.name.toLowerCase().includes('xsl') &&
        f.name !== 'primary_doc.xml' &&
        !f.name.toLowerCase().includes('form13f')
      ) || items.find(f => f.name.endsWith('.xml'));

      if (!xmlFile) throw new Error('XML file not found');

      const xmlUrl = `https://data.sec.gov/Archives/edgar/data/${cikNum}/${accNumFlat}/${xmlFile.name}`;
      const xmlRes = await fetch(xmlUrl, { headers: { 'User-Agent': EDGAR_AGENT } });
      const xmlText = await xmlRes.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, 'text/xml');
      const tables = doc.querySelectorAll('infoTable');

      let parsed = Array.from(tables).map(tbl => {
        const name = tbl.querySelector('nameOfIssuer')?.textContent?.trim() || '';
        const value = parseInt(tbl.querySelector('value')?.textContent?.trim() || '0') * 1000;
        const shares = parseInt(tbl.querySelector('sshPrnamt')?.textContent?.trim() || '0');
        return { name, value, shares, ticker: nameToTicker(name) };
      });

      const total = parsed.reduce((s, h) => s + h.value, 0);
      parsed = parsed
        .map(h => ({ ...h, pct: total > 0 ? ((h.value / total) * 100).toFixed(1) : '0.0' }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 20);

      setHoldings(prev => ({ ...prev, [idx]: { rows: parsed, filingDate, total } }));
    } catch (e) {
      setErrors(prev => ({ ...prev, [idx]: true }));
    }
    setLoadingIdx(null);
  };

  useEffect(() => {
    fetchHoldings(INVESTORS[selected], selected); // eslint-disable-line react-hooks/exhaustive-deps
  }, [selected]); // eslint-disable-line react-hooks/exhaustive-deps

  const investor = INVESTORS[selected];
  const data = holdings[selected];
  const isLoading = loadingIdx === selected;
  const hasError = errors[selected];
  const top10 = data?.rows?.slice(0, 10) || [];
  const maxPct = top10.length ? Math.max(...top10.map(h => parseFloat(h.pct))) : 1;

  const fmtVal = (v) => {
    if (!v) return '—';
    if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
    if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
    return `$${v.toLocaleString()}`;
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: t.text, letterSpacing: '-0.02em', margin: '0 0 20px 0' }}>Big Investors</h1>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {INVESTORS.map((inv, idx) => (
          <button
            key={inv.cik}
            onClick={() => setSelected(idx)}
            style={{
              background: selected === idx ? t.accentBg : t.bgCard,
              border: `1px solid ${selected === idx ? t.accent : t.border}`,
              color: selected === idx ? t.accent : t.textSecondary,
              fontWeight: selected === idx ? '600' : '400',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {inv.name}
          </button>
        ))}
      </div>

      {isLoading && <div style={{ color: t.textMuted, fontSize: '14px', padding: '40px 0' }}>Loading 13F filing…</div>}
      {hasError && !isLoading && (
        <div style={{ color: t.textSecondary, fontSize: '14px', padding: '40px 0' }}>
          Could not load latest filing. SEC EDGAR may be temporarily unavailable.
        </div>
      )}

      {data && !isLoading && (
        <>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: t.text, margin: '0 0 4px 0' }}>{investor.name} / {investor.fund}</h2>
            <p style={{ fontSize: '12px', color: t.textMuted, margin: 0 }}>As of {data.filingDate} · 13F filing (up to 45 days delayed) · Top 20 holdings shown</p>
          </div>

          {top10.length > 0 && (
            <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '20px', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>Top 10 Portfolio Breakdown</div>
              {top10.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: t.textSecondary, width: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {h.ticker !== '—' ? h.ticker : h.name.slice(0, 14)}
                  </span>
                  <div style={{ flex: 1, height: '10px', background: t.bgTertiary, borderRadius: '5px', overflow: 'hidden' }}>
                    <div style={{ width: `${(parseFloat(h.pct) / maxPct) * 100}%`, height: '100%', background: t.accent, borderRadius: '5px' }} />
                  </div>
                  <span style={{ fontSize: '12px', color: t.accent, fontWeight: '600', width: '40px', textAlign: 'right', flexShrink: 0 }}>{h.pct}%</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ border: `1px solid ${t.border}`, borderRadius: '12px', overflow: 'hidden', boxShadow: t.shadow }}>
            <div style={{ display: 'grid', gridTemplateColumns: '40px 60px 1fr 120px 140px 80px', padding: '10px 16px', background: t.tableHeader, borderBottom: `1px solid ${t.border}` }}>
              {['#', 'Ticker', 'Company', 'Shares', 'Value', '% Port'].map(h => (
                <span key={h} style={{ fontSize: '11px', fontWeight: '600', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>
            {data.rows.map((h, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 60px 1fr 120px 140px 80px', padding: '11px 16px', background: i % 2 === 0 ? t.bgCard : t.bgSecondary, borderBottom: `1px solid ${t.border}`, alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: t.textMuted }}>{i + 1}</span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: t.accent }}>{h.ticker}</span>
                <span style={{ fontSize: '13px', color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</span>
                <span style={{ fontSize: '12px', color: t.textSecondary }}>{h.shares ? Number(h.shares).toLocaleString() : '—'}</span>
                <span style={{ fontSize: '12px', color: t.text, fontWeight: '600' }}>{fmtVal(h.value)}</span>
                <span style={{ fontSize: '12px', color: t.accent, fontWeight: '600' }}>{h.pct}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function InsiderTrades({ theme, activeSubPage }) {
  if (activeSubPage === 'big-investors') return <BigInvestorsPage theme={theme} />;
  return <CongressPage theme={theme} />;
}

export default InsiderTrades;
