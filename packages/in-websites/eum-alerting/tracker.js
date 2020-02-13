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
  WEBSITES_ALERTING_CLOSE_DIALOG,
  WEBSITES_ALERTING_JS_ERRORS_MSG_CHANGED,
  WEBSITES_ALERTING_THRESHOLD_DEVIATION_FACTOR_CHANGED
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
