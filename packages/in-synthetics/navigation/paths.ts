/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Observable } from '@instana/observables';

import {
  testId as testIdMatrixParam,
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam
} from 'in-synthetics/navigation/matrix';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { setTimeConfig } from 'in-stores/time/config';
import { Location } from 'in-stores/navigation/types';
import { stringify } from 'in-services/util/json';
import { TimeConfig } from 'in-types';

const matrixTestId = 'testId';
const matrixStatus = 'status';
const matrixLocationLabels = 'locationLabels';

const summaryTab = '/summary';
export const resultsTab = '/results';
export const alertsTab = '/alerts';

export const syntheticsPath = '/syntheticTests';
export const syntheticLocationPath = '/syntheticLocations';
export const syntheticsDashboard = '/synthetic';
export const syntheticAlertListPath = `${syntheticsDashboard}${alertsTab}`;
export const syntheticsSummaryPath = `${syntheticsDashboard}${summaryTab}`;
export const syntheticResultsListPath = `${syntheticsDashboard}${resultsTab}`;
export const syntheticDetailsPath = `/syntheticDetails`;
export const syntheticSmartAlertsPath = '/syntheticSmartAlerts';
export const syntheticSmartAlertsDetailsPath = '/details';

export const alertsTabDetailsFullyQualified = `${syntheticSmartAlertsPath}${syntheticSmartAlertsDetailsPath}`;
export const dashboardAlertsFullyQualified = `${syntheticsDashboard}${alertsTab}`;
export const dashboardTestAlertsTabDetailsFullyQualified = `${dashboardAlertsFullyQualified}${syntheticSmartAlertsDetailsPath}`;

export const isSyntheticMonitoringView = getRootPathPredicate(
  syntheticsPath,
  syntheticLocationPath,
  syntheticsDashboard,
  syntheticsSummaryPath,
  syntheticResultsListPath,
  syntheticDetailsPath,
  syntheticSmartAlertsPath
);

export function getSyntheticTestDashboard(testId: string, timeConfig?: TimeConfig): Observable<string> {
  return getDashboard(syntheticsDashboard, testId, summaryTab, timeConfig);
}

export function getSyntheticTestResultDashboard(
  testId: string,
  timeConfig?: TimeConfig,
  failedStatusFilter?: boolean,
  locationLabelFilters?: string[]
): Observable<string> {
  return getDashboard(syntheticsDashboard, testId, resultsTab, timeConfig, failedStatusFilter, locationLabelFilters);
}

function getDashboard(
  basePath: string,
  testId: string,
  tab: string,
  timeConfig?: TimeConfig,
  failedStatusFilter?: boolean,
  locationLabelFilters?: string[]
): Observable<string> {
  return getModifiedUrlStream(params => {
    params.pathname = `${basePath}${tab}`;
    setOrDeleteMatrixKey(params, basePath, matrixTestId, testId);

    if (timeConfig != null) {
      setTimeConfig(params, timeConfig);
    }

    if (failedStatusFilter != null) {
      setOrDeleteMatrixKey(params, tab, matrixStatus, stringify(['0']));
    }

    if (locationLabelFilters != null && locationLabelFilters.length > 0) {
      setOrDeleteMatrixKey(params, tab, matrixLocationLabels, stringify(locationLabelFilters));
    }
  });
}

export const useGetAlertConfigLink = () => {
  const { createHref, location } = useNavigation();
  return (alertConfigId: string, testId: string, alertConfigVersion?: number) => {
    location.pathname = dashboardTestAlertsTabDetailsFullyQualified;
    fillAlertTabSpecificValues(location, alertConfigId, alertsTab, alertConfigVersion, testId);
    return createHref(location);
  };
};

function fillAlertTabSpecificValues(
  params: Location,
  alertConfigId: string,
  alertsTab: string,
  alertConfigVersion?: number,
  testId?: string
) {
  setOrDeleteMatrixKey(params, syntheticsDashboard, testIdMatrixParam, testId);
  setOrDeleteMatrixKey(params, alertsTab, alertIdMatrixParam, alertConfigId);
  setOrDeleteMatrixKey(params, alertsTab, alertCreatedMatrixParam, alertConfigVersion);
}

export function useLinkToGlobalAlertConfigWithoutDashboard() {
  const { location, createHref } = useNavigation();

  return (alertConfigId: string) => {
    location.pathname = alertsTabDetailsFullyQualified;
    fillAlertTabSpecificValues(location, alertConfigId, syntheticSmartAlertsPath, undefined, undefined);

    return createHref(location);
  };
}
