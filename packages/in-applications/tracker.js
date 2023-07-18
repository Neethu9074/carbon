/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  ANALYZE_TRACE_VIEW_ANALYZE_CALLS_FROM_TRACE_CLICK,
  ANALYZE_TRACE_VIEW_CHILD_CALL_LOAD_MORE_CLICK,
  ANALYZE_TRACE_VIEW_CLOSED,
  ANALYZE_TRACE_VIEW_DOWNLOAD_CALL_DETAILS,
  ANALYZE_TRACE_VIEW_DOWNLOAD_TRACES,
  ANALYZE_TRACE_VIEW_EXPAND_COLLAPSE_SIDEBAR,
  ANALYZE_TRACE_VIEW_NAVIGATE_TO_UA,
  ANALYZE_TRACE_VIEW_RETRY_CALL_CLICK,
  ANALYZE_TRACE_VIEW_ROOT_CALL_LOAD_MORE_CLICK,
  ANALYZE_TRACE_VIEW_SERVICE_ENDPOINT_LIST_CLICK,
  ANALYZE_TRACE_VIEW_TIMELINE_CALL_CLICK,
  ANALYZE_TRACE_VIEW_TRACE_LIST_CLICK,
  ANALYZE_TRACE_VIEW_TRACK_IF_LARGE_TRACE,
  ANALYZE_TRACE_VIEW_TREE_CALL_CLICK,
  ANALYZE_UA2_API_QUERY_PRESSED,
  ANALYZE_UA2_CHART_CHANGED,
  ANALYZE_UA2_CHART_REMOVED,
  ANALYZE_UA2_EXPAND_COLLAPSE_GROUPED_LIST_ITEM,
  ANALYZE_UA2_FACETED_SEARCH_FILTER_ADDED,
  ANALYZE_UA2_FACETED_SEARCH_FILTER_CLOSED,
  ANALYZE_UA2_FACETED_SEARCH_FILTER_OPENED,
  ANALYZE_UA2_FACETED_SEARCH_GROUP_CHANGED,
  ANALYZE_UA2_FACETED_SEARCH_GROUP_REMOVED,
  ANALYZE_UA2_FACETED_SEARCH_INTERNAL_CALLS_TOGGLED,
  ANALYZE_UA2_FACETED_SEARCH_SYNTHETIC_CALLS_TOGGLED,
  ANALYZE_UA2_FACETS_CHANGED,
  ANALYZE_UA2_FAST_QUERY_MODE_CHANGED,
  ANALYZE_UA2_FORMMODEL_CHANGED,
  ANALYZE_UA2_GROUP_CHANGED,
  ANALYZE_UA2_METRIC_ADDED,
  ANALYZE_UA2_METRIC_REMOVED,
  ANALYZE_UA2_NESTING_DEPTH,
  ANALYZE_UA2_ORDER_BY_CHANGED,
  ANALYZE_UA2_ORDER_BY_GROUP_CHANGED,
  ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED,
  APPLICATION_CLICK_CREATE,
  APPLICATION_CLICK_SOURCE_OR_DESTINATION,
  APPLICATION_CLICK_SUBMIT,
  APPLICATION_LATENCY_JUMP_TO_UNBOUNDED_ANALYTICS,
  APPLICATION_TIME_SHIFT_SELECT,
  track
} from 'in-services/tracking/tracking';

export const applicationOpenSubmitFormTracker = e => track(APPLICATION_CLICK_CREATE, e);
export const applicationSubmitTracker = e => track(APPLICATION_CLICK_SUBMIT, e);
export const applicationSourceOrDestinationTracker = e => track(APPLICATION_CLICK_SOURCE_OR_DESTINATION, e);
export const jumpToUnboundedAnalyticsFromLatencyTracker = e =>
  track(APPLICATION_LATENCY_JUMP_TO_UNBOUNDED_ANALYTICS, e);
export const applicationTimeShiftSelectTracker = e => track(APPLICATION_TIME_SHIFT_SELECT, e);

export const ua2FacetedSearchFilterAddedTracker = e => track(ANALYZE_UA2_FACETED_SEARCH_FILTER_ADDED, e);
export const ua2FacetedSearchGroupChangedTracker = e => track(ANALYZE_UA2_FACETED_SEARCH_GROUP_CHANGED, e);
export const ua2FacetedSearchGroupingRemovedTracker = e => track(ANALYZE_UA2_FACETED_SEARCH_GROUP_REMOVED, e);
export const ua2FacetedSearchSyntheticCallsToggledTracker = e =>
  track(ANALYZE_UA2_FACETED_SEARCH_SYNTHETIC_CALLS_TOGGLED, e);
export const ua2FacetedSearchInternalCallsToggledTracker = e =>
  track(ANALYZE_UA2_FACETED_SEARCH_INTERNAL_CALLS_TOGGLED, e);
