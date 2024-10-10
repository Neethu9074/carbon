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
  WEBSITES_ANALYZE_NAVIGATE_TO_PAGE_LOAD_FROM_BACKEND_TRACE
} from 'in-services/tracking/tracking';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';

export const websiteOpenAddFrom = (trackCta: CtaTrackingFunction) => {
  trackCta(WEBSITES_OPEN_ADD_FORM);
};

export const addWebsite = (trackCta: CtaTrackingFunction) => {
  trackCta(WEBSITES_ADD_WEBSITE);
};

export const removeWebsite = (trackCta: CtaTrackingFunction, _websiteName: { websiteName: string }) => {
  trackCta(WEBSITES_DASHBOARD_REMOVE_WEBSITE);
};

export const tabChange = (trackCta: CtaTrackingFunction) => {
  trackCta(WEBSITES_DASHBOARD_TAB_CHANGE);
};

export const showWebsiteDetailsInTraceView = (trackCta: CtaTrackingFunction) => {
  trackCta(WEBSITES_ANALYZE_SHOW_WEBSITE_DETAILS_IN_TRACE_VIEW);
};

export const hideWebsiteDetailsInTraceView = (trackCta: CtaTrackingFunction) => {
  trackCta(WEBSITES_ANALYZE_HIDE_WEBSITE_DETAILS_IN_TRACE_VIEW);
};

export const navigateToBackendTraceFromPageLoad = (trackCta: CtaTrackingFunction) => {
  trackCta(WEBSITES_ANALYZE_NAVIGATE_TO_BACKEND_TRACK_FROM_PAGE_LOAD);
};

export const navigateToPageLoadFromBackendTrace = (trackCta: CtaTrackingFunction) => {
  trackCta(WEBSITES_ANALYZE_NAVIGATE_TO_PAGE_LOAD_FROM_BACKEND_TRACE);
};
