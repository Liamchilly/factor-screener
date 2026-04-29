import React, { useState } from 'react';

const SECTION1 = [
  {
    id: 'build_own',
    name: 'Build Your Own',
    description: 'Start from scratch and select your own factors.',
    factors: [],
    buildYourOwn: true,
  },
  {
    id: 'low_volatility',
    name: 'Low Volatility / Defensive',
    styleLabel: 'Defensive',
    description: 'Minimize drawdowns with stable, low-volatility stocks that hold up during market turbulence.',
    factors: ['volatility', 'stable_earnings', 'high_dividend_yield'],
    weights: { volatility: 3, stable_earnings: 3, high_dividend_yield: 2 },
  },
  {
    id: 'div_income',
    name: 'Dividend Income',
    styleLabel: 'Income',
    description: 'Maximize current income through stocks with high, sustainable dividends.',
    factors: ['high_dividend_yield', 'low_payout_ratio', 'stable_earnings'],
    weights: { high_dividend_yield: 3, low_payout_ratio: 2, stable_earnings: 2 },
  },
  {
    id: 'conservative',
    name: 'Conservative',
    styleLabel: 'Capital Preservation',
    description: 'Capital preservation first. Focus on financial strength and earnings predictability over growth.',
    factors: ['low_debt', 'strong_balance_sheet', 'stable_earnings'],
    weights: { low_debt: 3, strong_balance_sheet: 3, stable_earnings: 2 },
  },
  {
    id: 'value_factor',
    name: 'Value Factor',
    styleLabel: 'Pure Value',
    description: 'Pure quantitative value. Screen for stocks that are cheap across multiple valuation metrics simultaneously.',
    factors: ['low_pb', 'low_pe', 'high_earnings_yield'],
    weights: { low_pb: 3, low_pe: 3, high_earnings_yield: 2 },
  },
  {
    id: 'div_growth',
    name: 'Dividend Growth',
    styleLabel: 'Dividend Growth',
    description: 'Companies that consistently grow their dividends over time, signaling financial strength and shareholder-friendly management.',
    factors: ['increasing_dividends', 'cash_flow'],
    weights: { increasing_dividends: 3, cash_flow: 2 },
  },
  {
    id: 'quality_factor',
    name: 'Quality Factor',
    styleLabel: 'Quality',
    description: 'Own only the highest-quality businesses. Strong returns on capital, durable margins, and consistent earnings define this screen.',
    factors: ['high_roic', 'consistent_margins', 'low_debt', 'earnings_consistency', 'stable_earnings'],
    weights: { high_roic: 3, consistent_margins: 3, low_debt: 2, earnings_consistency: 2, stable_earnings: 2 },
  },
];

const SECTION2 = [
  {
    id: 'buffett',
    name: 'Warren Buffett',
    styleLabel: 'Quality Value',
    description: 'High-quality businesses at fair prices. Focus on durable competitive advantages and consistent profitability.',
    factors: ['high_roic', 'consistent_margins', 'low_debt', 'reasonable_valuation'],
    weights: { high_roic: 3, consistent_margins: 3, low_debt: 2, reasonable_valuation: 2 },
  },
  {
    id: 'lynch',
    name: 'Peter Lynch',
    styleLabel: 'GARP',
    description: 'Growth at a Reasonable Price. Find fast-growing companies before the market catches on.',
    factors: ['high_revenue_growth', 'moderate_pe', 'earnings_consistency'],
    weights: { high_revenue_growth: 3, moderate_pe: 3, earnings_consistency: 2 },
  },
  {
    id: 'graham',
    name: 'Benjamin Graham',
    styleLabel: 'Deep Value',
    description: 'Buy dollars for fifty cents. Focus on balance sheet strength and deeply discounted valuations.',
    factors: ['low_pb', 'low_pe', 'strong_balance_sheet'],
    weights: { low_pb: 3, strong_balance_sheet: 3, low_pe: 2 },
  },
  {
    id: 'greenblatt',
    name: 'Joel Greenblatt',
    styleLabel: 'Magic Formula',
    description: 'Systematically buy good companies at cheap prices using two simple metrics.',
    factors: ['high_earnings_yield', 'high_roic'],
    weights: { high_earnings_yield: 3, high_roic: 3 },
  },
];

