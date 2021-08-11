/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export const VIEW_CHANGE = 'page.view';

export const URL_SHORTENER_OPEN = 'url.shortener.open';

export const CUSTOM_DASHBOARD_CREATE = 'custom.dashboard.create';
export const CUSTOM_DASHBOARD_SHARE = 'custom.dashboard.share';
export const CUSTOM_DASHBOARD_EDIT = 'custom.dashboard.edit';
export const CUSTOM_DASHBOARD_DELETE = 'custom.dashboard.delete';
export const CUSTOM_DASHBOARD_ADD_WIDGET_START = 'custom.dashboard.add.widget.start';
export const CUSTOM_DASHBOARD_ADD_WIDGET_FINISH = 'custom.dashboard.add.widget.finish';
export const CUSTOM_DASHBOARD_EDIT_WIDGET_START = 'custom.dashboard.edit.widget.start';
export const CUSTOM_DASHBOARD_EDIT_WIDGET_CANCEL = 'custom.dashboard.edit.widget.cancel';
export const CUSTOM_DASHBOARD_EDIT_WIDGET_FINISH = 'custom.dashboard.edit.widget.finish';
export const CUSTOM_DASHBOARD_VIEW_WIDGET = 'custom.dashboard.view.widget';

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

export const ANALYZE_UA2_FACETED_SEARCH_FILTER_ADDED = 'analyze.ua2.facetedSearch.filter.added';
export const ANALYZE_UA2_FACETED_SEARCH_GROUP_CHANGED = 'analyze.ua2.facetedSearch.group.changed';
export const ANALYZE_UA2_FACETED_SEARCH_SYNTHETIC_CALLS_TOGGLED = 'analyze.ua2.facetedSearch.synthetic.calls.toggled';
export const ANALYZE_UA2_FACETED_SEARCH_INTERNAL_CALLS_TOGGLED = 'analyze.ua2.facetedSearch.internal.calls.toggled';
export const ANALYZE_UA2_FACETED_SEARCH_FILTER_OPENED = 'analyze.ua2.facetedSearch.filter.opened';
export const ANALYZE_UA2_FACETED_SEARCH_FILTER_CLOSED = 'analyze.ua2.facetedSearch.filter.closed';
export const ANALYZE_UA2_QUERY_BUILDER_FILTER_ADDED = 'analyze.ua2.queryBuilder.filter.added';
export const ANALYZE_UA2_GROUP_CHANGED = 'analyze.ua2.group.changed';
export const ANALYZE_UA2_CHART_CHANGED = 'analyze.ua2.chart.changed';
export const ANALYZE_UA2_METRIC_ADDED = 'analyze.ua2.metric.added';
export const ANALYZE_UA2_METRIC_REMOVED = 'analyze.ua2.metric.removed';
export const ANALYZE_UA2_ORDER_BY_CHANGED = 'analyze.ua2.orderBy.changed';
export const ANALYZE_UA2_ORDER_BY_GROUP_CHANGED = 'analyze.ua2.orderByGroup.changed';
export const ANALYZE_UA2_API_QUERY_PRESSED = 'analyze.ua2.apiQuery.pressed';
export const ANALYZE_UA2_NESTING_DEPTH = 'analyze.ua2.nesting.depth';

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
export const IS_MONITORING_HOSTS = 'isMonitoringHosts';
export const MAP_GROUPING_CHANGED = 'map.grouping.change';
export const MAP_METRICS_AGGREGATION = 'map.metrics.aggregation';
export const MAP_METRICS_SHOW = 'map.metrics.show';
export const MAP_SELECT_ENTITY = 'map.select.entity';
export const NAVIGATION_BREADCRUMB = 'navigation.breadcrumb';
export const REQUEST_QUOTE_BUTTON_CLICKED = 'requestQuote.buttonClicked';
export const REQUEST_QUOTE_SUBMITTED = 'requestQuote.submitted';
export const TIME_WINDOW_SIZE_VIA_PICKER = 'time.windowSize.viaPicker';
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

