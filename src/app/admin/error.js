'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('Admin route error:', error);
  }, [error]);

  return (
    <div style={{
      maxWidth: '650px',
      margin: '3rem auto',
      padding: '2.5rem',
      backgroundColor: 'var(--surface-color, #1e293b)',
      borderRadius: '12px',
      border: '1px solid var(--border-color, #334155)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
      color: 'var(--text-primary, #f8fafc)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#ef444420',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ef4444',
          fontSize: '1.25rem',
          fontWeight: 'bold'
        }}>
          !
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Admin Page Encountered an Error</h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary, #94a3b8)' }}>
            An unexpected error occurred while loading this admin view.
          </p>
        </div>
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: 'var(--bg-color, #0f172a)',
        borderRadius: '8px',
        border: '1px solid var(--border-color, #334155)',
        fontFamily: 'monospace',
        fontSize: '0.85rem',
        color: '#f87171',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap'
      }}>
        {error?.message || 'Unknown error occurred'}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => reset()}
          style={{
            padding: '0.65rem 1.25rem',
            backgroundColor: 'var(--primary-color, #10b981)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Try Again
        </button>

        <Link
          href="/admin/magazines"
          style={{
            padding: '0.65rem 1.25rem',
            backgroundColor: 'var(--bg-color, #0f172a)',
            color: 'var(--text-primary, #f8fafc)',
            border: '1px solid var(--border-color, #334155)',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          Back to Magazines
        </Link>

        <Link
          href="/admin"
          style={{
            padding: '0.65rem 1.25rem',
            color: 'var(--text-secondary, #94a3b8)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          Admin Dashboard
        </Link>
      </div>
    </div>
  );
}
