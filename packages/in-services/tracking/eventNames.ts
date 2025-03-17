/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

export const VIEW_CHANGE = 'page.view';
export const PAGE_SCROLLED_BOTTOM = 'page.scrolled.bottom';

export const URL_SHORTENER_OPEN = 'url.shortener.open';

export const CUSTOM_DASHBOARD_CREATE = 'custom.dashboard.create';
export const CUSTOM_DASHBOARD_SHARE = 'custom.dashboard.share';
export const CUSTOM_DASHBOARD_EDIT_SAVE = 'custom.dashboard.edit.save';
export const CUSTOM_DASHBOARD_DELETE = 'custom.dashboard.delete';
export const CUSTOM_DASHBOARD_ADD_WIDGET_START = 'custom.dashboard.add.widget.start';
export const CUSTOM_DASHBOARD_ADD_WIDGET_FINISH = 'custom.dashboard.add.widget.finish';
export const CUSTOM_DASHBOARD_ADD_WIDGET_DUPLICATE = 'custom.dashboard.add.widget.duplicate';
export const CUSTOM_DASHBOARD_EDIT_WIDGET_START = 'custom.dashboard.edit.widget.start';
export const CUSTOM_DASHBOARD_EDIT_WIDGET_CANCEL = 'custom.dashboard.edit.widget.cancel';
export const CUSTOM_DASHBOARD_EDIT_WIDGET_FINISH = 'custom.dashboard.edit.widget.finish';
export const CUSTOM_DASHBOARD_DELETE_WIDGET = 'custom.dashboard.delete.widget';
export const CUSTOM_DASHBOARD_VIEW_WIDGET = 'custom.dashboard.view.widget';
export const CUSTOM_DASHBOARD_ZOOM_WIDGET_START = 'custom.dashboard.zoom.widget.start';
export const CUSTOM_DASHBOARD_ZOOM_WIDGET_FINISH = 'custom.dashboard.zoom.widget.finish';
export const CUSTOM_DASHBOARD_WIDGET_DOWNLOAD_PDF = 'custom.dashboard.widget.download.pdf';
export const CUSTOM_DASHBOARD_DOWNLOAD_PDF_START = 'custom.dashboard.download.pdf.start';
export const CUSTOM_DASHBOARD_DOWNLOAD_PDF_FINISH = 'custom.dashboard.download.pdf.finish';
export const CUSTOM_DASHBOARD_DOWNLOAD_PDF_ORIENTATION = 'custom.dashboard.download.pdf.orientation';
export const CUSTOM_DASHBOARD_DOWNLOAD_PDF_LAYOUT = 'custom.dashboard.download.pdf.layout';
export const CUSTOM_DASHBOARD_DOWNLOAD_PDF_DISPLAY = 'custom.dashboard.download.pdf.display';
export const CUSTOM_DASHBOARD_DOWNLOAD_PDF_GENERATE_PREVIEW = 'custom.dashboard.download.pdf.generate.preview';

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
export const ANALYZE_UA2_EXPAND_COLLAPSE_GROUPED_LIST_ITEM = 'analyze.ua2.expand.collapse.grouped.list.item';
export const ANALYZE_TRACE_VIEW_CLOSED = 'analyze.trace.view.closed';
export const ANALYZE_TRACE_VIEW_NAVIGATE_TO_UA = 'analyze.trace.view.navigate.ua';
export const ANALYZE_TRACE_VIEW_TRACE_LIST_CLICK = 'analyze.trace.view.trace.list.click';
export const ANALYZE_TRACE_VIEW_SERVICE_ENDPOINT_LIST_CLICK = 'analyze.trace.view.service.endpoint.list.click';
export const ANALYZE_TRACE_VIEW_TREE_CALL_CLICK = 'analyze.trace.view.call.tree.click';
export const ANALYZE_TRACE_VIEW_TIMELINE_CALL_CLICK = 'analyze.trace.view.call.timeline.click';
export const ANALYZE_TRACE_VIEW_ROOT_CALL_LOAD_MORE_CLICK = 'analyze.trace.view.root.call.load.more.click';
export const ANALYZE_TRACE_VIEW_CHILD_CALL_LOAD_MORE_CLICK = 'analyze.trace.view.child.call.load.more.click';
export const ANALYZE_TRACE_VIEW_RETRY_CALL_CLICK = 'analyze.trace.view.retry.call.click';
export const ANALYZE_TRACE_VIEW_ANALYZE_CALLS_FROM_TRACE_CLICK = 'analyze.trace.view.analyze.calls.from.trace.click';
export const ANALYZE_TRACE_VIEW_DOWNLOAD_TRACES = 'analyze.trace.view.download.traces.click';
export const ANALYZE_TRACE_VIEW_DOWNLOAD_CALL_DETAILS = 'analyze.trace.view.download.call.details.click';
export const ANALYZE_TRACE_VIEW_EXPAND_COLLAPSE_SIDEBAR = 'analyze.trace.view.expand.collapse.sidebar';
export const ANALYZE_TRACE_VIEW_TRACK_IF_LARGE_TRACE = 'analyze.trace.view.if.large.trace';