export const ua2FacetedSearchFilterOpenedTracker = e => track(ANALYZE_UA2_FACETED_SEARCH_FILTER_OPENED, e);
export const ua2FacetedSearchFilterClosedTracker = e => track(ANALYZE_UA2_FACETED_SEARCH_FILTER_CLOSED, e);
export const ua2QueryBuilderFilterAddedTracker = e => track(ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED, e);
export const ua2GroupChangedTracker = e => track(ANALYZE_UA2_GROUP_CHANGED, e);
export const ua2ChartChangedTracker = e => track(ANALYZE_UA2_CHART_CHANGED, e);
export const ua2ChartRemovedTracker = e => track(ANALYZE_UA2_CHART_REMOVED, e);
export const ua2MetricAddedTracker = e => track(ANALYZE_UA2_METRIC_ADDED, e);
export const ua2MetricRemovedTracker = e => track(ANALYZE_UA2_METRIC_REMOVED, e);
export const ua2OrderByChangedTracker = e => track(ANALYZE_UA2_ORDER_BY_CHANGED, e);
export const ua2OrderByGroupChangedTracker = e => track(ANALYZE_UA2_ORDER_BY_GROUP_CHANGED, e);
export const ua2ApiQueryPressedTracker = e => track(ANALYZE_UA2_API_QUERY_PRESSED, e);
export const ua2NestingDepthTracker = e => track(ANALYZE_UA2_NESTING_DEPTH, e);
export const ua2FastQueryModeChangedTracker = e => track(ANALYZE_UA2_FAST_QUERY_MODE_CHANGED, e);
export const ua2FormModelChangedTracker = e => track(ANALYZE_UA2_FORMMODEL_CHANGED, e);
export const ua2FacetsChangedTracker = e => track(ANALYZE_UA2_FACETS_CHANGED, e);
export const ua2ExpandCollapseGroupedListItem = e => track(ANALYZE_UA2_EXPAND_COLLAPSE_GROUPED_LIST_ITEM, e);
export const traceViewClosedTracker = e => track(ANALYZE_TRACE_VIEW_CLOSED, e);
export const traceViewNavigateBackToUa = e => track(ANALYZE_TRACE_VIEW_NAVIGATE_TO_UA, e);
export const traceViewTraceListClickedTracker = e => track(ANALYZE_TRACE_VIEW_TRACE_LIST_CLICK, e);
export const traceViewTraceServiceEndpointListClickedTracker = e =>
  track(ANALYZE_TRACE_VIEW_SERVICE_ENDPOINT_LIST_CLICK, e);
export const traceViewCallTimelineDetailClickedTracker = e => track(ANALYZE_TRACE_VIEW_TIMELINE_CALL_CLICK, e);
export const traceViewCallTreeDetailClickedTracker = e => track(ANALYZE_TRACE_VIEW_TREE_CALL_CLICK, e);
export const collapseOrExpandTraceDetailSidebar = e => track(ANALYZE_TRACE_VIEW_EXPAND_COLLAPSE_SIDEBAR, e);
export const loadRootCallClickedTracker = e => track(ANALYZE_TRACE_VIEW_ROOT_CALL_LOAD_MORE_CLICK, e);
export const loadChildCallClickedTracker = e => track(ANALYZE_TRACE_VIEW_CHILD_CALL_LOAD_MORE_CLICK, e);
export const retryCallClickedTracker = e => track(ANALYZE_TRACE_VIEW_RETRY_CALL_CLICK, e);
export const analyzeCallsOfTraceClickedTracker = e => track(ANALYZE_TRACE_VIEW_ANALYZE_CALLS_FROM_TRACE_CLICK, e);
export const downloadTraceClickedTracker = e => track(ANALYZE_TRACE_VIEW_DOWNLOAD_TRACES, e);
export const downloadCallDetailsClickedTracker = e => track(ANALYZE_TRACE_VIEW_DOWNLOAD_CALL_DETAILS, e);

export const traceViewTrackIfLargeTrace = e => track(ANALYZE_TRACE_VIEW_TRACK_IF_LARGE_TRACE, e);
export const traceViewTracker = {
  traceViewNavigateBackToUa,
  traceViewClosedTracker,
  traceViewTraceListClickedTracker,
  traceViewTraceServiceEndpointListClickedTracker,
  traceViewCallTreeDetailClickedTracker,
  traceViewCallTimelineDetailClickedTracker,
  collapseOrExpandTraceDetailSidebar,
  loadRootCallClickedTracker,
  loadChildCallClickedTracker,
  analyzeCallsOfTraceClickedTracker,
  downloadTraceClickedTracker,
  downloadCallDetailsClickedTracker,
  traceViewTrackIfLargeTrace
};
