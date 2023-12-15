/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { WebsiteMonitoringBeacon, WebsiteMonitoringBeaconType, WebsiteMonitoringResourceType } from '@instana/types';

import { chartColors, carbonAlert } from 'in-themes/chartColors';
import { t } from 'in-i18n';

type FilterableType = Exclude<
  WebsiteMonitoringBeaconType | WebsiteMonitoringResourceType,
  'pageLoad' | 'resourceLoad' | 'httpRequest'
>;

type TypeConfig = {
  short: string;
  badgeLabel: string;
  long: string;
  color: string;
};

type TypeConfigs = {
  [key in FilterableType]: TypeConfig;
};

export const types: TypeConfigs = {
  xhr: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeXHRShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeXHRBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeXHRLong'),
    color: chartColors.strokeColors100[0]
  },
  javascript: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeJavascriptShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeJavascriptBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeJavascriptLong'),
    color: chartColors.strokeColors100[1]
  },
  css: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeCSSShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeCSSBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeCSSLong'),
    color: chartColors.strokeColors100[2]
  },
  img: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeImgShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeImgBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeImgLong'),
    color: chartColors.strokeColors100[3]
  },
  font: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeFontShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeFontBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeFontLong'),
    color: chartColors.strokeColors100[4]
  },
  document: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeDocumentShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeDocumentBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeDocumentLong'),
    color: chartColors.strokeColors100[5]
  },
  pageChange: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypePageChangeShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypePageChangeBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypePageChangeLong'),
    color: chartColors.strokeColors100[6]
  },
  error: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeErrorShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeErrorBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeErrorLong'),
    color: chartColors.strokeColors100[7]
  },
  custom: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeCustomShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeCustomBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeCustomLong'),
    color: chartColors.strokeColors100[8]
  },
  other: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeOtherShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeOtherBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeOtherLong'),
    color: carbonAlert.gray60
  }
};

export function getType(beacon: WebsiteMonitoringBeacon): FilterableType {
  if (types[beacon.resourceType as FilterableType]) {
    return beacon.resourceType as FilterableType;
  } else if (beacon.type === 'error') {
    return 'error';
  } else if (beacon.type === 'custom') {
    return 'custom';
  } else if (beacon.type === 'pageChange') {
    return 'pageChange';
  }

  return 'other';
}

export function getResourceTypes(): Array<FilterableType> {
  return (
    (Object.keys(types) as Array<FilterableType>)
      // Errors and XHR don't make sense as resource types
      .filter(k => k && k !== 'xhr' && k !== 'error' && k !== 'custom' && k !== 'pageChange')
      .sort()
  );
}

export function getResourceTypesComboBoxItems(
  restrict: Array<FilterableType> | null = null
): Array<{ value: FilterableType; label: string }> {
  return getResourceTypes()
    .filter(k => restrict == null || restrict.indexOf(k) !== -1)
    .reduce<Array<{ value: FilterableType; label: string }>>(
      (agg, k) =>
        agg.concat({
          value: k,
          label: types[k].short
        }),
      []
    );
}
