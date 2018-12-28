import { urlFriendly } from 'in-services/util/json';
import { isBlank } from 'in-services/util/string';

// dashboards
export const websiteId = 'websiteId';
export const pageId = 'pageId';
export const errorId = 'errorId';
export const resourceId = 'resourceId';
export const resourceType = 'resourceType';
export const xhrId = 'xhrId';

// analyze
export const tagFilters = 'tagFilters';
export const group = 'group';
export const beaconType = 'beaconType';
export const metrics = 'metrics';

export const serializeGroup = buildSerializer();
export const deserializeGroup = buildParser({ groupbyTag: 'beacon.location.path' });
export const serializeTagFilters = buildSerializer();
export const deserializeTagFilters = buildParser([]);
export const serializeMetrics = buildSerializer();
export const deserializeMetrics = buildParser(null);

// page load view
export const pageLoadId = 'pageLoadId';
export const beaconId = 'beaconId';
export const beaconTimestamp = 'beaconTimestamp';

function buildSerializer() {
  return v => {
    if (!v) {
      return undefined;
    }
    return urlFriendly.stringify(v);
  };
}

function buildParser(fallback) {
  return str => {
    if (isBlank(str)) {
      return fallback;
    }

    try {
      return urlFriendly.parse(str);
    } catch (e) {
      return fallback;
    }
  };
}
