/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export const types = {
  document: {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.document'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.document'),
    color: '#8900b3'
  },
  stylesheet: {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.stylesheet'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.stylesheet'),
    color: '#2277FF' // based on the CSS logo color
  },
  image: {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.image'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.image'),
    color: '#00b37a'
  },
  font: {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.font'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.font'),
    color: '#ce1293'
  },
  script: {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.script'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.script'),
    color: '#d3bd12' // inspired by the JS logo color
  },
  media: {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.media'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.media'),
    color: 'darkblue'
  },
  other: {
    short: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.short.other'),
    long: t('in-synthetics:dashboard.detailsPage.browserDetails.entry.types.long.other'),
    color: 'darkgray'
  }
} as const;

export function getType(type: string) {
  //@ts-expect-error No index signature found
  if (types[type]) {
    return type;
  }
  return 'other';
}

export function getFilterType(type: string) {
  //@ts-expect-error No index signature found
  if (types[type]) {
    //@ts-expect-error No index signature found
    return types[type].long;
  }
  return 'other';
}
