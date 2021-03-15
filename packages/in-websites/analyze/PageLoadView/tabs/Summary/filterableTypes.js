/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';
export const types = {
  xhr: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeXHRShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeXHRBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeXHRLong'),
    color: '#8900b3'
  },
  javascript: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeJavascriptShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeJavascriptBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeJavascriptLong'),
    color: '#d3bd12' // inspired by the JS logo color
  },
  css: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeCSSShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeCSSBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeCSSLong'),
    color: '#2277FF' // based on the CSS logo color
  },
  img: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeImgShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeImgBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeImgLong'),
    color: '#00b37a'
  },
  font: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeFontShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeFontBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeFontLong'),
    color: '#ce1293'
  },
  document: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeDocumentShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeDocumentBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeDocumentLong'),
    color: '#F16528' // based on the HTML logo color
  },
  pageChange: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypePageChangeShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypePageChangeBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypePageChangeLong'),
    color: '#91c200'
  },
  error: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeErrorShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeErrorBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeErrorLong'),
    color: 'darkred'
  },
  custom: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeCustomShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeCustomBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeCustomLong'),
    color: '#009e89'
  },
  other: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeOtherShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeOtherBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeOtherLong'),
    color: 'darkgray'
  }
};

export function getType(beacon) {
  if (types[beacon.resourceType]) {
    return beacon.resourceType;
  } else if (beacon.type === 'error') {
    return 'error';
  } else if (beacon.type === 'custom') {
    return 'custom';
  } else if (beacon.type === 'pageChange') {
    return 'pageChange';
  }

  return 'other';
}

export function getResourceTypes() {
  return (
    Object.keys(types)
      // Errors and XHR don't make sense as resource types
      .filter(k => k && k !== 'xhr' && k !== 'error' && k !== 'custom' && k !== 'pageChange')
      .sort()
  );
}

export function getResourceTypesComboBoxItems(restrict = null) {
  return getResourceTypes()
    .filter(k => restrict == null || restrict.indexOf(k) !== -1)
    .reduce(
      (agg, k) =>
        agg.concat({
          value: k,
          label: types[k].short
        }),
      []
    );
}
