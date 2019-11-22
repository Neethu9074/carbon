import { track as trackInternal } from 'in-services/tracking/trackers';

export function track(event, payload) {
  trackInternal(event, payload);
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
export const APPLICATION_CLICK_SUBMIT = 'application.click.submit';

export const CONNECTION_LOST = 'connection.lost';
export const CONNECTION_ESTABLISHED = 'connection.established';

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

export const TIMELINE_TOGGLE = 'timeline.toggle';
export const TIMELINE_CLICK_ON_EVENT = 'timeline.clickOnEvent';

export const WEBSITES_ADD_WEBSITE = 'websites.addWebsite';
export const WEBSITES_OPEN_ADD_FORM = 'websites.website.add';
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

export const MOBILE_APPS_ADD_MOBILE_APP = 'mobileApps.addMobileApp';
export const MOBILE_APPS_OPEN_ADD_FORM = 'mobileApps.mobileApp.add';
export const MOBILE_APPS_ANALYZE_CHANGE_METRICS = 'mobileApps.analyze.changeMetrics';
export const MOBILE_APPS_ANALYZE_FILTER_ADD = 'mobileApps.analyze.filter.add';
export const MOBILE_APPS_ANALYZE_FILTER_CHANGE = 'mobileApps.analyze.filter.change';
export const MOBILE_APPS_ANALYZE_FILTER_CLEAR = 'mobileApps.analyze.filter.clear';
export const MOBILE_APPS_ANALYZE_FILTER_REMOVE = 'mobileApps.analyze.filter.remove';
export const MOBILE_APPS_ANALYZE_FILTER_SET = 'mobileApps.analyze.filter.set';
export const MOBILE_APPS_ANALYZE_GROUP_REMOVE = 'mobileApps.analyze.group.remove';
export const MOBILE_APPS_ANALYZE_GROUP_SET = 'mobileApps.analyze.group.set';
export const MOBILE_APPS_ANALYZE_HIDE_MOBILE_APP_DETAILS_IN_TRACE_VIEW = 'mobileApps.analyze.hideMobileAppDetailsInTraceView';
export const MOBILE_APPS_ANALYZE_NAVIGATE_TO_BACKEND_TRACK_FROM_PAGE_LOAD =
  'mobileApps.analyze.navigateToBackendTraceFromPageLoad';
export const MOBILE_APPS_ANALYZE_NAVIGATE_TO_PAGE_LOAD_FROM_BACKEND_TRACE =
  'mobileApps.analyze.navigateToPageLoadFromBackendTrace';
export const MOBILE_APPS_ANALYZE_OPEN_PAGE_LOAD = 'mobileApps.analyze.openPageLoad';
export const MOBILE_APPS_ANALYZE_SHOW_MOBILE_APP_DETAILS_IN_TRACE_VIEW = 'mobileApps.analyze.showMobileAppDetailsInTraceView';
export const MOBILE_APPS_DASHBOARD_FILTER_ADD = 'mobileApps.dashboard.filter.add';
export const MOBILE_APPS_DASHBOARD_FILTER_CHANGE = 'mobileApps.dashboard.filter.change';
export const MOBILE_APPS_DASHBOARD_FILTER_CLEAR = 'mobileApps.dashboard.filter.clear';
export const MOBILE_APPS_DASHBOARD_FILTER_REMOVE = 'mobileApps.dashboard.filter.remove';
export const MOBILE_APPS_DASHBOARD_FILTER_SET = 'mobileApps.dashboard.filter.set';
export const MOBILE_APPS_DASHBOARD_REMOVE_MOBILE_APP = 'mobileApps.dashboard.removeMobileApp';
export const MOBILE_APPS_DASHBOARD_RENAME_MOBILE_APP = 'mobileApps.dashboard.renameMobileApp';
export const MOBILE_APPS_DASHBOARD_TAB_CHANGE = 'mobileApps.dashboard.tabChange';
export const MOBILE_APPS_DASHBOARD_VIEW_DEPRECATION_DETAILS = 'mobileApps.dashboard.viewDeprecationDetails';

export const SETTINGS_USER_INVITE_SUBMIT = 'settings.user.invite.submit';
export const SETTINGS_ROLE_SUBMIT = 'settings.role.submit';
export const SETTINGS_ROLE_OPEN_SUBMIT_FORM = 'settings.role.new';
export const SETTINGS_ALERT_CHANNEL_SUBMIT = 'settings.alertChannel.submit';
export const SETTINGS_ALERT_CHANNEL_OPEN_SUBMIT_FORM = 'settings.alertChannel.new';
export const SETTINGS_ALERT_SUBMIT = 'settings.alert.submit';
export const SETTINGS_ALERT_TOGGLE = 'settings.alert.toggle';
export const SETTINGS_ALERT_OPEN_SUBMIT_FORM = 'settings.alert.new';
export const SETTINGS_EVENT_VIEW = 'settings.event.custom.view';
export const SETTINGS_EVENT_SUBMIT = 'settings.event.submit';
export const SETTINGS_EVENT_OPEN_SUBMIT_FORM = 'settings.event.new';

export const PROFILES_ANALYZE_FILTER_ADD = 'profiles.analyze.filter.add';
export const PROFILES_ANALYZE_FILTER_CHANGE = 'profiles.analyze.filter.change';
export const PROFILES_ANALYZE_FILTER_CLEAR = 'profiles.analyze.filter.clear';
export const PROFILES_ANALYZE_FILTER_REMOVE = 'profiles.analyze.filter.remove';
export const PROFILES_ANALYZE_FILTER_SET = 'profiles.analyze.filter.set';
export const PROFILES_ANALYZE_GROUP_REMOVE = 'profiles.analyze.group.remove';
export const PROFILES_ANALYZE_GROUP_SET = 'profiles.analyze.group.set';

export const ONBOARDING_INSTANA_BEGINNER_VIDEOS_CLICKED = 'onboarding.instana.beginner.videos.clicked';
export const ONBOARDING_HELP_AND_SUPPORT_CLICKED = 'onboarding.help.and.support.clicked';
export const ONBOARDING_MAIN_TOPIC_CHANGED = 'onboarding.main.topic.changed';
export const ONBOARDING_SUB_TOPIC_CHANGED = 'onboarding.sub.topic.changed';
export const ONBOARDING_SEARCH_QUERY_CHANGED = 'onboarding.search.query.changed';
