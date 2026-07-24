'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import styles from './Navbar.module.css';

export default function NavbarClient({ categories }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`${styles.navLinks} ${styles.desktopNav}`}>
        <Link href="/">HOME</Link>
        <Link href="/magazines">MAGAZINES</Link>
        <div className={styles.dropdown}>
          <span className={styles.dropdownToggle}>CATEGORIES ▾</span>
          <div className={styles.dropdownMenu}>
            {categories.map(cat => (
              <Link key={cat.id} href={`/category/${cat.slug}`}>
                {cat.name.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      
      <div className={`${styles.actions} ${styles.desktopNav}`}>
        <ThemeToggle />
      </div>

      {/* Mobile Hamburger Toggle */}
      <button 
        className={styles.menuToggle} 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <div className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Mobile Menu Overlay */}
      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileMenuHeader}>
          <h3>MENU</h3>
          <button className={styles.closeMenuBtn} onClick={() => setMenuOpen(false)}>✕</button>
        </div>
        <div className={styles.mobileMenuLinks}>
          <Link href="/" onClick={() => setMenuOpen(false)}>HOME</Link>
          <Link href="/magazines" onClick={() => setMenuOpen(false)}>MAGAZINES</Link>
          <div className={styles.mobileCategoriesHeading}>CATEGORIES</div>
          {categories.map(cat => (
            <Link key={cat.id} href={`/category/${cat.slug}`} onClick={() => setMenuOpen(false)}>
              {cat.name.toUpperCase()}
            </Link>
          ))}
        </div>
        <div className={styles.mobileMenuFooter}>
          <span>Theme</span>
          <ThemeToggle />
        </div>
      </div>
      
      {/* Overlay backdrop */}
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)}></div>}
    </>
  );
}
