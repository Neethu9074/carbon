/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  APPLICATION_CLICK_CREATE,
  APPLICATION_CLICK_SUBMIT,
  APPLICATION_LATENCY_JUMP_TO_UNBOUNDED_ANALYTICS,
  APPLICATION_TIME_SHIFT_SELECT,
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
  ANALYZE_UA2_FACETED_SEARCH_FILTER_CLOSED,
  ANALYZE_TRACE_VIEW_CLOSED,
  ANALYZE_TRACE_VIEW_NAVIGATE_TO_UA,
  ANALYZE_TRACE_VIEW_TRACE_LIST_CLICK,
  ANALYZE_TRACE_VIEW_SERVICE_ENDPOINT_LIST_CLICK,
  ANALYZE_TRACE_VIEW_TIMELINE_CALL_CLICK,
  ANALYZE_TRACE_VIEW_TREE_CALL_CLICK,
  ANALYZE_TRACE_VIEW_EXPAND_COLLAPSE_SIDEBAR,
  ANALYZE_TRACE_VIEW_ROOT_CALL_LOAD_MORE_CLICK,
  ANALYZE_TRACE_VIEW_CHILD_CALL_LOAD_MORE_CLICK,
  ANALYZE_TRACE_VIEW_RETRY_CALL_CLICK,
  ANALYZE_TRACE_VIEW_ANALYZE_CALLS_FROM_TRACE_CLICK,
  ANALYZE_TRACE_VIEW_DOWNLOAD_TRACES,
  ANALYZE_TRACE_VIEW_DOWNLOAD_CALL_DETAILS,
  ANALYZE_TRACE_VIEW_TRACK_IF_LARGE_TRACE,
  FLOW_MAP_CLICK,
  FLOW_MAP_CLICK_CALLS,
  FLOW_MAP_CLICK_LATENCY,
  FLOW_MAP_CLICK_ERROR,
  FLOW_MAP_CLICK_SIMULATION,
  FLOW_MAP_CLICK_EXPAND_LEVEL,
  APPLICATION_CREATION_OPEN_DIALOG_CLICK,
  APPLCATION_CREATION_CLOSE_DIALOG_CLICK,
  APPLICATION_CREATION_STEP_SWITCH,
  APPLICATION_CREATION_MODE_SWITCH,
  APPLICATION_CREATION_CREATE_CLICK,
  APPLICATION_CREATION_SELECTED_BLUEPRINT,
  APPLICATION_CREATION_ADD_TAG,
  APPLICATION_CREATION_REMOVE_TAG,
  APPLICATION_CREATION_BOUNDARY_SCOPE_SELECT,
  APPLICATION_CREATION_SCOPE_SELECT
} from 'in-services/tracking/eventNames';
import { clickSyntheticMonitoringTabInApplicationsTracker } from 'in-synthetics/tracking/tracker';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { CREATED_OBJECT, UI_INTERACTION } from 'in-services/util/constants';

export interface TrackingFunctions {
  trackApplicationOpenSubmitForm: (payload?: object) => void;
  trackApplicationSubmitted: (payload?: object) => void;
  trackAumpToUnboundedAnalyticsFromLatency: (payload?: object) => void;
  trackApplicationTimeShiftSelected: (payload?: object) => void;
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
  trackTraceViewClosed: (payload?: object) => void;
  trackTraceViewNavigateBackToUa: (payload?: object) => void;
  trackTraceViewTraceListClicked: (payload?: object) => void;
  trackTraceViewTraceServiceEndpointListClicked: (payload?: object) => void;
  trackTraceViewCallTimelineDetailClicked: (payload?: object) => void;
  trackTraceViewCallTreeDetailClicked: (payload?: object) => void;
  trackCollapseOrExpandTraceDetailSidebar: (payload?: object) => void;
  trackLoadRootCallClicked: (payload?: object) => void;
  trackLoadChildCallClicked: (payload?: object) => void;
  trackRetryCallClicked: (payload?: object) => void;
  trackAnalyzeCallsOfTraceClicked: (payload?: object) => void;
  trackDownloadTraceClicked: (payload?: object) => void;
  trackDownloadCallDetailsClicked: (payload?: object) => void;
  trackTraceViewTrackIfLargeTrace: (payload?: object) => void;
  trackFlowMapClicked: (payload?: object) => void;
  trackFlowMapCallsClicked: (payload?: object) => void;
  trackFlowMapLatencyClicked: (payload?: object) => void;
  trackFlowMapErrorClicked: (payload?: object) => void;
  trackFlowMapSimulationClicked: (payload?: object) => void;
  trackFlowMapLevelExpanded: (payload?: object) => void;
  trackSyntheticMonitoringTabInApplicationsClicked: () => void;
  trackApplicationCreationOpenDialogClicked: (payload?: Object) => void;
  trackApplicationCreationCloseDialogClicked: (payload?: Object) => void;
  trackApplicationCreationStepSwitched: (payload?: Object) => void;
  trackApplicationCreationModeSwitched: (payload?: Object) => void;
  trackApplicationCreationCreateClicked: (payload?: Object) => void;
  trackApplicationCreationBlueprintSelected: (payload?: Object) => void;
  trackApplicationCreationTagAdded: (payload?: Object) => void;
  trackApplicationCreationTagRemoved: (payload?: Object) => void;
  trackApplicationCreationBoundaryScopeSelected: (payload?: Object) => void;
  trackApplicationCreationScopeSelected: (payload?: Object) => void;
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
}

