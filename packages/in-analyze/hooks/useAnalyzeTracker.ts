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
  ANALYZE_VIEW_SELECTED,
  ANALYZE_UA2_FACETED_SEARCH_SYNTHETIC_CALLS_TOGGLED,
  ANALYZE_UA2_FACETED_SEARCH_INTERNAL_CALLS_TOGGLED,
  ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED,
  ANALYZE_UA2_GROUP_CHANGED,
  ANALYZE_UA2_CHART_CHANGED,
  ANALYZE_UA2_CHART_REMOVED,
  ANALYZE_UA2_API_QUERY_PRESSED,
  ANALYZE_UA2_NESTING_DEPTH,
  ANALYZE_UA2_FAST_QUERY_MODE_CHANGED,
  ANALYZE_UA2_FORMMODEL_CHANGED,
  ANALYZE_UA2_FACETS_CHANGED,
  ANALYZE_UA2_EXPAND_COLLAPSE_GROUPED_LIST_ITEM,
  ANALYZE_UA2_METRIC_ADDED,
  ANALYZE_UA2_METRIC_REMOVED,
  ANALYZE_UA2_LOAD_MORE,
  ANALYZE_UA2_ORDER_BY_CHANGED,
  ANALYZE_UA2_ORDER_BY_GROUP_CHANGED,
  ANALYZE_UA2_FACETED_SEARCH_FILTER_ADDED,
  ANALYZE_UA2_FACETED_SEARCH_GROUP_REMOVED,
  ANALYZE_UA2_FACETED_SEARCH_GROUP_CHANGED,
  ANALYZE_UA2_FACETED_SEARCH_FILTER_OPENED,
  ANALYZE_UA2_FACETED_SEARCH_FILTER_CLOSED
} from 'in-services/tracking/tracking';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { CREATED_OBJECT, UI_INTERACTION } from 'in-services/util/constants';

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
  trackUa2MetricAdded: (payload?: Object) => void;
  trackUa2MetricRemoved: (payload?: Object) => void;
  trackUa2LoadMore: (payload?: object) => void;
  trackUa2OrderByChanged: (payload?: object) => void;
  trackUa2OrderByGroupChanged: (payload?: object) => void;
  trackUa2FacetedSearchGroupChanged: (payload?: object) => void;
  trackUa2FacetedSearchGroupRemoved: (payload?: object) => void;
  trackUa2FacetedSearchFilterOpened: (payload?: object) => void;
  trackUa2FacetedSearchFilterClosed: (payload?: object) => void;
  trackUa2FacetedSearchFilterAdded: (payload?: object) => void;
  trackUa2FacetedSearchSyntheticCallsToggled: (payload?: object) => void;
  trackUa2FacetedSearchInternalCallsToggled: (payload?: object) => void;
  trackUa2QueryBuilderFilterAdded: (payload?: object) => void;
  trackUa2GroupChanged: (payload?: object) => void;
  trackUa2ChartChanged: (payload?: object) => void;
  trackUa2ChartRemoved: (payload?: object) => void;
  trackUa2ApiQueryPressed: (payload?: object) => void;
  trackUa2NestingDepth: (payload?: object) => void;
  trackUa2FastQueryModeChanged: (payload?: object) => void;
  trackUa2FormModelChanged: (payload?: object) => void;
  trackUa2FacetsChanged: (payload?: object) => void;
  trackUa2ExpandCollapseGroupedListItem: (payload?: object) => void;
}

