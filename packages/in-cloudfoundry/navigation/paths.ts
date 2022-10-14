/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import { applicationId as matrixApplicationId } from 'in-cloudfoundry/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export const cloudfoundry = '/cloudfoundry';
export const applicationList = '/applications';
export const applicationListFullyQualified = `${cloudfoundry}${applicationList}`;
export const applicationDashboard = `/application`;
export const applicationDashboardFullyQualified = `${cloudfoundry}${applicationDashboard}`;

type GetApplicationDashboardLink = (applicationId: string) => Observable<string>;

export function useNavigateToApplicationDashboard(): GetApplicationDashboardLink {
  return applicationId =>
    getModifiedUrlStream(params => {
      params.pathname = `${applicationDashboardFullyQualified}`;
      setOrDeleteMatrixKey(params, applicationDashboard, matrixApplicationId, applicationId);
    });
}
