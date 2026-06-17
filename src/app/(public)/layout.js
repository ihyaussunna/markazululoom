import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ flexGrow: 1, minHeight: 'calc(100vh - 80px - 200px)' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
