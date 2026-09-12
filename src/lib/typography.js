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
      fontFamily: "var(--font-arabic), 'Amiri', 'Noto Naskh Arabic', serif",
      direction: 'rtl',
      textAlign: options.align || (options.center ? 'center' : 'right'),
      lineHeight: options.lineHeight || 1.8,
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
