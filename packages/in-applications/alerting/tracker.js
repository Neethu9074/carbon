import { track, APPLICATIONS_ALERTING_ADD_ALERT } from 'in-services/tracking/tracking';

export const applicationsAlertingAddAlert = (pathname, websiteName) =>
  track(APPLICATIONS_ALERTING_ADD_ALERT, { pathname, websiteName });
