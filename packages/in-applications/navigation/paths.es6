import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { emptyObject } from 'in-services/fixedObjects';
import {
  applicationId as matrixApplicationId,
  serviceId as matrixServiceId,
  endpointId as matrixEndpointId
} from 'in-applications/navigation/matrix';

export const applicationsList = '/applications';
export const applicationDashboard = '/application';
export const newApplicationView = '/application/new';

export const servicesList = '/services';
export const serviceDashboard = '/service';
export const newServiceView = '/foobar/new';
export const endpointDashboard = '/endpoint';

export const isApplicationsView = getRootPathPredicate(
  applicationsList,
  applicationDashboard,
  servicesList,
  serviceDashboard,
  endpointDashboard
);

export function getApplicationDashboard(applicationId, { serviceId, endpointId, tab, tabMatrix } = emptyObject) {
  return getDashboard({
    base: applicationDashboard,
    applicationId,
    serviceId,
    endpointId,
    tab,
    tabMatrix
  });
}

export function getServiceDashboard(serviceId, { applicationId, endpointId, tab, tabMatrix } = emptyObject) {
  return getDashboard({
    base: serviceDashboard,
    applicationId,
    serviceId,
    endpointId,
    tab,
    tabMatrix
  });
}

export function getEndpointDashboard(endpointId, { applicationId, serviceId, tab, tabMatrix } = emptyObject) {
  return getDashboard({
    base: endpointDashboard,
    applicationId,
    serviceId,
    endpointId,
    tab,
    tabMatrix
  });
}

function getDashboard({ base, applicationId, serviceId, endpointId, tab = '/summary', tabMatrix = emptyObject }) {
  return getModifiedUrlStream(params => {
    params.pathname = `${base}${tab}`;
    setOrDeleteMatrixKey(params, base, matrixApplicationId, applicationId);
    setOrDeleteMatrixKey(params, base, matrixServiceId, serviceId);
    setOrDeleteMatrixKey(params, base, matrixEndpointId, endpointId);
    params.matrix[tab] = tabMatrix;
  });
}
