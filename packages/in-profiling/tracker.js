import {
  track,
  PROFILES_ANALYZE_FILTER_ADD,
  PROFILES_ANALYZE_FILTER_CHANGE,
  PROFILES_ANALYZE_FILTER_CLEAR,
  PROFILES_ANALYZE_FILTER_REMOVE,
  PROFILES_ANALYZE_FILTER_SET,
  PROFILES_ANALYZE_GROUP_REMOVE,
  PROFILES_ANALYZE_GROUP_SET
} from 'in-services/tracking/tracking';

// analyze
export const analyzeTagFilters = {
  add: e => track(PROFILES_ANALYZE_FILTER_ADD, e),
  change: e => track(PROFILES_ANALYZE_FILTER_CHANGE, e),
  remove: e => track(PROFILES_ANALYZE_FILTER_REMOVE, e),
  clear: e => track(PROFILES_ANALYZE_FILTER_CLEAR, e),
  set: e => track(PROFILES_ANALYZE_FILTER_SET, e)
};
export const analyzeGrouping = {
  remove: e => track(PROFILES_ANALYZE_GROUP_REMOVE, e),
  set: e => track(PROFILES_ANALYZE_GROUP_SET, e)
};
