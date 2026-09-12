import "./globals.css";
import { prisma } from '@/lib/prisma';
import { 
  fklDhikk, 
  inter, 
  raleway, 
  ubuntu, 
  poppins, 
  montserrat, 
  outfit, 
  geo, 
  amiri, 
  cairo,
  tajawal,
  alexandria,
  ibmPlexSansArabic,
  notoKufiArabic
} from '@/lib/fonts';
import AuthProvider from '@/components/AuthProvider';

export const metadata = {
  title: "Globeats",
  description: "The ultimate destination for Malayalam & Arabic blogs, essays, literature, and culture.",
};

export default async function RootLayout({ children }) {
  let titleFont = 'fkl-dhikk';
  let textFont = 'anek-malayalam';
  let uiFont = 'inter';
  let arabicFont = 'tajawal';

  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    
    if (settingsMap['titleFont']) titleFont = settingsMap['titleFont'];
    if (settingsMap['textFont']) textFont = settingsMap['textFont'];
    if (settingsMap['uiFont']) uiFont = settingsMap['uiFont'];
    if (settingsMap['arabicFont']) arabicFont = settingsMap['arabicFont'];
  } catch (e) {
    console.error("Failed to load site settings", e);
  }

  // Map settings to actual CSS font-family strings
  const getFontFamily = (fontSetting) => {
    switch (fontSetting) {
      case 'fkl-dhikk': return "var(--font-dhikk), 'FKL-Dhikk', 'FKL-Dhikk-Bold', 'Anek Malayalam', sans-serif";
      case 'inter': return 'var(--font-inter), sans-serif';
      case 'outfit': return 'var(--font-outfit), sans-serif';
      case 'raleway': return 'var(--font-raleway), sans-serif';
      case 'ubuntu': return 'var(--font-ubuntu), sans-serif';
      case 'poppins': return 'var(--font-poppins), sans-serif';
      case 'montserrat': return 'var(--font-montserrat), sans-serif';
      case 'manjari': return "'Manjari', sans-serif";
      case 'anek-malayalam': return "'Anek Malayalam', sans-serif";
      case 'tajawal': return "var(--font-tajawal), 'Tajawal', sans-serif";
      case 'ibm-plex': return "var(--font-ibm-plex), 'IBM Plex Sans Arabic', sans-serif";
      case 'cairo': return "var(--font-cairo), 'Cairo', sans-serif";
      case 'alexandria': return "var(--font-alexandria), 'Alexandria', sans-serif";
      case 'noto-kufi': return "var(--font-noto-kufi), 'Noto Kufi Arabic', sans-serif";
      case 'amiri': return "var(--font-amiri), 'Amiri', serif";
      default: return "'Inter', sans-serif";
    }
  };

  const getArabicFonts = (setting) => {
    switch (setting) {
      case 'ibm-plex':
        return {
          heading: "var(--font-ibm-plex), 'IBM Plex Sans Arabic', var(--font-cairo), 'Cairo', sans-serif",
          body: "var(--font-ibm-plex), 'IBM Plex Sans Arabic', sans-serif",
        };
      case 'cairo':
        return {
          heading: "var(--font-cairo), 'Cairo', sans-serif",
          body: "var(--font-cairo), 'Cairo', var(--font-tajawal), 'Tajawal', sans-serif",
        };
      case 'alexandria':
        return {
          heading: "var(--font-alexandria), 'Alexandria', var(--font-cairo), 'Cairo', sans-serif",
          body: "var(--font-alexandria), 'Alexandria', var(--font-tajawal), 'Tajawal', sans-serif",
        };
      case 'noto-kufi':
        return {
          heading: "var(--font-noto-kufi), 'Noto Kufi Arabic', sans-serif",
          body: "var(--font-noto-kufi), 'Noto Kufi Arabic', var(--font-tajawal), 'Tajawal', sans-serif",
        };
      case 'amiri':
        return {
          heading: "var(--font-cairo), 'Cairo', var(--font-amiri), 'Amiri', serif",
          body: "var(--font-amiri), 'Amiri', 'Noto Naskh Arabic', serif",
        };
      case 'tajawal':
      default:
        return {
          heading: "var(--font-cairo), 'Cairo', var(--font-alexandria), 'Alexandria', var(--font-tajawal), 'Tajawal', sans-serif",
          body: "var(--font-tajawal), 'Tajawal', var(--font-ibm-plex), 'IBM Plex Sans Arabic', var(--font-cairo), 'Cairo', sans-serif",
        };
    }
  };

  const arabicStyles = getArabicFonts(arabicFont);

  const cssVariables = `
    :root {
      --font-title-dynamic: ${getFontFamily(titleFont)};
      --font-text-dynamic: ${getFontFamily(textFont)};
      --font-ui-dynamic: ${getFontFamily(uiFont)};
      --font-arabic-heading: ${arabicStyles.heading};
      --font-arabic: ${arabicStyles.body};
    }
  `;

  return (
    <html lang="en" className={`${fklDhikk.variable} ${inter.variable} ${raleway.variable} ${ubuntu.variable} ${poppins.variable} ${montserrat.variable} ${outfit.variable} ${geo.variable} ${amiri.variable} ${cairo.variable} ${tajawal.variable} ${alexandria.variable} ${ibmPlexSansArabic.variable} ${notoKufiArabic.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: cssVariables }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  var theme = savedTheme || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