export const APPLICATION_CLICK_CREATE = 'application.click.create';
export const APPLICATION_CLICK_SUBMIT = 'application.click.submit';
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
export const KUBERNETES_VIEW_MODE_TOGGLED = 'kubernetes.view.mode.toggled';
export const KUBERNETES_SEARCH_QUERY_CHANGED = 'kubernetes.search.query.changed';
export const KUBERNETES_SEARCH_BAR_CLEARED = 'kubernetes.search.bar.cleared';
export const KUBERNETES_SORTING_CHANGED = 'kubernetes.sorting.changed';
export const KUBERNETES_CARD_CLICKED = 'kubernetes.card.clicked';

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
export const BUY_NOW_BUTTON_AWS_CLICKED = 'purchaseIntent.aws';
export const BUY_NOW_BUTTON_IBM_CLICKED = 'purchaseIntent.ibm';
export const PLAY_WITH_BOOK_DEMO_NOW_BUTTON_CLICKED = 'intentToTry.Demo';
export const PLAY_WITH_BOOK_FREE_TRIAL_BUTTON_CLICKED = 'intentToTry.Trial';

export const REVIEW_DATA_USAGE_BUTTON = 'reviewDataUsage.clicked';
export const FAIR_USE_POLICY_BLOG = 'learnMoreFupDocumentation.clicked';
export const CONTACT_SALES = 'learnMoreContactSales.clicked';

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
export const APPLICATIONS_GENERATE_IMPACT_REPORT = 'applications.generate.impact.report';

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

export const SETTINGS_ACCESS_CONTROL_GROUP_CREATE = 'settings.accessControl.createGroup';
export const SETTINGS_ACCESS_CONTROL_GROUP_UPDATE = 'settings.accessControl.updateGroup';
export const SETTINGS_API_TOKEN_CREATE = 'settings.apiToken.create';
export const SETTINGS_API_TOKEN_UPDATE = 'settings.apiToken.update';
export const SETTINGS_AUDIT_TRAIL_ACCESS_LOG_CLICK = 'settings.auditTrail.accessLog.click';
export const SETTINGS_AUDIT_TRAIL_ACTION_LOG_CLICK = 'settings.auditTrail.actionLog.click';
export const SETTINGS_GROUP_APPLICATION_FILTER_ADDED = 'settings.group.application.filter.added';
export const SETTINGS_GROUP_USER_ADDED = 'settings.group.user.added';
export const SETTINGS_IDENTITY_PROVIDER_GOOGLE_UPDATE = 'settings.identityProvider.googleSingleSignOn';
export const SETTINGS_IDENTITY_PROVIDER_LDAP_UPDATE = 'settings.identityProvider.ldap';
export const SETTINGS_IDENTITY_PROVIDER_OIDC_UPDATE = 'settings.identityProvider.openIdConnect';
export const SETTINGS_IDENTITY_PROVIDER_SAML_UPDATE = 'settings.identityProvider.saml';
export const SETTINGS_IDP_LDAP_TEST_CONFIGURATION = 'settings.idp.ldap.testConfiguration';
export const SETTINGS_PERSONAL_API_TOKEN_CREATE = 'settings.personalApiToken.create';
export const SETTINGS_PERSONAL_API_TOKEN_UPDATE = 'settings.personalApiToken.update';
export const SETTINGS_ROLE_SUBMIT = 'settings.role.submit';
export const SETTINGS_ROLE_OPEN_SUBMIT_FORM = 'settings.role.new';
export const SETTINGS_SESSION_TIMEOUT_UPDATE = 'settings.sessionTimeout.update';
export const SETTINGS_TEAM_CREATE = 'settings.team.create';
export const SETTINGS_TEAM_UPDATE = 'settings.team.update';
export const SETTINGS_USER_GROUP_ADDED = 'settings.user.group.added';
export const SETTINGS_USER_INVITE_SUBMIT = 'settings.user.invite.submit';

export const PROFILE_MENU_LOGOUT_CLICK = 'profileMenu.logout.click';
export const PROFILE_MENU_SWITCH_TENANT_OR_UNIT_CLICK = 'profileMenu.switchUnitOrTenant.click';
export const PROFILE_MENU_USER_PROFILE_CLICK = 'profileMenu.userProfile.click';
export const PROFILE_MENU_SAAS_CONSOLE_CLICK = 'profileMenu.ibmSaasConsole.click';

export const SHARE_AND_INVITE_SUBMIT = 'shareAndInvite.submit';
export const SHARE_AND_INVITE_CLOSED = 'shareAndInvite.closed';
export const SHARE_AND_INVITE_TRIGGERED = 'shareAndInvite.triggered';
export const SHARE_AND_INVITE_INVITEE_JOINED = 'shareAndInvite.invitee.joined';
export const SHARE_AND_INVITE_ADD_USER = 'shareAndInvite.add.user';
export const SHARE_AND_INVITE_NEW_GROUP = 'shareAndInvite.new.group';
export const SHARE_AND_INVITE_COPY_LINK = 'shareAndInvite.copy.link';

