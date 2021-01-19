/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { get } from 'lodash';

import { compareIgnoreCase } from 'in-services/util/string';

export const tagDefinitions = get(window, ['instana', 'tags'], [])
  .filter(t => t.category === 'WEBSITE_MONITORING')
  .sort((a, b) => compareIgnoreCase(a.name, b.name));

export const tagKeys = tagDefinitions.map(t => t.name);

export function translateDemocratisationTagFiltersToAnalyzeTagFilters({ websiteLabel, tagFilters }) {
  let tagFiltersForAnalyze = tagFilters;
  if (!websiteLabel) {
    return tagFiltersForAnalyze;
  }
  // replace website ID filter with something more understandable by users.
  if (tagFiltersForAnalyze.some(f => f.name === 'beacon.website.id')) {
    return tagFiltersForAnalyze.map(f => (f.name !== 'beacon.website.id' ? f : getWebsiteLabelTagFilter(websiteLabel)));
  }
  // or add the website label tag filter to the end if website ID is filter is not present
  return tagFiltersForAnalyze.concat(getWebsiteLabelTagFilter(websiteLabel));
}

function getWebsiteLabelTagFilter(websiteLabel) {
  return {
    name: 'beacon.website.name',
    operator: 'EQUALS',
    stringValue: websiteLabel
  };
}

export const dataSourceTitles = {
  pageLoad: 'Page Load',
  pageChange: 'Page Transition',
  resourceLoad: 'Resource',
  httpRequest: 'HTTP Request',
  error: 'JS Error',
  custom: 'Custom Event'
};

export const defaultGroupings = {
  none: {},
  pageLoad: {
    groupbyTag: 'beacon.location.path'
  },
  pageChange: {
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
  },
  custom: {
    groupbyTag: 'beacon.customEvent.name'
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
  'beacon.sessionId',
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
  'beacon.window.width',
  'beacon.effectiveConnectionType'
];

export const availableGroupingTags = {
  pageLoad: [...commonGroupingTags].sort(),
  pageChange: [...commonGroupingTags].sort(),
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
    'beacon.error.type',
    'beacon.http.method',
    'beacon.http.origin',
    'beacon.http.path',
    'beacon.http.sameOrigin',
    'beacon.http.status',
    'beacon.http.url',
    'beacon.asynchronous',
    'beacon.erroneous',
    'beacon.error.count',
    'beacon.error.message',
    'beacon.graphql.operationName',
    'beacon.graphql.operationType'
  ].sort(),
  error: [
    ...commonGroupingTags,
    'beacon.erroneous',
    'beacon.error.count',
    'beacon.error.message',
    'beacon.error.type',
    'beacon.stackTrace',
    'beacon.componentStack'
  ].sort(),
  custom: [
    ...commonGroupingTags,
    'beacon.customEvent.name',
    'beacon.erroneous',
    'beacon.error.count',
    'beacon.error.message',
    'beacon.error.type',
    'beacon.stackTrace',
    'beacon.componentStack'
  ].sort()
};

const commonFilterTagsWithoutCommonGroupingTags = [
  'beacon.deprecations',
  'beacon.duration',
  'beacon.geo.accuracyRadius',
  'beacon.geo.latitude',
  'beacon.geo.longitude',
  'beacon.pageLoadId',
  'beacon.timestamp',
  'beacon.website.id'
];

export const commonFilterTags = [...commonGroupingTags, ...commonFilterTagsWithoutCommonGroupingTags];

const translatedStackTraceFilterTags = [
  'beacon.stackTrace.parsingStatus',
  // Disabled because they are not properly supported in the backend
  // 'beacon.stackTraceElement.file',
  // 'beacon.stackTraceElement.name',
  // 'beacon.stackTraceElement.line',
  // 'beacon.stackTraceElement.column',
  // 'beacon.stackTraceElement.translationStatus',
  'beacon.stackTrace.readability'
];

const resourceTimings = [
  'beacon.timing.redirect',
  'beacon.timing.app_cache',
  'beacon.timing.dns',
  'beacon.timing.tcp',
  'beacon.timing.ssl',
  'beacon.timing.request',
  'beacon.timing.response',
  'beacon.timing.timeToFirstByte'
];

const cachingTags = ['beacon.http.decodedBodySize', 'beacon.http.encodedBodySize', 'beacon.http.transferSize'];

const backendCorrelationTags = ['beacon.backend.correlationAttempted', 'beacon.backend.traceId'];

export const availableFilterTags = {
  pageLoad: [
    ...availableGroupingTags.pageLoad,
    ...commonFilterTagsWithoutCommonGroupingTags,
    ...resourceTimings,
    ...backendCorrelationTags,
    'beacon.timing.unload',
    'beacon.timing.processing',
    'beacon.timing.onLoad',
    'beacon.timing.dom',
    'beacon.timing.children',
    'beacon.timing.backend',
    'beacon.timing.frontend',
    'beacon.timing.firstPaint',
    'beacon.timing.firstContentfulPaint',
    'beacon.timing.largestContentfulPaint',
    'beacon.timing.firstInputDelay'
  ].sort(),
  pageChange: [...availableGroupingTags.pageChange, ...commonFilterTagsWithoutCommonGroupingTags].sort(),
  resourceLoad: [
    ...availableGroupingTags.resourceLoad,
    ...commonFilterTagsWithoutCommonGroupingTags,
    ...resourceTimings,
    ...cachingTags,
    ...backendCorrelationTags
  ].sort(),
  httpRequest: [
    ...availableGroupingTags.httpRequest,
    ...commonFilterTagsWithoutCommonGroupingTags,
    ...resourceTimings,
    ...cachingTags,
    ...backendCorrelationTags
  ].sort(),
  error: [
    ...availableGroupingTags.error,
    ...commonFilterTagsWithoutCommonGroupingTags,
    'beacon.batchSize',
    'beacon.error.id',
    ...translatedStackTraceFilterTags
  ].sort(),
  custom: [
    ...availableGroupingTags.custom,
    ...commonFilterTagsWithoutCommonGroupingTags,
    'beacon.batchSize',
    ...translatedStackTraceFilterTags
  ].sort()
};