export const WEBSITES_ALERTING_ADD_ALERT = 'websites.alerting.addAlert';
export const WEBSITES_ALERTING_CLOSE_DIALOG = 'websites.alerting.closeDialog';
export const WEBSITES_ALERTING_SWITCH_MODE = 'websites.alerting.switchMode';
export const WEBSITES_ALERTING_CREATE_ALERT = 'websites.alerting.createAlert';
export const WEBSITES_ALERTING_JS_ERRORS_MSG_CHANGED = 'websites.alerting.jsErrorsMessageChanged';
export const WEBSITES_ALERTING_JS_ERRORS_OPERATOR_CHANGED = 'websites.alerting.jsErrorsOperatorChanged';
export const WEBSITES_ALERTING_JS_ERRORS_OPEN_ERROR_SELECT_VIEW = 'websites.alerting.jsErrorsOpenErrorSelectView';
export const WEBSITES_ALERTING_JS_ERRORS_ERROR_SELECTED = 'websites.alerting.jsErrorsErrorSelected';
export const WEBSITES_ALERTING_STATUS_CODE_CHANGED = 'websites.alerting.statusCodeChanged';
export const WEBSITES_ALERTING_THRESHOLD_METRIC_CHANGED = 'websites.alerting.thresholdMetricChanged';
export const WEBSITES_ALERTING_THRESHOLD_OPERATOR_CHANGED = 'websites.alerting.thresholdOperatorChanged';
export const WEBSITES_ALERTING_THRESHOLD_VALUE_CHANGED = 'websites.alerting.thresholdValueChanged';
export const WEBSITES_ALERTING_AGGREGATION_CHANGED = 'websites.alerting.thresholdAggregationChanged';
export const WEBSITES_ALERTING_THRESHOLD_TYPE_CHANGED = 'websites.alerting.thresholdTypeChanged';
export const WEBSITES_ALERTING_THRESHOLD_DEVIATION_FACTOR_CHANGED = 'websites.alerting.thresholdDeviationFactorChanged';
export const WEBSITES_ALERTING_FILTER_ADD = 'websites.alerting.filter.add';
export const WEBSITES_ALERTING_FILTER_REMOVE = 'websites.alerting.filter.remove';
export const WEBSITES_ALERTING_FILTER_EDIT = 'websites.alerting.filter.edit';
export const WEBSITES_ALERTING_FILTER_SET = 'websites.alerting.filter.set';
export const WEBSITES_ALERTING_STEP_SWITCH = 'websites.alerting.stepSwitch';
export const WEBSITES_ALERTING_BLUEPRINT_CHANGED = 'websites.alerting.bluePrintChanged';
export const WEBSITES_ALERTING_ADDITIONAL_PROPS_TITLE_CHANGE = 'websites.alerting.additionalProps.titleChanged';
export const WEBSITES_ALERTING_ADDITIONAL_PROPS_ALERT_LEVEL_CHANGED =
  'websites.alerting.additionalProps.alertLevelChanged';
export const WEBSITES_ALERTING_ADDITIONAL_PROPS_INCIDENT_TRIGGER_CHANGED =
  'websites.alerting.additionalProps.triggerChanged';
export const WEBSITES_ALERTING_ADDITIONAL_PROPS_DESCRIPTION_CHANGED =
  'websites.alerting.additionalProps.descriptionChanged';
export const WEBSITES_ALERTING_LIST_ALERT_PAUSED = 'websites.alerting.list.alert.paused';
export const WEBSITES_ALERTING_LIST_ALERT_DELETED = 'websites.alerting.list.alert.deleted';
export const WEBSITES_ALERTING_LIST_ALERT_RESUMED = 'websites.alerting.list.alert.resumed';
export const WEBSITES_ALERTING_ALERT_PAUSED = 'websites.alerting.alert.paused';
export const WEBSITES_ALERTING_ALERT_DELETED = 'websites.alerting.alert.deleted';
export const WEBSITES_ALERTING_ALERT_RESUMED = 'websites.alerting.alert.resumed';
export const WEBSITES_ALERTING_ALERT_EDIT = 'websites.alerting.alert.edit';
export const WEBSITES_ALERTING_ALERT_REVISION_CHANGED = 'websites.alerting.alert.revisionChanged';
export const WEBSITES_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE = 'websites.alerting.event.details.goToAnalyze';
export const WEBSITES_ALERTING_EVENT_DETAILS_VIEW_EDIT_CONFIG = 'websites.alerting.event.details.ViewEditConfig';

