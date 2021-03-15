/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  ANALYZE_UA2_FACETED_SEARCH_FILTER_ADDED,
  ANALYZE_UA2_FACETED_SEARCH_GROUP_CHANGED,
  ANALYZE_UA2_METRIC_ADDED,
  ANALYZE_UA2_METRIC_REMOVED,
  ANALYZE_UA2_ORDER_BY_CHANGED,
  ANALYZE_UA2_ORDER_BY_GROUP_CHANGED
} from 'in-services/tracking/tracking';

export const ua2FacetedSearchFilterAddedTracker = e => track(ANALYZE_UA2_FACETED_SEARCH_FILTER_ADDED, e);
export const ua2FacetedSearchGroupChangedTracker = e => track(ANALYZE_UA2_FACETED_SEARCH_GROUP_CHANGED, e);
export const ua2MetricAddedTracker = e => track(ANALYZE_UA2_METRIC_ADDED, e);
export const ua2MetricRemovedTracker = e => track(ANALYZE_UA2_METRIC_REMOVED, e);
export const ua2OrderByChangedTracker = e => track(ANALYZE_UA2_ORDER_BY_CHANGED, e);
export const ua2OrderByGroupChangedTracker = e => track(ANALYZE_UA2_ORDER_BY_GROUP_CHANGED, e);
