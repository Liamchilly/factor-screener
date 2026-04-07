import React, { useState } from 'react';

const SECTIONS = [
  {
    section: 'Technical Factors',
    categories: [
      {
        category: 'Valuation & Size',
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
            id: 'quality_growth',
            label: 'Quality Growth',
            description: 'Targets companies with consistent revenue and earnings growth backed by strong fundamentals. Differs from pure growth investing by requiring profitability alongside expansion.',
          },
        ],
      },
      {
        category: 'Profitability & Financial Health',
        factors: [
          {
            id: 'quality',
            label: 'Quality & Profitability',
            description: 'Focuses on companies with high return on equity, strong margins, and low debt. Quality companies tend to be more resilient during downturns and compound returns more reliably over time.',
          },
          {
            id: 'financial_health',
            label: 'Financial Health',
            description: 'Screens on debt-to-equity ratio, current ratio, and cash ratio. Flags companies with manageable leverage and sufficient liquidity to meet short-term obligations without distress.',
          },
          {
            id: 'cash_flow',
            label: 'Cash Flow Health',
            description: 'Evaluates free cash flow generation, the relationship between operating cash flow and net income, and capex intensity. Strong cash flow relative to earnings signals earnings quality and reinvestment capacity.',
          },
        ],
      },
      {
        category: 'Price & Market Behavior',
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
    ],
  },
  {
    section: 'Fundamental Factors',
    categories: [
      {
        category: 'Competitive Position & Market Opportunity',
        factors: [
          {
            id: 'moat',
            label: 'Business Moat',
            description: 'Identifies companies with durable competitive advantages — brand strength, network effects, pricing power, switching costs, or structural barriers to entry. Moats protect margins and market share over time.',
          },
          {
            id: 'tam_growth',
            label: 'TAM Expansion',
            description: 'Focuses on companies operating in large or rapidly expanding total addressable markets. A growing TAM can sustain revenue growth even without market share gains, though TAM estimates are often speculative.',
          },
        ],
      },
      {
        category: 'Management & Corporate Governance',
        factors: [
          {
            id: 'insider',
            label: 'Insider & Institutional Conviction',
            description: 'Flags companies with high insider ownership, recent insider buying activity, or significant institutional accumulation. Insiders buying with their own capital is historically a positive signal of management confidence.',
          },
          {
            id: 'accounting_quality',
            label: 'Accounting Quality',
            description: 'Filters for companies with low accruals and conservative accounting practices. High accruals can signal earnings manipulation — cleaner books have historically outperformed aggressive accounting peers.',
          },
        ],
      },
      {
        category: 'Risk & Sustainability',
        factors: [
          {
            id: 'high_risk',
            label: 'High Risk Exposure',
            description: 'Covers business risk, financial leverage risk, and operational or regulatory risk. Use this to either seek out higher-risk, higher-potential stocks or to screen them out of your results entirely.',
            hasSubOption: true,
            subOptions: ['Seek High Risk', 'Exclude High Risk'],
            multiSub: false,
          },
          {
            id: 'esg',
            label: 'ESG Compliance',
            description: 'Filters for companies meeting environmental, social, and governance standards based on third-party ESG ratings. ESG scores vary significantly across rating providers and should be treated as one input among many.',
          },
        ],
      },
    ],
  },
];

function Strategy() {
  const [selected, setSelected] = useState([]);
  const [subSelections, setSubSelections] = useState({});

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
        <h1 style={styles.title}>Build Your Strategy</h1>
        <p style={styles.subtitle}>
          Select the factors you want your stocks to meet. Combine multiple factors to refine your screen.
        </p>
      </div>

      {SECTIONS.map(section => (
        <div key={section.section} style={styles.sectionBlock}>
          <div style={styles.sectionTitleRow}>
            <h2 style={styles.sectionTitle}>{section.section}</h2>
          </div>

          <div style={styles.body}>
            {section.categories.map(cat => (
              <div key={cat.category} style={styles.row}>
                <div style={styles.leftCol}>
                  <span style={styles.categoryLabel}>{cat.category}</span>
                </div>

                <div style={styles.rightCol}>
                  {cat.factors.map(factor => {
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
          </div>
        </div>
      ))}

      {totalSelected > 0 && (
        <div style={styles.footer}>
          <span style={styles.footerText}>
            {totalSelected} factor{totalSelected > 1 ? 's' : ''} selected
          </span>
          <button style={styles.button}>
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
    marginBottom: '56px',
  },
  sectionTitleRow: {
    marginBottom: '32px',
    paddingBottom: '12px',
    borderBottom: '2px solid #4ade80',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#4ade80',
    margin: 0,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '220px 1fr',
    gap: '24px',
    paddingBottom: '32px',
    marginBottom: '32px',
    borderBottom: '1px solid #1e293b',
  },
  leftCol: {
    paddingTop: '4px',
  },
  categoryLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#4ade80',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    lineHeight: '1.6',
  },
  rightCol: {
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

export default Strategy;