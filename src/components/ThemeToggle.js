'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (!mounted) return <div className={styles.togglePlaceholder} />;

  return (
    <button onClick={toggleTheme} className={styles.toggleBtn} aria-label="Toggle Dark Mode">
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
