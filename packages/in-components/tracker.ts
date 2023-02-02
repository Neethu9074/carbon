/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  ANALYZE_UA2_FACETED_SEARCH_FILTER_ADDED,
  ANALYZE_UA2_FACETED_SEARCH_FILTER_CLOSED,
  ANALYZE_UA2_FACETED_SEARCH_FILTER_OPENED,
  ANALYZE_UA2_FACETED_SEARCH_GROUP_CHANGED,
  ANALYZE_UA2_LOAD_MORE,
  ANALYZE_UA2_METRIC_ADDED,
  ANALYZE_UA2_METRIC_REMOVED,
  ANALYZE_UA2_ORDER_BY_CHANGED,
  ANALYZE_UA2_ORDER_BY_GROUP_CHANGED,
  CHART_ZOOM_INTO_TIMEFRAME,
  track
} from 'in-services/tracking/tracking';

export const ua2FacetedSearchFilterAddedTracker = (e: Object) => track(ANALYZE_UA2_FACETED_SEARCH_FILTER_ADDED, e);
export const ua2FacetedSearchGroupChangedTracker = (e: Object) => track(ANALYZE_UA2_FACETED_SEARCH_GROUP_CHANGED, e);
export const ua2FacetedSearchFilterOpenedTracker = (e: Object) => track(ANALYZE_UA2_FACETED_SEARCH_FILTER_OPENED, e);
export const ua2FacetedSearchFilterClosedTracker = (e: Object) => track(ANALYZE_UA2_FACETED_SEARCH_FILTER_CLOSED, e);
export const ua2MetricAddedTracker = (e: Object) => track(ANALYZE_UA2_METRIC_ADDED, e);
export const ua2MetricRemovedTracker = (e: Object) => track(ANALYZE_UA2_METRIC_REMOVED, e);
export const ua2OrderByChangedTracker = (e: Object) => track(ANALYZE_UA2_ORDER_BY_CHANGED, e);
export const ua2OrderByGroupChangedTracker = (e: Object) => track(ANALYZE_UA2_ORDER_BY_GROUP_CHANGED, e);
export const chartZoomInTracker = (e: { chartMetrics: string[] }) => track(CHART_ZOOM_INTO_TIMEFRAME, e);
export const ua2LoadedMore = (e: { dataSource?: string; groupbyTag?: string; groupbyTagSecondLevelKey?: string }) =>
  track(ANALYZE_UA2_LOAD_MORE, e);