const FACTOR_DISPLAY = {
  volatility: 'Volatility',
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

function StrategyCard({ strategy, onClick, theme }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr auto',
        alignItems: 'center',
        gap: '28px',
        background: strategy.buildYourOwn ? theme.accentBg : (hovered ? theme.bgCardHover : theme.bgCard),
        borderLeft: `4px solid ${theme.accent}`,
        borderTop: 'none',
        borderRight: 'none',
        borderBottom: 'none',
        borderRadius: '0 10px 10px 0',
        boxShadow: hovered ? theme.shadowMd : theme.shadow,
        padding: '20px 24px',
        cursor: 'pointer',
        transition: 'background 0.15s ease, box-shadow 0.15s ease',
        position: strategy.buildYourOwn ? 'relative' : undefined,
      }}
      onClick={() => onClick(strategy)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {strategy.buildYourOwn && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '12px',
          background: theme.accentBg,
          border: `1px solid ${theme.accentBorder}`,
          color: theme.accentText,
          fontSize: '10px',
          fontWeight: '600',
          padding: '2px 8px',
          borderRadius: '20px',
          letterSpacing: '0.04em',
        }}>
          ✦ Custom
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: theme.text, margin: 0, lineHeight: '1.3' }}>
          {strategy.name}
        </h3>
        {strategy.styleLabel && (
          <span style={{ fontSize: '11px', color: theme.accent, fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {strategy.styleLabel}
          </span>
        )}
        {strategy.buildYourOwn && (
          <span style={{ fontSize: '11px', color: theme.accent, fontWeight: '500', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Custom · All Factors
          </span>
        )}
        <p style={{ fontSize: '13px', color: theme.textSecondary, lineHeight: '1.6', margin: '4px 0 0 0' }}>
          {strategy.description}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {strategy.factors.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {strategy.factors.map(f => (
              <span key={f} style={{
                background: theme.tagBg,
                border: `1px solid ${theme.accentBorder}`,
                color: theme.accentText,
                fontSize: '11px',
                padding: '3px 10px',
                borderRadius: '20px',
                fontWeight: '600',
              }}>
                {FACTOR_DISPLAY[f] || f}
              </span>
            ))}
          </div>
        ) : (
          <span style={{ fontSize: '13px', color: theme.textMuted, fontStyle: 'italic' }}>
            Select any combination of factors
          </span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', flexShrink: 0 }}>
        <button
          style={{
            background: hovered ? theme.bgTertiary : 'transparent',
            border: `1px solid ${theme.borderStrong}`,
            color: theme.text,
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
            whiteSpace: 'nowrap',
          }}
          tabIndex={-1}
        >
          Select →
        </button>
      </div>
    </div>
  );
}

function Strategy({ onSelectStrategy, theme }) {
  const handleClick = (strategy) => {
    onSelectStrategy(strategy.factors, {}, strategy.weights || {});
  };

  return (
    <div style={{
      padding: '40px 32px',
      maxWidth: '900px',
      margin: '0 auto',
      color: theme.text,
      background: theme.gradientSubtle,
      minHeight: 'calc(100vh - 56px)',
    }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: theme.text, letterSpacing: '-0.02em', margin: '0 0 4px 0' }}>
          Select a Strategy
        </h1>
        <p style={{ fontSize: '14px', color: theme.textSecondary, margin: 0 }}>
          Choose a proven framework or build your own.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {SECTION1.map(strategy => (
          <StrategyCard key={strategy.id} strategy={strategy} onClick={handleClick} theme={theme} />
        ))}
      </div>

      <div style={{
        marginTop: '48px',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: `2px solid ${theme.accentBorder}`,
      }}>
        <h2 style={{ fontSize: '11px', fontWeight: '600', color: theme.accent, letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
          Famous Investor Strategies
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {SECTION2.map(strategy => (
          <StrategyCard key={strategy.id} strategy={strategy} onClick={handleClick} theme={theme} />
        ))}
      </div>
    </div>
  );
}

export default Strategy;
