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
  deserializeMetrics
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
  initialState: [],
  parser: deserializeTagFilters,
  serializer: serializeTagFilters
};

// ###################################
// analyze view
// ###################################
export const groupedBeaconsMetricsUrlParameter = {
  path: analyzePath,
  name: `groups.${metrics}`,
  as: 'metrics',
  parser: deserializeMetrics,
  serializer: serializeMetrics
};

export const groupedBeaconsOrderByUrlParameter = {
  path: analyzePath,
  name: 'groups.orderBy',
  as: 'orderBy'
};

export const groupedBeaconsOrderDirectionUrlParameter = {
  path: analyzePath,
  name: 'groups.orderDirection',
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
