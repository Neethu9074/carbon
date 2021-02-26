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
  ANALYZE_UA2_NESTING_DEPTH
} from 'in-services/tracking/tracking';

// website entry point
export const websitesOpenAddForm = e => track(WEBSITES_OPEN_ADD_FORM, e);
export const addWebsite = e => track(WEBSITES_ADD_WEBSITE, e);

// democratisation dashboard
export const renameWebsite = e => track(WEBSITES_DASHBOARD_RENAME_WEBSITE, e);
export const removeWebsite = e => track(WEBSITES_DASHBOARD_REMOVE_WEBSITE, e);
export const viewDeprecationDetails = e => track(WEBSITES_DASHBOARD_VIEW_DEPRECATION_DETAILS, e);
export const tabChange = e => track(WEBSITES_DASHBOARD_TAB_CHANGE, e);
export const dashboardTagFilters = {
  add: e => track(WEBSITES_DASHBOARD_FILTER_ADD, e),
  change: e => track(WEBSITES_DASHBOARD_FILTER_CHANGE, e),
  remove: e => track(WEBSITES_DASHBOARD_FILTER_REMOVE, e),
  clear: e => track(WEBSITES_DASHBOARD_FILTER_CLEAR, e),
  set: e => track(WEBSITES_DASHBOARD_FILTER_SET, e)
};

// analyze
export const changeAnalyzeMetrics = e => track(WEBSITES_ANALYZE_CHANGE_METRICS, e);
export const showWebsiteDetailsInTraceView = e => track(WEBSITES_ANALYZE_SHOW_WEBSITE_DETAILS_IN_TRACE_VIEW, e);
export const hideWebsiteDetailsInTraceView = e => track(WEBSITES_ANALYZE_HIDE_WEBSITE_DETAILS_IN_TRACE_VIEW, e);
export const analyzeTagFilters = {
  add: e => track(WEBSITES_ANALYZE_FILTER_ADD, e),
  change: e => track(WEBSITES_ANALYZE_FILTER_CHANGE, e),
  remove: e => track(WEBSITES_ANALYZE_FILTER_REMOVE, e),
  clear: e => track(WEBSITES_ANALYZE_FILTER_CLEAR, e),
  set: e => track(WEBSITES_ANALYZE_FILTER_SET, e)
};
export const analyzeGrouping = {
  remove: e => track(WEBSITES_ANALYZE_GROUP_REMOVE, e),
  set: e => track(WEBSITES_ANALYZE_GROUP_SET, e)
};

// page load view
export const openPageLoad = e => track(WEBSITES_ANALYZE_OPEN_PAGE_LOAD, e);
export const navigateToBackendTraceFromPageLoad = e =>
  track(WEBSITES_ANALYZE_NAVIGATE_TO_BACKEND_TRACK_FROM_PAGE_LOAD, e);
export const navigateToPageLoadFromBackendTrace = e =>
  track(WEBSITES_ANALYZE_NAVIGATE_TO_PAGE_LOAD_FROM_BACKEND_TRACE, e);

export const ua2QueryBuilderFilterAddedTracker = e => track(ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED, e);
export const ua2GroupChangedTracker = e => track(ANALYZE_UA2_GROUP_CHANGED, e);
export const ua2ChartChangedTracker = e => track(ANALYZE_UA2_CHART_CHANGED, e);
export const ua2ApiQueryPressedTracker = e => track(ANALYZE_UA2_API_QUERY_PRESSED, e);
export const ua2NestingDepthTracker = e => track(ANALYZE_UA2_NESTING_DEPTH, e);
