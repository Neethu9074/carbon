/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  mobileAppId,
  viewId,
  tagFilters,
  serializeTagFilters,
  deserializeTagFilters,
  sessionId,
  beaconId,
  beaconTimestamp,
  metrics,
  serializeMetrics,
  deserializeMetrics,
  group,
  serializeGroup,
  deserializeGroup,
  beaconType
} from 'in-mobile-apps/navigation/matrix';
import { mobileAppPath, sessionViewPath, analyzePath } from 'in-mobile-apps/navigation/paths';

// ###################################
// democratisation dashboard
// ###################################
export const mobileAppIdUrlParameter = {
  path: mobileAppPath,
  name: mobileAppId
};

export const viewIdUrlParameter = {
  path: mobileAppPath,
  name: viewId
};

export const tagFiltersInDashboardUrlParameter = {
  path: mobileAppPath,
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
  initialState: 'sessionStart'
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
// session view
// ###################################
export const sessionIdUrlParameter = {
  path: sessionViewPath,
  name: sessionId,
  as: 'sessionId'
};

export const beaconIdUrlParameter = {
  path: sessionViewPath,
  name: beaconId,
  as: 'beaconId'
};

export const beaconTimestampUrlParameter = {
  path: sessionViewPath,
  name: beaconTimestamp,
  as: 'beaconTimestamp'
};