export const UNIT_ONBOARDING_START_INTEGRATING_CLICK = 'unitOnboarding.installAgents.click';
export const UNIT_ONBOARDING_TRACE_INTERACTIONS_CLICK = 'unitOnboarding.verifyTracing.click';
export const UNIT_ONBOARDING_CONNECT_WITH_EXPERTS_CLICK = 'unitOnboarding.inviteUsers.click';
export const UNIT_ONBOARDING_BRING_IN_MORE_DATA_CLICK = 'unitOnboarding.installAdditionalAgents.click';
export const UNIT_ONBOARDING_TAILOR_YOUR_VIEW_CLICK = 'unitOnboarding.createApplicationPerspective.click';
export const UNIT_ONBOARDING_GET_ALERTED_CLICK = 'unitOnboarding.setUpSmartAlerts.click';
export const UNIT_ONBOARDING_MONITOR_ENVIRONMENT_CLICK = 'unitOnboarding.startMonitoring.click';
export const UNIT_ONBOARDING_BRING_YOUR_TEAM_CLICK = 'unitOnboarding.inviteTeammates.click';

export const WELCOME_PAGE_DEPLOY_AGENT_CLICK = 'welcomePage.deployAgent.click';
export const WELCOME_PAGE_ADD_USER_CLICK = 'welcomePage.addUser.click';
export const WELCOME_PAGE_IBM_DOCUMENTATION_CLICK = 'welcomePage.ibmDocumentation.click';
export const WELCOME_PAGE_RELEASE_NOTES_CLICK = 'welcomePage.releaseNotes.click';
export const WELCOME_PAGE_WHATS_NEW_LINK_CLICK = 'welcomePage.whatsNewLink.click';

// Owned by Team Alert Response
// Tracking all team owned components
export const SETTINGS_ALERT_CHANNEL_CREATE = 'settings.alertChannel.create';
export const SETTINGS_ALERT_CHANNEL_OPEN_SUBMIT_FORM = 'settings.alertChannel.new';
export const SETTINGS_ALERT_CHANNEL_ADD_MENU_CLICK = 'settings.alertChannel.addMenu.click';
export const SETTINGS_ALERT_CHANNEL_ADD_CLICK = 'settings.alertChannel.add.click';
export const SETTINGS_ALERT_CHANNEL_TEST_CLICK = 'settings.alertChannel.test.click';
export const SETTINGS_ALERT_CHANNEL_CLICK = 'settings.alertChannel.click';
export const SETTINGS_ALERT_CHANNEL_DELETE = 'settings.alertChannel.delete';
export const SETTINGS_ALERT_CHANNEL_EDIT = 'settings.alertChannel.edit';

export const SETTINGS_ALERT_SUBMIT = 'settings.alert.submit';
export const SETTINGS_ALERT_DELETE = 'settings.alert.delete';
export const SETTINGS_ALERT_TOGGLE = 'settings.alert.toggle';
export const SETTINGS_ALERT_OPEN_SUBMIT_FORM = 'settings.alert.new';
export const SETTINGS_ALERT_CUSTOM_PAYLOAD_SUBMIT = 'settings.alert.customPayload.submit';
export const SETTINGS_ALERT_CUSTOM_PAYLOAD_ADD_ITEM = 'settings.alert.customPayload.addItem';
export const SETTINGS_ALERT_CUSTOM_PAYLOAD_REMOVE_ITEM = 'settings.alert.customPayload.removeItem';

//Events
export const SETTINGS_EVENT_VIEW = 'settings.event.view.clicked';
export const SETTINGS_EVENT_SUBMIT = 'settings.event.saved';
export const SETTINGS_EVENT_OPEN_SUBMIT_FORM = 'settings.event.add.clicked';
export const SETTINGS_EVENT_ENABLE = 'settings.event.enabled';
export const SETTINGS_EVENT_DISABLE = 'settings.event.disabled';
export const SETTINGS_EVENT_DELETE_TRIGGER = 'settings.event.delete.clicked';
export const SETTINGS_EVENT_DELETED = 'settings.event.delete.confirmed';

