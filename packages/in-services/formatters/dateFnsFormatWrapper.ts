/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { de, enUS, es, fr, it, ja, ko, ptBR, zhCN, zhTW } from 'date-fns/locale';
import { format, fromUnixTime, isValid, millisecondsToSeconds } from 'date-fns';

import { activeLanguage } from 'in-i18n/language';

// Locales have to match supported languages in packages/in-i18n/supportedLanguages.ts
const supportedLanguageLocales: Record<string, Locale> = {
  'en-US': enUS,
  'de-DE': de,
  'fr-FR': fr,
  'it-IT': it,
  'ja-JA': ja,
  'ko-KO': ko,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'es-ES': es,
  'pt-BR': ptBR
};

function isValidInput(dateOrTimestamp: Date | number) {
  const date =
    typeof dateOrTimestamp === 'number' ? fromUnixTime(millisecondsToSeconds(dateOrTimestamp)) : dateOrTimestamp;

  return isValid(date);
}

export function formatDateWithActiveLanguage(dateOrTimestamp: Date | number, formatStr: string) {
  if (isValidInput(dateOrTimestamp)) {
    return format(dateOrTimestamp, formatStr, {
      locale: supportedLanguageLocales[activeLanguage]
    });
  }

  return String(dateOrTimestamp);
}
