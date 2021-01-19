/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import {
  applicationDashboard as applicationDashboardPath,
  serviceDashboard as serviceDashboardPth,
  endpointDashboard as endpointDashboardPath
} from 'in-applications/navigation/paths';
import { applicationId, serviceId, endpointId, boundaryScope } from 'in-applications/navigation/matrix';
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';

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

export function createQueryUrlParameter(pathSegment, matrixPrefix) {
  return {
    path: pathSegment,
    name: `${matrixPrefix}query`,
    as: 'query',
    initialState: ''
  };
}

export function createLogQueryUrlParameter(pathSegment, matrixPrefix) {
  return {
    path: pathSegment,
    name: `${matrixPrefix}query`,
    as: 'query',
    initialState: ''
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
    },
    boundaryScope: {
      path,
      name: boundaryScope
    }
  };
}