export const APPLICATIONS_ALERTING_ADD_ALERT = 'applications.alerting.addAlert';
export const APPLICATIONS_ALERTING_CLOSE_DIALOG = 'applications.alerting.closeDialog';
export const APPLICATIONS_ALERTING_SWITCH_MODE = 'applications.alerting.switchMode';
export const APPLICATIONS_ALERTING_CREATE_ALERT = 'applications.alerting.createAlert';
export const APPLICATIONS_ALERTING_LIST_ALERT_PAUSED = 'applications.alerting.list.alert.paused';
export const APPLICATIONS_ALERTING_LIST_ALERT_DELETED = 'applications.alerting.list.alert.deleted';
export const APPLICATIONS_ALERTING_LIST_ALERT_RESUMED = 'applications.alerting.list.alert.resumed';
export const APPLICATIONS_ALERTING_ALERT_PAUSED = 'applications.alerting.alert.paused';
export const APPLICATIONS_ALERTING_ALERT_DELETED = 'applications.alerting.alert.deleted';
export const APPLICATIONS_ALERTING_ALERT_RESUMED = 'applications.alerting.alert.resumed';
export const APPLICATIONS_ALERTING_ALERT_EDIT = 'applications.alerting.alert.edit';
export const APPLICATIONS_ALERTING_ALERT_REVISION_CHANGED = 'applications.alerting.alert.revisionChanged';
export const APPLICATIONS_ALERTING_ADDITIONAL_PROPS_TITLE_CHANGE = 'applications.alerting.additionalProps.titleChanged';
export const APPLICATIONS_ALERTING_ADDITIONAL_PROPS_ALERT_LEVEL_CHANGED =
  'applications.alerting.additionalProps.alertLevelChanged';
export const APPLICATIONS_ALERTING_ADDITIONAL_PROPS_INCIDENT_TRIGGER_CHANGED =
  'applications.alerting.additionalProps.triggerChanged';
export const APPLICATIONS_ALERTING_ADDITIONAL_PROPS_DESCRIPTION_CHANGED =
  'applications.alerting.additionalProps.descriptionChanged';
export const APPLICATIONS_ALERTING_STEP_SWITCH = 'applications.alerting.stepSwitch';
export const APPLICATIONS_ALERTING_BLUEPRINT_CHANGED = 'applications.alerting.bluePrintChanged';
export const APPLICATIONS_ALERTING_THRESHOLD_OPERATOR_CHANGED = 'applications.alerting.thresholdOperatorChanged';
export const APPLICATIONS_ALERTING_THRESHOLD_VALUE_CHANGED = 'applications.alerting.thresholdValueChanged';
export const APPLICATIONS_ALERTING_THRESHOLD_AGGREGATION_CHANGED = 'applications.alerting.thresholdAggregationChanged';
export const APPLICATIONS_ALERTING_THRESHOLD_TYPE_CHANGED = 'applications.alerting.thresholdTypeChanged';
export const APPLICATIONS_ALERTING_THRESHOLD_DEVIATION_FACTOR_CHANGED =
  'applications.alerting.thresholdDeviationFactorChanged';
export const APPLICATIONS_ALERTING_LOG_MSG_CHANGED = 'applications.alerting.logMessageChanged';
export const APPLICATIONS_ALERTING_LOG_LEVEL_CHANGED = 'applications.alerting.logLevelChanged';
export const APPLICATIONS_ALERTING_LOG_OPERATOR_CHANGED = 'applications.alerting.logOperatorChanged';
export const APPLICATIONS_ALERTING_LOG_OPEN_MSG_SELECT_VIEW = 'applications.alerting.logOpenMessageSelectView';
export const APPLICATIONS_ALERTING_LOG_MSG_SELECTED = 'applications.alerting.logMessageSelected';
export const APPLICATIONS_ALERTING_FILTER_ADD = 'applications.alerting.filter.add';
export const APPLICATIONS_ALERTING_FILTER_REMOVE = 'applications.alerting.filter.remove';
export const APPLICATIONS_ALERTING_FILTER_EDIT = 'applications.alerting.filter.edit';
export const APPLICATIONS_ALERTING_FILTER_SET = 'applications.alerting.filter.set';
export const APPLICATIONS_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE = 'applications.alerting.event.details.goToAnalyze';
export const APPLICATIONS_ALERTING_EVENT_DETAILS_VIEW_EDIT_CONFIG =
  'applications.alerting.event.details.ViewEditConfig';
