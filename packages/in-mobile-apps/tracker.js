/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  MOBILE_APPS_OPEN_ADD_FORM,
  MOBILE_APPS_ADD_MOBILE_APP,
  MOBILE_APPS_ANALYZE_CHANGE_METRICS,
  MOBILE_APPS_ANALYZE_FILTER_ADD,
  MOBILE_APPS_ANALYZE_FILTER_CHANGE,
  MOBILE_APPS_ANALYZE_FILTER_CLEAR,
  MOBILE_APPS_ANALYZE_FILTER_REMOVE,
  MOBILE_APPS_ANALYZE_FILTER_SET,
  MOBILE_APPS_ANALYZE_GROUP_REMOVE,
  MOBILE_APPS_ANALYZE_GROUP_SET,
  MOBILE_APPS_ANALYZE_HIDE_MOBILE_APP_DETAILS_IN_TRACE_VIEW,
  MOBILE_APPS_ANALYZE_NAVIGATE_TO_BACKEND_TRACK_FROM_SESSION,
  MOBILE_APPS_ANALYZE_NAVIGATE_TO_SESSION_FROM_BACKEND_TRACE,
  MOBILE_APPS_ANALYZE_OPEN_SESSION,
  MOBILE_APPS_ANALYZE_SHOW_MOBILE_APP_DETAILS_IN_TRACE_VIEW,
  MOBILE_APPS_DASHBOARD_FILTER_ADD,
  MOBILE_APPS_DASHBOARD_FILTER_CHANGE,
  MOBILE_APPS_DASHBOARD_FILTER_CLEAR,
  MOBILE_APPS_DASHBOARD_FILTER_REMOVE,
  MOBILE_APPS_DASHBOARD_FILTER_SET,
  MOBILE_APPS_DASHBOARD_REMOVE_MOBILE_APP,
  MOBILE_APPS_DASHBOARD_RENAME_MOBILE_APP,
  MOBILE_APPS_DASHBOARD_TAB_CHANGE,
  ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED,
  ANALYZE_UA2_GROUP_CHANGED,
  ANALYZE_UA2_CHART_CHANGED,
  ANALYZE_UA2_API_QUERY_PRESSED,
  ANALYZE_UA2_NESTING_DEPTH
} from 'in-services/tracking/tracking';

// mobile app entry point
export const mobileAppsOpenAddForm = e => track(MOBILE_APPS_OPEN_ADD_FORM, e);
export const addMobileApp = e => track(MOBILE_APPS_ADD_MOBILE_APP, e);

// democratisation dashboard
export const renameMobileApp = e => track(MOBILE_APPS_DASHBOARD_RENAME_MOBILE_APP, e);
export const removeMobileApp = e => track(MOBILE_APPS_DASHBOARD_REMOVE_MOBILE_APP, e);
export const tabChange = e => track(MOBILE_APPS_DASHBOARD_TAB_CHANGE, e);
export const dashboardTagFilters = {
  add: e => track(MOBILE_APPS_DASHBOARD_FILTER_ADD, e),
  change: e => track(MOBILE_APPS_DASHBOARD_FILTER_CHANGE, e),
  remove: e => track(MOBILE_APPS_DASHBOARD_FILTER_REMOVE, e),
  clear: e => track(MOBILE_APPS_DASHBOARD_FILTER_CLEAR, e),
  set: e => track(MOBILE_APPS_DASHBOARD_FILTER_SET, e)
};

// analyze
export const changeAnalyzeMetrics = e => track(MOBILE_APPS_ANALYZE_CHANGE_METRICS, e);
export const showMobileAppDetailsInTraceView = e => track(MOBILE_APPS_ANALYZE_SHOW_MOBILE_APP_DETAILS_IN_TRACE_VIEW, e);
export const hideMobileAppDetailsInTraceView = e => track(MOBILE_APPS_ANALYZE_HIDE_MOBILE_APP_DETAILS_IN_TRACE_VIEW, e);
export const analyzeTagFilters = {
  add: e => track(MOBILE_APPS_ANALYZE_FILTER_ADD, e),
  change: e => track(MOBILE_APPS_ANALYZE_FILTER_CHANGE, e),
  remove: e => track(MOBILE_APPS_ANALYZE_FILTER_REMOVE, e),
  clear: e => track(MOBILE_APPS_ANALYZE_FILTER_CLEAR, e),
  set: e => track(MOBILE_APPS_ANALYZE_FILTER_SET, e)
};
export const analyzeGrouping = {
  remove: e => track(MOBILE_APPS_ANALYZE_GROUP_REMOVE, e),
  set: e => track(MOBILE_APPS_ANALYZE_GROUP_SET, e)
};

// session view
export const openSession = e => track(MOBILE_APPS_ANALYZE_OPEN_SESSION, e);
export const navigateToBackendTraceFromSession = e =>
  track(MOBILE_APPS_ANALYZE_NAVIGATE_TO_BACKEND_TRACK_FROM_SESSION, e);
export const navigateToSessionFromBackendTrace = e =>
  track(MOBILE_APPS_ANALYZE_NAVIGATE_TO_SESSION_FROM_BACKEND_TRACE, e);

export const ua2QueryBuilderFilterAddedTracker = e => track(ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED, e);
export const ua2GroupChangedTracker = e => track(ANALYZE_UA2_GROUP_CHANGED, e);
export const ua2ChartChangedTracker = e => track(ANALYZE_UA2_CHART_CHANGED, e);
export const ua2ApiQueryPressedTracker = e => track(ANALYZE_UA2_API_QUERY_PRESSED, e);
export const ua2NestingDepthTracker = e => track(ANALYZE_UA2_NESTING_DEPTH, e);
