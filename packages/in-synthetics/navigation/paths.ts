/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { setOrDeleteMatrixKey} from 'in-stores/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { setTimeConfig } from 'in-stores/time/config';
import { Observable } from "@instana/observables";
import { TimeConfig } from 'in-types';

const matrixTestId = 'testId';

export const syntheticsPath = '/syntheticTests';
export const syntheticLocationPath = '/syntheticLocations';
export const syntheticsDashboard = '/synthetic';
export const syntheticAlertListPath = `${syntheticsDashboard}/alerts`;
export const syntheticsSummaryPath = `${syntheticsDashboard}/summary`;
export const syntheticResultsListPath = `${syntheticsDashboard}/results`;
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
  return getDashboard(
    syntheticsDashboard,
    testId,
    timeConfig,
  );
}

function getDashboard(path: string, testId: string, timeConfig?: TimeConfig): Observable<string> {
  return getModifiedUrlStream(params => {
    params.pathname = path;
    setOrDeleteMatrixKey(params, path, matrixTestId, testId);

    if (timeConfig != null) {
      setTimeConfig(params, timeConfig);
    }
  });
}
