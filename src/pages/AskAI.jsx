import React from 'react';

const STARTER_QUESTIONS = [
  'What is an ETF and should I invest in one?',
  'How do I start investing with $500?',
  'What is the difference between a stock and a bond?',
  'How do I read a stock chart?',
  'What is dollar cost averaging?',
];

function AskAI({ theme }) {
  const t = theme || {};

  const openClaude = (question) => {
    const url = question
      ? `https://claude.ai/new?q=${encodeURIComponent(question)}`
      : 'https://claude.ai';
    window.open(url, '_blank');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(() => {});
    openClaude(text);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 56px)',
      padding: '40px 24px',
      background: t.gradientSubtle,
    }}>
      <div style={{
        background: t.bgCard,
        border: `1px solid ${t.border}`,
        borderRadius: '16px',
        boxShadow: t.shadowMd,
        padding: '48px 56px',
        maxWidth: '540px',
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '28px',
          fontWeight: '700',
          color: t.accent,
          letterSpacing: '-0.02em',
          marginBottom: '8px',
        }}>
          Bullet Investing
        </div>

        <p style={{
          fontSize: '15px',
          color: t.textSecondary,
          lineHeight: '1.7',
          margin: '0 0 36px 0',
        }}>
          Have a question about investing? Ask our AI assistant.
        </p>

        <button
          onClick={() => openClaude()}
          style={{
            background: t.accent,
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '14px 32px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            letterSpacing: '-0.01em',
          }}
        >
          Ask Claude →
        </button>

        <p style={{
          fontSize: '12px',
          color: t.textMuted,
          margin: '12px 0 36px 0',
        }}>
          Powered by Claude AI · Opens in a new tab
        </p>

        <div style={{
          borderTop: `1px solid ${t.border}`,
          paddingTop: '28px',
        }}>
          <p style={{ fontSize: '12px', color: t.textMuted, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' }}>
            Suggested questions
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {STARTER_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => copyToClipboard(q)}
                style={{
                  background: t.bgTertiary,
                  border: `1px solid ${t.border}`,
                  color: t.textSecondary,
                  borderRadius: '8px',
                  padding: '10px 16px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  lineHeight: '1.4',
                  transition: 'background 0.1s ease',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AskAI;
