/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  WEBSITES_OPEN_ADD_FORM,
  WEBSITES_ADD_WEBSITE,
  WEBSITES_ANALYZE_CHANGE_METRICS,
  WEBSITES_ANALYZE_FILTER_ADD,
  WEBSITES_ANALYZE_FILTER_CHANGE,
  WEBSITES_ANALYZE_FILTER_CLEAR,
  WEBSITES_ANALYZE_FILTER_REMOVE,
  WEBSITES_ANALYZE_FILTER_SET,
  WEBSITES_ANALYZE_GROUP_REMOVE,
  WEBSITES_ANALYZE_GROUP_SET,
  WEBSITES_ANALYZE_HIDE_WEBSITE_DETAILS_IN_TRACE_VIEW,
  WEBSITES_ANALYZE_NAVIGATE_TO_BACKEND_TRACK_FROM_PAGE_LOAD,
  WEBSITES_ANALYZE_NAVIGATE_TO_PAGE_LOAD_FROM_BACKEND_TRACE,
  WEBSITES_ANALYZE_OPEN_PAGE_LOAD,
  WEBSITES_ANALYZE_SHOW_WEBSITE_DETAILS_IN_TRACE_VIEW,
  WEBSITES_DASHBOARD_FILTER_ADD,
  WEBSITES_DASHBOARD_FILTER_CHANGE,
  WEBSITES_DASHBOARD_FILTER_CLEAR,
  WEBSITES_DASHBOARD_FILTER_REMOVE,
  WEBSITES_DASHBOARD_FILTER_SET,
  WEBSITES_DASHBOARD_REMOVE_WEBSITE,
  WEBSITES_DASHBOARD_RENAME_WEBSITE,
  WEBSITES_DASHBOARD_TAB_CHANGE,
  WEBSITES_DASHBOARD_VIEW_DEPRECATION_DETAILS,
  ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED,
  ANALYZE_UA2_GROUP_CHANGED,
  ANALYZE_UA2_CHART_CHANGED,
  ANALYZE_UA2_API_QUERY_PRESSED,
  ANALYZE_UA2_NESTING_DEPTH,
  ANALYZE_FILTER_REMOVED
} from 'in-services/tracking/tracking';

// website entry point
export const websitesOpenAddForm = (e?: Object) => track(WEBSITES_OPEN_ADD_FORM, e);
export const addWebsite = (e?: Object) => track(WEBSITES_ADD_WEBSITE, e);

// democratisation dashboard
export const renameWebsite = (e?: Object) => track(WEBSITES_DASHBOARD_RENAME_WEBSITE, e);
export const removeWebsite = (e?: Object) => track(WEBSITES_DASHBOARD_REMOVE_WEBSITE, e);
export const viewDeprecationDetails = (e?: Object) => track(WEBSITES_DASHBOARD_VIEW_DEPRECATION_DETAILS, e);
export const tabChange = (e?: Object) => track(WEBSITES_DASHBOARD_TAB_CHANGE, e);
export const dashboardTagFilters = {
  add: (e?: Object) => track(WEBSITES_DASHBOARD_FILTER_ADD, e),
  change: (e?: Object) => track(WEBSITES_DASHBOARD_FILTER_CHANGE, e),
  remove: (e?: Object) => track(WEBSITES_DASHBOARD_FILTER_REMOVE, e),
  clear: (e?: Object) => track(WEBSITES_DASHBOARD_FILTER_CLEAR, e),
  set: (e?: Object) => track(WEBSITES_DASHBOARD_FILTER_SET, e)
};

export type DashboardTagFiltersTracker = typeof dashboardTagFilters;

// analyze
export const changeAnalyzeMetrics = (e?: Object) => track(WEBSITES_ANALYZE_CHANGE_METRICS, e);
export const showWebsiteDetailsInTraceView = (e?: Object) =>
  track(WEBSITES_ANALYZE_SHOW_WEBSITE_DETAILS_IN_TRACE_VIEW, e);
export const hideWebsiteDetailsInTraceView = (e?: Object) =>
  track(WEBSITES_ANALYZE_HIDE_WEBSITE_DETAILS_IN_TRACE_VIEW, e);
export const analyzeTagFilters = {
  add: (e?: Object) => track(WEBSITES_ANALYZE_FILTER_ADD, e),
  change: (e?: Object) => track(WEBSITES_ANALYZE_FILTER_CHANGE, e),
  remove: (e?: Object) => track(WEBSITES_ANALYZE_FILTER_REMOVE, e),
  clear: (e?: Object) => track(WEBSITES_ANALYZE_FILTER_CLEAR, e),
  set: (e?: Object) => track(WEBSITES_ANALYZE_FILTER_SET, e)
};
export const analyzeGrouping = {
  remove: (e?: Object) => track(WEBSITES_ANALYZE_GROUP_REMOVE, e),
  set: (e?: Object) => track(WEBSITES_ANALYZE_GROUP_SET, e)
};

// page load view
export const openPageLoad = (e?: Object) => track(WEBSITES_ANALYZE_OPEN_PAGE_LOAD, e);
export const navigateToBackendTraceFromPageLoad = (e?: Object) =>
  track(WEBSITES_ANALYZE_NAVIGATE_TO_BACKEND_TRACK_FROM_PAGE_LOAD, e);
export const navigateToPageLoadFromBackendTrace = (e?: Object) =>
  track(WEBSITES_ANALYZE_NAVIGATE_TO_PAGE_LOAD_FROM_BACKEND_TRACE, e);

export const ua2QueryBuilderFilterAddedTracker = (e?: Object) => track(ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED, e);
export const ua2GroupChangedTracker = (e?: Object) => track(ANALYZE_UA2_GROUP_CHANGED, e);
export const ua2ChartChangedTracker = (e?: Object) => track(ANALYZE_UA2_CHART_CHANGED, e);
export const ua2ApiQueryPressedTracker = (e?: Object) => track(ANALYZE_UA2_API_QUERY_PRESSED, e);
export const ua2NestingDepthTracker = (e?: Object) => track(ANALYZE_UA2_NESTING_DEPTH, e);
export const ua2FilterRemoved = (e?: Object) => track(ANALYZE_FILTER_REMOVED, e);
