'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const FlipbookViewer = dynamic(() => import('./FlipbookViewer'), { 
  ssr: false,
  loading: () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', backgroundColor: 'var(--bg-color)' }}>
      <div style={{ padding: '2rem', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
        Loading Magazine Viewer...
      </div>
    </div>
  )
});

export default function FlipbookWrapper(props) {
  return <FlipbookViewer {...props} />;
}
