import {
  applicationDashboard as applicationDashboardPath,
  serviceDashboard as serviceDashboardPth,
  endpointDashboard as endpointDashboardPath
} from 'in-applications/navigation/paths';
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { applicationId, serviceId, endpointId } from 'in-applications/navigation/matrix';

export const applicationDashboardUrlParameters = createApplicationServiceEndpointParameters(applicationDashboardPath);
export const serviceDashboardUrlParameters = createApplicationServiceEndpointParameters(serviceDashboardPth);
export const endpointDashboardUrlParameters = createApplicationServiceEndpointParameters(endpointDashboardPath);

export function createEndpointTypesUrlParameter(pathSegment, matrixPrefix) {
  return {
    path: pathSegment,
    name: `${matrixPrefix}endpointTypes`,
    as: 'endpointTypes',
    initialState: [],
    parser: buildJsonParser([]),
    serializer: buildJsonSerializer()
  };
}

export function createEndpointTechnologiesUrlParameter(pathSegment, matrixPrefix) {
  return {
    path: pathSegment,
    name: `${matrixPrefix}technologies`,
    as: 'technologies',
    initialState: [],
    parser: buildJsonParser([]),
    serializer: buildJsonSerializer()
  };
}

function createApplicationServiceEndpointParameters(path) {
  return {
    applicationId: {
      path,
      name: applicationId
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
