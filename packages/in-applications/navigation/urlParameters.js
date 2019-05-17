import {
  applicationDashboard as applicationDashboardPath,
  serviceDashboard as serviceDashboardPth,
  endpointDashboard as endpointDashboardPath
} from 'in-applications/navigation/paths';
import { appId, serviceId, endpointId } from 'in-applications/navigation/matrix';

export const applicationDashboardUrlParameters = createApplicationServiceEndpointParameters(applicationDashboardPath);
export const serviceDashboardUrlParameters = createApplicationServiceEndpointParameters(serviceDashboardPth);
export const endpointDashboardUrlParameters = createApplicationServiceEndpointParameters(endpointDashboardPath);

function createApplicationServiceEndpointParameters(path) {
  return {
    applicationId: {
      path,
      name: appId
    },
    serviceId: {
      path,
      name: serviceId
    },
    endpointId: {
      path,
      name: endpointId
    }
  };
}
