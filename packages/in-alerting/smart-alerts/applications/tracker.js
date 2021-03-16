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
  APPLICATIONS_ALERTING_ALERT_REVISION_CHANGED,
  APPLICATIONS_ALERTING_ALERT_PAUSED,
  APPLICATIONS_ALERTING_ALERT_RESUMED,
  APPLICATIONS_ALERTING_ALERT_DELETED,
  APPLICATIONS_ALERTING_ADDITIONAL_PROPS_TITLE_CHANGE,
  APPLICATIONS_ALERTING_ADDITIONAL_PROPS_ALERT_LEVEL_CHANGED,
  APPLICATIONS_ALERTING_ADDITIONAL_PROPS_INCIDENT_TRIGGER_CHANGED,
  APPLICATIONS_ALERTING_ADDITIONAL_PROPS_DESCRIPTION_CHANGED,
  APPLICATIONS_ALERTING_BLUEPRINT_CHANGED,
  APPLICATIONS_ALERTING_THRESHOLD_OPERATOR_CHANGED,
  APPLICATIONS_ALERTING_THRESHOLD_VALUE_CHANGED,
  APPLICATIONS_ALERTING_THRESHOLD_AGGREGATION_CHANGED,
  APPLICATIONS_ALERTING_THRESHOLD_TYPE_CHANGED,
  APPLICATIONS_ALERTING_THRESHOLD_DEVIATION_FACTOR_CHANGED,
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

export const applicationsAlertingAddAlert = (pathname, applicationName) =>
  track(APPLICATIONS_ALERTING_ADD_ALERT, { pathname, applicationName });

export const applicationsAlertingCloseDialog = e => track(APPLICATIONS_ALERTING_CLOSE_DIALOG, e);
export const applicationsAlertingStepSwitch = e => track(APPLICATIONS_ALERTING_STEP_SWITCH, e);
export const applicationsAlertingSwitchMode = e => track(APPLICATIONS_ALERTING_SWITCH_MODE, e);
export const applicationsAlertingAlertCreated = e => track(APPLICATIONS_ALERTING_CREATE_ALERT, e);

export const applicationsAlertingListAlertPaused = e => track(APPLICATIONS_ALERTING_LIST_ALERT_PAUSED, e);
export const applicationsAlertingListAlertResumed = e => track(APPLICATIONS_ALERTING_LIST_ALERT_RESUMED, e);
export const applicationsAlertingListAlertDeleted = e => track(APPLICATIONS_ALERTING_LIST_ALERT_DELETED, e);

export const applicationsAlertingAlertRevisionChanged = e => track(APPLICATIONS_ALERTING_ALERT_REVISION_CHANGED, e);
export const applicationsAlertingAlertPaused = e => track(APPLICATIONS_ALERTING_ALERT_PAUSED, e);
export const applicationsAlertingAlertResumed = e => track(APPLICATIONS_ALERTING_ALERT_RESUMED, e);
export const applicationsAlertingAlertDeleted = e => track(APPLICATIONS_ALERTING_ALERT_DELETED, e);
export const applicationsAlertingAlertEdit = e => track(APPLICATIONS_ALERTING_ALERT_EDIT, e);
export const applicationsAlertingAdditionalPropsTitleChanged = e =>
  track(APPLICATIONS_ALERTING_ADDITIONAL_PROPS_TITLE_CHANGE, e);
export const applicationsAlertingAdditionalPropsAlertLevelChanged = e =>
  track(APPLICATIONS_ALERTING_ADDITIONAL_PROPS_ALERT_LEVEL_CHANGED, e);
export const applicationsAlertingAdditionalPropsTriggerChanged = e =>
  track(APPLICATIONS_ALERTING_ADDITIONAL_PROPS_INCIDENT_TRIGGER_CHANGED, e);
export const applicationsAlertingAdditionalPropsDescriptionChanged = e =>
  track(APPLICATIONS_ALERTING_ADDITIONAL_PROPS_DESCRIPTION_CHANGED, e);

export const applicationsAlertingBlueprintChanged = e => track(APPLICATIONS_ALERTING_BLUEPRINT_CHANGED, e);

export const applicationsAlertingThresholdOperatorChanged = e =>
  track(APPLICATIONS_ALERTING_THRESHOLD_OPERATOR_CHANGED, e);
export const applicationsAlertingThresholdValueChanged = e => track(APPLICATIONS_ALERTING_THRESHOLD_VALUE_CHANGED, e);
export const applicationsAlertingThresholdAggregationChanged = e =>
  track(APPLICATIONS_ALERTING_THRESHOLD_AGGREGATION_CHANGED, e);
export const applicationsAlertingThresholdTypeChanged = e => track(APPLICATIONS_ALERTING_THRESHOLD_TYPE_CHANGED, e);
export const applicationsAlertingThresholdDeviationFactorChanged = e =>
  track(APPLICATIONS_ALERTING_THRESHOLD_DEVIATION_FACTOR_CHANGED, e);

export const applicationsAlertingLogMsgChanged = e => track(APPLICATIONS_ALERTING_LOG_MSG_CHANGED, e);
export const applicationsAlertingLogLevelChanged = e => track(APPLICATIONS_ALERTING_LOG_LEVEL_CHANGED, e);
export const applicationsAlertingLogOperatorChanged = e => track(APPLICATIONS_ALERTING_LOG_OPERATOR_CHANGED, e);
export const applicationsAlertingLogOpenMsgSelectView = e => track(APPLICATIONS_ALERTING_LOG_OPEN_MSG_SELECT_VIEW, e);
export const applicationsAlertingLogMsgSelected = e => track(APPLICATIONS_ALERTING_LOG_MSG_SELECTED, e);
export const applicationsAlertingFilterAdd = e => track(APPLICATIONS_ALERTING_FILTER_ADD, e);
export const applicationsAlertingFilterRemove = e => track(APPLICATIONS_ALERTING_FILTER_REMOVE, e);
export const applicationsAlertingFilterEdit = e => track(APPLICATIONS_ALERTING_FILTER_EDIT, e);
export const applicationsAlertingFilterSet = e => track(APPLICATIONS_ALERTING_FILTER_SET, e);

export const applicationsAlertingStatusCodeChanged = e => track(APPLICATIONS_ALERTING_STATUS_CODE_CHANGED, e);

export const applicationsAlertingEventDetailsGoToAnalyze = e =>
  track(APPLICATIONS_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE, e);
export const applicationsAlertingEventDetailsViewEditConfig = e =>
  track(APPLICATIONS_ALERTING_EVENT_DETAILS_VIEW_EDIT_CONFIG, e);
