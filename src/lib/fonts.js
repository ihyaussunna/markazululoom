import localFont from 'next/font/local';
import { Inter, Raleway, Ubuntu, Poppins, Montserrat, Outfit, Geo } from 'next/font/google';

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

export const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
});

export const ubuntu = Ubuntu({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-ubuntu',
  display: 'swap',
});

export const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const geo = Geo({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-geo',
  display: 'swap',
});
