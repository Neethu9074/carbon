/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import { combineLatest, fromPromise } from '@instana/observables';
// eslint-disable-next-line no-restricted-imports
import { initReactI18next } from 'react-i18next';
// eslint-disable-next-line no-restricted-imports
import i18n from 'i18next';

import { build } from 'in-services/config';
import http from 'in-services/http';

const fallbackLanguage = 'en-US';

export function init() {
  // TODO get from somewhere / store somewhere
  const activeLanguage = 'en-US';

  return getLanguageBundles(activeLanguage).flatMap(languageBundles =>
    fromPromise(
      i18n.use(initReactI18next).init({
        resources: languageBundles,

        lng: activeLanguage,

        defaultNS: 'common',
        fallbackLng: fallbackLanguage,

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
      })
    )
  );
}

function getLanguageBundles(activeLanguage) {
  const observables = [getLanguageBundle(activeLanguage)];

  if (activeLanguage !== fallbackLanguage) {
    observables.push(getLanguageBundle(fallbackLanguage));
  }

  return combineLatest(observables).map(languageBundles =>
    languageBundles.reduce((agg, [language, translations]) => {
      agg[language] = translations;
      return agg;
    }, {})
  );
}

function getLanguageBundle(language) {
  return http({
    method: 'GET',
    // Use the build revision for cache-busting purposes
    url: `/i18n/${language}.json?revision=${build.revision}`,
    maxRetries: 3
  }).map(({ body }) => [language, body]);
}