export const APPLICATIONS_ALERTING_STATUS_CODE_CHANGED = 'applications.alerting.statusCodeChanged';
export const APPLICATIONS_ALERTING_ALERT_DUPLICATE = 'applications.alerting.duplicate';

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

// Potential Problems Marker Lane
export const POTENTIAL_PROBLEMS_MARKER_HOVERED = 'potential.problems.marker.hovered';
export const POTENTIAL_PROBLEMS_MARKER_CLICKED = 'potential.problems.marker.clicked';
export const POTENTIAL_PROBLEMS_SMART_ALERT_CREATE = 'potential.problems.smartalert.create';
export const POTENTIAL_PROBLEMS_GO_TO_ANALYZE = 'potential.problems.goto.analyze';
export const POTENTIAL_PROBLEMS_REQUEST_LOADING_TIME = 'potential.problems.request.loading.time';
export const POTENTIAL_PROBLEMS_SELECTED = 'potential.problems.selected';
export const POTENTIAL_PROBLEMS_DIALOG_CLOSED = 'potential.problems.dialog.closed';

// SLI Widget and SLI Management
export const SLI_WIDGET_JUMP_TO_UNBOUNDED_ANALYTICS = 'sli.widget.chart.jumpToUA';
export const SLI_WIDGET_START_EDITING = 'sli.widget.editStart';
export const SLI_WIDGET_AP_CHANGED = 'sli.widget.apChanged';
export const SLI_WIDGET_SLI_CHANGED = 'sli.widget.sliChanged';
export const SLI_WIDGET_SLO_CHANGED = 'sli.widget.sloChanged';
export const SLI_WIDGET_TIME_WINDOW_TYPE_CHANGED = 'sli.widget.timeWindowChanged';
export const SLI_WIDGET_OPEN_SLI_MANAGEMENT = 'sli.widget.openSliManagement';
export const SLI_MANAGEMENT_CREATE = 'sli.management.create';
export const SLI_MANAGEMENT_VIEW = 'sli.management.view';
export const SLI_MANAGEMENT_DELETED = 'sli.management.deleted';
export const SLI_MANAGEMENT_NEW_CREATED = 'sli.management.sliCreated';
export const SLI_MANAGEMENT_CLONED = 'sli.management.cloned';
export const SLI_MANAGEMENT_EDIT_ABORT = 'sli.management.editAbort';

// Logging
export const ANALYZE_LOGGING_QUERY_BUILDER_FILTER_ADDED = 'analyze.logging.queryBuilder.filter.added';
export const ANALYZE_LOGGING_QUERY_BUILDER_QUERY_CHANGED = 'analyze.logging.queryBuilder.query.changed';
export const ANALYZE_LOGGING_QUERY_BUILDER_GROUP_ADDED = 'analyze.logging.queryBuilder.group.added';
export const ANALYZE_LOGGING_QUERY_BUILDER_CHART_CHANGED = 'analyze.logging.queryBuilder.chart.changed';
export const ANALYZE_LOGGING_SELECTED_TAGS_CHANGED = 'analyze.logging.selected.tags.changed';
export const ANALYZE_LOGGING_LOAD_MORE_CLICKED = 'analyze.logging.load.more.clicked';
export const ANALYZE_LOGGING_TIMEFRAME_USED = 'analyze.logging.timeframe.used';
export const ANALYZE_LOGGING_LOG_MESSAGE_PARAMETER_CLICKED = 'analyze.logging.log.message.parameter.clicked';
export const ANALYZE_LOGGING_LOG_MESSAGE_TAG_CLICKED = 'analyze.logging.log.message.tag.clicked';
export const ANALYZE_LOGGING_FACETTEDSEARCH_ITEM_CLICKED = 'analyze.logging.facettedsearch.item.clicked';
export const ANALYZE_LOGGING_FACETTEDSEARCH_GROUP_CLICKED = 'analyze.logging.facettedsearch.group.clicked';
export const ANALYZE_LOGGING_JUMP_TO_LOGS = 'analyze.logging.jump.to.logs';
export const ANALYZE_LOGGING_TIME_SPENT = 'analyze.logging.time.spent';
export const LOGGING_LOGDNA_BUTTON_CLICKED = 'logging.logDna.clicked';
