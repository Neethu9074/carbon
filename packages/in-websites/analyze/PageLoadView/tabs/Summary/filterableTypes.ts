/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { WebsiteMonitoringBeacon, WebsiteMonitoringBeaconType, WebsiteMonitoringResourceType } from '@instana/types';

import { carbonAlert, carbonCategorical } from 'in-themes/chartColors';
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
  pillType: string;
};

type TypeConfigs = {
  [key in FilterableType]: TypeConfig;
};

const { purple70, cyan50, teal70, magenta70, red50, green60, blue80, magenta50 } = carbonCategorical;
const { gray60, orange60 } = carbonAlert;

export const types: TypeConfigs = {
  xhr: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeXHRShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeXHRBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeXHRLong'),
    color: cyan50,
    pillType: 'cyan'
  },
  javascript: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeJavascriptShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeJavascriptBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeJavascriptLong'),
    color: teal70,
    pillType: 'teal'
  },
  css: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeCSSShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeCSSBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeCSSLong'),
    color: purple70,
    pillType: 'purple'
  },
  img: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeImgShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeImgBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeImgLong'),
    color: magenta70,
    pillType: 'magenta'
  },
  font: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeFontShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeFontBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeFontLong'),
    color: red50,
    pillType: 'red'
  },
  document: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeDocumentShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeDocumentBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeDocumentLong'),
    color: orange60,
    pillType: 'orange'
  },
  pageChange: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypePageChangeShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypePageChangeBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypePageChangeLong'),
    color: green60,
    pillType: 'green'
  },
  error: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeErrorShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeErrorBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeErrorLong'),
    color: blue80,
    pillType: 'blue'
  },
  custom: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeCustomShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeCustomBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeCustomLong'),
    color: magenta50,
    pillType: 'magenta'
  },
  other: {
    short: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeOtherShort'),
    badgeLabel: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeOtherBadgeLabel'),
    long: t('in-websites:analyze.analyzeView.pageLoadView.filterTypeOtherLong'),
    color: gray60,
    pillType: 'gray'
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
