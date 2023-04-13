/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export const VIEW_CHANGE = 'page.view';
export const PAGE_SCROLLED_BOTTOM = 'page.scrolled.bottom';

export const URL_SHORTENER_OPEN = 'url.shortener.open';

export const CUSTOM_DASHBOARD_CREATE = 'custom.dashboard.create';
export const CUSTOM_DASHBOARD_SHARE = 'custom.dashboard.share';
export const CUSTOM_DASHBOARD_EDIT = 'custom.dashboard.edit';
export const CUSTOM_DASHBOARD_DELETE = 'custom.dashboard.delete';
export const CUSTOM_DASHBOARD_ADD_WIDGET_START = 'custom.dashboard.add.widget.start';
export const CUSTOM_DASHBOARD_ADD_WIDGET_FINISH = 'custom.dashboard.add.widget.finish';
export const CUSTOM_DASHBOARD_ADD_WIDGET_DUPLICATE = 'custom.dashboard.add.widget.duplicate';
export const CUSTOM_DASHBOARD_EDIT_WIDGET_START = 'custom.dashboard.edit.widget.start';
export const CUSTOM_DASHBOARD_EDIT_WIDGET_CANCEL = 'custom.dashboard.edit.widget.cancel';
export const CUSTOM_DASHBOARD_EDIT_WIDGET_FINISH = 'custom.dashboard.edit.widget.finish';
export const CUSTOM_DASHBOARD_DELETE_WIDGET = 'custom.dashboard.delete.widget';
export const CUSTOM_DASHBOARD_VIEW_WIDGET = 'custom.dashboard.view.widget';

export const ANALYZE_VIEW_SELECTED = 'analyze.view.selected';
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
export const ANALYZE_LATENCY_PERCENTILE_MENU_CLICK = 'analyze.latency.percentile.click';
export const ANALYZE_LATENCY_SELECTION_CHANGED = 'analyze.latency.selection.changed';
export const ANALYZE_DOCS_LINK_OPENED = 'analyze.header.docs.click';

export const ANALYZE_UA2_FACETED_SEARCH_FILTER_ADDED = 'analyze.ua2.facetedSearch.filter.added';
export const ANALYZE_UA2_FACETED_SEARCH_GROUP_CHANGED = 'analyze.ua2.facetedSearch.group.changed';
export const ANALYZE_UA2_FACETED_SEARCH_GROUP_REMOVED = 'analyze.ua2.facetedSearch.group.removed';
export const ANALYZE_UA2_FACETED_SEARCH_SYNTHETIC_CALLS_TOGGLED = 'analyze.ua2.facetedSearch.synthetic.calls.toggled';
export const ANALYZE_UA2_FACETED_SEARCH_INTERNAL_CALLS_TOGGLED = 'analyze.ua2.facetedSearch.internal.calls.toggled';
export const ANALYZE_UA2_FACETED_SEARCH_FILTER_OPENED = 'analyze.ua2.facetedSearch.filter.opened';
export const ANALYZE_UA2_FACETED_SEARCH_FILTER_CLOSED = 'analyze.ua2.facetedSearch.filter.closed';
export const ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED = 'analyze.ua2.queryBuilder.filter.added';
export const ANALYZE_UA2_GROUP_CHANGED = 'analyze.ua2.group.changed';
export const ANALYZE_UA2_CHART_CHANGED = 'analyze.ua2.chart.changed';
export const ANALYZE_UA2_CHART_REMOVED = 'analyze.ua2.chart.removed';
export const ANALYZE_UA2_METRIC_ADDED = 'analyze.ua2.metric.added';
export const ANALYZE_UA2_METRIC_REMOVED = 'analyze.ua2.metric.removed';
export const ANALYZE_UA2_ORDER_BY_CHANGED = 'analyze.ua2.orderBy.changed';
export const ANALYZE_UA2_ORDER_BY_GROUP_CHANGED = 'analyze.ua2.orderByGroup.changed';
export const ANALYZE_UA2_API_QUERY_PRESSED = 'analyze.ua2.apiQuery.pressed';
export const ANALYZE_UA2_NESTING_DEPTH = 'analyze.ua2.nesting.depth';
export const ANALYZE_UA2_FAST_QUERY_MODE_CHANGED = 'analyze.ua2.fastQueryMode.changed';

