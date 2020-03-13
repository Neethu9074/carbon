import {
  track,
  APPLICATIONS_ALERTING_ADD_ALERT,
  APPLICATIONS_ALERTING_LIST_ALERT_PAUSED,
  APPLICATIONS_ALERTING_LIST_ALERT_RESUMED,
  APPLICATIONS_ALERTING_LIST_ALERT_DELETED
} from 'in-services/tracking/tracking';

export const applicationsAlertingAddAlert = (pathname, websiteName) =>
  track(APPLICATIONS_ALERTING_ADD_ALERT, { pathname, websiteName });

export const applicationsAlertingListAlertPaused = e => track(APPLICATIONS_ALERTING_LIST_ALERT_PAUSED, e);
export const applicationsAlertingListAlertResumed = e => track(APPLICATIONS_ALERTING_LIST_ALERT_RESUMED, e);
export const applicationsAlertingListAlertDeleted = e => track(APPLICATIONS_ALERTING_LIST_ALERT_DELETED, e);
