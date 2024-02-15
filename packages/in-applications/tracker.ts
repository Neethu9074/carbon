/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TagFilter } from '@instana/types';

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
  ANALYZE_UA2_FACETED_SEARCH_INTERNAL_CALLS_TOGGLED,
  ANALYZE_UA2_FACETED_SEARCH_SYNTHETIC_CALLS_TOGGLED,
  ANALYZE_UA2_FACETS_CHANGED,
  ANALYZE_UA2_FAST_QUERY_MODE_CHANGED,
  ANALYZE_UA2_FORMMODEL_CHANGED,
  ANALYZE_UA2_GROUP_CHANGED,
  ANALYZE_UA2_NESTING_DEPTH,
  ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED,
  APPLICATION_CLICK_CREATE,
  APPLICATION_CLICK_SUBMIT,
  APPLICATION_LATENCY_JUMP_TO_UNBOUNDED_ANALYTICS,
  SERVICE_FLOW_MAP_CLICK,
  APPLICATION_TIME_SHIFT_SELECT,
  track,
  SERVICE_FLOW_MAP_CLICK_EXPAND_LEVEL,
  SERVICE_FLOW_MAP_CLICK_CALLS,
  SERVICE_FLOW_MAP_CLICK_LATENCY,
  SERVICE_FLOW_MAP_CLICK_ERROR,
  SERVICE_FLOW_MAP_CLICK_SIMULATION
} from 'in-services/tracking/tracking';

export type FilterAddedTrackingPayload = { dataSource: string; tagName: string; tagFilter?: TagFilter };

export const applicationOpenSubmitFormTracker = (e: Record<string, unknown>) => track(APPLICATION_CLICK_CREATE, e);
export const applicationSubmitTracker = (e: Record<string, unknown>) => track(APPLICATION_CLICK_SUBMIT, e);
export const jumpToUnboundedAnalyticsFromLatencyTracker = (e: Record<string, unknown>) =>
  track(APPLICATION_LATENCY_JUMP_TO_UNBOUNDED_ANALYTICS, e);
export const applicationTimeShiftSelectTracker = (e: Record<string, unknown>) =>
  track(APPLICATION_TIME_SHIFT_SELECT, e);
export const ua2FacetedSearchSyntheticCallsToggledTracker = (e: Record<string, unknown>) =>
  track(ANALYZE_UA2_FACETED_SEARCH_SYNTHETIC_CALLS_TOGGLED, e);
export const ua2FacetedSearchInternalCallsToggledTracker = (e: Record<string, unknown>) =>
  track(ANALYZE_UA2_FACETED_SEARCH_INTERNAL_CALLS_TOGGLED, e);
export const ua2QueryBuilderFilterAddedTracker = (e: Record<string, unknown>) =>
  track(ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED, e);
export const ua2GroupChangedTracker = (e: Record<string, unknown>) => track(ANALYZE_UA2_GROUP_CHANGED, e);
export const ua2ChartChangedTracker = (e: Record<string, unknown>) => track(ANALYZE_UA2_CHART_CHANGED, e);
export const ua2ChartRemovedTracker = (e: Record<string, unknown>) => track(ANALYZE_UA2_CHART_REMOVED, e);
export const ua2ApiQueryPressedTracker = (e: Record<string, unknown>) => track(ANALYZE_UA2_API_QUERY_PRESSED, e);
export const ua2NestingDepthTracker = (e: Record<string, unknown>) => track(ANALYZE_UA2_NESTING_DEPTH, e);
export const ua2FastQueryModeChangedTracker = (e: Record<string, unknown>) =>
  track(ANALYZE_UA2_FAST_QUERY_MODE_CHANGED, e);
export const ua2FormModelChangedTracker = (e: Record<string, unknown>) => track(ANALYZE_UA2_FORMMODEL_CHANGED, e);
export const ua2FacetsChangedTracker = (e: Record<string, unknown>) => track(ANALYZE_UA2_FACETS_CHANGED, e);
export const ua2ExpandCollapseGroupedListItem = (e: Record<string, unknown>) =>
  track(ANALYZE_UA2_EXPAND_COLLAPSE_GROUPED_LIST_ITEM, e);
