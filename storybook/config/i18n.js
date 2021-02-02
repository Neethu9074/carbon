/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

// eslint-disable-next-line no-restricted-imports
import { initReactI18next } from 'react-i18next';
// eslint-disable-next-line no-restricted-imports
import i18n from 'i18next';

i18n.use(initReactI18next).init({
  lng: 'en-US',

  defaultNS: 'common',

  react: {
    // Do not support language changes without reloading. This is unnecessary
    // complexity we can save ourselves.
    bindI18n: '',
    useSuspense: false,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p', 'code']
  },

  interpolation: {
    // React already escapes values
    escapeValue: false
  }
});
