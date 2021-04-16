/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { pseudoLanguageEnabled } from 'in-services/featureFlags';

export const supportedLanguages = [
  'en-US',
  // files not yet shipped
  // 'de-DE',
  'fr-FR',
  'it-IT',
  'ja-JA',
  'ko-KO',
  'zh-CN',
  'zh-TW',
  // files not yet shipped
  // 'es-ES',
  pseudoLanguageEnabled && 'zz-ZZ'
].filter(Boolean);
