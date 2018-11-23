import { isBlank } from 'in-services/util/string';

// dashboards
export const websiteId = 'websiteId';
export const pageId = 'pageId';
export const errorId = 'errorId';

// analyze
export const tagFilters = 'tagFilters';
export const group = 'group';

export const serializeGroup = buildSerializer();
export const deserializeGroup = buildParser({ groupbyTag: 'beacon.location.path' });
export const serializeTagFilters = buildSerializer();
export const deserializeTagFilters = buildParser([]);

function buildSerializer() {
  return v => {
    if (!v) {
      return undefined;
    }
    return JSON.stringify(v);
  };
}

function buildParser(fallback) {
  return str => {
    if (isBlank(str)) {
      return fallback;
    }

    try {
      return JSON.parse(str);
    } catch (e) {
      return fallback;
    }
  };
}
