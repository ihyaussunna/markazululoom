import localFont from 'next/font/local';
import { Outfit } from 'next/font/google';

export const fklDhikk = localFont({
  src: '../../public/fonts/FKL-Dhikk-Bold.ttf',
  variable: '--font-dhikk',
  display: 'swap',
});

export const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});