export const ANALYZE_UA2_FORMMODEL_CHANGED = 'analyze.ua2.formmodel.changed';
export const ANALYZE_UA2_FACETS_CHANGED = 'analyze.ua2.facets.changed';
export const ANALYZE_UA2_LOAD_MORE = 'anaylze.ua2.loaded.more';
export const ANALYZE_TRACE_VIEW_CLOSED = 'analyze.trace.view.closed';
export const ANALYZE_TRACE_VIEW_NAVIGATE_TO_UA = 'analyze.trace.view.navigate.ua';
export const ANALYZE_TRACE_VIEW_TRACE_LIST_CLICK = 'analyze.trace.view.trace.list.click';
export const ANALYZE_TRACE_VIEW_SERVICE_ENDPOINT_LIST_CLICK = 'analyze.trace.view.service.endpoint.list.click';
export const ANALYZE_TRACE_VIEW_TREE_CALL_CLICK = 'analyze.trace.view.call.tree.click';
export const ANALYZE_TRACE_VIEW_TIMELINE_CALL_CLICK = 'analyze.trace.view.call.timeline.click';

export const APPLICATION_CLICK_CREATE = 'application.click.create';
export const APPLICATION_CLICK_SUBMIT = 'application.click.submit';
export const APPLICATION_CLICK_SOURCE_OR_DESTINATION = 'application.click.changeSourceOrDestination';
export const APPLICATION_LATENCY_JUMP_TO_UNBOUNDED_ANALYTICS = 'application.click.latency.jumpToUA';
export const APPLICATION_TIME_SHIFT_SELECT = 'application.timeShift.select';

export const APPLICATION_CREATION_OPEN_DIALOG_CLICK = 'application.creation.open.dialog.click';
export const APPLCATION_CREATION_CLOSE_DIALOG_CLICK = 'application.creation.close.dialog.click';
export const APPLICATION_CREATION_STEP_SWITCH = 'application.creation.step.switch';
export const APPLICATION_CREATION_MODE_SWITCH = 'application.creation.mode.switch';
export const APPLICATION_CREATION_CREATE_CLICK = 'application.creation.create.click';
export const APPLICATION_CREATION_SELECTED_BLUEPRINT = 'application.creation.selected.blueprint';
export const APPLICATION_CREATION_ADD_TAG = 'application.creation.add.tag';
export const APPLICATION_CREATION_REMOVE_TAG = 'application.creation.remove.tag';
export const APPLICATION_CREATION_BOUNDARY_SCOPE_SELECT = 'application.creation.boundary.scope.select';
export const APPLICATION_CREATION_SCOPE_SELECT = 'application.creation.scope.select';

export const DYNAMIC_FOCUS_QUERY = 'dynamic.focus.query';
export const DFQ_FILTER_SAVED = 'dfq.filter.saved';
export const DFQ_FILTER_EDITED = 'dfq.filter.edited';
export const DFQ_FILTER_REMOVED = 'dfq.filter.removed';
export const DFQ_FILTER_SELECTED = 'dfq.filter.selected';

