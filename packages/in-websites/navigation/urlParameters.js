/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import {
  websiteId,
  pageId,
  tagFilters,
  serializeTagFilters,
  deserializeTagFilters,
  pageLoadId,
  beaconId,
  beaconTimestamp,
  metrics,
  serializeMetrics,
  deserializeMetrics,
  group,
  serializeGroup,
  deserializeGroup,
  beaconType
} from 'in-websites/navigation/matrix';
import { websitePath, pageLoadViewPath, analyzePath } from 'in-websites/navigation/paths';

// ###################################
// democratisation dashboard
// ###################################
export const websiteIdUrlParameter = {
  path: websitePath,
  name: websiteId
};

export const pageIdUrlParameter = {
  path: websitePath,
  name: pageId
};

export const tagFiltersInDashboardUrlParameter = {
  path: websitePath,
  name: tagFilters,
  as: tagFilters,
  initialState: [],
  parser: deserializeTagFilters,
  serializer: serializeTagFilters
};

// ###################################
// analyze view
// ###################################
export const analyzeTagFiltersUrlParameter = {
  path: analyzePath,
  name: tagFilters,
  as: 'tagFilters',
  initialState: [],
  parser: deserializeTagFilters,
  serializer: serializeTagFilters
};

export const analyzeGroupingUrlParameter = {
  path: analyzePath,
  name: group,
  as: 'group',
  initialState: {},
  parser: deserializeGroup,
  serializer: serializeGroup
};

export const analyzeBeaconTypeUrlParameter = {
  path: analyzePath,
  name: beaconType,
  as: 'beaconType',
  initialState: 'pageLoad'
};

export const analyzeMetricsUrlParameter = {
  path: analyzePath,
  name: metrics,
  as: 'metrics',
  parser: deserializeMetrics,
  serializer: serializeMetrics
};

export const analyzeOrderByUrlParameter = {
  path: analyzePath,
  name: 'orderBy',
  as: 'orderBy'
};

export const analyzeOrderDirectionUrlParameter = {
  path: analyzePath,
  name: 'orderDirection',
  as: 'orderDirection'
};

// ###################################
// page load view
// ###################################
export const pageLoadIdUrlParameter = {
  path: pageLoadViewPath,
  name: pageLoadId,
  as: 'pageLoadId'
};

export const beaconIdUrlParameter = {
  path: pageLoadViewPath,
  name: beaconId,
  as: 'beaconId'
};

export const beaconTimestampUrlParameter = {
  path: pageLoadViewPath,
  name: beaconTimestamp,
  as: 'beaconTimestamp'
};
