import { createTracker } from 'in-services/tracking/mixpanel';

// website entry point
export const addWebsite = createTracker('websites.addWebsite');
export const returnToClassicTracker = createTracker('websites.returnToClassic');

// democratisation dashboard
export const renameWebsite = createTracker('websites.dashboard.renameWebsite');
export const removeWebsite = createTracker('websites.dashboard.removeWebsite');
export const viewDeprecationDetails = createTracker('websites.dashboard.viewDeprecationDetails');
export const tabChange = createTracker('websites.dashboard.tabChange');
export const dashboardTagFilters = {
  add: createTracker('websites.dashboard.filter.add'),
  change: createTracker('websites.dashboard.filter.change'),
  remove: createTracker('websites.dashboard.filter.remove'),
  clear: createTracker('websites.dashboard.filter.clear'),
  set: createTracker('websites.dashboard.filter.set')
};

// analyze
export const changeAnalyzeMetrics = createTracker('websites.analyze.changeMetrics');
export const analyzeTagFilters = {
  add: createTracker('websites.analyze.filter.add'),
  change: createTracker('websites.analyze.filter.change'),
  remove: createTracker('websites.analyze.filter.remove'),
  clear: createTracker('websites.analyze.filter.clear'),
  set: createTracker('websites.analyze.filter.set')
};
export const analyzeGrouping = {
  remove: createTracker('websites.analyze.group.remove'),
  set: createTracker('websites.analyze.group.set')
};

// page load view
export const openPageLoad = createTracker('websites.analyze.openPageLoad');
export const navigateToBackendTraceFromPageLoad = createTracker('websites.analyze.navigateToBackendTraceFromPageLoad');
export const navigateToPageLoadFromBackendTrace = createTracker('websites.analyze.navigateToPageLoadFromBackendTrace');
