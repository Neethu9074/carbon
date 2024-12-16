/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { setOptions } from '@instana/i18n';

import { activeLanguage, fallbackLanguage } from 'in-i18n/language';
import { getSingle } from 'in-services/settings/settings';

// Set locale in @instana/i18n to configure the formatting utilities
setOptions({
  fallbackLocale: fallbackLanguage,
  textLocale: activeLanguage,
  numberLocale: getSingle('formatNumbersAccordingToEnUs') ? 'en-US' : navigator.language || fallbackLanguage,
  dateLocale: activeLanguage,
  prefersIso8601LikeDateTimeFormat: true,
  timeZone: getSingle('formatTimestampsAsUtc') ? 'UTC' : new Intl.DateTimeFormat().resolvedOptions().timeZone,
  hour12: false
});
