/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
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
  ANALYZE_LOGGING_JUMP_TO_LOGS,
  ANALYZE_DOCS_LINK_OPENED,
  ANALYZE_VIEW_SELECTED
} from 'in-services/tracking/tracking';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';

interface TrackingFunctions {
  trackGroupAdded: (payload?: object) => void;
  trackGroupChanged: (payload?: object) => void;
  trackGroupRemoved: (payload?: object) => void;
  trackFilterAdded: (payload?: object) => void;
  trackFilterChanged: (payload?: object) => void;
  trackFilterRemoved: (payload?: object) => void;
  trackFilterCleared: (payload?: object) => void;
  trackJumpToLogs: (payload?: object) => void;
  trackMetricChanged: (payload?: object) => void;
  trackLatencyPercentileMenuClicked: (payload?: object) => void;
  trackLatencySelectionChanged: (payload?: object) => void;
  trackGroupClicked: (payload?: object) => void;
  trackTraceClicked: (payload?: object) => void;
  trackCallClicked: (payload?: object) => void;
  trackCallDetailClicked: (payload?: object) => void;
  trackClickedDocsLink: (payload?: object) => void;
  trackAnalyzeViewSelected: (payload?: object) => void;
}

export const useAnalyzeTracker = (): TrackingFunctions => {
  const { trackCta } = useSegmentTracking();

  const trackGroupAdded = (payload?: object) => trackCta(ANALYZE_GROUP_ADDED, payload);
  const trackGroupChanged = (payload?: object) => trackCta(ANALYZE_GROUP_CHANGED, payload);
  const trackGroupRemoved = (payload?: object) => trackCta(ANALYZE_GROUP_REMOVED, payload);
  const trackFilterAdded = (payload?: object) => trackCta(ANALYZE_FILTER_ADDED, payload);
  const trackFilterChanged = (payload?: object) => trackCta(ANALYZE_FILTER_CHANGED, payload);
  const trackFilterRemoved = (payload?: object) => trackCta(ANALYZE_FILTER_REMOVED, payload);
  const trackFilterCleared = (payload?: object) => trackCta(ANALYZE_FILTER_CLEARED, payload);
  const trackJumpToLogs = (payload?: object) => trackCta(ANALYZE_LOGGING_JUMP_TO_LOGS, payload);
  const trackMetricChanged = (payload?: object) => trackCta(ANALYZE_METRIC_CHANGED, payload);
  const trackLatencyPercentileMenuClicked = (payload?: object) =>
    trackCta(ANALYZE_LATENCY_PERCENTILE_MENU_CLICK, payload);
  const trackLatencySelectionChanged = (payload?: object) => trackCta(ANALYZE_LATENCY_SELECTION_CHANGED, payload);
  const trackGroupClicked = (payload?: object) => trackCta(ANALYZE_GROUP_CLICK, payload);
  const trackTraceClicked = (payload?: object) => trackCta(ANALYZE_TRACE_CLICK, payload);
  const trackCallClicked = (payload?: object) => trackCta(ANALYZE_CALL_CLICK, payload);
  const trackCallDetailClicked = (payload?: object) => trackCta(ANALYZE_DETAIL_CALL_CLICK, payload);
  const trackClickedDocsLink = (payload?: object) => trackCta(ANALYZE_DOCS_LINK_OPENED, payload);
  const trackAnalyzeViewSelected = (payload?: object) => trackCta(ANALYZE_VIEW_SELECTED, payload);

  return {
    trackGroupAdded,
    trackGroupChanged,
    trackGroupRemoved,
    trackFilterAdded,
    trackFilterChanged,
    trackFilterRemoved,
    trackFilterCleared,
    trackJumpToLogs,
    trackMetricChanged,
    trackLatencyPercentileMenuClicked,
    trackLatencySelectionChanged,
    trackGroupClicked,
    trackTraceClicked,
    trackCallClicked,
    trackCallDetailClicked,
    trackClickedDocsLink,
    trackAnalyzeViewSelected
  };
};