export const SETTINGS_MAINTENANCE_WINDOW_EDIT = 'settings.maintenance.edit';
export const SETTINGS_MAINTENANCE_WINDOW_NEW = 'settings.maintenance.new';
export const SETTINGS_MAINTENANCE_WINDOW_SUBMIT = 'settings.maintenance.submit';
export const SETTINGS_MAINTENANCE_WINDOW_REMOVE = 'settings.maintenance.remove';
export const SETTINGS_MAINTENANCE_WINDOW_CANCEL = 'settings.maintenance.cancel';
export const SETTINGS_MAINTENANCE_WINDOW_RESUME = 'settings.maintenance.resume';
export const SETTINGS_MAINTENANCE_WINDOW_PAUSE = 'settings.maintenance.pause';
export const SETTINGS_MAINTENANCE_WINDOW_ADVANCED = 'settings.maintenance.to.advanced';
export const SETTINGS_MAINTENANCE_WINDOW_SIMPLE = 'settings.maintenance.to.simple';
export const SETTINGS_MAINTENANCE_WINDOW_NEXT_STEP_ONE = 'settings.maintenance.nextStep.one';
export const SETTINGS_MAINTENANCE_WINDOW_NEXT_STEP_TWO = 'settings.maintenance.nextStep.two';
export const SETTINGS_MAINTENANCE_WINDOW_ACTIVE_TAB = 'settings.maintenance.tab.active';
export const SETTINGS_MAINTENANCE_WINDOW_SCHEDULED_TAB = 'settings.maintenance.tab.scheduled';
export const SETTINGS_MAINTENANCE_WINDOW_EXPIRED_TAB = 'settings.maintenance.tab.expired';
export const SETTINGS_MAINTENANCE_WINDOW_FEEDBACK_SUBMIT = 'settings.maintenance.feedback.submit';

export const SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_CLICKED = 'settings.logsManagement.deleteLogs.clicked';
export const SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_SUBMITTED = 'settings.logsManagement.deleteLogs.submitted';
export const SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_SUCCESS = 'settings.logsManagement.deleteLogs.success';
export const SETTINGS_LOG_MANAGEMENT_DELETE_LOGS_ERROR = 'settings.logsManagement.deleteLogs.error';
export const SETTINGS_LOG_MANAGEMENT_RETENTION_PERIOD_SUBMITTED = 'settings.logsManagement.retention.period.submitted';

export const SETTINGS_ACCOUNT_BILLING_TENANT_UNIT = 'settings.accountBilling.tenantUnit';
export const SETTINGS_ACCOUNT_BILLING_TIMERANGE = 'settings.accountBilling.timeRange';
export const SETTINGS_ACCOUNT_BILLING_PRESENTATION = 'settings.accountBilling.presentation';

export const ONBOARDING_OPENED = 'onboardingNewUnit.dialog.opened';
export const ONBOARDING_INSTANA_BEGINNER_VIDEOS_CLICKED = 'onboardingNewUnit.instanaBeginnerVideos.clicked';
export const ONBOARDING_HELP_AND_SUPPORT_CLICKED = 'onboardingNewUnit.helpAndSupport.clicked';
export const ONBOARDING_MAIN_TOPIC_CHANGED = 'onboardingNewUnit.mainTopic.changed';
export const ONBOARDING_SUB_TOPIC_CHANGED = 'onboardingNewUnit.subTopic.changed';
export const ONBOARDING_SEARCH_QUERY_CHANGED = 'onboardingNewUnit.searchQuery.changed';
export const ONBOARDING_CATALOG_PAGE_OPENED = 'catalog.page.opened';
export const ONBOARDING_CATALOG_PAGE_SEARCH_USED = 'catalog.page.search.used';
export const ONBOARDING_AGENT_DETAILS_PAGE_OPENED = 'agent.details.page.opened';
export const ONBOARDING_DEPLOY_AGENTS_BUTTON_CLICKED = 'view.deployed.agents.button.clicked';
export const ONBOARDING_GOTO_INSTANA_BUTTON_CLICKED = 'goto.instana.button.clicked';
export const ONBOARDING_SIGN_INTO_INSTANA_BUTTON_CLICKED = 'sign.into.instana.button.clicked';

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
export const INFRASTRUCTURE_ANALYZE_RELATED_INSTANCES_BUTTON_CLICKED =
  'infrastructure.analyze.related.instances.button.clicked';
export const INFRA_EXPLORE_TYPE_SELECTOR_STATE_CHANGED = 'infra.explore.type.selector.state.changed';
export const INFRA_EXPLORE_FILTER_ADDED = 'infra.explore.filter.added';
export const INFRA_EXPLORE_FILTER_REMOVED = 'infra.explore.filter.removed';
export const INFRA_EXPLORE_FILTERS_CLEARED = 'infra.explore.filters.cleared';
export const INFRA_EXPLORE_CHART_CHANGED = 'infra.explore.chart.changed';
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
export const AGENT_PROFILER_CLICKED = 'agent.profiler.clicked';
export const AGENT_SUPPORT_INFO_CLICKED = 'agent.support.info.clicked';
export const AGENT_SUPPORT_DOWNLOAD_CLICKED = 'agent.support.download.clicked';

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

// Actions Marker Lane

export const ACTION_LANES_MARKER_HOVERED = 'action.lanes.marker.hovered';
export const ACTION_LANES_MARKER_CLICKED = 'action.lanes.marker.clicked';
export const ACTION_LANES_INVESTIGATE_FILTER = 'action.lanes.investigate.filter';
export const ACTION_LANES_VIEW_ENTITY = 'action.lanes.view.entity';
export const ACTION_LANES_SELECTED = 'action.lanes.selected';
export const ACTION_LANES_DIALOG_CLOSED = 'action.lanes.dialog.closed';

