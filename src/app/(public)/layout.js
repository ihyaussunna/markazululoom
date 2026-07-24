import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PublicLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', maxWidth: '100vw' }}>
      <Navbar />
      <main style={{ flexGrow: 1, minHeight: 'calc(100vh - 80px - 200px)', overflowX: 'hidden', width: '100%' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
