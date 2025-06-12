/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// Initializing here so that if calls made to pages are not thru router
// then translation will not fail.

const path = require('path');
const fs = require('fs');
const i18next = require('i18next');
const middleware = require('i18next-http-middleware');

const i18nPath = path.join(__dirname, '..', 'i18n');
const namespace = 'in-server';
const translations = {};

fs.readdirSync(i18nPath).forEach(file => {
  if (file.endsWith('.json')) {
    const langCode = path.basename(file, '.json');
    const content = require(path.join(i18nPath, file));

    translations[langCode] = {
      [namespace]: content
    };
  }
});

i18next.use(middleware.LanguageDetector).init({
  fallbackLng: {
    en: ['en-US'],
    de: ['de-DE'],
    es: ['es-ES'],
    fr: ['fr-FR'],
    it: ['it-IT'],
    ja: ['ja-JA'],
    ko: ['ko-KO'],
    pt: ['pt-BR'],
    zh: ['zh-CN'],
    'zh-Hant': ['zh-TW'],
    default: ['en-US']
  },
  preload: Object.keys(translations),
  resources: translations,
  load: 'languageOnly',
  returnNull: false,
  defaultNS: namespace,
  ns: [namespace]
});

module.exports = i18next;
