import { get } from 'lodash';

import { compareIgnoreCase } from 'in-services/util/string';

export const tagDefinitions = get(window, ['instana', 'tags'], [])
  .filter(t => t.category === 'WEBSITE_MONITORING')
  .sort((a, b) => compareIgnoreCase(a.name, b.name));

export const tagKeys = tagDefinitions.map(t => t.name);

export const defaultGroupings = {
  pageLoad: {
    groupbyTag: 'beacon.page.name'
  },
  resourceLoad: {
    groupbyTag: 'beacon.http.origin'
  },
  httpRequest: {
    groupbyTag: 'beacon.http.origin'
  },
  error: {
    groupbyTag: 'beacon.error.message'
  }
};

const commonGroupingTags = [
  'beacon.browser.name',
  'beacon.browser.version',
  'beacon.geo.city',
  'beacon.geo.continent',
  'beacon.geo.continentCode',
  'beacon.geo.country',
  'beacon.geo.countryCode',
  'beacon.geo.subdivision',
  'beacon.geo.subdivisionCode',
  'beacon.id',
  'beacon.initiator',
  'beacon.location.origin',
  'beacon.location.path',
  'beacon.location.url',
  'beacon.meta',
  'beacon.os.name',
  'beacon.os.version',
  'beacon.page.name',
  'beacon.phase',
  'beacon.user.email',
  'beacon.user.id',
  'beacon.user.ip',
  'beacon.user.language',
  'beacon.user.name',
  'beacon.website.name',
  'beacon.window.height',
  'beacon.window.hidden',
  'beacon.window.width'
];

export const availableGroupingTags = {
  pageLoad: [...commonGroupingTags].sort(),
  resourceLoad: [
    ...commonGroupingTags,
    'beacon.http.origin',
    'beacon.http.path',
    'beacon.http.url',
    'beacon.resourceType',
    'beacon.cacheInteraction'
  ].sort(),
  httpRequest: [
    ...commonGroupingTags,
    'beacon.http.method',
    'beacon.http.origin',
    'beacon.http.path',
    'beacon.http.sameOrigin',
    'beacon.http.status',
    'beacon.http.url',
    'beacon.asynchronous'
  ].sort(),
  error: [
    ...commonGroupingTags,
    'beacon.erroneous',
    'beacon.error.count',
    'beacon.error.message',
    'beacon.error.type',
    'beacon.stackTrace',
    'beacon.componentStack'
  ].sort()
};

[];

const commonFilterTags = [
  'beacon.deprecations',
  'beacon.duration',
  'beacon.geo.accuracyRadius',
  'beacon.geo.latitude',
  'beacon.geo.longitude',
  'beacon.pageLoadId',
  'beacon.timestamp',
  'beacon.website.id'
];

export const availableFilterTags = {
  pageLoad: [
    ...availableGroupingTags.pageLoad,
    ...commonFilterTags,
    'beacon.backend.correlationAttempted',
    'beacon.backend.traceId'
  ].sort(),
  resourceLoad: [
    ...availableGroupingTags.resourceLoad,
    ...commonFilterTags,
    'beacon.http.decodedBodySize',
    'beacon.http.encodedBodySize',
    'beacon.http.transferSize',
    'beacon.timing.app_cache',
    'beacon.timing.backend',
    'beacon.timing.children',
    'beacon.timing.dns',
    'beacon.timing.dom',
    'beacon.timing.firstContentfulPaint',
    'beacon.timing.firstPaint',
    'beacon.timing.frontend',
    'beacon.timing.onLoad',
    'beacon.timing.processing',
    'beacon.timing.redirect',
    'beacon.timing.request',
    'beacon.timing.response',
    'beacon.timing.ssl',
    'beacon.timing.tcp',
    'beacon.timing.unload'
  ].sort(),
  httpRequest: [
    ...availableGroupingTags.httpRequest,
    ...commonFilterTags,
    'beacon.backend.correlationAttempted',
    'beacon.backend.traceId'
  ].sort(),
  error: [...availableGroupingTags.error, ...commonFilterTags, 'beacon.batchSize', 'beacon.error.id'].sort()
};
