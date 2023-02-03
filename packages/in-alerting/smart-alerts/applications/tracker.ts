/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  APPLICATIONS_ALERTING_ADD_ALERT,
  APPLICATIONS_ALERTING_SWITCH_MODE,
  APPLICATIONS_ALERTING_CREATE_ALERT,
  APPLICATIONS_ALERTING_LIST_ALERT_PAUSED,
  APPLICATIONS_ALERTING_LIST_ALERT_RESUMED,
  APPLICATIONS_ALERTING_LIST_ALERT_DELETED,
  APPLICATIONS_ALERTING_ALERT_EDIT,
  APPLICATIONS_ALERTING_ALERT_DUPLICATE,
  APPLICATIONS_ALERTING_ALERT_REVISION_CHANGED,
  APPLICATIONS_ALERTING_ALERT_PAUSED,
  APPLICATIONS_ALERTING_ALERT_RESUMED,
  APPLICATIONS_ALERTING_ALERT_DELETED,
  APPLICATIONS_ALERTING_ADDITIONAL_PROPS_TITLE_CHANGE,
  APPLICATIONS_ALERTING_ADDITIONAL_PROPS_ALERT_LEVEL_CHANGED,
  APPLICATIONS_ALERTING_ADDITIONAL_PROPS_INCIDENT_TRIGGER_CHANGED,
  APPLICATIONS_ALERTING_ADDITIONAL_PROPS_DESCRIPTION_CHANGED,
  APPLICATIONS_ALERTING_BLUEPRINT_CHANGED,
  APPLICATIONS_ALERTING_THRESHOLD_METRIC_CHANGED,
  APPLICATIONS_ALERTING_THRESHOLD_OPERATOR_CHANGED,
  APPLICATIONS_ALERTING_THRESHOLD_VALUE_CHANGED,
  APPLICATIONS_ALERTING_THRESHOLD_AGGREGATION_CHANGED,
  APPLICATIONS_ALERTING_THRESHOLD_TYPE_CHANGED,
  APPLICATIONS_ALERTING_THRESHOLD_DEVIATION_FACTOR_CHANGED,
  APPLICATIONS_ALERTING_THRESHOLD_TYPE_HELP_ICON_HOVERED,
  APPLICATIONS_ALERTING_CLOSE_DIALOG,
  APPLICATIONS_ALERTING_FILTER_ADD,
  APPLICATIONS_ALERTING_FILTER_REMOVE,
  APPLICATIONS_ALERTING_FILTER_EDIT,
  APPLICATIONS_ALERTING_FILTER_SET,
  APPLICATIONS_ALERTING_STEP_SWITCH,
  APPLICATIONS_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE,
  APPLICATIONS_ALERTING_EVENT_DETAILS_VIEW_EDIT_CONFIG,
  APPLICATIONS_ALERTING_LOG_OPEN_MSG_SELECT_VIEW,
  APPLICATIONS_ALERTING_LOG_MSG_SELECTED,
  APPLICATIONS_ALERTING_LOG_OPERATOR_CHANGED,
  APPLICATIONS_ALERTING_LOG_LEVEL_CHANGED,
  APPLICATIONS_ALERTING_LOG_MSG_CHANGED,
  APPLICATIONS_ALERTING_STATUS_CODE_CHANGED
} from 'in-services/tracking/tracking';

export const applicationsAlertingAddAlert = (pathname: string, applicationName: string) =>
  track(APPLICATIONS_ALERTING_ADD_ALERT, { pathname, applicationName });

export const applicationsAlertingCloseDialog = (e: any) => track(APPLICATIONS_ALERTING_CLOSE_DIALOG, e);
export const applicationsAlertingStepSwitch = (e: any) => track(APPLICATIONS_ALERTING_STEP_SWITCH, e);
export const applicationsAlertingSwitchMode = (e: any) => track(APPLICATIONS_ALERTING_SWITCH_MODE, e);
export const applicationsAlertingAlertCreated = (e: any) => track(APPLICATIONS_ALERTING_CREATE_ALERT, e);

export const applicationsAlertingListAlertPaused = (e: any) => track(APPLICATIONS_ALERTING_LIST_ALERT_PAUSED, e);
export const applicationsAlertingListAlertResumed = (e: any) => track(APPLICATIONS_ALERTING_LIST_ALERT_RESUMED, e);
export const applicationsAlertingListAlertDeleted = (e: any) => track(APPLICATIONS_ALERTING_LIST_ALERT_DELETED, e);

export const applicationsAlertingAlertRevisionChanged = (e: any) =>
  track(APPLICATIONS_ALERTING_ALERT_REVISION_CHANGED, e);
