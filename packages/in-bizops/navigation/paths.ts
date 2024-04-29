/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { getRootPathPredicate } from 'in-stores/navigation/paths';

export const summaryTab = '/summary';
export const activitiesTab = '/activities';
export const alertsTab = '/alerts';
export const servicesTab = '/services';

export const businessProcessPath = '/businessProcesses';
export const activitiesPath = '/bizopsActivities';
export const smartAlertsPath = '/bizopsSmartAlerts';
export const businessActivityPath = '/businessActivity';
export const businessProcessDashboard = '/businessProcess';
export const businessActivityDashboard = `${businessProcessDashboard}${businessActivityPath}`;
export const businessProcessAlertListPath = `${businessProcessDashboard}${alertsTab}`;
export const businessProcessSummaryPath = `${businessProcessDashboard}${summaryTab}`;
export const businessProcessActivityListPath = `${businessProcessDashboard}${activitiesTab}`;
export const businessActivitySummaryPath = `${businessActivityDashboard}${summaryTab}`;
export const businessActivityServiceListPath = `${businessActivityDashboard}${servicesTab}`;

export const isBizOpsView = getRootPathPredicate(
  businessProcessPath,
  activitiesPath,
  smartAlertsPath,
  businessProcessSummaryPath,
  businessProcessActivityListPath,
  businessActivitySummaryPath
);
