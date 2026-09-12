import localFont from 'next/font/local';
import { 
  Inter, 
  Raleway, 
  Ubuntu, 
  Poppins, 
  Montserrat, 
  Outfit, 
  Geo, 
  Amiri, 
  Cairo,
  Tajawal,
  Alexandria,
  IBM_Plex_Sans_Arabic,
  Noto_Kufi_Arabic
} from 'next/font/google';

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

export const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-amiri',
  display: 'swap',
});

export const cairo = Cairo({
  weight: ['400', '600', '700', '800', '900'],
  subsets: ['arabic'],
  variable: '--font-cairo',
  display: 'swap',
});

export const tajawal = Tajawal({
  weight: ['400', '500', '700', '800'],
  subsets: ['arabic'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const alexandria = Alexandria({
  weight: ['400', '600', '700', '800'],
  subsets: ['arabic'],
  variable: '--font-alexandria',
  display: 'swap',
});

export const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
  variable: '--font-ibm-plex',
  display: 'swap',
});

export const notoKufiArabic = Noto_Kufi_Arabic({
  weight: ['400', '500', '600', '700'],
  subsets: ['arabic'],
  variable: '--font-noto-kufi',
  display: 'swap',
});


