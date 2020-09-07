import { get } from 'lodash';

import { compareIgnoreCase } from 'in-services/util/string';

export const tagDefinitions = get(window, ['instana', 'tags'], [])
  .filter(t => t.category === 'MOBILE_APP_MONITORING')
  .sort((a, b) => compareIgnoreCase(a.name, b.name));

export const tagKeys = tagDefinitions.map(t => t.name);

export function translateDemocratisationTagFiltersToAnalyzeTagFilters({ mobileAppLabel, tagFilters }) {
  let tagFiltersForAnalyze = tagFilters;
  if (!mobileAppLabel) {
    return tagFiltersForAnalyze;
  }
  // replace mobile app ID filter with something more understandable by users.
  if (tagFiltersForAnalyze.some(f => f.name === 'mobileBeacon.mobileApp.id')) {
    return tagFiltersForAnalyze.map(f =>
      f.name !== 'mobileBeacon.mobileApp.id' ? f : getMobileAppLabelTagFilter(mobileAppLabel)
    );
  }
  // or add the mobile app label tag filter to the end if mobile app ID is filter is not present
  return tagFiltersForAnalyze.concat(getMobileAppLabelTagFilter(mobileAppLabel));
}

function getMobileAppLabelTagFilter(mobileAppLabel) {
  return {
    name: 'mobileBeacon.mobileApp.name',
    operator: 'EQUALS',
    stringValue: mobileAppLabel
  };
}

export const dataSourceTitles = {
  sessionStart: 'Session Start',
  viewChange: 'View Transition',
  httpRequest: 'HTTP Request',
  custom: 'Custom Event'
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
  'mobileBeacon.id',
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
  custom: [...commonGroupingTags, 'mobileBeacon.customEvent.name', 'mobileBeacon.error.message'].sort()
};

const commonFilterTags = [];

export const availableFilterTags = {
  sessionStart: [...availableGroupingTags.sessionStart, ...commonFilterTags].sort(),
  viewChange: [...availableGroupingTags.viewChange, ...commonFilterTags].sort(),
  httpRequest: [...availableGroupingTags.httpRequest, ...commonFilterTags].sort(),
  custom: [...availableGroupingTags.custom, ...commonFilterTags].sort()
};
