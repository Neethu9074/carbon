/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

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

import { setOptions } from '@instana/i18n';

import { activeLanguage, fallbackLanguage } from 'in-i18n/language';
import { getSingle } from 'in-services/settings/settings';

// Set locale globally so that moment.js formats dates correctly.
moment.locale(activeLanguage);

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
