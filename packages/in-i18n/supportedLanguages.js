/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { pseudoLanguageEnabled } from 'in-services/featureFlags';

export const supportedLanguages = ['en-US', 'de-DE', pseudoLanguageEnabled && 'zz-ZZ'].filter(Boolean);
