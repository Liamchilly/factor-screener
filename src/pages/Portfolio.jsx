import React from 'react';

function Portfolio() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Portfolio</h1>
      <p style={styles.subtitle}>Stocks you've saved will appear here with allocation controls.</p>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 32px',
    color: '#f1f5f9',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '16px',
  },
};

export default Portfolio;