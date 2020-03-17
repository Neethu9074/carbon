import {
  track,
  APPLICATIONS_ALERTING_ADD_ALERT,
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
  APPLICATIONS_ALERTING_ADDITIONAL_PROPS_DESCRIPTION_CHANGED
} from 'in-services/tracking/tracking';

export const applicationsAlertingAddAlert = (pathname, websiteName) =>
  track(APPLICATIONS_ALERTING_ADD_ALERT, { pathname, websiteName });

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
