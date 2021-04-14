/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  APPLICATION_CLICK_CREATE,
  APPLICATION_CLICK_SUBMIT,
  APPLICATION_CLICK_SOURCE_OR_DESTINATION,
  APPLICATION_LATENCY_JUMP_TO_UNBOUNDED_ANALYTICS,
  APPLICATION_TIME_SHIFT_SELECT,
  ANALYZE_UA2_FACETED_SEARCH_FILTER_ADDED,
  ANALYZE_UA2_FACETED_SEARCH_GROUP_CHANGED,
  ANALYZE_UA2_FACETED_SEARCH_SYNTHETIC_CALLS_TOGGLED,
  ANALYZE_UA2_FACETED_SEARCH_INTERNAL_CALLS_TOGGLED,
  ANALYZE_UA2_FACETED_SEARCH_FILTER_OPENED,
  ANALYZE_UA2_FACETED_SEARCH_FILTER_CLOSED,
  ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED,
  ANALYZE_UA2_GROUP_CHANGED,
  ANALYZE_UA2_CHART_CHANGED,
  ANALYZE_UA2_METRIC_ADDED,
  ANALYZE_UA2_METRIC_REMOVED,
  ANALYZE_UA2_ORDER_BY_CHANGED,
  ANALYZE_UA2_ORDER_BY_GROUP_CHANGED,
  ANALYZE_UA2_API_QUERY_PRESSED,
  ANALYZE_UA2_NESTING_DEPTH
} from 'in-services/tracking/tracking';

export const applicationOpenSubmitFormTracker = e => track(APPLICATION_CLICK_CREATE, e);
export const applicationSubmitTracker = e => track(APPLICATION_CLICK_SUBMIT, e);
export const applicationSourceOrDestinationTracker = e => track(APPLICATION_CLICK_SOURCE_OR_DESTINATION, e);
export const jumpToUnboundedAnalyticsFromLatencyTracker = e =>
  track(APPLICATION_LATENCY_JUMP_TO_UNBOUNDED_ANALYTICS, e);
export const applicationTimeShiftSelectTracker = e => track(APPLICATION_TIME_SHIFT_SELECT, e);

export const ua2FacetedSearchFilterAddedTracker = e => track(ANALYZE_UA2_FACETED_SEARCH_FILTER_ADDED, e);
export const ua2FacetedSearchGroupChangedTracker = e => track(ANALYZE_UA2_FACETED_SEARCH_GROUP_CHANGED, e);
export const ua2FacetedSearchSyntheticCallsToggledTracker = e =>
  track(ANALYZE_UA2_FACETED_SEARCH_SYNTHETIC_CALLS_TOGGLED, e);
export const ua2FacetedSearchInternalCallsToggledTracker = e =>
  track(ANALYZE_UA2_FACETED_SEARCH_INTERNAL_CALLS_TOGGLED, e);
export const ua2FacetedSearchFilterOpenedTracker = e => track(ANALYZE_UA2_FACETED_SEARCH_FILTER_OPENED, e);
export const ua2FacetedSearchFilterClosedTracker = e => track(ANALYZE_UA2_FACETED_SEARCH_FILTER_CLOSED, e);
export const ua2QueryBuilderFilterAddedTracker = e => track(ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED, e);
export const ua2GroupChangedTracker = e => track(ANALYZE_UA2_GROUP_CHANGED, e);
export const ua2ChartChangedTracker = e => track(ANALYZE_UA2_CHART_CHANGED, e);
export const ua2MetricAddedTracker = e => track(ANALYZE_UA2_METRIC_ADDED, e);
export const ua2MetricRemovedTracker = e => track(ANALYZE_UA2_METRIC_REMOVED, e);
export const ua2OrderByChangedTracker = e => track(ANALYZE_UA2_ORDER_BY_CHANGED, e);
export const ua2OrderByGroupChangedTracker = e => track(ANALYZE_UA2_ORDER_BY_GROUP_CHANGED, e);
export const ua2ApiQueryPressedTracker = e => track(ANALYZE_UA2_API_QUERY_PRESSED, e);
export const ua2NestingDepthTracker = e => track(ANALYZE_UA2_NESTING_DEPTH, e);
