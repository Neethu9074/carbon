/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  WEBSITES_OPEN_ADD_FORM,
  WEBSITES_ADD_WEBSITE,
  WEBSITES_DASHBOARD_REMOVE_WEBSITE,
  WEBSITES_DASHBOARD_TAB_CHANGE,
  WEBSITES_ANALYZE_SHOW_WEBSITE_DETAILS_IN_TRACE_VIEW,
  WEBSITES_ANALYZE_HIDE_WEBSITE_DETAILS_IN_TRACE_VIEW,
  WEBSITES_ANALYZE_NAVIGATE_TO_BACKEND_TRACK_FROM_PAGE_LOAD,
  WEBSITES_ANALYZE_NAVIGATE_TO_PAGE_LOAD_FROM_BACKEND_TRACE,
  WEBSITES_DASHBOARD_RENAME_WEBSITE,
  WEBSITES_DASHBOARD_VIEW_DEPRECATION_DETAILS,
  WEBSITES_DASHBOARD_FILTER_ADD,
  WEBSITES_DASHBOARD_FILTER_CHANGE,
  WEBSITES_DASHBOARD_FILTER_REMOVE,
  WEBSITES_DASHBOARD_FILTER_CLEAR,
  WEBSITES_DASHBOARD_FILTER_SET,
  WEBSITES_ANALYZE_CHANGE_METRICS,
  WEBSITES_ANALYZE_FILTER_ADD,
  WEBSITES_ANALYZE_FILTER_CHANGE,
  WEBSITES_ANALYZE_FILTER_REMOVE,
  WEBSITES_ANALYZE_FILTER_CLEAR,
  WEBSITES_ANALYZE_FILTER_SET,
  WEBSITES_ANALYZE_GROUP_REMOVE,
  WEBSITES_ANALYZE_GROUP_SET,
  ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED,
  ANALYZE_UA2_GROUP_CHANGED,
  ANALYZE_UA2_CHART_CHANGED,
  ANALYZE_UA2_API_QUERY_PRESSED,
  ANALYZE_UA2_NESTING_DEPTH,
  ANALYZE_FILTER_REMOVED
} from 'in-services/tracking/tracking';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';

export interface TrackingFunctions {
  websiteOpenAddFrom: (e?: Object) => void;
  addWebsiteTracker: (e?: Object) => void;
  removeWebsiteTracker: (e?: Object) => void;
  tabChange: (e?: Object) => void;
  showWebsiteDetailsInTraceView: (e?: Object) => void;
  hideWebsiteDetailsInTraceView: (e?: Object) => void;
  navigateToBackendTraceFromPageLoad: (e?: Object) => void;
  navigateToPageLoadFromBackendTrace: (e?: Object) => void;
  viewDeprecationDetails: (e?: Object) => void;
  changeAnalyzeMetrics: (e?: Object) => void;
  ua2QueryBuilderFilterAddedTracker: (e?: Object) => void;
  ua2GroupChangedTracker: (e?: Object) => void;
  ua2ChartChangedTracker: (e?: Object) => void;
  ua2ApiQueryPressedTracker: (e?: Object) => void;
  ua2NestingDepthTracker: (e?: Object) => void;
  ua2FilterRemoved: (e?: Object) => void;
}

