/**
 * Helper utilities for multilingual typography (Arabic, Malayalam, English)
 */

export function isArabic(text) {
  if (!text) return false;
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

export function isMalayalam(text) {
  if (!text) return false;
  return /[\u0D00-\u0D7F]/.test(text);
}

export function getTextStyle(text, categorySlug = '', options = {}) {
  const isArabicText = categorySlug === 'saqafa' || isArabic(text);

  if (isArabicText) {
    return {
      fontFamily: options.isHeading
        ? "var(--font-arabic-heading), 'Cairo', 'Alexandria', 'Tajawal', sans-serif"
        : "var(--font-arabic), 'Tajawal', 'IBM Plex Sans Arabic', 'Cairo', sans-serif",
      direction: 'rtl',
      textAlign: options.align || (options.center ? 'center' : 'right'),
      lineHeight: options.lineHeight || (options.isHeading ? 1.45 : 2.15),
      fontWeight: options.fontWeight || (options.isHeading ? 800 : 500),
      letterSpacing: '0',
    };
  }

  if (isMalayalam(text)) {
    return {
      fontFamily: "'Anek Malayalam', sans-serif",
    };
  }

  return {};
}
