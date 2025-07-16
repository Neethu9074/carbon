/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { navigationParameters$ } from 'in-stores/navigation/navigation';
import { getMatrixParameter } from 'in-stores/navigation/matrix';

export const homePath = '/';
export const agentsPath = '/agents';
export const datasourcePath = '/datasources';
export const settingsPath = '/config';
export const containerPath = '/container';
export const graphPath = '/graph';
export const physicalPath = '/physical';
export const physicalDashboardPath = `${physicalPath}/dashboard`;
export const tablePath = '/table';
export const physicalTablePath = '/table;view=physical;plugin=host';
export const eventsPath = '/events';
export const infraSmartAlerts = '/infraAlerts';
export const graphExplorerPath = '/graphExplorer';
export const infraAlertsDetailsPath = '/infraAlertdetails';
export const infraAlertDetailsFullyQualifiedPath = `${infraSmartAlerts}${infraAlertsDetailsPath}`;
export const vulnerabilityPath = '/vulnerability-center';
export const accountAndBillingPath = '/accountAndBilling';
export const infraSmartAlertsFullScreen = '/infraSmartAlerts';

export function useGetLinkToCurrentViewWithViewGrouping(view: string, vg: string) {
  const { createHref, location } = useNavigation();

  location.query[view] = vg;

  return createHref(location);
}

export function useSetCurrentViewWithViewGrouping() {
  const { navigate, location } = useNavigation();

  const setView = (view: string, vg: string) => {
    delete location.query[view];
    location.query[view] = vg;
    navigate(location);
  };

  return setView;
}

export function isTableView(type: string) {
  return navigationParameters$.map(params => getMatrixParameter(params, tablePath, 'view') === type).distinct();
}

export function isInfrastructurePath(path: string) {
  return (
    path.indexOf(physicalPath) === 0 ||
    path.indexOf(infraSmartAlerts) === 0 ||
    path.indexOf(graphExplorerPath) === 0 ||
    path.indexOf(tablePath) === 0 ||
    path.indexOf(containerPath) === 0 ||
    path.indexOf(infraAlertDetailsFullyQualifiedPath) === 0
  );
}

export function isEventsPath(path: string) {
  return path.indexOf(eventsPath) === 0;
}

export function isVulnerabilityPath(path: string) {
  return path.indexOf(vulnerabilityPath) === 0;
}
