/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useCallback } from 'react';

import {
  testId as testIdMatrixParam,
  alertCreated as alertCreatedMatrixParam,
  alertId as alertIdMatrixParam
} from 'in-synthetics/navigation/matrix';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { setTimeConfig } from 'in-stores/time/config';
import { Location } from 'in-stores/navigation/types';
import { stringify } from 'in-services/util/json';
import { TimeConfig } from 'in-types';

const matrixTestId = 'testId';
const matrixTestLabel = 'testLabel';
const matrixStatus = 'status';
const matrixLocationLabels = 'locationLabels';
const matrixLocationDisplayLabels = 'locationDisplayLabels';
const matrixLocationIds = 'locationIds';

export const globalSyntheticsPath = '/#/syntheticTests';
const summaryTab = '/summary';
export const resultsTab = '/results';
export const alertsTab = '/alerts';
const configurationTab = '/configuration';

export const syntheticsPath = '/syntheticTests';
export const syntheticLocationPath = '/syntheticLocations';
export const syntheticsDashboard = '/synthetic';
export const syntheticAlertListPath = `${syntheticsDashboard}${alertsTab}`;
export const syntheticsSummaryPath = `${syntheticsDashboard}${summaryTab}`;
export const syntheticResultsListPath = `${syntheticsDashboard}${resultsTab}`;
export const syntheticConfigurationPath = `${syntheticsDashboard}${configurationTab}`;
export const syntheticDetailsPath = `/syntheticDetails`;
export const syntheticSmartAlertsPath = '/syntheticSmartAlerts';
export const syntheticSmartAlertsDetailsPath = '/details';
export const syntheticCredentialPath = `/syntheticCredentials`;

export const alertsTabDetailsFullyQualified = `${syntheticSmartAlertsPath}${syntheticSmartAlertsDetailsPath}`;
export const dashboardAlertsFullyQualified = `${syntheticsDashboard}${alertsTab}`;
export const dashboardTestAlertsTabDetailsFullyQualified = `${dashboardAlertsFullyQualified}${syntheticSmartAlertsDetailsPath}`;
export const syntheticSmartAlertsFullScreenPath = '/smartAlert';
export const syntheticSmartAlertsFullScreen = `${syntheticsDashboard}${syntheticSmartAlertsFullScreenPath}`;

export const isSyntheticMonitoringView = getRootPathPredicate(
  syntheticsPath,
  syntheticLocationPath,
  syntheticsDashboard,
  syntheticsSummaryPath,
  syntheticResultsListPath,
  syntheticDetailsPath,
  syntheticSmartAlertsPath,
  syntheticCredentialPath
);

export function useSyntheticTestDashboard() {
  return useDashboard(syntheticsDashboard, summaryTab);
}

export function useSyntheticTestResultDashboard() {
  return useDashboard(syntheticsDashboard, resultsTab);
}

function useDashboard(basePath: string, tab: string) {
  const { location, createHref } = useNavigation();

  return useCallback(
    (
      testId: string,
      testLabel: string,
      timeConfig?: TimeConfig,
      failedStatusFilter?: boolean,
      locationLabelFilters?: string[],
      locationIds?: string
    ) => {
      const clonedLocation = cloneLocation(location);

      clonedLocation.pathname = `${basePath}${tab}`;
      setOrDeleteMatrixKey(clonedLocation, basePath, matrixTestId, testId);
      setOrDeleteMatrixKey(clonedLocation, basePath, matrixTestLabel, testLabel);
      setOrDeleteMatrixKey(
        clonedLocation,
        basePath,
        matrixLocationDisplayLabels,
        locationLabelFilters?.join(',') || ''
      );
      setOrDeleteMatrixKey(clonedLocation, basePath, matrixLocationIds, locationIds);

      if (timeConfig != null) {
        setTimeConfig(clonedLocation, timeConfig);
      }

      if (failedStatusFilter != null) {
        setOrDeleteMatrixKey(clonedLocation, tab, matrixStatus, stringify(['0']));
      }

      if (locationLabelFilters != null && locationLabelFilters.length > 0) {
        setOrDeleteMatrixKey(clonedLocation, tab, matrixLocationLabels, stringify(locationLabelFilters));
      }

      return createHref(clonedLocation);
    },
    [location, basePath, tab, createHref]
  );
}

export const useGetAlertConfigLink = () => {
  const { createHref, location } = useNavigation();

  return useCallback(
    (alertConfigId: string, testId: string, alertConfigVersion?: number) => {
      const clonedLocation = cloneLocation(location);

      clonedLocation.pathname = dashboardTestAlertsTabDetailsFullyQualified;
      fillAlertTabSpecificValues(clonedLocation, alertConfigId, alertsTab, alertConfigVersion, testId);

      return createHref(clonedLocation);
    },
    [createHref, location]
  );
};

function fillAlertTabSpecificValues(
  params: Location,
  alertConfigId: string,
  alertsPath: string,
  alertConfigVersion?: number,
  testId?: string
) {
  setOrDeleteMatrixKey(params, syntheticsDashboard, testIdMatrixParam, testId);
  setOrDeleteMatrixKey(params, alertsPath, alertIdMatrixParam, alertConfigId);
  setOrDeleteMatrixKey(params, alertsPath, alertCreatedMatrixParam, alertConfigVersion);
}

export function useLinkToGlobalAlertConfigWithoutDashboard() {
  const { location, createHref } = useNavigation();

  return useCallback(
    (alertConfigId: string) => {
      const clonedLocation = cloneLocation(location);

      clonedLocation.pathname = alertsTabDetailsFullyQualified;
      fillAlertTabSpecificValues(clonedLocation, alertConfigId, syntheticSmartAlertsPath);

      return createHref(clonedLocation);
    },
    [location, createHref]
  );
}
