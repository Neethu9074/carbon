import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { emptyObject } from 'in-services/fixedObjects';
import {
  applicationId as matrixApplicationId,
  serviceId as matrixServiceId,
  endpointId as matrixEndpointId
} from 'in-applications/navigation/matrix';
import { setTimeConfig } from 'in-stores/time/config';

export const applicationsList = '/applications';
export const applicationDashboard = '/application';
export const newApplicationView = '/application/new';
export const newApplicationWaiterView = '/application/waiter';

export const servicesList = '/services';
export const newServiceView = '/services/configure/new';
export const configureSyntheticEndpointsView = '/services/configure/syntheticEndpoints';
export const serviceDashboard = '/service';
export const endpointDashboard = '/endpoint';
export const configureEndpointsView = '/service/endpoints/configure';

export const isApplicationsView = getRootPathPredicate(
  applicationsList,
  applicationDashboard,
  servicesList,
  serviceDashboard,
  endpointDashboard
);

export function getApplicationDashboard(
  applicationId,
  { serviceId, endpointId, tab, tabMatrix, timeConfig } = emptyObject
) {
  return getDashboard({
    base: applicationDashboard,
    applicationId,
    serviceId,
    endpointId,
    tab,
    tabMatrix,
    timeConfig
  });
}

export function getServiceDashboard(
  serviceId,
  { applicationId, endpointId, tab, tabMatrix, timeConfig } = emptyObject
) {
  return getDashboard({
    base: serviceDashboard,
    applicationId,
    serviceId,
    endpointId,
    tab,
    tabMatrix,
    timeConfig
  });
}

export function getEndpointDashboard(
  endpointId,
  { applicationId, serviceId, tab, tabMatrix, timeConfig } = emptyObject
) {
  return getDashboard({
    base: endpointDashboard,
    applicationId,
    serviceId,
    endpointId,
    tab,
    tabMatrix,
    timeConfig
  });
}

function getDashboard({
  base,
  applicationId,
  serviceId,
  endpointId,
  tab = '/summary',
  tabMatrix = emptyObject,
  timeConfig
}) {
  return getModifiedUrlStream(params => {
    params.pathname = `${base}${tab}`;
    setOrDeleteMatrixKey(params, base, matrixApplicationId, applicationId);
    setOrDeleteMatrixKey(params, base, matrixServiceId, serviceId);
    setOrDeleteMatrixKey(params, base, matrixEndpointId, endpointId);

    if (timeConfig != null) {
      setTimeConfig(params, timeConfig);
    }

    params.matrix[tab] = tabMatrix;
  });
}
