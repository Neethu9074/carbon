/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  ANALYZE_FILTER_ADDED,
  ANALYZE_CALL_CLICK,
  ANALYZE_DETAIL_CALL_CLICK,
  ANALYZE_FILTER_CHANGED,
  ANALYZE_FILTER_CLEARED,
  ANALYZE_FILTER_REMOVED,
  ANALYZE_GROUP_ADDED,
  ANALYZE_GROUP_CHANGED,
  ANALYZE_GROUP_CLICK,
  ANALYZE_GROUP_REMOVED,
  ANALYZE_METRIC_CHANGED,
  ANALYZE_TRACE_CLICK,
  ANALYZE_LATENCY_PERCENTILE_MENU_CLICK,
  ANALYZE_LATENCY_SELECTION_CHANGED,
  ANALYZE_DOCS_LINK_OPENED
} from 'in-services/tracking/tracking';

export const groupAddedTracker = (e: Record<string, unknown>) => track(ANALYZE_GROUP_ADDED, e);
export const groupChangedTracker = (e: Record<string, unknown>) => track(ANALYZE_GROUP_CHANGED, e);
export const groupRemovedTracker = (e: Record<string, unknown>) => track(ANALYZE_GROUP_REMOVED, e);

export const filterAddedTracker = (e: Record<string, unknown>) => track(ANALYZE_FILTER_ADDED, e);
export const filterChangedTracker = (e: Record<string, unknown>) => track(ANALYZE_FILTER_CHANGED, e);
export const filterRemovedTracker = (e: Record<string, unknown>) => track(ANALYZE_FILTER_REMOVED, e);
export const filterClearedTracker = (e: Record<string, unknown>) => track(ANALYZE_FILTER_CLEARED, e);

export const metricChangedTracker = (e: Record<string, unknown>) => track(ANALYZE_METRIC_CHANGED, e);
export const latencyPercentileMenuClickedTracker = (e: Record<string, unknown>) =>
  track(ANALYZE_LATENCY_PERCENTILE_MENU_CLICK, e);
export const latencySelectionChanged = (e: Record<string, unknown>) => track(ANALYZE_LATENCY_SELECTION_CHANGED, e);

export const groupClickedTracker = (e: Record<string, unknown>) => track(ANALYZE_GROUP_CLICK, e);
export const traceClickedTracker = (e: Record<string, unknown>) => track(ANALYZE_TRACE_CLICK, e);
export const callClickedTracker = (e: Record<string, unknown>) => track(ANALYZE_CALL_CLICK, e);
export const callDetailClickedTracker = (e: Record<string, unknown>) => track(ANALYZE_DETAIL_CALL_CLICK, e);
export const clickedDocsLink = (e: Record<string, string>) => track(ANALYZE_DOCS_LINK_OPENED, e);
