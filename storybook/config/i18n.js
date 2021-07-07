/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { setOptions, defaultOptions } from '@instana/i18n';
// eslint-disable-next-line no-restricted-imports
import { initReactI18next } from 'react-i18next';
// eslint-disable-next-line no-restricted-imports
import i18n from 'i18next';

// This bundle will get generated from the regular gulp build process,
// therefore we need to run `gulp prepareTestExecution` in the
// `storybook` script.
// (currently we decided to do no file-watching or integrate sb into gulp)
//
// The i18n language bundle files will get created
// specifically in /ui-client/build/gulp/i18n.js
import languageBundle from '../../target/assets/i18n/en-US.json';

i18n.use(initReactI18next).init({
  resources: { 'en-US': languageBundle },

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

// Read more: https://ui.instana.io/global/internationalization
setOptions({
  ...defaultOptions,
  fallbackLocale: 'en-US',
  textLocale: 'en-US',
  numberLocale: 'en-US',
  prefersIso8601LikeDateTimeFormat: true,
  dateLocale: 'en-US',
  hour12: false
});
