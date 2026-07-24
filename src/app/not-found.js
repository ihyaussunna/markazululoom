import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        404
      </h2>
      <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        Page Not Found
      </h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '400px' }}>
        The page you are looking for doesn't exist or has been moved. Please check the URL or go back to the homepage.
      </p>
      <Link 
        href="/" 
        style={{
          padding: '0.8rem 1.5rem',
          backgroundColor: 'var(--primary-color)',
          color: '#ffffff',
          borderRadius: '8px',
          fontWeight: '600',
          transition: 'opacity 0.2s'
        }}
      >
        Return Home
      </Link>
    </div>
  );
}
