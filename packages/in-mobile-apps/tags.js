/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';

import {
  mobileAppCrashBeaconEnabled,
  mobileAppPerfBeaconEnabled,
  mobileAppDroppedBeaconsEnabled
} from 'in-services/featureFlags';
import { fromTagFiltersArray } from 'in-components/QueryBuilder/transformation/formModel';
import { compareIgnoreCase } from 'in-services/util/string';
import { t } from 'in-i18n';

export const tagDefinitions = get(window, ['instana', 'tags'], [])
  .filter(t => t.category === 'MOBILE_APP_MONITORING')
  .sort((a, b) => compareIgnoreCase(a.name, b.name));

export const tagKeys = tagDefinitions.map(t => t.name);

export function translateDemocratisationTagFiltersToFormModel({ mobileAppLabel, tagFilters, tagCatalog }) {
  let updatedTagFilters = tagFilters;
  if (mobileAppLabel) {
    // replace mobile app ID filter with something more understandable by users.
    if (updatedTagFilters.some(f => f.name === 'mobileBeacon.mobileApp.id')) {
      updatedTagFilters = updatedTagFilters.map(f =>
        f.name !== 'mobileBeacon.mobileApp.id' ? f : getMobileAppLabelTagFilter(mobileAppLabel)
      );
    } else {
      // or add the mobile app label tag filter to the end if mobile app ID is filter is not present
      updatedTagFilters = updatedTagFilters.concat(getMobileAppLabelTagFilter(mobileAppLabel));
    }
  }
  return fromTagFiltersArray(updatedTagFilters, tagCatalog);
}

function getMobileAppLabelTagFilter(mobileAppLabel) {
  return {
    name: 'mobileBeacon.mobileApp.name',
    operator: 'EQUALS',
    value: mobileAppLabel
  };
}

export const dataSourceTitles = {
  ...(mobileAppCrashBeaconEnabled ? { crash: t('in-mobile-apps:tags.crash') } : {}),
  ...(mobileAppPerfBeaconEnabled ? { perf: t('in-mobile-apps:tags.perf') } : {}),
  ...(mobileAppDroppedBeaconsEnabled ? { dropBeacon: t('in-mobile-apps:tags.dropBeacon') } : {}),
  sessionStart: t('in-mobile-apps:tags.sessionStart'),
  viewChange: t('in-mobile-apps:tags.viewChange'),
  httpRequest: t('in-mobile-apps:tags.httpRequest'),
  custom: t('in-mobile-apps:tags.custom')
};

export const dataSourceTypes = {
  sessionStart: 'SESSION_START',
  viewChange: 'VIEW_CHANGE',
  httpRequest: 'HTTP_REQUEST',
  custom: 'CUSTOM',
  crash: 'CRASH',
  perf: 'PERF',
  dropBeacon: 'DROP_BEACON'
};

export const defaultGroupings = {
  sessionStart: {
    groupbyTag: 'mobileBeacon.view.name'
  },
  viewChange: {
    groupbyTag: 'mobileBeacon.view.name'
  },
  httpRequest: {
    groupbyTag: 'mobileBeacon.http.origin'
  },
  custom: {
    groupbyTag: 'mobileBeacon.customEvent.name'
  },
  crash: {
    groupbyTag: 'mobileBeacon.crash.groupLabel'
  },
  perf: {
    groupbyTag: 'mobileBeacon.performanceSubtype'
  },
  dropBeacon: {
    groupbyTag: 'mobileBeacon.view.name'
  }
};

const commonGroupingTags = [
  'mobileBeacon.geo.city',
  'mobileBeacon.geo.continent',
  'mobileBeacon.geo.continentCode',
  'mobileBeacon.geo.country',
  'mobileBeacon.geo.countryCode',
  'mobileBeacon.geo.subdivision',
  'mobileBeacon.geo.subdivisionCode',
  'mobileBeacon.meta',
  'mobileBeacon.view.name',
  'mobileBeacon.user.email',
  'mobileBeacon.user.id',
  'mobileBeacon.user.ip',
  'mobileBeacon.user.language',
  'mobileBeacon.user.name',
  'mobileBeacon.mobileApp.name',
  'mobileBeacon.viewPort.height',
  'mobileBeacon.viewPort.width',
  'mobileBeacon.effectiveConnectionType',
  'mobileBeacon.connectionType',
  'mobileBeacon.carrier',
  'mobileBeacon.app.build',
  'mobileBeacon.app.version',
  'mobileBeacon.os.name',
  'mobileBeacon.os.version',
  'mobileBeacon.device.name',
  'mobileBeacon.platform'
];

export const availableGroupingTags = {
  sessionStart: [...commonGroupingTags].sort(),
  viewChange: [...commonGroupingTags].sort(),
  httpRequest: [
    ...commonGroupingTags,
    'mobileBeacon.http.url',
    'mobileBeacon.http.origin',
    'mobileBeacon.http.method',
    'mobileBeacon.http.path',
    'mobileBeacon.http.status'
  ].sort(),
  custom: [...commonGroupingTags, 'mobileBeacon.customEvent.name', 'mobileBeacon.error.message'].sort(),
  crash: [
    ...commonGroupingTags,
    'mobileBeacon.error.message',
    'mobileBeacon.error.type',
    'mobileBeacon.stackTrace',
    'mobileBeacon.crash.groupLabel'
  ].sort(),
  perf: [...commonGroupingTags, 'mobileBeacon.performanceSubtype'],
  dropBeacon: [...commonGroupingTags, 'mobileBeacon.dropView'].sort()
};

const commonFilterTags = ['mobileBeacon.id', 'mobileBeacon.sessionId'];

export const availableFilterTags = {
  sessionStart: [...availableGroupingTags.sessionStart, ...commonFilterTags].sort(),
  viewChange: [...availableGroupingTags.viewChange, ...commonFilterTags].sort(),
  httpRequest: [...availableGroupingTags.httpRequest, 'mobileBeacon.backend.traceId', ...commonFilterTags].sort(),
  custom: [...availableGroupingTags.custom, ...commonFilterTags].sort(),
  crash: [...availableGroupingTags.crash, 'mobileBeacon.error.id', ...commonFilterTags].sort(),
  perf: [...availableGroupingTags.perf, ...commonFilterTags].sort(),
  dropBeacon: [...availableGroupingTags.dropBeacon, ...commonFilterTags].sort()
};

export const HTTP_REQUEST = 'httpRequest';
export const VIEW_CHANGE = 'viewChange';
export const CUSTOM = 'custom';