export const useApplicationTracker = (): TrackingFunctions => {
  const { trackCta, unstable_trackEvent } = useSegmentTracking();

  const trackApplicationOpenSubmitForm = (payload?: object) => trackCta(APPLICATION_CLICK_CREATE, payload);
  const trackApplicationSubmitted = (payload?: object) =>
    unstable_trackEvent(CREATED_OBJECT, { objectType: APPLICATION_CLICK_SUBMIT }, payload);
  const trackAumpToUnboundedAnalyticsFromLatency = (payload?: object) =>
    trackCta(APPLICATION_LATENCY_JUMP_TO_UNBOUNDED_ANALYTICS, payload);
  const trackApplicationTimeShiftSelected = (payload?: object) => trackCta(APPLICATION_TIME_SHIFT_SELECT, payload);
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

  const trackTraceViewClosed = (payload?: object) => trackCta(ANALYZE_TRACE_VIEW_CLOSED, payload);
  const trackTraceViewNavigateBackToUa = (payload?: object) => trackCta(ANALYZE_TRACE_VIEW_NAVIGATE_TO_UA, payload);
  const trackTraceViewTraceListClicked = (payload?: object) => trackCta(ANALYZE_TRACE_VIEW_TRACE_LIST_CLICK, payload);
  const trackTraceViewTraceServiceEndpointListClicked = (payload?: object) =>
    trackCta(ANALYZE_TRACE_VIEW_SERVICE_ENDPOINT_LIST_CLICK, payload);
  const trackTraceViewCallTimelineDetailClicked = (payload?: object) =>
    trackCta(ANALYZE_TRACE_VIEW_TIMELINE_CALL_CLICK, payload);
  const trackTraceViewCallTreeDetailClicked = (payload?: object) =>
    trackCta(ANALYZE_TRACE_VIEW_TREE_CALL_CLICK, payload);
  const trackCollapseOrExpandTraceDetailSidebar = (payload?: object) =>
    trackCta(ANALYZE_TRACE_VIEW_EXPAND_COLLAPSE_SIDEBAR, payload);
  const trackLoadRootCallClicked = (payload?: object) =>
    trackCta(ANALYZE_TRACE_VIEW_ROOT_CALL_LOAD_MORE_CLICK, payload);
  const trackLoadChildCallClicked = (payload?: object) =>
    trackCta(ANALYZE_TRACE_VIEW_CHILD_CALL_LOAD_MORE_CLICK, payload);
  const trackRetryCallClicked = (payload?: object) => trackCta(ANALYZE_TRACE_VIEW_RETRY_CALL_CLICK, payload);
  const trackAnalyzeCallsOfTraceClicked = (payload?: object) =>
    trackCta(ANALYZE_TRACE_VIEW_ANALYZE_CALLS_FROM_TRACE_CLICK, payload);
  const trackDownloadTraceClicked = (payload?: object) => trackCta(ANALYZE_TRACE_VIEW_DOWNLOAD_TRACES, payload);
  const trackDownloadCallDetailsClicked = (payload?: object) =>
    trackCta(ANALYZE_TRACE_VIEW_DOWNLOAD_CALL_DETAILS, payload);
  const trackTraceViewTrackIfLargeTrace = (payload?: object) =>
    trackCta(ANALYZE_TRACE_VIEW_TRACK_IF_LARGE_TRACE, payload);
  const trackFlowMapClicked = (payload?: object) => trackCta(FLOW_MAP_CLICK, payload);
  const trackFlowMapCallsClicked = (payload?: object) => trackCta(FLOW_MAP_CLICK_CALLS, payload);
  const trackFlowMapLatencyClicked = (payload?: object) => trackCta(FLOW_MAP_CLICK_LATENCY, payload);
  const trackFlowMapErrorClicked = (payload?: object) => trackCta(FLOW_MAP_CLICK_ERROR, payload);
  const trackFlowMapSimulationClicked = (payload?: object) => trackCta(FLOW_MAP_CLICK_SIMULATION, payload);
  const trackFlowMapLevelExpanded = (payload?: object) => trackCta(FLOW_MAP_CLICK_EXPAND_LEVEL, payload);
  // TODO: move tracking function and constants from in-synthetics to in-applications
  const trackSyntheticMonitoringTabInApplicationsClicked = () =>
    clickSyntheticMonitoringTabInApplicationsTracker(trackCta);

  // creation trackers
  const trackApplicationCreationOpenDialogClicked = (payload?: Object) =>
    trackCta(APPLICATION_CREATION_OPEN_DIALOG_CLICK, payload);
  const trackApplicationCreationCloseDialogClicked = (payload?: Object) =>
    trackCta(APPLCATION_CREATION_CLOSE_DIALOG_CLICK, payload);
  const trackApplicationCreationStepSwitched = (payload?: Object) =>
    trackCta(APPLICATION_CREATION_STEP_SWITCH, payload);
  const trackApplicationCreationModeSwitched = (payload?: Object) =>
    trackCta(APPLICATION_CREATION_MODE_SWITCH, payload);
  const trackApplicationCreationCreateClicked = (payload?: Object) =>
    trackCta(APPLICATION_CREATION_CREATE_CLICK, payload);
  const trackApplicationCreationBlueprintSelected = (payload?: Object) =>
    trackCta(APPLICATION_CREATION_SELECTED_BLUEPRINT, payload);
  const trackApplicationCreationTagAdded = (payload?: Object) => trackCta(APPLICATION_CREATION_ADD_TAG, payload);
  const trackApplicationCreationTagRemoved = (payload?: Object) => trackCta(APPLICATION_CREATION_REMOVE_TAG, payload);
  const trackApplicationCreationBoundaryScopeSelected = (payload?: Object) =>
    trackCta(APPLICATION_CREATION_BOUNDARY_SCOPE_SELECT, payload);
  const trackApplicationCreationScopeSelected = (payload?: Object) =>
    trackCta(APPLICATION_CREATION_SCOPE_SELECT, payload);

  return {
    trackApplicationOpenSubmitForm,
    trackApplicationSubmitted,
    trackAumpToUnboundedAnalyticsFromLatency,
    trackApplicationTimeShiftSelected,
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
    trackUa2ExpandCollapseGroupedListItem,
    trackTraceViewClosed,
    trackTraceViewNavigateBackToUa,
    trackTraceViewTraceListClicked,
    trackTraceViewTraceServiceEndpointListClicked,
    trackTraceViewCallTimelineDetailClicked,
    trackTraceViewCallTreeDetailClicked,
    trackCollapseOrExpandTraceDetailSidebar,
    trackLoadRootCallClicked,
    trackLoadChildCallClicked,
    trackRetryCallClicked,
    trackAnalyzeCallsOfTraceClicked,
    trackDownloadTraceClicked,
    trackDownloadCallDetailsClicked,
    trackTraceViewTrackIfLargeTrace,
    trackFlowMapClicked,
    trackFlowMapCallsClicked,
    trackFlowMapLatencyClicked,
    trackFlowMapErrorClicked,
    trackFlowMapSimulationClicked,
    trackFlowMapLevelExpanded,
    trackSyntheticMonitoringTabInApplicationsClicked,
    trackApplicationCreationOpenDialogClicked,
    trackApplicationCreationCloseDialogClicked,
    trackApplicationCreationStepSwitched,
    trackApplicationCreationModeSwitched,
    trackApplicationCreationCreateClicked,
    trackApplicationCreationBlueprintSelected,
    trackApplicationCreationTagAdded,
    trackApplicationCreationTagRemoved,
    trackApplicationCreationBoundaryScopeSelected,
    trackApplicationCreationScopeSelected,
    trackUa2MetricAdded,
    trackUa2MetricRemoved,
    trackUa2LoadMore,
    trackUa2OrderByChanged,
    trackUa2OrderByGroupChanged,
    trackUa2FacetedSearchGroupChanged,
    trackUa2FacetedSearchGroupRemoved,
    trackUa2FacetedSearchFilterOpened,
    trackUa2FacetedSearchFilterClosed,
    trackUa2FacetedSearchFilterAdded
  };
};