// SLI Widget and SLI Management
export const SLO_WIDGET_EDIT_START = 'slo.widget.edit.start';
export const SLI_MANAGEMENT_VIEW = 'sli.v2.management.view';
export const SLI_MANAGEMENT_EXIT = 'sli.v2.management.exit';
export const SLI_MANAGEMENT_CREATE_START = 'sli.v2.management.create.start';
export const SLI_MANAGEMENT_CREATE_FINISH = 'sli.v2.management.create.finish';
export const SLI_MANAGEMENT_EDIT_START = 'sli.v2.management.edit.start';
export const SLI_MANAGEMENT_EDIT_FINISH = 'sli.v2.management.edit.finish';
export const SLI_MANAGEMENT_DELETE = 'sli.v2.management.delete';

// SLO Reborn Widget
export const SLO2_WIDGET_EDIT_START = 'slo2.widget.edit.start';
export const SLO2_BIG_NUMBER_WIDGET_EDIT_START = 'slo2.bigNumber.widget.edit.start';

// Service Levels
export const SLO_LIST_VIEW = 'slo.list.view';
export const SLO_SUMMARY_VIEW = 'slo.summary.view';
export const SLO_CONFIG_VIEW = 'slo.config.view';
export const SLO_CONFIG_DIALOG_OPEN = 'slo.config.dialog.open';
export const SLO_CONFIG_DIALOG_CLOSE = 'slo.config.dialog.close';
export const SLO_CONFIG_DIALOG_ERROR = 'slo.config.dialog.error';
export const SLO_CONFIG_DIALOG_FINISH = 'slo.config.dialog.finish';
export const SLO_CONFIG_DELETE_START = 'slo.config.delete.start';
export const SLO_CONFIG_DELETE_ERROR = 'slo.config.delete.error';
export const SLO_CONFIG_DELETE_FINISH = 'slo.config.delete.finish';

// Logging
export const ANALYZE_LOGGING_QUERY_BUILDER_FILTER_ADDED = 'analyze.logging.queryBuilder.filter.added';
export const ANALYZE_LOGGING_QUERY_BUILDER_GROUP_ADDED = 'analyze.logging.queryBuilder.group.added';
export const ANALYZE_LOGGING_SELECTED_TAGS_CHANGED = 'analyze.logging.selected.tags.changed';
export const ANALYZE_LOGGING_LOG_MESSAGE_PARAMETER_CLICKED = 'analyze.logging.log.message.parameter.clicked';
export const ANALYZE_LOGGING_LOG_MESSAGE_TAG_CLICKED = 'analyze.logging.log.message.tag.clicked';
export const ANALYZE_LOGGING_JUMP_TO_LOGS = 'analyze.logging.jump.to.logs';
export const ANALYZE_LOGGING_TIME_SPENT = 'analyze.logging.time.spent';
export const ANALYZE_LOGGING_SORTING_CHANGED = 'analyze.logging.sorting.changed';
export const LOGGING_CLICKED_APPLICATION_PERSPECTIVE_LINK = 'analyze.logging.applications.perspective.link.clicked';
export const ANALYZE_LOGGING_LOG_GETLOGS_FILTERS = 'analyze.logging.log.getLogs.filters';
export const ANALYZE_CUSTOM_WIDGET_SEE_IN_LOGS_CLICKED = 'analyze.custom.widget.see.in.logs.clicked';

// Logging Integrations
export const LOGGING_MEZMO_BUTTON_CLICKED = 'logging.mezmo.clicked';
export const LOGGING_INTEGRATIONS_INSTANCE_THIRD_PARTY_CLICKED = 'logging.integration.instance.third.party.clicked';

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

