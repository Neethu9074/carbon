/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  WEBSITES_ALERTING_ADD_ALERT,
  WEBSITES_ALERTING_SWITCH_MODE,
  WEBSITES_ALERTING_CREATE_ALERT,
  WEBSITES_ALERTING_JS_ERRORS_OPERATOR_CHANGED,
  WEBSITES_ALERTING_JS_ERRORS_OPEN_ERROR_SELECT_VIEW,
  WEBSITES_ALERTING_JS_ERRORS_ERROR_SELECTED,
  WEBSITES_ALERTING_STATUS_CODE_CHANGED,
  WEBSITES_ALERTING_THRESHOLD_METRIC_CHANGED,
  WEBSITES_ALERTING_THRESHOLD_OPERATOR_CHANGED,
  WEBSITES_ALERTING_THRESHOLD_VALUE_CHANGED,
  WEBSITES_ALERTING_THRESHOLD_TYPE_HELP_ICON_HOVERED,
  WEBSITES_ALERTING_AGGREGATION_CHANGED,
  WEBSITES_ALERTING_THRESHOLD_TYPE_CHANGED,
  WEBSITES_ALERTING_FILTER_ADD,
  WEBSITES_ALERTING_FILTER_REMOVE,
  WEBSITES_ALERTING_FILTER_EDIT,
  WEBSITES_ALERTING_FILTER_SET,
  WEBSITES_ALERTING_STEP_SWITCH,
  WEBSITES_ALERTING_BLUEPRINT_CHANGED,
  WEBSITES_ALERTING_ADDITIONAL_PROPS_ALERT_LEVEL_CHANGED,
  WEBSITES_ALERTING_ADDITIONAL_PROPS_INCIDENT_TRIGGER_CHANGED,
  WEBSITES_ALERTING_ADDITIONAL_PROPS_DESCRIPTION_CHANGED,
  WEBSITES_ALERTING_ADDITIONAL_PROPS_TITLE_CHANGE,
  WEBSITES_ALERTING_LIST_ALERT_PAUSED,
  WEBSITES_ALERTING_LIST_ALERT_DELETED,
  WEBSITES_ALERTING_LIST_ALERT_RESUMED,
  WEBSITES_ALERTING_ALERT_PAUSED,
  WEBSITES_ALERTING_ALERT_RESUMED,
  WEBSITES_ALERTING_ALERT_DELETED,
  WEBSITES_ALERTING_ALERT_EDIT,
  WEBSITES_ALERTING_CLOSE_DIALOG,
  WEBSITES_ALERTING_JS_ERRORS_MSG_CHANGED,
  WEBSITES_ALERTING_THRESHOLD_DEVIATION_FACTOR_CHANGED,
  WEBSITES_ALERTING_ALERT_REVISION_CHANGED,
  WEBSITES_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE,
  WEBSITES_ALERTING_EVENT_DETAILS_VIEW_EDIT_CONFIG
} from 'in-services/tracking/tracking';

export const websitesAlertingAddAlert = (pathname: string, websiteName: string) =>
  track(WEBSITES_ALERTING_ADD_ALERT, { pathname, websiteName });
export const websitesAlertingCloseDialog = (e: any) => track(WEBSITES_ALERTING_CLOSE_DIALOG, e);
export const websitesAlertingSwitchMode = (e: any) => track(WEBSITES_ALERTING_SWITCH_MODE, e);
export const websitesAlertingAlertCreated = (e: any) => track(WEBSITES_ALERTING_CREATE_ALERT, e);

export const websitesAlertingJsErrorsMsgChanged = (e: any) => track(WEBSITES_ALERTING_JS_ERRORS_MSG_CHANGED, e);
export const websitesAlertingJsErrorsOperatorChanged = (e: any) =>
  track(WEBSITES_ALERTING_JS_ERRORS_OPERATOR_CHANGED, e);
export const websitesAlertingJsErrorsOpenErrorSelectView = (e: any) =>
  track(WEBSITES_ALERTING_JS_ERRORS_OPEN_ERROR_SELECT_VIEW, e);
export const websitesAlertingJsErrorsErrorSelected = (e: any) => track(WEBSITES_ALERTING_JS_ERRORS_ERROR_SELECTED, e);

