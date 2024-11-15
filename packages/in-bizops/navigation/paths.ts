/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ActivityMatrixParams, ProcessMatrixParams } from 'in-bizops/utils/types';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { getRootPathPredicate } from 'in-stores/navigation/paths';

// Generalized path names
export const summaryTab = '/summary';
export const activitiesTab = '/activities';
export const flowMapTab = '/flowMap';
export const alertsTab = '/alerts';
export const servicesTab = '/services';
export const configurationTab = '/configuration';

// Processes
export const businessProcessPath = '/businessProcesses';
export const businessProcessDashboard = '/businessProcess';
export const businessProcessSummaryPath = `${businessProcessDashboard}${summaryTab}`;
export const businessProcessActivityListPath = `${businessProcessDashboard}${activitiesTab}`;
export const businessProcessFlowMapPath = `${businessProcessDashboard}${flowMapTab}`;

// Activities
export const businessActivityPath = '/businessActivity';
export const businessActivityDashboard = `${businessProcessDashboard}${businessActivityPath}`;
export const businessActivitySummaryPath = `${businessActivityDashboard}${summaryTab}`;

// Perspective paths
export const businessPerspectivesPath = '/businessPerspectives';
export const businessPerspectiveDashboard = '/businessPerspective';
export const businessPerspectiveSummaryPath = `${businessPerspectiveDashboard}${summaryTab}`;
export const businessPerspectiveConfigPath = `${businessPerspectiveDashboard}${configurationTab}`;

export const businessActivityServiceListPath = `${businessActivityDashboard}${servicesTab}`;

export const isBizOpsView = getRootPathPredicate(
  businessProcessPath,
  businessProcessDashboard,
  businessPerspectivesPath,
  businessPerspectiveDashboard
);

/**
 * Util to get the proper link to a business process dashboard given the necessary process details.
 *
 * @param     props   name, definitionId, and serviceId of the process to navigate to
 * @returns   Href to business process summary dashboard
 */
export function useHrefToBusinessProcess(props: ProcessMatrixParams) {
  const { location, createHref } = useNavigation();
  const clonedLocation = cloneLocation(location);

  const { name, definitionId, serviceId } = props;

  clonedLocation.pathname = businessProcessSummaryPath;
  setOrDeleteMatrixKey(clonedLocation, businessProcessDashboard, 'definitionName', name);
  setOrDeleteMatrixKey(clonedLocation, businessProcessDashboard, 'definitionId', definitionId);
  setOrDeleteMatrixKey(clonedLocation, businessProcessDashboard, 'serviceId', serviceId);

  return createHref(clonedLocation);
}

/**
 * Util to get the proper link to a business activity dashboard given the necessary activity details.
 *
 * @param     props   details for the activity and parent process needed to construct the URL
 * @returns   Href to business activity summary dashboard
 */
export function useHrefToBusinessActivity(props: ActivityMatrixParams) {
  const { location, createHref } = useNavigation();
  const clonedLocation = cloneLocation(location);

  const { process, activity } = props;

  clonedLocation.pathname = businessActivitySummaryPath;
  setOrDeleteMatrixKey(clonedLocation, businessProcessDashboard, 'definitionName', process.name);
  setOrDeleteMatrixKey(clonedLocation, businessProcessDashboard, 'definitionId', process.definitionId);
  setOrDeleteMatrixKey(clonedLocation, businessProcessDashboard, 'serviceId', process.serviceId);
  setOrDeleteMatrixKey(clonedLocation, businessActivityPath, 'activityName', activity.name);
  setOrDeleteMatrixKey(clonedLocation, businessActivityPath, 'activityId', activity.id);

  return createHref(clonedLocation);
}
