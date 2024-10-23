/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  MOBILE_APPS_OPEN_ADD_FORM,
  MOBILE_APPS_ADD_MOBILE_APP,
  MOBILE_APPS_DASHBOARD_RENAME_MOBILE_APP,
  MOBILE_APPS_DASHBOARD_REMOVE_MOBILE_APP,
  MOBILE_APPS_DASHBOARD_TAB_CHANGE,
  MOBILE_APPS_DASHBOARD_FILTER_ADD,
  MOBILE_APPS_DASHBOARD_FILTER_CHANGE,
  MOBILE_APPS_DASHBOARD_FILTER_REMOVE,
  MOBILE_APPS_DASHBOARD_FILTER_CLEAR,
  MOBILE_APPS_DASHBOARD_FILTER_SET,
  MOBILE_APPS_ANALYZE_CHANGE_METRICS,
  MOBILE_APPS_ANALYZE_SHOW_MOBILE_APP_DETAILS_IN_TRACE_VIEW,
  MOBILE_APPS_ANALYZE_HIDE_MOBILE_APP_DETAILS_IN_TRACE_VIEW,
  MOBILE_APPS_ANALYZE_FILTER_ADD,
  MOBILE_APPS_ANALYZE_FILTER_CHANGE,
  MOBILE_APPS_ANALYZE_FILTER_REMOVE,
  MOBILE_APPS_ANALYZE_FILTER_CLEAR,
  MOBILE_APPS_ANALYZE_FILTER_SET,
  MOBILE_APPS_ANALYZE_GROUP_REMOVE,
  MOBILE_APPS_ANALYZE_GROUP_SET,
  MOBILE_APPS_ANALYZE_NAVIGATE_TO_BACKEND_TRACK_FROM_SESSION,
  MOBILE_APPS_ANALYZE_NAVIGATE_TO_SESSION_FROM_BACKEND_TRACE,
  ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED,
  ANALYZE_UA2_GROUP_CHANGED,
  ANALYZE_UA2_CHART_CHANGED,
  ANALYZE_UA2_API_QUERY_PRESSED,
  ANALYZE_UA2_NESTING_DEPTH
} from 'in-services/tracking/tracking';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';

export interface TrackingFunctions {
  mobileAppsOpenAddForm: (e?: Object) => void;
  addMobileAppTracker: (e?: Object) => void;
  removeMobileAppTracker: (e?: Object) => void;
  tabChange: (e?: Object) => void;
  changeAnalyzeMetrics: (e?: Object) => void;
  showMobileAppDetailsInTraceView: (e?: Object) => void;
  hideMobileAppDetailsInTraceView: (e?: Object) => void;
  navigateToBackendTraceFromSession: (e?: Object) => void;
  navigateToSessionFromBackendTrace: (e?: Object) => void;
  ua2QueryBuilderFilterAddedTracker: (e?: Object) => void;
  ua2GroupChangedTracker: (e?: Object) => void;
  ua2ChartChangedTracker: (e?: Object) => void;
  ua2ApiQueryPressedTracker: (e?: Object) => void;
  ua2NestingDepthTracker: (e?: Object) => void;
}