export const KUBERNETES_DASHBOARD_TAB_CHANGE = 'kubernetes.dashboard.tabChange';
export const KUBERNETES_TIME_SHIFT_SELECT = 'kubernetes.timeShift.select';
export const IS_MONITORING_HOSTS = 'isMonitoringHosts';
export const MAP_GROUPING_CHANGED = 'map.grouping.change';
export const MAP_METRICS_AGGREGATION = 'map.metrics.aggregation';
export const MAP_METRICS_SHOW = 'map.metrics.show';
export const MAP_SELECT_ENTITY = 'map.select.entity';
export const NAVIGATION_BREADCRUMB = 'navigation.breadcrumb';
export const REQUEST_QUOTE_BUTTON_CLICKED = 'purchaseIntent.quote';
export const REQUEST_QUOTE_SUBMITTED = 'requestQuote.submitted';
export const TIME_WINDOW_SIZE_VIA_PICKER = 'time.windowSize.viaPicker';
export const TIME_LIVE_MODE = 'time.liveMode';
export const TOPLIST_METRIC_CHANGED = 'toplist.metricChanged';
export const TOPLIST_ROW_NAVIGATION = 'toplist.rowNavigation';
export const USER_INVITE = 'user.invite';
export const BUY_NOW_BUTTON_CLICKED = 'purchaseIntent.aws';

export const TABLE_ENTITY_ADDED = 'table.entity.added';
export const TABLE_ENTITY_CLEARED = 'table.entity.cleared';
export const TABLE_ENTITY_REMOVED = 'table.entity.removed';
export const TABLE_METRIC_ADDED = 'table.metric.added';
export const TABLE_METRIC_CLEARED = 'table.metric.cleared';
export const TABLE_METRIC_REMOVED = 'table.metric.removed';
export const TABLE_TYPE_CHANGED = 'table.type.changed';

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

export const WEBSITES_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE = 'websites.alerting.event.details.goToAnalyze';
export const WEBSITES_ALERTING_EVENT_DETAILS_VIEW_EDIT_CONFIG = 'websites.alerting.event.details.ViewEditConfig';

export const APPLICATIONS_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE = 'applications.alerting.event.details.goToAnalyze';
export const APPLICATIONS_ALERTING_EVENT_DETAILS_VIEW_EDIT_CONFIG =
  'applications.alerting.event.details.ViewEditConfig';

export const APPLICATIONS_ALERTING_SHOW_DEPRECATION_BANNER = 'applications.alerting.migration.deprecation.banner';
export const APPLICATIONS_ALERTING_SHOW_MIGRATION_NOTIFICATION = 'applications.alerting.show.migration.notification';
export const APPLICATIONS_ALERTING_MIGRATION_BANNER_DOCS = 'applications.alerting.migration.banner.docs';
export const APPLICATIONS_ALERTING_MIGRATION_NOTIFICATION_DOCS = 'applications.alerting.migration.notification.docs';

export const APPLICATIONS_ALERTING_MIGRATION_BANNER_EVENTS = 'applications.alerting.migration.banner.events';
export const APPLICATIONS_ALERTING_MIGRATION_NOTIFICATION_EVENTS =
  'applications.alerting.migration.notification.events';
export const APPLICATIONS_ALERTING_DEPRECATED_EVENT_OPEN = 'applications.alerting.deprecated.event.open';
export const APPLICATIONS_ALERTING_DEPRECATED_EVENT_MARK_MIGRATED =
  'applications.alerting.deprecated.event.mark.migrated';
export const APPLICATIONS_ALERTING_DEPRECATED_EVENT_CONFIRM_MIGRATED =
  'applications.alerting.deprecated.event.confirm.migrated';
export const APPLICATIONS_ALERTING_DEPRECATED_EVENT_MIGRATE_STARTED =
  'applications.alerting.deprecated.event.migrate.started';
export const APPLICATIONS_ALERTING_DEPRECATED_EVENT_MIGRATE_FINISHED =
  'applications.alerting.deprecated.event.migrate.finished';

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
export const MOBILE_APPS_ANALYZE_HIDE_MOBILE_APP_DETAILS_IN_TRACE_VIEW =
  'mobileApps.analyze.hideMobileAppDetailsInTraceView';
export const MOBILE_APPS_ANALYZE_NAVIGATE_TO_BACKEND_TRACK_FROM_SESSION =
  'mobileApps.analyze.navigateToBackendTraceFromSession';
export const MOBILE_APPS_ANALYZE_NAVIGATE_TO_SESSION_FROM_BACKEND_TRACE =
  'mobileApps.analyze.navigateToSessionFromBackendTrace';
