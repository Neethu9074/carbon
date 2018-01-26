import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export const applicationsList = '/applications';
export const applicationDashboard = '/application';

export const servicesList = '/services';
export const serviceDashboard = '/service';

export const endpointDashboard = '/endpoint';

export function getServiceDashboard(serviceId) {
  return getModifiedUrlStream(params => {
    params.pathname = `${serviceDashboard}/summary`;
    setOrDeleteMatrixKey(params, serviceDashboard, 'serviceId', serviceId);
  });
}
