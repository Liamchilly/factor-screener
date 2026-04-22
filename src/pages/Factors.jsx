import React, { useState } from 'react';

const SECTIONS = [
  {
    section: 'Valuation & Size',
    factors: [
      {
        id: 'market_cap',
        label: 'Market Cap',
        description: 'Filter by company size. Small cap (under $2B) offers higher growth potential but more volatility. Mid cap ($2B-$10B) balances growth and stability. Large cap (over $10B) provides liquidity and consistency with a lower growth ceiling.',
        hasSubOption: true,
        subOptions: ['Small Cap', 'Mid Cap', 'Large Cap'],
        multiSub: true,
      },
      {
        id: 'value',
        label: 'Value',
        description: 'Screens for stocks trading at low prices relative to fundamentals like earnings (P/E) or book value (P/B). Seeks companies the market has underpriced relative to their intrinsic worth.',
      },
      {
        id: 'low_pe',
        label: 'Low P/E Ratio',
        description: 'Screens for stocks with a low trailing or forward Price/Earnings ratio relative to sector peers. A classic value signal, though low P/E can also reflect genuine business deterioration.',
      },
      {
        id: 'low_pb',
        label: 'Low P/B Ratio',
        description: 'Filters for stocks trading near or below book value. Historically favored by deep value investors like Benjamin Graham as a margin-of-safety indicator for asset-heavy businesses.',
      },
      {
        id: 'high_earnings_yield',
        label: 'High Earnings Yield',
        description: 'Earnings yield is the inverse of P/E (earnings ÷ price). A high earnings yield relative to bonds or the market average indicates potential undervaluation and was central to Greenblatt\'s Magic Formula.',
      },
      {
        id: 'reasonable_valuation',
        label: 'Reasonable Valuation',
        description: 'Screens for stocks trading at a discount to estimated intrinsic value. Combines P/E, P/B, and EV/EBITDA to identify companies priced below fair value without requiring deep distress.',
      },
    ],
  },
  {
    section: 'Growth',
    factors: [
      {
        id: 'quality_growth',
        label: 'Quality Growth',
        description: 'Targets companies with consistent revenue and earnings growth backed by strong fundamentals. Differs from pure growth investing by requiring profitability alongside expansion.',
      },
      {
        id: 'high_revenue_growth',
        label: 'High Revenue Growth',
        description: 'Screens for companies growing revenue at above-market rates. Strong top-line growth, particularly when paired with expanding margins, is a leading indicator of future earnings power and market share gains.',
      },
      {
        id: 'moderate_pe',
        label: 'Moderate P/E / PEG',
        description: 'Targets stocks with a Price/Earnings ratio reasonable relative to growth rate (PEG ratio). A PEG near or below 1.0 suggests the market may not be fully pricing in the company\'s growth potential.',
      },
    ],
  },
  {
    section: 'Profitability & Quality',
    factors: [
      {
        id: 'quality',
        label: 'Quality & Profitability',
        description: 'Focuses on companies with high return on equity, strong margins, and low debt. Quality companies tend to be more resilient during downturns and compound returns more reliably over time.',
      },
      {
        id: 'high_roic',
        label: 'High ROIC',
        description: 'Return on Invested Capital measures how efficiently a company generates returns from its capital base. High ROIC (typically >15%) is a hallmark of businesses with durable competitive advantages and compounding potential.',
      },
      {
        id: 'consistent_margins',
        label: 'Consistent Margins',
        description: 'Screens for companies that maintain stable or expanding operating and net margins over time. Consistent margins signal pricing power, operational discipline, and protection from competitive pressure.',
      },
      {
        id: 'earnings_consistency',
        label: 'Earnings Consistency',
        description: 'Filters for companies with uninterrupted positive earnings over multiple years. Consistent earnings reduce downside risk and signal a resilient business model that can weather economic cycles.',
      },
      {
        id: 'stable_earnings',
        label: 'Stable Earnings',
        description: 'Targets companies with low earnings volatility quarter-over-quarter and year-over-year. Stability signals predictable cash generation and reduces the risk of earnings surprises that can compress multiples.',
      },
    ],
  },
  {
    section: 'Financial Health',
    factors: [
      {
        id: 'financial_health',
        label: 'Financial Health',
        description: 'Screens on debt-to-equity ratio, current ratio, and cash ratio. Flags companies with manageable leverage and sufficient liquidity to meet short-term obligations without distress.',
      },
      {
        id: 'low_debt',
        label: 'Low Debt',
        description: 'Screens for companies with a low debt-to-equity or debt-to-EBITDA ratio. Low leverage reduces financial risk, preserves future borrowing capacity, and insulates the business during economic downturns or rising rate environments.',
      },
      {
        id: 'strong_balance_sheet',
        label: 'Strong Balance Sheet',
        description: 'Evaluates net cash position, current ratio, and working capital. A strong balance sheet provides a buffer against adversity and optionality to invest in growth without diluting shareholders.',
      },
    ],
  },
  {
    section: 'Cash Flow & Income',
    factors: [
      {
        id: 'cash_flow',
        label: 'Cash Flow Health',
        description: 'Evaluates free cash flow generation, the relationship between operating cash flow and net income, and capex intensity. Strong cash flow relative to earnings signals earnings quality and reinvestment capacity.',
      },
      {
        id: 'high_dividend_yield',
        label: 'High Dividend Yield',
        description: 'Filters for stocks with a dividend yield meaningfully above the market average. A high yield can indicate income opportunity, though yields elevated by price declines may signal unsustainable dividends.',
      },
      {
        id: 'low_payout_ratio',
        label: 'Low Payout Ratio',
        description: 'Screens for companies paying a sustainable fraction of earnings as dividends. A low payout ratio leaves room for dividend growth, reinvestment, and resilience through earnings downturns.',
      },
      {
        id: 'increasing_dividends',
        label: 'Increasing Dividends',
        description: 'Targets companies with a multi-year track record of consistent dividend growth. Dividend growth signals management confidence in future cash flows and a shareholder-friendly capital allocation policy.',
      },
    ],
  },
  {
    section: 'Price & Market Behavior',
    factors: [
      {
        id: 'momentum',
        label: 'Momentum',
        description: 'Targets stocks that have outperformed over the past 6-12 months. Research suggests strong recent performers tend to continue outperforming near term, though momentum can reverse sharply in downturns.',
      },
      {
        id: 'volatility',
        label: 'Volatility',
        description: 'Screens based on beta and historical price volatility. Low volatility targets stable stocks with beta under 1.0. Medium volatility tracks the broader market. High volatility suits aggressive strategies seeking larger potential swings.',
        hasSubOption: true,
        subOptions: ['Low', 'Medium', 'High'],
        multiSub: false,
      },
    ],
  },
];

