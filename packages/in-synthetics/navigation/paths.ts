/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Observable } from '@instana/observables';

import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { setTimeConfig } from 'in-stores/time/config';
import { stringify } from 'in-services/util/json';
import { TimeConfig } from 'in-types';

const matrixTestId = 'testId';
const matrixStatus = 'status';
const matrixLocationLabels = 'locationLabels';

const summaryTab = '/summary';
export const resultsTab = '/results';
const alertsTab = '/alerts';

export const syntheticsPath = '/syntheticTests';
export const syntheticLocationPath = '/syntheticLocations';
export const syntheticsDashboard = '/synthetic';
export const syntheticAlertListPath = `${syntheticsDashboard}${alertsTab}`;
export const syntheticsSummaryPath = `${syntheticsDashboard}${summaryTab}`;
export const syntheticResultsListPath = `${syntheticsDashboard}${resultsTab}`;
export const syntheticDetailsPath = `/syntheticDetails`;

export const isSyntheticMonitoringView = getRootPathPredicate(
  syntheticsPath,
  syntheticLocationPath,
  syntheticsDashboard,
  syntheticsSummaryPath,
  syntheticResultsListPath,
  syntheticDetailsPath
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
