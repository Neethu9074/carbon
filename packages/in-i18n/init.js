/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

// eslint-disable-next-line no-restricted-imports
import { initReactI18next } from 'react-i18next';
// eslint-disable-next-line no-restricted-imports
import i18n from 'i18next';
import { combineLatest, fromPromise } from '@instana/observables';
import React from 'react';

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { activeLanguage, fallbackLanguage } from 'in-i18n/language';
import { ineum } from 'in-services/tracking/ineum';
import { build } from 'in-services/config';
import http from 'in-services/http';

export function init() {
  const keysAlreadyReportedAsMissing = new Map();
  i18n.on('missingKey', (lngs, namespace, keyWithoutNamespace, i18nKey) => {
    if (!keysAlreadyReportedAsMissing.has(i18nKey)) {
      keysAlreadyReportedAsMissing.set(i18nKey, true);
      reportMissingKeyToInstana(lngs, i18nKey);

      if (__DEV__) {
        reportMissingKeyToDeveloper(i18nKey);
      }
    }
  });

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
        },

        // needs to be true to support the onMissingKey event
        saveMissing: true
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

function reportMissingKeyToInstana(languages, i18nKey) {
  ineum('reportEvent', 'missingI18nKey', {
    meta: {
      languages,
      i18nKey
    }
  });
}

function reportMissingKeyToDeveloper(i18nKey) {
  addMessage({
    type: 'danger',
    title: 'Missing i18n key',
    content: (
      <p>
        Key <code>{i18nKey}</code> was referenced, but could not be found in the active language file.
      </p>
    )
  });
}
