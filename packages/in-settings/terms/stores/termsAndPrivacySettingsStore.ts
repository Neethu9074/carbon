/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createStore } from 'in-stores/store';

export interface TermsAndPrivacyStore {
  walkmeAnalyticsServices: boolean | undefined;
}

const termsAndPrivacyStore = createStore<TermsAndPrivacyStore>({
  name: 'termsAndPrivacy',
  initialValue: {
    walkmeAnalyticsServices: window.instana.termsAndPrivacySettings?.walkmeAnalyticsServices ?? false
  }
});

export const termsAndPrivacySettingsStore$ = termsAndPrivacyStore.observable
  // support state manipulate in render methods
  .nextFrame();

export function updateTermsAndPrivacySettings(data: TermsAndPrivacyStore) {
  termsAndPrivacyStore.applyStateMutation(() => data);
  return null;
}

export const isWalkmeScriptLoaded = Array.from(document.scripts).some(script =>
  script.src.includes('https://cdn.walkme.com')
);