export const traceViewClosedTracker = (e: Record<string, unknown>) => track(ANALYZE_TRACE_VIEW_CLOSED, e);
export const traceViewNavigateBackToUa = (e: Record<string, unknown>) => track(ANALYZE_TRACE_VIEW_NAVIGATE_TO_UA, e);
export const traceViewTraceListClickedTracker = (e: Record<string, unknown>) =>
  track(ANALYZE_TRACE_VIEW_TRACE_LIST_CLICK, e);
export const traceViewTraceServiceEndpointListClickedTracker = (e: Record<string, unknown>) =>
  track(ANALYZE_TRACE_VIEW_SERVICE_ENDPOINT_LIST_CLICK, e);
export const traceViewCallTimelineDetailClickedTracker = (e: Record<string, unknown>) =>
  track(ANALYZE_TRACE_VIEW_TIMELINE_CALL_CLICK, e);
export const traceViewCallTreeDetailClickedTracker = (e: Record<string, unknown>) =>
  track(ANALYZE_TRACE_VIEW_TREE_CALL_CLICK, e);
export const collapseOrExpandTraceDetailSidebar = (e: Record<string, unknown>) =>
  track(ANALYZE_TRACE_VIEW_EXPAND_COLLAPSE_SIDEBAR, e);
export const loadRootCallClickedTracker = (e: Record<string, unknown>) =>
  track(ANALYZE_TRACE_VIEW_ROOT_CALL_LOAD_MORE_CLICK, e);
export const loadChildCallClickedTracker = (e: Record<string, unknown>) =>
  track(ANALYZE_TRACE_VIEW_CHILD_CALL_LOAD_MORE_CLICK, e);
export const retryCallClickedTracker = (e: Record<string, unknown>) => track(ANALYZE_TRACE_VIEW_RETRY_CALL_CLICK, e);
export const analyzeCallsOfTraceClickedTracker = (e: Record<string, unknown>) =>
  track(ANALYZE_TRACE_VIEW_ANALYZE_CALLS_FROM_TRACE_CLICK, e);
export const downloadTraceClickedTracker = (e: Record<string, unknown>) => track(ANALYZE_TRACE_VIEW_DOWNLOAD_TRACES, e);
export const downloadCallDetailsClickedTracker = (e: Record<string, unknown>) =>
  track(ANALYZE_TRACE_VIEW_DOWNLOAD_CALL_DETAILS, e);

export const traceViewTrackIfLargeTrace = (e: Record<string, unknown>) =>
  track(ANALYZE_TRACE_VIEW_TRACK_IF_LARGE_TRACE, e);

export const serviceFlowMapClickedTracker = (e: Record<string, unknown>) => track(SERVICE_FLOW_MAP_CLICK, e);
export const serviceFlowMapCallsClickedTracker = (e: Record<string, unknown>) => track(SERVICE_FLOW_MAP_CLICK_CALLS, e);
export const serviceFlowMapLatencyClickedTracker = (e: Record<string, unknown>) =>
  track(SERVICE_FLOW_MAP_CLICK_LATENCY, e);
export const serviceFlowMapErrorClickedTracker = (e: Record<string, unknown>) => track(SERVICE_FLOW_MAP_CLICK_ERROR, e);
export const serviceFlowMapSimulationClickedTracker = (e: Record<string, unknown>) =>
  track(SERVICE_FLOW_MAP_CLICK_SIMULATION, e);
export const serviceFlowMapLevelExpandedTracker = (e: Record<string, unknown>) =>
  track(SERVICE_FLOW_MAP_CLICK_EXPAND_LEVEL, e);

export const traceViewTracker: Record<string, (e: Record<string, unknown>) => void> = {
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
