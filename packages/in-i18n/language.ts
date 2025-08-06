/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

// Direct import of 'in-services/userSettings/globals' instead of
// 'in-services/userSettings' to avoid circular imports.
import { userSettings } from 'in-services/userSettings/globals';
import { solisEnabled } from 'in-services/featureFlags';

export const fallbackLanguage = 'en-US';

export const browserLang = (language: string) => {
  let browserLang = language || fallbackLanguage;
  // Ensure it matches one of our i18n files (de-DE, fr-FR, etc.)
  const supportedLangs = ['en-US', 'de-DE', 'fr-FR', 'es-ES', 'it-IT', 'ja-JA', 'ko-KO', 'pt-BR', 'zh-CN', 'zh-TW'];
  if (!supportedLangs.includes(browserLang)) {
    const short = browserLang.split('-')[0];
    const match = supportedLangs.find(lang => lang.startsWith(short));
    browserLang = match || fallbackLanguage;
  }
  return browserLang;
};

export const activeLanguage = solisEnabled
  ? browserLang(navigator.language)
  : userSettings.preferredLanguage || fallbackLanguage;

export const collationLanguage = userSettings.collationLanguage || activeLanguage;
export const activeLocale = activeLanguage.split('-')[0];
