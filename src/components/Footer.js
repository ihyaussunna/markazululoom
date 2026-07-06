import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.footerGrid}>
          {/* Brand Column */}
          <div className={styles.footerBrand}>
            <h2>Globeats</h2>
            <p>The ultimate destination for Malayalam blogs, essays, and literature.</p>
          </div>
          
          {/* Quick Links Column */}
          <div className={styles.footerLinks}>
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/admin">Admin Panel</Link></li>
            </ul>
          </div>
          
          {/* Social Media Column */}
          <div className={styles.footerSocial}>
            <h3>Follow Us</h3>
            <div className={styles.socialIcons}>
              <a href="https://www.instagram.com/globeats.in?igsh=ZzRzeXAwdDdwcnpv" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* Add more icons here if needed in the future */}
            </div>
          </div>
        </div>
        
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} Globeats. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
