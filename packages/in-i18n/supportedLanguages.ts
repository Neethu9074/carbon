/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { pseudoLanguageEnabled } from 'in-services/featureFlags';

// Adding a new language? Also make sure that you import the appropriate moment locale file in
// in-i18n/init
export const supportedLanguages = [
  'en-US',
  'de-DE',
  'fr-FR',
  'it-IT',
  'ja-JA',
  'ko-KO',
  'zh-CN',
  'zh-TW',
  'es-ES',
  'pt-BR',
  // The "or else ''" part exists so that TypeScript can correctly
  // infer the type of supportedLanguages.
  pseudoLanguageEnabled ? 'zz-ZZ' : ''
].filter(Boolean);