const COMING_SOON = [
  { id: 'moat',              label: 'Business Moat' },
  { id: 'tam_growth',        label: 'TAM Expansion' },
  { id: 'insider',           label: 'Insider & Institutional Conviction' },
  { id: 'accounting_quality',label: 'Accounting Quality' },
  { id: 'esg',               label: 'ESG Compliance' },
  { id: 'high_risk',         label: 'High Risk Exposure' },
];

function Factors({ onViewStocks, initialFactors = [], initialSubSelections = {} }) {
  const [selected, setSelected] = useState(initialFactors);
  const [subSelections, setSubSelections] = useState(initialSubSelections);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const selectSub = (factorId, option, multiSub, e) => {
    e.stopPropagation();
    if (multiSub) {
      setSubSelections(prev => {
        const current = prev[factorId] || [];
        const updated = current.includes(option)
          ? current.filter(o => o !== option)
          : [...current, option];
        return { ...prev, [factorId]: updated };
      });
    } else {
      setSubSelections(prev => ({ ...prev, [factorId]: option }));
    }
    if (!selected.includes(factorId)) {
      setSelected(prev => [...prev, factorId]);
    }
  };

  const isSubSelected = (factorId, option, multiSub) => {
    const current = subSelections[factorId];
    if (!current) return false;
    if (multiSub) return current.includes(option);
    return current === option;
  };

  const totalSelected = selected.length;

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>Select Factors</h1>
        <p style={styles.subtitle}>
          Select the factors you want your stocks to meet. Combine multiple factors to refine your screen.
        </p>
      </div>

      {SECTIONS.map(section => (
        <div key={section.section} style={styles.sectionBlock}>
          <div style={styles.sectionTitleRow}>
            <h2 style={styles.sectionTitle}>{section.section}</h2>
          </div>
          <div style={styles.factorsGrid}>
            {section.factors.map(factor => {
              const isSelected = selected.includes(factor.id);
              return (
                <div
                  key={factor.id}
                  onClick={() => toggle(factor.id)}
                  style={{
                    ...styles.card,
                    ...(isSelected ? styles.cardSelected : {}),
                  }}
                >
                  <div style={styles.cardTop}>
                    <span style={styles.cardLabel}>{factor.label}</span>
                    <div style={{
                      ...styles.checkbox,
                      ...(isSelected ? styles.checkboxSelected : {}),
                    }}>
                      {isSelected && '✓'}
                    </div>
                  </div>
                  <p style={styles.cardDesc}>{factor.description}</p>

                  {factor.hasSubOption && (
                    <div style={styles.subOptions}>
                      {factor.subOptions.map(opt => (
                        <button
                          key={opt}
                          onClick={(e) => selectSub(factor.id, opt, factor.multiSub, e)}
                          style={{
                            ...styles.subBtn,
                            ...(isSubSelected(factor.id, opt, factor.multiSub) ? styles.subBtnSelected : {}),
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={styles.comingSoonSection}>
        <div style={styles.comingSoonDivider} />
        <p style={styles.comingSoonIntro}>
          The following factors require additional data sources and will be available in a future update.
        </p>
        <div style={styles.comingSoonGrid}>
          {COMING_SOON.map(factor => (
            <div key={factor.id} style={styles.comingSoonCard}>
              <div style={styles.comingSoonTop}>
                <span style={styles.comingSoonLabel}>{factor.label}</span>
                <span style={styles.comingSoonBadge}>Coming Soon</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalSelected > 0 && (
        <div style={styles.footer}>
          <span style={styles.footerText}>
            {totalSelected} factor{totalSelected > 1 ? 's' : ''} selected
          </span>
          <button
            style={styles.button}
            onClick={() => onViewStocks(selected, subSelections, {})}
          >
            View Matching Stocks →
          </button>
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
  pageHeader: {
    marginBottom: '48px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '16px',
    margin: 0,
  },
  sectionBlock: {
    marginBottom: '48px',
  },
  sectionTitleRow: {
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '2px solid #4ade80',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#4ade80',
    margin: 0,
  },
  factorsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  card: {
    background: '#1e293b',
    border: '2px solid #1e293b',
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    minHeight: '200px',
  },
  cardSelected: {
    border: '2px solid #4ade80',
    background: '#0f2a1a',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  cardLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  checkbox: {
    width: '22px',
    height: '22px',
    borderRadius: '6px',
    border: '2px solid #475569',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    color: '#4ade80',
    fontWeight: '700',
    flexShrink: 0,
  },
  checkboxSelected: {
    border: '2px solid #4ade80',
    background: '#0f172a',
  },
  cardDesc: {
    fontSize: '13px',
    color: '#94a3b8',
    lineHeight: '1.6',
    margin: 0,
  },
  subOptions: {
    display: 'flex',
    gap: '8px',
    marginTop: '14px',
    flexWrap: 'wrap',
  },
  subBtn: {
    background: '#0f172a',
    border: '1px solid #334155',
    color: '#94a3b8',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  subBtnSelected: {
    background: '#0f2a1a',
    border: '1px solid #4ade80',
    color: '#4ade80',
  },
  comingSoonSection: {
    marginTop: '16px',
    marginBottom: '48px',
  },
  comingSoonDivider: {
    height: '1px',
    background: '#1e293b',
    marginBottom: '24px',
  },
  comingSoonIntro: {
    fontSize: '13px',
    color: '#475569',
    margin: '0 0 20px 0',
  },
  comingSoonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '12px',
  },
  comingSoonCard: {
    background: '#0a0f1e',
    border: '1px solid #1e293b',
    borderRadius: '10px',
    padding: '16px 20px',
    cursor: 'default',
    opacity: 0.6,
  },
  comingSoonTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  comingSoonLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#475569',
  },
  comingSoonBadge: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#475569',
    background: '#1e293b',
    border: '1px solid #334155',
    padding: '2px 8px',
    borderRadius: '20px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  footer: {
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#1e293b',
    padding: '16px 24px',
    borderRadius: '12px',
    position: 'sticky',
    bottom: '24px',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: '14px',
  },
  button: {
    background: '#4ade80',
    color: '#0a0f1e',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default Factors;
