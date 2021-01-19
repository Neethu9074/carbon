/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { applicationId as matrixApplicationId } from 'in-cloudfoundry/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { emptyObject } from 'in-services/fixedObjects';
import { setTimeConfig } from 'in-stores/time/config';

export const cloudfoundry = '/cloudfoundry';

export const applicationList = '/applications';
export const applicationListFullyQualified = `${cloudfoundry}${applicationList}`;
export const applicationDashboard = `/application`;
export const applicationDashboardFullyQualified = `${cloudfoundry}${applicationDashboard}`;

export function getApplicationDashboard(applicationId, { tab, tabMatrix, timeConfig } = emptyObject) {
  return getDashboard({
    base: applicationDashboardFullyQualified,
    tab,
    tabMatrix,
    timeConfig,
    matrixSegment: applicationDashboard,
    matrixParam: matrixApplicationId,
    id: applicationId
  });
}

function getDashboard({
  base,
  tab = '/summary',
  tabMatrix = {},
  timeConfig,
  matrixSegment,
  matrixParam,
  id,
  paramsCallback
}) {
  return getModifiedUrlStream(params => {
    params.pathname = `${base}${tab}`;

    setOrDeleteMatrixKey(params, matrixSegment, matrixParam, id);

    if (timeConfig != null) {
      setTimeConfig(params, timeConfig);
    }

    params.matrix[tab] = tabMatrix;

    if (paramsCallback) {
      paramsCallback(params);
    }
  });
}
