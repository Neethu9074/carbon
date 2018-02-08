import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export const applicationsList = '/applications';
export const applicationDashboard = '/application';

export const servicesList = '/services';
export const serviceDashboard = '/service';

export const endpointDashboard = '/endpoint';

export function getServiceDashboard(serviceId, { appId, endpointId, tab = '/summary' } = {}) {
  return getModifiedUrlStream(params => {
    params.pathname = `${serviceDashboard}${tab}`;
    setOrDeleteMatrixKey(params, serviceDashboard, 'serviceId', serviceId);
    setOrDeleteMatrixKey(params, serviceDashboard, 'appId', appId);
    setOrDeleteMatrixKey(params, serviceDashboard, 'endpointId', endpointId);
  });
}

export function getEndpointDashboard(endpointId, { appId, serviceId } = {}) {
  return getModifiedUrlStream(params => {
    params.pathname = `${endpointDashboard}`;
    setOrDeleteMatrixKey(params, endpointDashboard, 'serviceId', serviceId);
    setOrDeleteMatrixKey(params, endpointDashboard, 'appId', appId);
    setOrDeleteMatrixKey(params, endpointDashboard, 'endpointId', endpointId);
  });
}

export function getApplicationDashboard(appId, { tab = '/summary' } = {}) {
  return getModifiedUrlStream(params => {
    params.pathname = `${applicationDashboard}${tab}`;
    setOrDeleteMatrixKey(params, applicationDashboard, 'appId', appId);
  });
}
