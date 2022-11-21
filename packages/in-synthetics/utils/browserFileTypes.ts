/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

// image
// font
// text
// application
// audio
// x-unknown

export const types = {
  html: {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.html'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.document'),
    color: '#8900b3'
  },
  javascript: {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.javascript'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.script'),
    color: '#d3bd12' // inspired by the JS logo color
  },
  css: {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.css'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.stylesheet'),
    color: '#2277FF' // based on the CSS logo color
  },
  plain: {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.plain'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.document'),
    color: '#F16528' // based on the HTML logo color
  },
  png: {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.image'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.image'),
    color: '#00b37a'
  },
  jpeg: {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.image'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.image'),
    color: '#00b37a'
  },
  'svg+xml': {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.image'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.image'),
    color: '#00b37a'
  },
  'x-icon': {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.image'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.image'),
    color: '#00b37a'
  },
  gif: {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.image'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.image'),
    color: '#00b37a'
  },
  woff2: {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.font'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.font'),
    color: '#ce1293'
  },
  'x-javascript': {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.application'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.application'),
    color: '#009e89'
  },
  json: {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.application'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.application'),
    color: '#009e89'
  },
  'x-unknown': {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.unknown'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.unknown'),
    color: 'darkred'
  },
  mpeg: {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.audio'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.audio'),
    color: 'darkblue'
  },
  other: {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.other'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.other'),
    color: 'darkgray'
  }
};

export function getType(type: string) {
  //@ts-expect-error
  if (types[type]) {
    return type;
  }
  return 'other';
}