export const websitesAlertingStatusCodeChanged = (e: any) => track(WEBSITES_ALERTING_STATUS_CODE_CHANGED, e);
export const websitesAlertingThresholdMetricChanged = (e: any) => track(WEBSITES_ALERTING_THRESHOLD_METRIC_CHANGED, e);
export const websitesAlertingThresholdOperatorChanged = (e: any) =>
  track(WEBSITES_ALERTING_THRESHOLD_OPERATOR_CHANGED, e);
export const websitesAlertingThresholdValueChanged = (e: any) => track(WEBSITES_ALERTING_THRESHOLD_VALUE_CHANGED, e);
export const websitesAlertingAggregationChanged = (e: any) => track(WEBSITES_ALERTING_AGGREGATION_CHANGED, e);
export const websitesAlertingThresholdTypeChanged = (e: any) => track(WEBSITES_ALERTING_THRESHOLD_TYPE_CHANGED, e);
export const websitesAlertingThresholdTypeHelpIconHovered = (e: any) =>
  track(WEBSITES_ALERTING_THRESHOLD_TYPE_HELP_ICON_HOVERED, e);
export const websitesAlertingThresholdDeviationFactorChanged = (e: any) =>
  track(WEBSITES_ALERTING_THRESHOLD_DEVIATION_FACTOR_CHANGED, e);
export const websitesAlertingFilterAdd = (e: any) => track(WEBSITES_ALERTING_FILTER_ADD, e);
export const websitesAlertingFilterRemove = (e: any) => track(WEBSITES_ALERTING_FILTER_REMOVE, e);
export const websitesAlertingFilterEdit = (e: any) => track(WEBSITES_ALERTING_FILTER_EDIT, e);
export const websitesAlertingFilterSet = (e: any) => track(WEBSITES_ALERTING_FILTER_SET, e);
export const websitesAlertingStepSwitch = (e: any) => track(WEBSITES_ALERTING_STEP_SWITCH, e);
export const websitesAlertingBlueprintChanged = (e: any) => track(WEBSITES_ALERTING_BLUEPRINT_CHANGED, e);
export const websitesAlertingAdditionalPropsTitleChanged = (e: any) =>
  track(WEBSITES_ALERTING_ADDITIONAL_PROPS_TITLE_CHANGE, e);
export const websitesAlertingAdditionalPropsAlertLevelChanged = (e: any) =>
  track(WEBSITES_ALERTING_ADDITIONAL_PROPS_ALERT_LEVEL_CHANGED, e);
export const websitesAlertingAdditionalPropsTriggerChanged = (e: any) =>
  track(WEBSITES_ALERTING_ADDITIONAL_PROPS_INCIDENT_TRIGGER_CHANGED, e);
export const websitesAlertingAdditionalPropsDescriptionChanged = (e: any) =>
  track(WEBSITES_ALERTING_ADDITIONAL_PROPS_DESCRIPTION_CHANGED, e);
export const websitesAlertingListAlertPaused = (e: any) => track(WEBSITES_ALERTING_LIST_ALERT_PAUSED, e);
export const websitesAlertingListAlertResumed = (e: any) => track(WEBSITES_ALERTING_LIST_ALERT_RESUMED, e);
export const websitesAlertingListAlertDeleted = (e: any) => track(WEBSITES_ALERTING_LIST_ALERT_DELETED, e);

export const websitesAlertingAlertRevisionChanged = (e: any) => track(WEBSITES_ALERTING_ALERT_REVISION_CHANGED, e);
export const websitesAlertingAlertPaused = (e: any) => track(WEBSITES_ALERTING_ALERT_PAUSED, e);
export const websitesAlertingAlertResumed = (e: any) => track(WEBSITES_ALERTING_ALERT_RESUMED, e);
export const websitesAlertingAlertDeleted = (e: any) => track(WEBSITES_ALERTING_ALERT_DELETED, e);
export const websitesAlertingAlertEdit = (e: any) => track(WEBSITES_ALERTING_ALERT_EDIT, e);

export const websitesAlertingEventDetailsGoToAnalyze = (e: any) =>
  track(WEBSITES_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE, e);
export const websitesAlertingEventDetailsViewEditConfig = (e: any) =>
  track(WEBSITES_ALERTING_EVENT_DETAILS_VIEW_EDIT_CONFIG, e);
