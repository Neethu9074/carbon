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

export function getServiceDashboard(serviceId, { appId, endpointId } = {}) {
  return getModifiedUrlStream(params => {
    params.pathname = `${serviceDashboard}/summary`;
    setOrDeleteMatrixKey(params, serviceDashboard, matrixServiceId, serviceId);
    setOrDeleteMatrixKey(params, serviceDashboard, matrixApplicationId, appId);
    setOrDeleteMatrixKey(params, serviceDashboard, matrixEndpointId, endpointId);
  });
}

export function getEndpointDashboard(endpointId, { appId, serviceId } = {}) {
  return getModifiedUrlStream(params => {
    params.pathname = `${endpointDashboard}/summary`;
    setOrDeleteMatrixKey(params, endpointDashboard, matrixServiceId, serviceId);
    setOrDeleteMatrixKey(params, endpointDashboard, matrixApplicationId, appId);
    setOrDeleteMatrixKey(params, endpointDashboard, matrixEndpointId, endpointId);
  });
}

export function getApplicationDashboard(appId) {
  return getModifiedUrlStream(params => {
    params.pathname = `${applicationDashboard}/summary`;
    setOrDeleteMatrixKey(params, applicationDashboard, matrixApplicationId, appId);
  });
}