// Automation
export const AUTOMATION_ACTION_CREATE = 'automation.action.create';
export const AUTOMATION_ACTION_EDIT = 'automation.action.edit';
export const AUTOMATION_ACTION_DELETE = 'automation.action.delete';
export const AUTOMATION_ACTION_RUN = 'automation.action.run';
export const AUTOMATION_OPTIMIZATION_RUN_CLICK = 'automation.optimization.run.click';
export const AUTOMATION_TURBO_TRY_CLICK = 'automation.turbo.try.click';
export const AUTOMATION_TURBO_BUY_CLICK = 'automation.turbo.buy.click';
export const AUTOMATION_TURBO_SUPPORT_CLICK = 'automation.turbo.support.click';
export const AUTOMATION_ACTION_HISTORY_VIEW = 'automation.action.history.view';
export const AUTOMATION_ACTION_HISTORY_INSTANCE_VIEW = 'automation.action.history.instance.view';
export const AUTOMATION_ACTION_HISTORY_FEEDBACK_SEND = 'automation.action.history.feedback.used';
export const AUTOMATION_ACTION_HISTORY_INSTANCE_DELETE = 'automation.action.history.instance.delete';
export const AUTOMATION_VIEW_TURBO_ACTION = 'view.turbo.action';
export const AUTOMATION_POLICY_CREATE = 'automation.policy.create';
export const AUTOMATION_POLICY_BULK_CREATE = 'automation.bulk.automation.policy.create';
export const AUTOMATION_POLICY_EDIT = 'automation.policy.edit';
export const AUTOMATION_RECOMMENDED_ACTIONS_TAB_CLICK = 'automation.recommended.actions.tab.click';
export const AUTOMATION_CREATE_POLICY_FROM_RECOMMENDED_ACTIONS = 'automation.create.policy.from.recommended.actions';
export const AUTOMATION_TEST_ACTION_RUN = 'automation.test.action.run';
export const AUTOMATION_CREATE_AI_ACTION_POLICY = 'automation.create.ai.action.policy';
export const AUTOMATION_CLICK_AI_GENERATED_ACTIONS_TAB = 'automation.click.ai.generated.actions.tab';
export const AUTOMATION_COPY_AI_GENERATED_ACTION = 'automation.copy.ai.generated.action';
export const AUTOMATION_VIEW_AI_GENERATED_ACTION = 'automation.view.ai.generated.action';
export const AUTOMATION_TEST_AI_GENERATED_ACTION = 'automation.test.ai.generated.action';
export const AUTOMATION_CLICK_COPY_AI_GENERATED_ACTION = 'automation.click.copy.ai.generated.action';
export const AUTOMATION_CLICK_TEST_AI_GENERATED_ACTION = 'automation.click.test.ai.generated.action';
// live ai events
export const AUTOMATION_GENERATE_AI_BUTTON_CLICK = 'automation.generate.ai.button.click';
export const AUTOMATION_GENERATE_AI_ACTION_CLICK_PROMPT_STEP = 'automation.ai.generate.ai.action.click_prompt_step';
export const AUTOMATION_AI_SELECT_NEXT_PROMPT_STEP_CLICK = 'automation.ai.select.next.prompt.step.click';
export const AUTOMATION_AI_SELECT_NEXT_CUSTOMIZE_ACTION_STEP_CLICK =
  'automation.ai.select.next.customize.action.step.click';
export const AUTOMATION_AI_ACTION_CONTENT_MODIFIED = 'automation.ai.action.content.modified';
export const AUTOMATION_AI_LEAVE_GENERATE_DIALOG = 'automation.ai.leave.generate.dialog';

export const AUTOMATION_AI_SCRIPT_SELECT_STEP_NEXT_CLICK = 'automation.ai.script.select.step.next.click';
export const AUTOMATION_GENERATE_AI_SCRIPT_BUTTON_CLICK_STEP2 = 'automation.generate.ai.script.button.click.step2';
export const AUTOMATION_AI_SCRIPT_GENERATE_STEP_NEXT_CLICK = 'automation.ai.script.generate.step.next.click';
export const AUTOMATION_AI_GENERATE_STEP_ERROR = 'automation.ai.generate.step.error';

export const AUTOMATION_AI_GOOD_FEEDBACK = 'automation.ai.good.feedback';
export const AUTOMATION_AI_BAD_FEEDBACK = 'automation.ai.bad.feedback';
export const AUTOMATION_CLICK_EPWT_LINK = 'automation.click.epwt.link';

export const CHART_ZOOM_INTO_TIMEFRAME = 'chart.zoomToTimeRange.used';

// Smart Alert Tracking

export const ALERTING_CREATE = 'smartalert.add.clicked';
export const ALERTING_SAVED = 'smartalert.saved';
export const ALERTING_UPDATED = 'smartalert.updated';
export const ALERTING_EDIT = 'smartalert.edit.clicked';
export const ALERTING_DELETE_TRIGGER = 'smartalert.delete.clicked';
export const ALERTING_DELETE_CONFIRM = 'smartalert.deleted.confirmed';
export const ALERTING_PAUSED = 'smartalert.paused';
export const ALERTING_RESUMED = 'smartalert.resumed';
export const ALERTING_REVISION_CHANGED = 'smartalert.revision.changed';
export const ALERTING_CLONE_TRIGGER = 'smartalert.clone.clicked';
//This is only available for tearsheets(To track from which step users closed the form)
export const ALERTING_CANCEL_CLICKED = 'smartalert.cancel.clicked';

// Business Monitoring Tracking
// Segment
export const BIZOPS_FLOW_MAP_LOAD_MORE = 'bizops.flow.map.load.more';

export const BIZOPS_TAB_CLICK = 'bizops.tab.click';
export const BIZOPS_PROCESSES_LIST_SELECT = 'bizops.processes.list.select';
export const BIZOPS_PERSPECTIVES_LIST_SELECT = 'bizops.perspectives.list.select';
export const BIZOPS_ANALYZE_INSTANCES_CLICK = 'bizops.analyze.instances.click';
export const BIZOPS_VIEW_ALL_ACTIVITIES_CLICK = 'bizops.view.all.activities.click';
export const BIZOPS_ACTIVITY_SELECT = 'bizops.activity.select';
export const BIZOPS_CREATE_PERSPECTIVE_CLICK = 'bizops.create.perspective.click';
export const BIZOPS_PERSPECTIVE_CREATED = 'bizops.perspective.created';
export const BIZOPS_BREADCRUMB_CLICK = 'bizops.breadcrumb.click';
export const BIZOPS_DEPLOY_AGENT_CLICK = 'bizops.deploy.agent.click';

