import localFont from 'next/font/local';
import { Inter } from 'next/font/google';

export const fklDhikk = localFont({
  src: '../../public/fonts/FKL-Dhikk-Bold.ttf',
  variable: '--font-dhikk',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
