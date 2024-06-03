/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { getRootPathPredicate } from 'in-stores/navigation/paths';

// Generalized path names
export const summaryTab = '/summary';
export const activitiesTab = '/activities';
export const alertsTab = '/alerts';
export const servicesTab = '/services';
export const configurationTab = '/configuration';

// Processes and activities
export const businessProcessPath = '/businessProcesses';
export const businessProcessDashboard = '/businessProcess';
export const businessActivityPath = '/businessActivity';
export const businessActivityDashboard = `${businessProcessDashboard}${businessActivityPath}`;
export const businessProcessSummaryPath = `${businessProcessDashboard}${summaryTab}`;
export const businessProcessActivityListPath = `${businessProcessDashboard}${activitiesTab}`;
export const businessActivitySummaryPath = `${businessActivityDashboard}${summaryTab}`;

// Perspective paths
export const businessPerspectivesPath = '/businessPerspectives';
export const businessPerspectiveDashboard = '/businessPerspective';
export const businessPerspectiveSummaryPath = `${businessPerspectiveDashboard}${summaryTab}`;
export const businessPerspectiveConfigPath = `${businessPerspectiveDashboard}${configurationTab}`;

export const businessActivityServiceListPath = `${businessActivityDashboard}${servicesTab}`;

export const isBizOpsView = getRootPathPredicate(
  businessProcessPath,
  businessPerspectivesPath,
  businessPerspectiveDashboard,
  businessProcessSummaryPath,
  businessProcessActivityListPath,
  businessActivitySummaryPath
);