export const useMobileTracker = (): TrackingFunctions => {
  const { trackCta } = useSegmentTracking();

  // mobile app entry point
  const mobileAppsOpenAddForm = (e?: Object) => trackCta(MOBILE_APPS_OPEN_ADD_FORM, e);
  const addMobileAppTracker = (e?: Object) => trackCta(MOBILE_APPS_ADD_MOBILE_APP, e);
  const removeMobileAppTracker = (e?: Object) => trackCta(MOBILE_APPS_DASHBOARD_REMOVE_MOBILE_APP, e);
  const tabChange = (e?: Object) => trackCta(MOBILE_APPS_DASHBOARD_TAB_CHANGE, e);

  // analyze
  const changeAnalyzeMetrics = (e?: Object) => trackCta(MOBILE_APPS_ANALYZE_CHANGE_METRICS, e);
  const showMobileAppDetailsInTraceView = (e?: Object) =>
    trackCta(MOBILE_APPS_ANALYZE_SHOW_MOBILE_APP_DETAILS_IN_TRACE_VIEW, e);
  const hideMobileAppDetailsInTraceView = (e?: Object) =>
    trackCta(MOBILE_APPS_ANALYZE_HIDE_MOBILE_APP_DETAILS_IN_TRACE_VIEW, e);

  // session view
  const navigateToBackendTraceFromSession = (e?: Object) =>
    trackCta(MOBILE_APPS_ANALYZE_NAVIGATE_TO_BACKEND_TRACK_FROM_SESSION, e);
  const navigateToSessionFromBackendTrace = (e?: Object) =>
    trackCta(MOBILE_APPS_ANALYZE_NAVIGATE_TO_SESSION_FROM_BACKEND_TRACE, e);
  const ua2QueryBuilderFilterAddedTracker = (e?: Object) => trackCta(ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED, e);
  const ua2GroupChangedTracker = (e?: Object) => trackCta(ANALYZE_UA2_GROUP_CHANGED, e);
  const ua2ChartChangedTracker = (e?: Object) => trackCta(ANALYZE_UA2_CHART_CHANGED, e);
  const ua2ApiQueryPressedTracker = (e?: Object) => trackCta(ANALYZE_UA2_API_QUERY_PRESSED, e);
  const ua2NestingDepthTracker = (e?: Object) => trackCta(ANALYZE_UA2_NESTING_DEPTH, e);

  return {
    mobileAppsOpenAddForm,
    addMobileAppTracker,
    removeMobileAppTracker,
    tabChange,
    changeAnalyzeMetrics,
    showMobileAppDetailsInTraceView,
    hideMobileAppDetailsInTraceView,
    navigateToBackendTraceFromSession,
    navigateToSessionFromBackendTrace,
    ua2QueryBuilderFilterAddedTracker,
    ua2GroupChangedTracker,
    ua2ChartChangedTracker,
    ua2ApiQueryPressedTracker,
    ua2NestingDepthTracker
  };
};

export const renameMobileApp = (trackCta: CtaTrackingFunction) => {
  trackCta(MOBILE_APPS_DASHBOARD_RENAME_MOBILE_APP);
};

export const dashboardTagFilters = (trackCta: CtaTrackingFunction) => {
  const dashboardFilters = {
    add: (e?: Object) => trackCta(MOBILE_APPS_DASHBOARD_FILTER_ADD, e),
    change: (e?: Object) => trackCta(MOBILE_APPS_DASHBOARD_FILTER_CHANGE, e),
    remove: (e?: Object) => trackCta(MOBILE_APPS_DASHBOARD_FILTER_REMOVE, e),
    clear: (e?: Object) => trackCta(MOBILE_APPS_DASHBOARD_FILTER_CLEAR, e),
    set: (e?: Object) => trackCta(MOBILE_APPS_DASHBOARD_FILTER_SET, e)
  };
  return dashboardFilters;
};

export type DashboardTagFiltersTracker = ReturnType<typeof dashboardTagFilters>;

// analyze
export const analyzeTagFilters = (trackCta: CtaTrackingFunction) => {
  const analyzeFilters = {
    add: (e?: Object) => trackCta(MOBILE_APPS_ANALYZE_FILTER_ADD, e),
    change: (e?: Object) => trackCta(MOBILE_APPS_ANALYZE_FILTER_CHANGE, e),
    remove: (e?: Object) => trackCta(MOBILE_APPS_ANALYZE_FILTER_REMOVE, e),
    clear: (e?: Object) => trackCta(MOBILE_APPS_ANALYZE_FILTER_CLEAR, e),
    set: (e?: Object) => trackCta(MOBILE_APPS_ANALYZE_FILTER_SET, e)
  };
  return analyzeFilters;
};
export const analyzeGrouping = (trackCta: CtaTrackingFunction) => {
  const analyzeGroup = {
    remove: (e?: Object) => trackCta(MOBILE_APPS_ANALYZE_GROUP_REMOVE, e),
    set: (e?: Object) => trackCta(MOBILE_APPS_ANALYZE_GROUP_SET, e)
  };
  return analyzeGroup;
};
