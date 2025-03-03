/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

// eslint-disable-next-line no-restricted-imports
import i18n, { Resource, ResourceLanguage, InitOptions } from 'i18next';
// eslint-disable-next-line no-restricted-imports
import { initReactI18next } from 'react-i18next';
import React from 'react';

import { combineLatest, fromPromise } from '@instana/observables';

import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { activeLanguage, fallbackLanguage } from 'in-i18n/language';
import { ineum } from 'in-services/tracking/ineum';
import { build } from 'in-services/config';
import Code from 'in-components/Code';
import http from 'in-services/http';

export function init() {
  // Report the locale to Instana for monitoring purposes
  ineum('meta', 'locale', activeLanguage);

  const keysAlreadyReportedAsMissing = new Map<string, boolean>();

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
          escapeValue: false,
          format: function (value, format) {
            if (format === 'parenthesis') return value ? `(${value})` : null;
            return value;
          }
        },

        // needs to be true to support the missingKeyHandler
        saveMissing: true,
        missingKeyHandler(
          lngs: string[],
          _unused0: any,
          _unused1: any,
          i18nKey: string,
          _unused2: any,
          options: Object
        ) {
          if (!keysAlreadyReportedAsMissing.has(i18nKey)) {
            // Remove keys that are confusing in monitoring data/in the dev mode messages
            options = {
              ...(options || {}),
              ns: undefined,
              defaultValue: undefined
            };
            keysAlreadyReportedAsMissing.set(i18nKey, true);
            reportMissingKeyToInstana(lngs, i18nKey, options);

            if (__DEV__) {
              reportMissingKeyToDeveloper(i18nKey, options);
            }
          }
        }
      } as InitOptions)
    )
  );
}

function getLanguageBundles(activeLanguage: string) {
  const observables = [getLanguageBundle(activeLanguage)];

  if (activeLanguage !== fallbackLanguage) {
    observables.push(getLanguageBundle(fallbackLanguage));
  }

  return combineLatest(observables).map(languageBundles =>
    languageBundles.filter(Boolean).reduce((agg: Resource, languageBundle) => {
      if (languageBundle) {
        agg[languageBundle.language] = languageBundle.body;
      }
      return agg;
    }, {})
  );
}

function getLanguageBundle(language: string) {
  return http<ResourceLanguage>({
    method: 'GET',
    // Use the build revision for cache-busting purposes
    url: `/i18n/${language}.json?revision=${build.revision}`,
    maxRetries: 3,
    treat400AsError: language === fallbackLanguage,
    // We don't need to prefix path with TU information as this route will be
    // handled by ingress directly
    automaticallyApplyTuPath: false
  }).map(({ status, body }) => {
    if (status < 200 || status > 299) {
      return null;
    }
    return { language, body };
  });
}

function reportMissingKeyToInstana(languages: string[], i18nKey: string, i18nOptions: any) {
  ineum('reportEvent', 'missingI18nKey', {
    meta: {
      languages: languages as any,
      i18nKey,
      i18nOptions
    }
  });
}

function reportMissingKeyToDeveloper(i18nKey: string, i18nOptions: Object) {
  addMessage({
    type: 'danger',
    title: 'Missing i18n key',
    content: (
      <>
        <p>
          Key <code>{i18nKey}</code> was referenced, but could not be found in the active language file.
        </p>

        <Code softWrap showLineNumbers={false} lang="json" code={JSON.stringify(i18nOptions, undefined, 2)} />
      </>
    )
  });
}