export const BIZOPS_PERSPECTIVE_LIST_SELECT = 'bizops.perspective.list.select';

export const BIZOPS_PROCESS_TABS_CLICK = 'bizops.process.tabs.click';
export const BIZOPS_PROCESS_ANALYZEINSTANCES_CLICK = 'bizops.process.analyzeInstances.click';
export const BIZOPS_PROCESS_ACTIVITIES_ALL_CLICK = 'bizops.process.summary.activities.all.click';
export const BIZOPS_PROCESS_ACTIVITIES_SELECT = 'bizops.process.summary.activities.select';

export const BIZOPS_PROCESS_ACTIVITY_TABS_CLICK = 'bizops.process.activity.tabs.click';
export const BIZOPS_PROCESS_ACTIVITY_PROCESS_CONTEXT_CLICK = 'bizops.process.activity.processContext.click';

// Synthetic Monitoring Tracking
export const SYNTHETIC_NAV_CLICK = 'synthetic.monitoring.nav.click';
export const SYNTHETIC_TEST_CLICK = 'synthetic.monitoring.test.click';
export const SYNTHETIC_TAB_INAPP_CLICK = 'synthetic.monitoring.application.test.click';

export const SYNTHETIC_CREATE_BUTTON_CLICK = 'synthetic.monitoring.test.create.click';
export const SYNTHETIC_WIZARD__CREATE_TEST_TYPE_SWITCH = 'synthetic.monitoring.test.create.wizard.type.switch';
export const SYNTHETIC_CREATE_ADVANCED_BUTTON_CLICK = 'synthetic.monitoring.test.create.advanced.click';
export const SYNTHETIC_ADVANCED__CREATE_TEST_TYPE_SWITCH = 'synthetic.monitoring.test.create.advanced.type.switch';
export const SYNTHETIC_ADVANCED_CREATE_BUTTON_CLICK = 'synthetic.monitoring.test.advanced.create.click';
export const SYNTHETIC_WIZARD_CREATE_BUTTON_CLICK = 'synthetic.monitoring.test.wizard.create.click';

export const SYNTHETIC_RESULTS_TAB_CLICK = 'synthetic.monitoring.results.tab.click';
export const SYNTHETIC_CONFIGURATION_TAB_CLICK = 'synthetic.monitoring.configuration.tab.click';
export const SYNTHETIC_CONFIGURATION_TAB_EDIT_CLICK = 'synthetic.monitoring.configuration.tab.edit.icon.click';
export const SYNTHETIC_CONFIGURATION_TAB_DELETE_CLICK = 'synthetic.monitoring.configuration.tab.delete.icon.click';
export const SYNTHETIC_RESULTS_LIST_DETAIL_CLICK = 'synthetic.monitoring.results.list.detail.click';
export const SYNTHETIC_RESULTS_WIDGET_DETAIL_CLICK = 'synthetic.monitoring.results.widget.detail.click';

export const SYNTHETIC_CREDENTIAL_OPEN_CREATE_DIALOG_CLICK = 'synthetic.monitoring.credential.open.create.dialog.click';
export const SYNTHETIC_CREDENTIAL_SWITCH_TAB_CLICK = 'synthetic.monitoring.credential.switch_tab_click';
export const SYNTHETIC_CREDENTIAL_CREATE_BUTTON_CLICK = 'synthetic.monitoring.credential.create.button.click';
export const SYNTHETIC_CREDENTIAL_EDIT_SUBMIT_BUTTON_CLICK = 'synthetic.monitoring.credential.edit.submit.button.click';
export const SYNTHETIC_CREDENTIAL_DELETE_SUBMIT_BUTTON_CLICK =
  'synthetic.monitoring.credential.delete.submit.button.click';

// Events Page RCA Tracking
export const EVENT_RCA_SUGGESTION_HELPFUL = 'event.rca.suggestion.helpful';
export const EVENT_RCA_SUGGESTION_UNHELPFUL = 'event.rca.suggestion.unhelpful';
export const EVENT_RCA_EXPANDED_CARD = 'event.rca.expanded.card';
export const EVENT_RCA_FEEDBACK_SUBMIT = 'event.rca.feedback.submit';
export const EVENT_RCA_FEEDBACK_CLOSED_MANUALLY = 'event.rca.feedback.closed.manually';
export const EVENT_RCA_FEEDBACK_NEXT = 'event.rca.feedback.next';
export const EVENT_RCA_FEEDBACK_SKIP = 'event.rca.feedback.skip';
export const EVENT_RCA_ANALYZE_CLICK = 'event.rca.analyze.click';
export const EVENT_RCA_ENTITY_CLICK = 'event.rca.entity.click';
export const EVENT_RCA_ASSOCIATED_EVENTS_CLICK = 'event.rca.associated_events.click';
export const EVENT_RCA_TRACE_AND_ERROR_LOGS_CLICK = 'event.rca.trace_and_error_logs.click';

