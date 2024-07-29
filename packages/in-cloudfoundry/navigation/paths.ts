/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */


import { applicationId as matrixApplicationId } from 'in-cloudfoundry/navigation/matrix';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';

export const cloudfoundry = '/cloudfoundry';
export const applicationList = '/applications';
export const applicationListFullyQualified = `${cloudfoundry}${applicationList}`;
export const applicationDashboard = `/application`;
export const applicationDashboardFullyQualified = `${cloudfoundry}${applicationDashboard}`;

type GetApplicationDashboardLink = (applicationId: string) => string;

export function useNavigateToApplicationDashboard(): GetApplicationDashboardLink {
  const {location, createHref} = useNavigation()
  const targetLocation = {...location, pathname: `${applicationDashboardFullyQualified}`}
  return applicationId => {
    setOrDeleteMatrixKey(targetLocation, applicationDashboard, matrixApplicationId, applicationId);
    return createHref(targetLocation)
  }
}
