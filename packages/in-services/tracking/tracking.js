import { createTracker } from 'in-services/tracking/mixpanel';

const registeredTrackers = new Map();

function getTracker(name) {
  if (!registeredTrackers.has(name)) {
    registeredTrackers.set(name, createTracker(name));
  }
  return registeredTrackers.get(name);
}

export function track(event, payload) {
  getTracker(event)(payload);
}

export const ANALYZE_CALL_CLICK = 'analyze.call.click';
export const ANALYZE_DETAIL_CALL_CLICK = 'analyze.detail.call.click';
export const ANALYZE_FILTER_ADDED = 'analyze.filter.added';
export const ANALYZE_FILTER_CHANGED = 'analyze.filter.changed';
export const ANALYZE_FILTER_CLEARED = 'analyze.filter.cleared';
export const ANALYZE_FILTER_REMOVED = 'analyze.filter.removed';
export const ANALYZE_GROUP_ADDED = 'analyze.group.added';
export const ANALYZE_GROUP_CHANGED = 'analyze.group.changed';
export const ANALYZE_GROUP_CLICK = 'analyze.group.click';
export const ANALYZE_GROUP_REMOVED = 'analyze.group.removed';
export const ANALYZE_METRIC_CHANGED = 'analyze.metric.changed';
export const ANALYZE_TRACE_CLICK = 'analyze.trace.click';

export const APPLICATION_CLICK_CREATE = 'application.click.create';

export const DYNAMIC_FOCUS_QUERY = 'dynamic.focus.query';
export const KUBERNETES_DASHBOARD_TAB_CHANGE = 'kubernetes.dashboard.tabChange';
export const IS_MONITORING_HOSTS = 'isMonitoringHosts';
export const MAP_GROUPING_CHANGED = 'map.grouping.change';
export const MAP_METRICS_AGGREGATION = 'map.metrics.aggregation';
export const MAP_METRICS_SHOW = 'map.metrics.show';
export const MAP_SELECT_ENTITY = 'map.select.entity';
export const NAVIGATION_BREADCRUMB = 'navigation.breadcrumb';
export const NODEJS_CPU_PROFILING_START = 'nodejs.cpuProfiling.start';
export const NODEJS_CPU_PROFILING_TOGGLE_NODE = 'nodejs.cpuProfiling.toggleNode';
export const REQUEST_QUOTE_BUTTON_CLICKED = 'requestQuote.buttonClicked';
export const REQUEST_QUOTE_SUBMITTED = 'requestQuote.submitted';
export const TIME_WINDOW_SIZE_VIA_PICKER = 'time.windowSize.viaPicker';
export const TIME_WINDOW_SIZE_VIA_ZOOM = 'time.windowSize.viaZoom';
export const TOPLIST_METRIC_CHANGED = 'toplist.metricChanged';
export const TOPLIST_ROW_NAVIGATION = 'toplist.rowNavigation';
export const USER_INVITE = 'user.invite';

export const TABLE_ENTITY_ADDED = 'table.entity.added';
export const TABLE_ENTITY_CLEARED = 'table.entity.cleared';
export const TABLE_ENTITY_REMOVED = 'table.entity.removed';
export const TABLE_METRIC_ADDED = 'table.metric.added';
export const TABLE_METRIC_CLEARED = 'table.metric.cleared';
export const TABLE_METRIC_REMOVED = 'table.metric.removed';
export const TABLE_TYPE_CHANGED = 'table.type.changed';

export const WEBSITES_ADD_WEBSITE = 'websites.addWebsite';
export const WEBSITES_ANALYZE_CHANGE_METRICS = 'websites.analyze.changeMetrics';
export const WEBSITES_ANALYZE_FILTER_ADD = 'websites.analyze.filter.add';
export const WEBSITES_ANALYZE_FILTER_CHANGE = 'websites.analyze.filter.change';
export const WEBSITES_ANALYZE_FILTER_CLEAR = 'websites.analyze.filter.clear';
export const WEBSITES_ANALYZE_FILTER_REMOVE = 'websites.analyze.filter.remove';
export const WEBSITES_ANALYZE_FILTER_SET = 'websites.analyze.filter.set';
export const WEBSITES_ANALYZE_GROUP_REMOVE = 'websites.analyze.group.remove';
export const WEBSITES_ANALYZE_GROUP_SET = 'websites.analyze.group.set';
export const WEBSITES_ANALYZE_HIDE_WEBSITE_DETAILS_IN_TRACE_VIEW = 'websites.analyze.hideWebsiteDetailsInTraceView';
export const WEBSITES_ANALYZE_NAVIGATE_TO_BACKEND_TRACK_FROM_PAGE_LOAD =
  'websites.analyze.navigateToBackendTraceFromPageLoad';
export const WEBSITES_ANALYZE_NAVIGATE_TO_PAGE_LOAD_FROM_BACKEND_TRACE =
  'websites.analyze.navigateToPageLoadFromBackendTrace';
export const WEBSITES_ANALYZE_OPEN_PAGE_LOAD = 'websites.analyze.openPageLoad';
export const WEBSITES_ANALYZE_SHOW_WEBSITE_DETAILS_IN_TRACE_VIEW = 'websites.analyze.showWebsiteDetailsInTraceView';
export const WEBSITES_DASHBOARD_FILTER_ADD = 'websites.dashboard.filter.add';
export const WEBSITES_DASHBOARD_FILTER_CHANGE = 'websites.dashboard.filter.change';
export const WEBSITES_DASHBOARD_FILTER_CLEAR = 'websites.dashboard.filter.clear';
export const WEBSITES_DASHBOARD_FILTER_REMOVE = 'websites.dashboard.filter.remove';
export const WEBSITES_DASHBOARD_FILTER_SET = 'websites.dashboard.filter.set';
export const WEBSITES_DASHBOARD_REMOVE_WEBSITE = 'websites.dashboard.removeWebsite';
export const WEBSITES_DASHBOARD_RENAME_WEBSITE = 'websites.dashboard.renameWebsite';
export const WEBSITES_DASHBOARD_TAB_CHANGE = 'websites.dashboard.tabChange';
export const WEBSITES_DASHBOARD_VIEW_DEPRECATION_DETAILS = 'websites.dashboard.viewDeprecationDetails';
export const WEBSITES_RETURN_TO_CLASSIC = 'websites.returnToClassic';