export const MOBILE_APPS_ANALYZE_OPEN_SESSION = 'mobileApps.analyze.openSession';
export const MOBILE_APPS_ANALYZE_SHOW_MOBILE_APP_DETAILS_IN_TRACE_VIEW =
  'mobileApps.analyze.showMobileAppDetailsInTraceView';
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
export const SETTINGS_ALERT_CUSTOM_PAYLOAD_SUBMIT = 'settings.alert.customPayload.submit';
export const SETTINGS_ALERT_CUSTOM_PAYLOAD_ADD_ITEM = 'settings.alert.customPayload.addItem';
export const SETTINGS_ALERT_CUSTOM_PAYLOAD_EDIT_ITEM = 'settings.alert.customPayload.editItem';
export const SETTINGS_ALERT_CUSTOM_PAYLOAD_REMOVE_ITEM = 'settings.alert.customPayload.removeItem';
export const SETTINGS_EVENT_VIEW = 'settings.event.custom.view';
export const SETTINGS_EVENT_SUBMIT = 'settings.event.submit';
export const SETTINGS_EVENT_OPEN_SUBMIT_FORM = 'settings.event.new';
export const SETTINGS_AUTOMATION_ACTION_CREATE = 'settings.automation.action.create';
export const SETTINGS_AUTOMATION_ACTION_EDIT = 'settings.automation.action.edit';
export const SETTINGS_AUTOMATION_ACTION_DELETE = 'settings.automation.action.delete';
export const SETTINGS_MAINTENANCE_WINDOW_EDIT = 'settings.maintenance.edit';
export const SETTINGS_MAINTENANCE_WINDOW_NEW = 'settings.maintenance.new';
export const SETTINGS_MAINTENANCE_WINDOW_SUBMIT = 'settings.maintenance.submit';
export const SETTINGS_MAINTENANCE_WINDOW_REMOVE = 'settings.maintenance.remove';
export const SETTINGS_MAINTENANCE_WINDOW_CANCEL = 'settings.maintenance.cancel';

export const ONBOARDING_OPENED = 'onboardingNewUnit.dialog.opened';
export const ONBOARDING_INSTANA_BEGINNER_VIDEOS_CLICKED = 'onboardingNewUnit.instanaBeginnerVideos.clicked';
export const ONBOARDING_HELP_AND_SUPPORT_CLICKED = 'onboardingNewUnit.helpAndSupport.clicked';
export const ONBOARDING_MAIN_TOPIC_CHANGED = 'onboardingNewUnit.mainTopic.changed';
export const ONBOARDING_SUB_TOPIC_CHANGED = 'onboardingNewUnit.subTopic.changed';
export const ONBOARDING_SEARCH_QUERY_CHANGED = 'onboardingNewUnit.searchQuery.changed';

export const PROFILING_OVERVIEW_OPENED = 'profiling.overview.openend';
export const PROFILING_CPU_TREEVIEW_OPENEND = 'profiling.cpu.treeView.openend';
export const PROFILING_CPU_FLAMEGRAPH_OPENEND = 'profiling.cpu.flameGraph.openend';
export const PROFILING_WAITTIME_TREEVIEW_OPENEND = 'profiling.waitTime.treeView.openend';
export const PROFILING_WAITTIME_FLAMEGRAPH_OPENEND = 'profiling.waitTime.flameGraph.openend';
export const PROFILING_MEMORY_TREEVIEW_OPENEND = 'profiling.memory.treeView.openend';
export const PROFILING_MEMORY_FLAMEGRAPH_OPENEND = 'profiling.memory.flameGraph.openend';
export const PROFILING_TREEVIEW_EXPANDED = 'profiling.treeView.expanded';

