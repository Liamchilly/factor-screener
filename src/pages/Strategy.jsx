import React, { useState } from 'react';

const STRATEGIES = [
  {
    id: 'build_own',
    name: 'Build Your Own',
    description: 'Start from scratch and select your own factors.',
    factors: [],
    buildYourOwn: true,
  },
  {
    id: 'buffett',
    name: 'Warren Buffett',
    styleLabel: 'Quality Value',
    description: 'High-quality businesses at fair prices. Focus on durable competitive advantages and consistent profitability.',
    factors: ['high_roic', 'consistent_margins', 'low_debt', 'reasonable_valuation'],
  },
  {
    id: 'lynch',
    name: 'Peter Lynch',
    styleLabel: 'GARP',
    description: 'Growth at a Reasonable Price. Find fast-growing companies before the market catches on.',
    factors: ['high_revenue_growth', 'moderate_pe', 'earnings_consistency'],
  },
  {
    id: 'graham',
    name: 'Benjamin Graham',
    styleLabel: 'Deep Value',
    description: 'Buy dollars for fifty cents. Focus on balance sheet strength and deeply discounted valuations.',
    factors: ['low_pb', 'low_pe', 'strong_balance_sheet'],
  },
  {
    id: 'greenblatt',
    name: 'Joel Greenblatt',
    styleLabel: 'Magic Formula',
    description: 'Systematically buy good companies at cheap prices using two simple metrics.',
    factors: ['high_earnings_yield', 'high_roic'],
  },
  {
    id: 'div_income',
    name: 'Dividend Income',
    styleLabel: 'Income',
    description: 'Maximize current income through stocks with high, sustainable dividends.',
    factors: ['high_dividend_yield', 'low_payout_ratio', 'stable_earnings'],
  },
  {
    id: 'div_growth',
    name: 'Dividend Growth',
    styleLabel: 'Dividend Growth',
    description: 'Companies that consistently grow their dividends over time, signaling financial strength.',
    factors: ['increasing_dividends', 'cash_flow'],
  },
];

const FACTOR_DISPLAY = {
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
  cash_flow: 'Cash Flow Health',
};

function StrategyCard({ strategy, onClick }) {
  const [hovered, setHovered] = useState(false);

  const cardStyle = strategy.buildYourOwn
    ? {
        ...styles.card,
        ...styles.buildOwnCard,
        ...(hovered ? styles.buildOwnCardHover : {}),
      }
    : {
        ...styles.card,
        ...(hovered ? styles.cardHover : {}),
      };

  return (
    <div
      style={cardStyle}
      onClick={() => onClick(strategy)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.cardLeft}>
        <h3 style={styles.cardName}>{strategy.name}</h3>
        {strategy.styleLabel && (
          <span style={styles.styleLabel}>{strategy.styleLabel}</span>
        )}
        {strategy.buildYourOwn && (
          <span style={styles.buildOwnLabel}>Custom · All Factors</span>
        )}
        <p style={styles.cardDesc}>{strategy.description}</p>
      </div>

      <div style={styles.cardMiddle}>
        {strategy.factors.length > 0 ? (
          <div style={styles.factorList}>
            {strategy.factors.map(f => (
              <span key={f} style={styles.factorPill}>
                {FACTOR_DISPLAY[f] || f}
              </span>
            ))}
          </div>
        ) : (
          <span style={styles.buildOwnHint}>Select any combination of factors</span>
        )}
      </div>

      <div style={styles.cardRight}>
        <button
          style={{ ...styles.selectBtn, ...(hovered ? styles.selectBtnHover : {}) }}
          tabIndex={-1}
        >
          Select →
        </button>
      </div>
    </div>
  );
}

function Strategy({ onSelectStrategy }) {
  const handleClick = (strategy) => {
    onSelectStrategy(strategy.factors, {});
  };

  const prebuilt = STRATEGIES.filter(s => !s.buildYourOwn);
  const buildOwn = STRATEGIES.find(s => s.buildYourOwn);

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>Select a Strategy</h1>
        <p style={styles.subtitle}>
          Choose a proven framework or build your own from scratch.
        </p>
      </div>

      <div style={styles.cardList}>
        {buildOwn && (
          <StrategyCard key={buildOwn.id} strategy={buildOwn} onClick={handleClick} />
        )}

        <div style={styles.divider}>
          <span style={styles.dividerText}>— or choose a proven strategy —</span>
        </div>

        {prebuilt.map(strategy => (
          <StrategyCard key={strategy.id} strategy={strategy} onClick={handleClick} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 32px',
    color: '#f1f5f9',
    maxWidth: '900px',
    margin: '0 auto',
  },
  pageHeader: {
    marginBottom: '40px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '16px',
    margin: 0,
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '12px 0',
    gap: '12px',
  },
  dividerText: {
    color: '#334155',
    fontSize: '12px',
    fontWeight: '500',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    width: '100%',
    textAlign: 'center',
  },
  card: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr auto',
    alignItems: 'center',
    gap: '32px',
    background: '#0a0f1e',
    borderLeft: '4px solid #4ade80',
    borderTop: 'none',
    borderRight: 'none',
    borderBottom: 'none',
    borderRadius: '0 8px 8px 0',
    padding: '24px 32px',
    cursor: 'pointer',
    transition: 'background 0.15s ease, box-shadow 0.15s ease',
  },
  cardHover: {
    background: '#0f172a',
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
  },
  buildOwnCard: {
    background: '#0d1117',
    borderLeft: '4px dashed #4ade80',
  },
  buildOwnCardHover: {
    background: '#0f172a',
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
  },
  cardLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  cardName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#f1f5f9',
    margin: 0,
    lineHeight: '1.3',
  },
  styleLabel: {
    fontSize: '12px',
    color: '#4ade80',
    fontWeight: '500',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  buildOwnLabel: {
    fontSize: '12px',
    color: '#4ade80',
    fontWeight: '500',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  cardDesc: {
    fontSize: '13px',
    color: '#94a3b8',
    lineHeight: '1.6',
    margin: '6px 0 0 0',
  },
  cardMiddle: {
    display: 'flex',
    alignItems: 'center',
  },
  factorList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  factorPill: {
    background: '#0f2a1a',
    border: '1px solid #4ade80',
    color: '#4ade80',
    fontSize: '11px',
    padding: '3px 10px',
    borderRadius: '20px',
    fontWeight: '600',
  },
  buildOwnHint: {
    fontSize: '13px',
    color: '#334155',
    fontStyle: 'italic',
  },
  cardRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexShrink: 0,
  },
  selectBtn: {
    background: 'transparent',
    border: '1px solid #334155',
    color: '#f1f5f9',
    padding: '8px 18px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'border-color 0.15s ease, color 0.15s ease',
    whiteSpace: 'nowrap',
  },
  selectBtnHover: {
    borderColor: '#4ade80',
    color: '#4ade80',
  },
};

export default Strategy;
