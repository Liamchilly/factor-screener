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

function Factors({ onViewStocks, initialFactors = [], initialSubSelections = {}, initialWeights = {}, theme }) {
  const [selected, setSelected] = useState(initialFactors);
  const [subSelections, setSubSelections] = useState(initialSubSelections);
  const [weights, setWeights] = useState(initialWeights);

  const toggle = (id) => {
    if (selected.includes(id)) {
      setSelected(prev => prev.filter(f => f !== id));
    } else {
      setSelected(prev => [...prev, id]);
      setWeights(prev => prev[id] !== undefined ? prev : { ...prev, [id]: 2 });
    }
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
      setWeights(prev => prev[factorId] !== undefined ? prev : { ...prev, [factorId]: 2 });
    }
  };

  const setWeight = (factorId, value, e) => {
    e.stopPropagation();
    setWeights(prev => ({ ...prev, [factorId]: value }));
  };

  const isSubSelected = (factorId, option, multiSub) => {
    const current = subSelections[factorId];
    if (!current) return false;
    if (multiSub) return current.includes(option);
    return current === option;
  };

  const totalSelected = selected.length;
  const highCount = selected.filter(id => weights[id] === 3).length;
  const medCount = selected.filter(id => weights[id] === 2 || weights[id] === undefined).length;
  const lowCount = selected.filter(id => weights[id] === 1).length;

  return (
    <div style={{
      padding: '40px 32px',
      color: theme.text,
      maxWidth: '1200px',
      margin: '0 auto',
      background: theme.gradientSubtle,
      minHeight: 'calc(100vh - 56px)',
    }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: theme.text, letterSpacing: '-0.02em', margin: '0 0 4px 0' }}>
          Select Factors
        </h1>
        <p style={{ fontSize: '14px', color: theme.textSecondary, margin: 0 }}>
          Select the factors you want your stocks to meet. Combine multiple factors to refine your screen.
        </p>
      </div>

      {SECTIONS.map(section => (
        <div key={section.section} style={{ marginBottom: '48px' }}>
          <div style={{
            marginBottom: '20px',
            paddingBottom: '10px',
            borderBottom: `2px solid ${theme.accentBorder}`,
          }}>
            <h2 style={{ fontSize: '11px', fontWeight: '600', color: theme.accent, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
              {section.section}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {section.factors.map(factor => {
              const isSelected = selected.includes(factor.id);
              const currentWeight = weights[factor.id] !== undefined ? weights[factor.id] : 2;
              return (
                <div
                  key={factor.id}
                  onClick={() => toggle(factor.id)}
                  style={{
                    background: isSelected ? theme.accentBg : theme.bgCard,
                    border: isSelected ? `1px solid ${theme.accent}` : `1px solid ${theme.border}`,
                    borderRadius: '10px',
                    padding: '18px',
                    cursor: 'pointer',
                    boxShadow: isSelected ? theme.shadowMd : theme.shadow,
                    transition: 'all 0.15s ease',
                    minHeight: '180px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: theme.text }}>{factor.label}</span>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      border: isSelected ? `2px solid ${theme.accent}` : `2px solid ${theme.borderStrong}`,
                      background: isSelected ? theme.accentBg : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      color: theme.accent,
                      fontWeight: '700',
                      flexShrink: 0,
                    }}>
                      {isSelected && '✓'}
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: theme.textSecondary, lineHeight: '1.6', margin: 0 }}>
                    {factor.description}
                  </p>

                  {factor.hasSubOption && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                      {factor.subOptions.map(opt => {
                        const active = isSubSelected(factor.id, opt, factor.multiSub);
                        return (
                          <button
                            key={opt}
                            onClick={(e) => selectSub(factor.id, opt, factor.multiSub, e)}
                            style={{
                              background: active ? theme.accentBg : theme.bgTertiary,
                              border: active ? `1px solid ${theme.accent}` : `1px solid ${theme.border}`,
                              color: active ? theme.accentText : theme.textMuted,
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div style={{
                    maxHeight: isSelected ? '80px' : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.25s ease',
                  }}>
                    <div style={{ paddingTop: '4px' }}>
                      <div style={{ height: '1px', background: theme.border, marginTop: '8px', marginBottom: '8px' }} />
                      <span style={{ fontSize: '10px', color: theme.textMuted, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                        IMPORTANCE
                      </span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[{ label: 'Low', value: 1 }, { label: 'Med', value: 2 }, { label: 'High', value: 3 }].map(({ label, value }) => {
                          const isActive = currentWeight === value;
                          let pillStyle;
                          if (isActive) {
                            if (value === 1) pillStyle = { background: '#1a1a0f', border: '1px solid #facc15', color: '#facc15' };
                            else if (value === 2) pillStyle = { background: theme.accentBg, border: `1px solid ${theme.accent}`, color: theme.accentText };
                            else pillStyle = { background: '#2a0f0f', border: '1px solid #f87171', color: '#f87171' };
                          } else {
                            pillStyle = { background: theme.bgTertiary, border: `1px solid ${theme.border}`, color: theme.textMuted };
                          }
                          return (
                            <button
                              key={value}
                              onClick={(e) => setWeight(factor.id, value, e)}
                              style={{ ...pillStyle, padding: '4px 14px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer' }}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ marginTop: '16px', marginBottom: '48px' }}>
        <div style={{ height: '1px', background: theme.border, marginBottom: '24px' }} />
        <p style={{ fontSize: '13px', color: theme.textMuted, margin: '0 0 20px 0' }}>
          The following factors require additional data sources and will be available in a future update.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
          {COMING_SOON.map(factor => (
            <div key={factor.id} style={{
              background: theme.bgTertiary,
              border: `1px solid ${theme.border}`,
              borderRadius: '10px',
              padding: '16px 20px',
              cursor: 'default',
              opacity: 0.5,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textMuted }}>{factor.label}</span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: theme.textMuted,
                  background: theme.bgTertiary,
                  border: `1px solid ${theme.border}`,
                  padding: '2px 8px',
                  borderRadius: '20px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>
                  Coming Soon
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalSelected > 0 && (
        <div style={{
          marginTop: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: theme.bgCard,
          border: `1px solid ${theme.border}`,
          boxShadow: `0 -4px 12px rgba(0,0,0,${theme.bg === '#f8f9fb' ? '0.06' : '0.3'})`,
          padding: '16px 24px',
          borderRadius: '12px',
          position: 'sticky',
          bottom: '24px',
        }}>
          <span style={{ color: theme.textSecondary, fontSize: '14px' }}>
            {totalSelected} factor{totalSelected > 1 ? 's' : ''} selected · {highCount} High · {medCount} Med · {lowCount} Low
          </span>
          <button
            style={{
              background: theme.accent,
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            onClick={() => onViewStocks(selected, subSelections, weights)}
          >
            View Matching Stocks →
          </button>
        </div>
      )}
    </div>
  );
}

export default Factors;
