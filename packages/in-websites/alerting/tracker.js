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

export const websitesAlertingAddAlert = (pathname, websiteName) =>
  track(WEBSITES_ALERTING_ADD_ALERT, { pathname, websiteName });
export const websitesAlertingCloseDialog = e => track(WEBSITES_ALERTING_CLOSE_DIALOG, e);
export const websitesAlertingSwitchMode = e => track(WEBSITES_ALERTING_SWITCH_MODE, e);
export const websitesAlertingAlertCreated = e => track(WEBSITES_ALERTING_CREATE_ALERT, e);

export const websitesAlertingJsErrorsMsgChanged = e => track(WEBSITES_ALERTING_JS_ERRORS_MSG_CHANGED, e);
export const websitesAlertingJsErrorsOperatorChanged = e => track(WEBSITES_ALERTING_JS_ERRORS_OPERATOR_CHANGED, e);
export const websitesAlertingJsErrorsOpenErrorSelectView = e =>
  track(WEBSITES_ALERTING_JS_ERRORS_OPEN_ERROR_SELECT_VIEW, e);
export const websitesAlertingJsErrorsErrorSelected = e => track(WEBSITES_ALERTING_JS_ERRORS_ERROR_SELECTED, e);

export const websitesAlertingStatusCodeChanged = e => track(WEBSITES_ALERTING_STATUS_CODE_CHANGED, e);
export const websitesAlertingThresholdMetricChanged = e => track(WEBSITES_ALERTING_THRESHOLD_METRIC_CHANGED, e);
export const websitesAlertingThresholdOperatorChanged = e => track(WEBSITES_ALERTING_THRESHOLD_OPERATOR_CHANGED, e);
export const websitesAlertingThresholdValueChanged = e => track(WEBSITES_ALERTING_THRESHOLD_VALUE_CHANGED, e);
export const websitesAlertingAggregationChanged = e => track(WEBSITES_ALERTING_AGGREGATION_CHANGED, e);
export const websitesAlertingThresholdTypeChanged = e => track(WEBSITES_ALERTING_THRESHOLD_TYPE_CHANGED, e);
export const websitesAlertingThresholdDeviationFactorChanged = e =>
  track(WEBSITES_ALERTING_THRESHOLD_DEVIATION_FACTOR_CHANGED, e);
export const websitesAlertingFilterAdd = e => track(WEBSITES_ALERTING_FILTER_ADD, e);
export const websitesAlertingFilterRemove = e => track(WEBSITES_ALERTING_FILTER_REMOVE, e);
export const websitesAlertingFilterEdit = e => track(WEBSITES_ALERTING_FILTER_EDIT, e);
export const websitesAlertingFilterSet = e => track(WEBSITES_ALERTING_FILTER_SET, e);
export const websitesAlertingStepSwitch = e => track(WEBSITES_ALERTING_STEP_SWITCH, e);
export const websitesAlertingBlueprintChanged = e => track(WEBSITES_ALERTING_BLUEPRINT_CHANGED, e);
export const websitesAlertingAdditionalPropsTitleChanged = e =>
  track(WEBSITES_ALERTING_ADDITIONAL_PROPS_TITLE_CHANGE, e);
export const websitesAlertingAdditionalPropsAlertLevelChanged = e =>
  track(WEBSITES_ALERTING_ADDITIONAL_PROPS_ALERT_LEVEL_CHANGED, e);
export const websitesAlertingAdditionalPropsTriggerChanged = e =>
  track(WEBSITES_ALERTING_ADDITIONAL_PROPS_INCIDENT_TRIGGER_CHANGED, e);
export const websitesAlertingAdditionalPropsDescriptionChanged = e =>
  track(WEBSITES_ALERTING_ADDITIONAL_PROPS_DESCRIPTION_CHANGED, e);
export const websitesAlertingListAlertPaused = e => track(WEBSITES_ALERTING_LIST_ALERT_PAUSED, e);
export const websitesAlertingListAlertResumed = e => track(WEBSITES_ALERTING_LIST_ALERT_RESUMED, e);
export const websitesAlertingListAlertDeleted = e => track(WEBSITES_ALERTING_LIST_ALERT_DELETED, e);

export const websitesAlertingAlertRevisionChanged = e => track(WEBSITES_ALERTING_ALERT_REVISION_CHANGED, e);
export const websitesAlertingAlertPaused = e => track(WEBSITES_ALERTING_ALERT_PAUSED, e);
export const websitesAlertingAlertResumed = e => track(WEBSITES_ALERTING_ALERT_RESUMED, e);
export const websitesAlertingAlertDeleted = e => track(WEBSITES_ALERTING_ALERT_DELETED, e);
export const websitesAlertingAlertEdit = e => track(WEBSITES_ALERTING_ALERT_EDIT, e);

export const websitesAlertingEventDetailsGoToAnalyze = e => track(WEBSITES_ALERTING_EVENT_DETAILS_GO_TO_ANALYZE, e);
export const websitesAlertingEventDetailsViewEditConfig = e =>
  track(WEBSITES_ALERTING_EVENT_DETAILS_VIEW_EDIT_CONFIG, e);
