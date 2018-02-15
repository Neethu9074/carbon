import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

import {
  applicationId as matrixApplicationId,
  serviceId as matrixServiceId,
  endpointId as matrixEndpointId
} from 'in-applications/navigation/matrix';

export const applicationsList = '/applications';
export const applicationDashboard = '/application';

export const servicesList = '/services';
export const serviceDashboard = '/service';

export const endpointDashboard = '/endpoint';

export function getServiceDashboard(serviceId, { applicationId, endpointId, tab = '/summary' } = {}) {
  return getModifiedUrlStream(params => {
    params.pathname = `${serviceDashboard}${tab}`;
    setOrDeleteMatrixKey(params, serviceDashboard, matrixApplicationId, applicationId);
    setOrDeleteMatrixKey(params, serviceDashboard, matrixServiceId, serviceId);
    setOrDeleteMatrixKey(params, serviceDashboard, matrixEndpointId, endpointId);
  });
}

export function getEndpointDashboard(endpointId, { applicationId, serviceId } = {}) {
  return getModifiedUrlStream(params => {
    params.pathname = `${endpointDashboard}/summary`;
    setOrDeleteMatrixKey(params, endpointDashboard, matrixApplicationId, applicationId);
    setOrDeleteMatrixKey(params, endpointDashboard, matrixServiceId, serviceId);
    setOrDeleteMatrixKey(params, endpointDashboard, matrixEndpointId, endpointId);
  });
}

export function getApplicationDashboard(appId, { tab = '/summary' } = {}) {
  return getModifiedUrlStream(params => {
    params.pathname = `${applicationDashboard}${tab}`;
    setOrDeleteMatrixKey(params, applicationDashboard, matrixApplicationId, appId);
  });
}
