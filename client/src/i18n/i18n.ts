import { i18n } from '@lingui/core';
import * as plurals from 'make-plural/plurals';
import { detect, fromNavigator } from '@lingui/detect-locale';

// Import JSON translations directly
import da from 'src/i18n/locales/da/translation.json';
import de from 'src/i18n/locales/de/translation.json';
import en from 'src/i18n/locales/en/translation.json';
import es from 'src/i18n/locales/es/translation.json';
import fr from 'src/i18n/locales/fr/translation.json';
import ko from 'src/i18n/locales/ko/translation.json';
import pt from 'src/i18n/locales/pt/translation.json';

export const setupI18n = () => {
  const allMessages = {
    da: da,
    de: de,
    en: en,
    es: es,
    fr: fr,
    ko: ko,
    pt: pt,
  };

  const supportedLanguages = Object.keys(allMessages);

  const detectedLocale = detect(fromNavigator(), 'en').split('-')?.at(0);

  const locale = supportedLanguages.includes(detectedLocale)
    ? detectedLocale
    : 'en';

  i18n.loadLocaleData({
    [locale]: { plurals: plurals[locale] },
  });
  i18n.load(allMessages);
  i18n.activate(locale);
};
