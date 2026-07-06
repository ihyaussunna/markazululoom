import "./globals.css";
import { prisma } from '@/lib/prisma';
import { fklDhikk, inter } from '@/lib/fonts';

export const metadata = {
  title: "Globeats",
  description: "The ultimate destination for Malayalam blogs, essays, and literature.",
};

export default async function RootLayout({ children }) {
  let titleFont = 'fkl-dhikk';
  let textFont = 'anek-malayalam';

  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    
    if (settingsMap['titleFont']) titleFont = settingsMap['titleFont'];
    if (settingsMap['textFont']) textFont = settingsMap['textFont'];
  } catch (e) {
    console.error("Failed to load site settings", e);
  }

  // Map settings to actual CSS font-family strings
  const getFontFamily = (fontSetting) => {
    switch (fontSetting) {
      case 'fkl-dhikk': return 'var(--font-dhikk), sans-serif';
      case 'inter': return 'var(--font-inter), sans-serif';
      case 'manjari': return "'Manjari', sans-serif";
      case 'anek-malayalam': return "'Anek Malayalam', sans-serif";
      default: return "'Inter', sans-serif";
    }
  };

  const cssVariables = `
    :root {
      --font-title-dynamic: var(--font-dhikk), sans-serif;
      --font-text-dynamic: ${getFontFamily(textFont)};
    }
  `;

  return (
    <html lang="en" className={`${fklDhikk.variable} ${inter.variable}`}>
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
      <body>{children}</body>
    </html>
  );
}
