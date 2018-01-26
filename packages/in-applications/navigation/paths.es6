import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

export const applicationsList = '/applications';
export const applicationDashboard = '/application';

export const servicesList = '/services';
export const serviceDashboard = '/service';

export const endpointDashboard = '/endpoint';

export function getServiceDashboard(serviceId) {
  return getModifiedUrlStream(params => {
    params.pathname = serviceDashboard;
    setOrDeleteMatrixKey(params, serviceDashboard, 'serviceId', serviceId);
    setOrDeleteMatrixKey(params, serviceDashboard, 'applicationId', 42);
    setOrDeleteMatrixKey(params, serviceDashboard, 'endpointId', 42);
    params.pathname += '/dashboard';
  });
}