export const INFRASTRUCTURE_CONTEXT_GUIDE_STACK_LOADED = 'infrastructure.context.guide.stack.loaded';
export const INFRASTRUCTURE_SIDEBAR_RELATED_ENTITIES_EXPANDED = 'infrastructure.sidebar.related.entities.expanded';
export const INFRASTRUCTURE_SIDEBAR_RELATED_ENTITIES_CLICKED = 'infrastructure.sidebar.related.entities.clicked';
export const INFRA_EXPLORE_TYPE_SELECTOR_STATE_CHANGED = 'infra.explore.type.selector.state.changed';
export const INFRA_EXPLORE_FILTER_ADDED = 'infra.explore.filter.added';
export const INFRA_EXPLORE_FILTER_REMOVED = 'infra.explore.filter.removed';
export const INFRA_EXPLORE_FILTERS_CLEARED = 'infra.explore.filters.cleared';
export const INFRA_EXPLORE_GROUP_ADDED = 'infra.explore.group.added';
export const INFRA_EXPLORE_GROUP_REMOVED = 'infra.explore.group.removed';
export const INFRA_EXPLORE_GROUP_EXPANDED = 'infra.explore.group.expanded';
export const INFRA_EXPLORE_GROUP_COLLAPSED = 'infra.explore.group.collapsed';
export const INFRA_EXPLORE_GROUP_FOCUSED_ON = 'infra.explore.group.focused.on';
export const INFRA_EXPLORE_NAVIGATE_TO_ENTITY_DASHBOARD = 'infra.explore.navigate.to.entity.dashboard';
export const INFRA_EXPLORE_LOAD_MORE = 'infra.explore.load.more';
export const INFRA_EXPLORE_METRIC_ADDED = 'infra.explore.metric.added';
export const INFRA_EXPLORE_METRIC_REMOVED = 'infra.explore.metric.removed';
export const INFRA_EXPLORE_METRIC_AGGREGATION_CHANGED = 'infra.explore.metric.aggregation.changed';
export const INFRA_EXPLORE_SORTED = 'infra.explore.sorted';

export const AMP_TENANT_UNIT_CHANGED = 'amp.tenant.unit.metrics.changed';

export const AGENT_LOGS_DOWNLOAD_CLICKED = 'agent.logs.download.clicked';
export const AGENT_REBOOT_CLICKED = 'agent.reboot.clicked';
export const AGENT_RESET_CLICKED = 'agent.reset.clicked';
export const AGENT_UPDATE_CLICKED = 'agent.update.clicked';
export const AGENT_SENSOR_RESET_INTERNAL_CLICKED = 'agent.internal.reset.sensors.clicked';
export const AGENTS_RESET_ALL_AGENTS_INTERNAL_CLICKED = 'agents.internal.reset.all.clicked';
export const AGENTS_UPDATE_ALL_AGENTS_INTERNAL_CLICKED = 'agents.internal.update.all.clicked';

// Potential Problems Marker Lane
export const POTENTIAL_PROBLEMS_MARKER_HOVERED = 'potential.problems.marker.hovered';
export const POTENTIAL_PROBLEMS_MARKER_CLICKED = 'potential.problems.marker.clicked';
export const POTENTIAL_PROBLEMS_SMART_ALERT_CREATE = 'potential.problems.smartalert.create';
export const POTENTIAL_PROBLEMS_GO_TO_ANALYZE = 'potential.problems.goto.analyze';
export const POTENTIAL_PROBLEMS_REQUEST_LOADING_TIME = 'potential.problems.request.loading.time';
export const POTENTIAL_PROBLEMS_SELECTED = 'potential.problems.selected';
export const POTENTIAL_PROBLEMS_DIALOG_CLOSED = 'potential.problems.dialog.closed';

// Alert Preview Marker Lane
export const ALERT_PREVIEW_MARKER_FETCH_RETRY = 'alert.preview.marker.fetch.retry';

// SLI Widget and SLI Management
export const SLO_WIDGET_EDIT_START = 'slo.widget.edit.start';
export const SLI_MANAGEMENT_VIEW = 'sli.v2.management.view';
export const SLI_MANAGEMENT_EXIT = 'sli.v2.management.exit';
export const SLI_MANAGEMENT_CREATE_START = 'sli.v2.management.create.start';
export const SLI_MANAGEMENT_CREATE_FINISH = 'sli.v2.management.create.finish';
export const SLI_MANAGEMENT_EDIT_START = 'sli.v2.management.edit.start';
export const SLI_MANAGEMENT_EDIT_FINISH = 'sli.v2.management.edit.finish';
export const SLI_MANAGEMENT_DELETE = 'sli.v2.management.delete';