export const useWebsiteTracker = (): TrackingFunctions => {
  const { trackCta } = useSegmentTracking();

  // website entry point
  const websiteOpenAddFrom = (e?: Object) => trackCta(WEBSITES_OPEN_ADD_FORM, e);
  const addWebsiteTracker = (e?: Object) => trackCta(WEBSITES_ADD_WEBSITE, e);
  const removeWebsiteTracker = (e?: Object) => trackCta(WEBSITES_DASHBOARD_REMOVE_WEBSITE, e);
  const tabChange = (e?: Object) => trackCta(WEBSITES_DASHBOARD_TAB_CHANGE, e);
  const showWebsiteDetailsInTraceView = (e?: Object) =>
    trackCta(WEBSITES_ANALYZE_SHOW_WEBSITE_DETAILS_IN_TRACE_VIEW, e);
  const hideWebsiteDetailsInTraceView = (e?: Object) =>
    trackCta(WEBSITES_ANALYZE_HIDE_WEBSITE_DETAILS_IN_TRACE_VIEW, e);
  const navigateToBackendTraceFromPageLoad = (e?: Object) =>
    trackCta(WEBSITES_ANALYZE_NAVIGATE_TO_BACKEND_TRACK_FROM_PAGE_LOAD, e);
  const navigateToPageLoadFromBackendTrace = (e?: Object) =>
    trackCta(WEBSITES_ANALYZE_NAVIGATE_TO_PAGE_LOAD_FROM_BACKEND_TRACE, e);
  const viewDeprecationDetails = (e?: Object) => trackCta(WEBSITES_DASHBOARD_VIEW_DEPRECATION_DETAILS, e);
  const changeAnalyzeMetrics = (e?: Object) => trackCta(WEBSITES_ANALYZE_CHANGE_METRICS, e);

  // page load view
  const ua2QueryBuilderFilterAddedTracker = (e?: Object) => trackCta(ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED, e);
  const ua2GroupChangedTracker = (e?: Object) => trackCta(ANALYZE_UA2_GROUP_CHANGED, e);
  const ua2ChartChangedTracker = (e?: Object) => trackCta(ANALYZE_UA2_CHART_CHANGED, e);
  const ua2ApiQueryPressedTracker = (e?: Object) => trackCta(ANALYZE_UA2_API_QUERY_PRESSED, e);
  const ua2NestingDepthTracker = (e?: Object) => trackCta(ANALYZE_UA2_NESTING_DEPTH, e);
  const ua2FilterRemoved = (e?: Object) => trackCta(ANALYZE_FILTER_REMOVED, e);

  return {
    websiteOpenAddFrom,
    addWebsiteTracker,
    removeWebsiteTracker,
    tabChange,
    showWebsiteDetailsInTraceView,
    hideWebsiteDetailsInTraceView,
    navigateToBackendTraceFromPageLoad,
    navigateToPageLoadFromBackendTrace,
    viewDeprecationDetails,
    changeAnalyzeMetrics,
    ua2QueryBuilderFilterAddedTracker,
    ua2GroupChangedTracker,
    ua2ChartChangedTracker,
    ua2ApiQueryPressedTracker,
    ua2NestingDepthTracker,
    ua2FilterRemoved
  };
};

// democratisation dashboard
export const renameWebsite = (trackCta: CtaTrackingFunction) => {
  trackCta(WEBSITES_DASHBOARD_RENAME_WEBSITE);
};

export const dashboardTagFilters = (trackCta: CtaTrackingFunction) => {
  const dashboardFilters = {
    add: (e?: Object) => trackCta(WEBSITES_DASHBOARD_FILTER_ADD, e),
    change: (e?: Object) => trackCta(WEBSITES_DASHBOARD_FILTER_CHANGE, e),
    remove: (e?: Object) => trackCta(WEBSITES_DASHBOARD_FILTER_REMOVE, e),
    clear: (e?: Object) => trackCta(WEBSITES_DASHBOARD_FILTER_CLEAR, e),
    set: (e?: Object) => trackCta(WEBSITES_DASHBOARD_FILTER_SET, e)
  };
  return dashboardFilters;
};

export type DashboardTagFiltersTracker = ReturnType<typeof dashboardTagFilters>;

// analyze
export const analyzeTagFilters = (trackCta: CtaTrackingFunction) => {
  const analyzeFilters = {
    add: (e?: Object) => trackCta(WEBSITES_ANALYZE_FILTER_ADD, e),
    change: (e?: Object) => trackCta(WEBSITES_ANALYZE_FILTER_CHANGE, e),
    remove: (e?: Object) => trackCta(WEBSITES_ANALYZE_FILTER_REMOVE, e),
    clear: (e?: Object) => trackCta(WEBSITES_ANALYZE_FILTER_CLEAR, e),
    set: (e?: Object) => trackCta(WEBSITES_ANALYZE_FILTER_SET, e)
  };
  return analyzeFilters;
};

export const analyzeGrouping = (trackCta: CtaTrackingFunction) => {
  const analyzeGroup = {
    remove: (e?: Object) => trackCta(WEBSITES_ANALYZE_GROUP_REMOVE, e),
    set: (e?: Object) => trackCta(WEBSITES_ANALYZE_GROUP_SET, e)
  };
  return analyzeGroup;
};
