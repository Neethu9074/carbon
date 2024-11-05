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
import { CREATED_OBJECT } from 'in-services/util/constants';

export interface TrackingFunctions {
  trackApplicationOpenSubmitForm: (payload?: object) => void;
  trackApplicationSubmitted: (payload?: object) => void;
  trackAumpToUnboundedAnalyticsFromLatency: (payload?: object) => void;
  trackApplicationTimeShiftSelected: (payload?: object) => void;

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
}

export const useApplicationTracker = (): TrackingFunctions => {
  const { trackCta, unstable_trackEvent } = useSegmentTracking();

  const trackApplicationOpenSubmitForm = (payload?: object) => trackCta(APPLICATION_CLICK_CREATE, payload);
  const trackApplicationSubmitted = (payload?: object) =>
    unstable_trackEvent(CREATED_OBJECT, { objectType: APPLICATION_CLICK_SUBMIT }, payload);
  const trackAumpToUnboundedAnalyticsFromLatency = (payload?: object) =>
    trackCta(APPLICATION_LATENCY_JUMP_TO_UNBOUNDED_ANALYTICS, payload);
  const trackApplicationTimeShiftSelected = (payload?: object) => trackCta(APPLICATION_TIME_SHIFT_SELECT, payload);

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
    trackApplicationCreationScopeSelected
  };
};
