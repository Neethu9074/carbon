/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { pseudoLanguageEnabled } from 'in-services/featureFlags';

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
  pseudoLanguageEnabled && 'zz-ZZ'
].filter(Boolean);