// Events Page Feedback Tracking
export const EVENT_FEEDBACK_SUBMIT = 'event.feedback.submit';
export const EVENT_FEEDBACK_CLOSED_MANUALLY = 'event.feedback.closed.manually';
export const EVENT_FEEDBACK_NEXT = 'event.feedback.next';
export const EVENT_FEEDBACK_SKIP = 'event.feedback.skip';
export const EVENT_FEEDBACK_POSITIVE = 'event.feedback.positive';
export const EVENT_FEEDBACK_NEGATIVE = 'event.feedback.negative';

// Event Enrichment Tracking
export const EVENT_NOTES_SUBMIT = 'event.notes.submit';
export const EVENT_NOTES_EDIT_SUBMIT = 'event.notes.edit.submit';
export const EVENT_NOTES_DELETE_SUBMIT = 'event.notes.delete.submit';
export const EVENT_AI_GENERATE_SUBMIT = 'event.ai.generate.submit';
export const EVENT_AI_SHOW_MORE_INCIDENTS = 'event.ai.show.more.incidents';
export const EVENT_AI_SHOW_MORE_ACTIONS = 'event.ai.show.more.actions';
export const EVENT_AI_SHARE_OPENED = 'event.ai.share.opened';
export const EVENT_AI_SHARE_SUBMIT = 'event.ai.share.submit';
export const EVENT_AI_RUN_ACTION = 'event.ai.run.action';
export const EVENT_SIDE_PANEL_CLICK = 'event.side.panel.click';

// Notes and Activity Summary Feedback Tracking
export const NOTES_SUMMARY_FEEDBACK_POSITIVE = 'notes.summary.feedback.positive';
export const NOTES_SUMMARY_FEEDBACK_NEGATIVE = 'notes.summary.feedback.negative';

// Flow Map Tracking (services and endpoints)
export const FLOW_MAP_CLICK = 'flowmap.click';
export const FLOW_MAP_CLICK_CALLS = 'flowmap.click.calls';
export const FLOW_MAP_CLICK_LATENCY = 'flowmap.click.latency';
export const FLOW_MAP_CLICK_ERROR = 'flowmap.click.error';
export const FLOW_MAP_CLICK_SIMULATION = 'flowmap.click.simulation';
export const FLOW_MAP_CLICK_EXPAND_LEVEL = 'flowmap.click.level.expand';

// Vulnerabilities tracking
export const VULNERABILITIES_TAB_IN_APP_CLICK = 'vulnerabilities.application.tab.click';
export const VULNERABILITIES_BUTTON_IN_CONTAINER_DASHBOARD_CLICK = 'vulnerabilities.container.dashboard.click';
export const VULNERABILITIES_CSV_EXPORT_CLICK = 'vulnerabilities.csv.export.click';
export const VULNERABILITIES_NAVIGATION_CLICK = 'vulnerabilities.navigation.click';
export const CVE_TAB_IN_VULNERABILITIES_CLICK = 'cve.vulnerabilities.tab.click';
export const DETECTIONS_TAB_IN_VULNERABILITIES_CLICK = 'detections.vulnerabilities.tab.click';
export const VULNERABILITIES_CONCERT_TRY_CLICK = 'vulnerabilities.concert.try.click';
export const VULNERABILITIES_CONCERT_DOCS_CLICK = 'vulnerabilities.concert.docs.click';
export const VULNERABILITIES_CONCERT_BUY_CLICK = 'vulnerabilities.concert.buy.click';
export const VULNERABILITIES_CONCERT_SUPPORT_CLICK = 'vulnerabilities.concert.support.click';
export const VULNERABILITIES_CVE_TAB_ROW_CLICK = 'vulnerabilities.cve.tab.row.click';
export const VULNERABILITIES_CVE_DETAIL_VIEW_ON_CONCERT_CLICK = 'vulnerabilities.view.on.concert.click';
export const VULNERABILITIES_CVE_DETAIL_ANY_AFFECTED_APPLICATION_CLICK =
  'vulnerabilities.cve.detail.any.affected.application.click';
export const VULNERABILITIES_CVE_DETAIL_ANY_AFFECTED_ENTITY_CLICK =
  'vulnerabilities.cve.detail.any.affected.entity.click';
export const VULNERABILITIES_DETECTIONS_TAB_ROW_CLICK = 'vulnerabilities.detections.tab.row.click';
export const VULNERABILITIES_DETECTIONS_DETAIL_ON_ENTITY_CLICK = 'vulnerabilities.detections.detail.on.entity.click';
export const VULNERABILITIES_DETECTIONS_DETAIL_ANY_ASSOCIATED_APPLICATION_CLICK =
  'vulnerabilities.detections.detail.any.associated.application.click';
