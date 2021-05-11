/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

// eslint-disable-next-line no-restricted-imports
import { initReactI18next } from 'react-i18next';
// eslint-disable-next-line no-restricted-imports
import i18n from 'i18next';
import 'moment/locale/pt-br';
import 'moment/locale/zh-cn';
import 'moment/locale/zh-tw';
import moment from 'moment';
import 'moment/locale/de';
import 'moment/locale/fr';
import 'moment/locale/it';
import 'moment/locale/es';
import 'moment/locale/ja';
import 'moment/locale/ko';
import React from 'react';

import { combineLatest, fromPromise } from '@instana/observables';

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { activeLanguage, fallbackLanguage } from 'in-i18n/language';
import { ineum } from 'in-services/tracking/ineum';
import { build } from 'in-services/config';
import Code from 'in-components/Code';
import http from 'in-services/http';

export function init() {
  // Set locale globally so that moment.js formats dates correctly.
  moment.locale(activeLanguage);

  // Report the locale to Instana for monitoring purposes
  ineum('meta', 'locale', activeLanguage);

  const keysAlreadyReportedAsMissing = new Map();

  // Set a correct based lang HTML attribute. Wrap in a typeof check
  // for unit testing purposes.
  if (typeof document !== 'undefined') {
    document?.documentElement?.setAttribute('lang', activeLanguage);
  }

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
          transKeepBasicHtmlNodesFor: ['br', 'strong', 'em', 'p', 'code']
        },

        interpolation: {
          // React already escapes values
          escapeValue: false
        },

        // needs to be true to support the missingKeyHandler
        saveMissing: true,
        missingKeyHandler(lngs, unused0, unused1, i18nKey, unused2, options) {
          if (!keysAlreadyReportedAsMissing.has(i18nKey)) {
            // Remove keys that are confusing in monitoring data/in the dev mode messages
            options = {
              ...(options || {})
            };
            delete options.ns;
            delete options.defaultValue;
            keysAlreadyReportedAsMissing.set(i18nKey, true);
            reportMissingKeyToInstana(lngs, i18nKey, options);

            if (__DEV__) {
              reportMissingKeyToDeveloper(i18nKey, options);
            }
          }
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
    languageBundles.filter(Boolean).reduce((agg, [language, translations]) => {
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
    maxRetries: 3,
    treat400AsError: language === fallbackLanguage
  }).map(({ status, body }) => {
    if (status < 200 || status > 299) {
      return null;
    }
    return [language, body];
  });
}

function reportMissingKeyToInstana(languages, i18nKey, i18nOptions) {
  ineum('reportEvent', 'missingI18nKey', {
    meta: {
      languages,
      i18nKey,
      i18nOptions
    }
  });
}

function reportMissingKeyToDeveloper(i18nKey, i18nOptions) {
  addMessage({
    type: 'danger',
    title: 'Missing i18n key',
    content: (
      <>
        <p>
          Key <code>{i18nKey}</code> was referenced, but could not be found in the active language file.
        </p>

        <Code softWrap showLineNumbers={false} lang="json" code={JSON.stringify(i18nOptions, 0, 2)} />
      </>
    )
  });
}