// Logging
export const ANALYZE_LOGGING_QUERY_BUILDER_FILTER_ADDED = 'analyze.logging.queryBuilder.filter.added';
export const ANALYZE_LOGGING_QUERY_BUILDER_GROUP_ADDED = 'analyze.logging.queryBuilder.group.added';
export const ANALYZE_LOGGING_SELECTED_TAGS_CHANGED = 'analyze.logging.selected.tags.changed';
export const ANALYZE_LOGGING_LOG_MESSAGE_PARAMETER_CLICKED = 'analyze.logging.log.message.parameter.clicked';
export const ANALYZE_LOGGING_LOG_MESSAGE_TAG_CLICKED = 'analyze.logging.log.message.tag.clicked';
export const ANALYZE_LOGGING_JUMP_TO_LOGS = 'analyze.logging.jump.to.logs';
export const ANALYZE_LOGGING_TIME_SPENT = 'analyze.logging.time.spent';
export const LOGGING_LOGDNA_BUTTON_CLICKED = 'logging.logDna.clicked';
export const ANALYZE_LOGGING_SORTING_CHANGED = 'analyze.logging.sorting.changed';
export const LOGGING_CLICKED_APPLICATION_PERSPECTIVE_LINK = 'analyze.logging.applications.perspective.link.clicked';

// ENTERPRISE
export const ENTERPRISE_IDP_MAPPING_FIRST = 'enterprise.idp.mapping.first';
export const ENTERPRISE_IDP_MAPPING_CHANGED = 'enterprise.idp.mapping.changed';
export const ENTERPRISE_IDP_MAPPING_REMOVED = 'enterprise.idp.mapping.removed';
export const ENTERPRISE_IDP_MAPPING_RESTRICT_ACCESS = 'enterprise.idp.mapping.restrictAccess';
export const ENTERPRISE_IDP_MAPPING_RESTRICT_ACCESS_REMOVE = 'enterprise.idp.mapping.restrictAccess.remove';

// Apdex Widget and Apdex Management
export const APDEX_WIDGET_EDIT_START = 'apdex.widget.edit.start';
export const APDEX_MANAGEMENT_VIEW = 'apdex.management.view';
export const APDEX_MANAGEMENT_EXIT = 'apdex.management.exit';
export const APDEX_MANAGEMENT_CREATE_START = 'apdex.management.create.start';
export const APDEX_MANAGEMENT_CREATE_FINISH = 'apdex.management.create.finish';
export const APDEX_MANAGEMENT_EDIT_START = 'apdex.management.edit.start';
export const APDEX_MANAGEMENT_EDIT_FINISH = 'apdex.management.edit.finish';
export const APDEX_MANAGEMENT_DELETE = 'apdex.management.delete';

// Action associations for events
export const REMEDIATION_ASSOCIATE_ACTION = 'event.issue.action.associate';
export const REMEDIATION_RUN_ACTION = 'event.issue.action.run';
export const CHART_ZOOM_INTO_TIMEFRAME = 'chart.zoomToTimeRange.used';

// Smart Alert Tracking

export const ALERTING_CREATE = 'alerting.add';
export const ALERTING_SAVED = 'alerting.saved';
export const ALERTING_UPDATED = 'alerting.updated';
export const ALERTING_EDIT = 'alerting.edit';
export const ALERTING_DELETE_TRIGGER = 'alerting.delete.trigger';
export const ALERTING_DELETE_CONFIRM = 'alerting.deleted.confirm';
export const ALERTING_PAUSED = 'alerting.paused';
export const ALERTING_RESUMED = 'alerting.resumed';
export const ALERTING_CLONE_TRIGGER = 'alerting.clone.trigger';
