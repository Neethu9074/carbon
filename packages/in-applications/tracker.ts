/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { TagFilter } from '@instana/types';

import {
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
  FLOW_MAP_CLICK,
  track,
  FLOW_MAP_CLICK_EXPAND_LEVEL,
  FLOW_MAP_CLICK_CALLS,
  FLOW_MAP_CLICK_LATENCY,
  FLOW_MAP_CLICK_ERROR,
  FLOW_MAP_CLICK_SIMULATION
} from 'in-services/tracking/tracking';

export type FilterAddedTrackingPayload = { dataSource: string; tagName: string; tagFilter?: TagFilter };
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

export const flowMapClickedTracker = (e: Record<string, unknown>) => track(FLOW_MAP_CLICK, e);
export const flowMapCallsClickedTracker = (e: Record<string, unknown>) => track(FLOW_MAP_CLICK_CALLS, e);
export const flowMapLatencyClickedTracker = (e: Record<string, unknown>) => track(FLOW_MAP_CLICK_LATENCY, e);
export const flowMapErrorClickedTracker = (e: Record<string, unknown>) => track(FLOW_MAP_CLICK_ERROR, e);
export const flowMapSimulationClickedTracker = (e: Record<string, unknown>) => track(FLOW_MAP_CLICK_SIMULATION, e);
export const flowMapLevelExpandedTracker = (e: Record<string, unknown>) => track(FLOW_MAP_CLICK_EXPAND_LEVEL, e);