export const applicationsAlertingAlertPaused = (e: any) => track(APPLICATIONS_ALERTING_ALERT_PAUSED, e);
export const applicationsAlertingAlertResumed = (e: any) => track(APPLICATIONS_ALERTING_ALERT_RESUMED, e);
export const applicationsAlertingAlertDeleted = (e: any) => track(APPLICATIONS_ALERTING_ALERT_DELETED, e);
export const applicationsAlertingAlertEdit = (e: any) => track(APPLICATIONS_ALERTING_ALERT_EDIT, e);
export const applicationsAlertingAlertDuplicate = (e: any) => track(APPLICATIONS_ALERTING_ALERT_DUPLICATE, e);
export const applicationsAlertingAdditionalPropsTitleChanged = (e: any) =>
  track(APPLICATIONS_ALERTING_ADDITIONAL_PROPS_TITLE_CHANGE, e);
export const applicationsAlertingAdditionalPropsAlertLevelChanged = (e: any) =>
  track(APPLICATIONS_ALERTING_ADDITIONAL_PROPS_ALERT_LEVEL_CHANGED, e);
export const applicationsAlertingAdditionalPropsTriggerChanged = (e: any) =>
  track(APPLICATIONS_ALERTING_ADDITIONAL_PROPS_INCIDENT_TRIGGER_CHANGED, e);
export const applicationsAlertingAdditionalPropsDescriptionChanged = (e: any) =>
  track(APPLICATIONS_ALERTING_ADDITIONAL_PROPS_DESCRIPTION_CHANGED, e);

export const applicationsAlertingBlueprintChanged = (e: any) => track(APPLICATIONS_ALERTING_BLUEPRINT_CHANGED, e);

export const applicationsAlertingThresholdMetricChanged = (e: any) =>
  track(APPLICATIONS_ALERTING_THRESHOLD_METRIC_CHANGED, e);
export const applicationsAlertingThresholdOperatorChanged = (e: any) =>
  track(APPLICATIONS_ALERTING_THRESHOLD_OPERATOR_CHANGED, e);
export const applicationsAlertingThresholdValueChanged = (e: any) =>
  track(APPLICATIONS_ALERTING_THRESHOLD_VALUE_CHANGED, e);
export const applicationsAlertingThresholdAggregationChanged = (e: any) =>
  track(APPLICATIONS_ALERTING_THRESHOLD_AGGREGATION_CHANGED, e);
export const applicationsAlertingThresholdTypeChanged = (e: any) =>
  track(APPLICATIONS_ALERTING_THRESHOLD_TYPE_CHANGED, e);
export const applicationsAlertingThresholdTypeHelpIconHovered = (e: any) =>
  track(APPLICATIONS_ALERTING_THRESHOLD_TYPE_HELP_ICON_HOVERED, e);
export const applicationsAlertingThresholdDeviationFactorChanged = (e: any) =>
  track(APPLICATIONS_ALERTING_THRESHOLD_DEVIATION_FACTOR_CHANGED, e);

export const applicationsAlertingLogMsgChanged = (e: any) => track(APPLICATIONS_ALERTING_LOG_MSG_CHANGED, e);
export const applicationsAlertingLogLevelChanged = (e: any) => track(APPLICATIONS_ALERTING_LOG_LEVEL_CHANGED, e);
export const applicationsAlertingLogOperatorChanged = (e: any) => track(APPLICATIONS_ALERTING_LOG_OPERATOR_CHANGED, e);
export const applicationsAlertingLogOpenMsgSelectView = (e: any) =>
  track(APPLICATIONS_ALERTING_LOG_OPEN_MSG_SELECT_VIEW, e);
export const applicationsAlertingLogMsgSelected = (e: any) => track(APPLICATIONS_ALERTING_LOG_MSG_SELECTED, e);
export const applicationsAlertingFilterAdd = (e: any) => track(APPLICATIONS_ALERTING_FILTER_ADD, e);
export const applicationsAlertingFilterRemove = (e: any) => track(APPLICATIONS_ALERTING_FILTER_REMOVE, e);
export const applicationsAlertingFilterEdit = (e: any) => track(APPLICATIONS_ALERTING_FILTER_EDIT, e);
export const applicationsAlertingFilterSet = (e: any) => track(APPLICATIONS_ALERTING_FILTER_SET, e);

export const applicationsAlertingStatusCodeChanged = (e: any) => track(APPLICATIONS_ALERTING_STATUS_CODE_CHANGED, e);

export const applicationsAlertingEventDetailsGoToAnalyze = (e: any) =>
  track(APPLICATIONS_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE, e);
export const applicationsAlertingEventDetailsViewEditConfig = (e: any) =>
  track(APPLICATIONS_ALERTING_EVENT_DETAILS_VIEW_EDIT_CONFIG, e);
