'use client';

export default function ErrorBoundary({ error, reset }) {
  return (
    <div style={{ padding: '2rem', color: 'red', backgroundColor: '#fee2e2', borderRadius: '8px', margin: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>An error occurred!</h2>
      <p style={{ marginTop: '1rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {error.message || 'Unknown error'}
      </p>
      <p style={{ marginTop: '0.5rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '0.8rem' }}>
        {error.stack || ''}
      </p>
      <button 
        onClick={() => reset()}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: 'red', color: 'white', borderRadius: '4px' }}
      >
        Try again
      </button>
    </div>
  );
}
