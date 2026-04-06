import React from 'react';

function Strategy() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Build Your Strategy</h1>
      <p style={styles.subtitle}>Select the factors you want your stocks to meet.</p>
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

export default Strategy;