export const useAnalyzeTracker = (): TrackingFunctions => {
  const { trackCta, unstable_trackEvent } = useSegmentTracking();

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
  const trackUa2MetricAdded = (payload?: object) =>
    unstable_trackEvent(CREATED_OBJECT, { objectType: ANALYZE_UA2_METRIC_ADDED }, payload);
  const trackUa2MetricRemoved = (payload?: object) =>
    unstable_trackEvent(CREATED_OBJECT, { objectType: ANALYZE_UA2_METRIC_REMOVED }, payload);
  const trackUa2LoadMore = (payload?: object) =>
    unstable_trackEvent(UI_INTERACTION, { objectType: ANALYZE_UA2_LOAD_MORE }, payload);
  const trackUa2OrderByChanged = (payload?: object) => trackCta(ANALYZE_UA2_ORDER_BY_CHANGED, payload);
  const trackUa2OrderByGroupChanged = (payload?: object) => trackCta(ANALYZE_UA2_ORDER_BY_GROUP_CHANGED, payload);
  const trackUa2FacetedSearchGroupChanged = (payload?: object) =>
    trackCta(ANALYZE_UA2_FACETED_SEARCH_GROUP_CHANGED, payload);
  const trackUa2FacetedSearchFilterAdded = (payload?: object) =>
    trackCta(ANALYZE_UA2_FACETED_SEARCH_FILTER_ADDED, payload);
  const trackUa2FacetedSearchGroupRemoved = (payload?: object) =>
    trackCta(ANALYZE_UA2_FACETED_SEARCH_GROUP_REMOVED, payload);
  const trackUa2FacetedSearchFilterOpened = (payload?: object) =>
    trackCta(ANALYZE_UA2_FACETED_SEARCH_FILTER_OPENED, payload);
  const trackUa2FacetedSearchFilterClosed = (payload?: object) =>
    trackCta(ANALYZE_UA2_FACETED_SEARCH_FILTER_CLOSED, payload);
  const trackUa2FacetedSearchSyntheticCallsToggled = (payload?: object) =>
    trackCta(ANALYZE_UA2_FACETED_SEARCH_SYNTHETIC_CALLS_TOGGLED, payload);
  const trackUa2FacetedSearchInternalCallsToggled = (payload?: object) =>
    trackCta(ANALYZE_UA2_FACETED_SEARCH_INTERNAL_CALLS_TOGGLED, payload);
  const trackUa2QueryBuilderFilterAdded = (payload?: object) =>
    trackCta(ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED, payload);
  const trackUa2GroupChanged = (payload?: object) => trackCta(ANALYZE_UA2_GROUP_CHANGED, payload);
  const trackUa2ChartChanged = (payload?: object) => trackCta(ANALYZE_UA2_CHART_CHANGED, payload);
  const trackUa2ChartRemoved = (payload?: object) => trackCta(ANALYZE_UA2_CHART_REMOVED, payload);
  const trackUa2ApiQueryPressed = (payload?: object) => trackCta(ANALYZE_UA2_API_QUERY_PRESSED, payload);
  const trackUa2NestingDepth = (payload?: object) => trackCta(ANALYZE_UA2_NESTING_DEPTH, payload);
  const trackUa2FastQueryModeChanged = (payload?: object) => trackCta(ANALYZE_UA2_FAST_QUERY_MODE_CHANGED, payload);
  const trackUa2FormModelChanged = (payload?: object) => trackCta(ANALYZE_UA2_FORMMODEL_CHANGED, payload);
  const trackUa2FacetsChanged = (payload?: object) => trackCta(ANALYZE_UA2_FACETS_CHANGED, payload);
  const trackUa2ExpandCollapseGroupedListItem = (payload?: object) =>
    trackCta(ANALYZE_UA2_EXPAND_COLLAPSE_GROUPED_LIST_ITEM, payload);

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
    trackAnalyzeViewSelected,
    trackUa2MetricAdded,
    trackUa2MetricRemoved,
    trackUa2LoadMore,
    trackUa2OrderByChanged,
    trackUa2OrderByGroupChanged,
    trackUa2FacetedSearchGroupChanged,
    trackUa2FacetedSearchGroupRemoved,
    trackUa2FacetedSearchFilterOpened,
    trackUa2FacetedSearchFilterClosed,
    trackUa2FacetedSearchFilterAdded,
    trackUa2FacetedSearchSyntheticCallsToggled,
    trackUa2FacetedSearchInternalCallsToggled,
    trackUa2QueryBuilderFilterAdded,
    trackUa2GroupChanged,
    trackUa2ChartChanged,
    trackUa2ChartRemoved,
    trackUa2ApiQueryPressed,
    trackUa2NestingDepth,
    trackUa2FastQueryModeChanged,
    trackUa2FormModelChanged,
    trackUa2FacetsChanged,
    trackUa2ExpandCollapseGroupedListItem
  };
};
