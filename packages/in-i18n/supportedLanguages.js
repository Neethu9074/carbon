/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { pseudoLanguageEnabled } from 'in-services/featureFlags';

// Adding a new language? Also make sure that you import the appropriate moment locale file in
// in-i18n/init
export const supportedLanguages = ['en-US', 'de-DE', pseudoLanguageEnabled && 'zz-ZZ'].filter(Boolean);
