/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  applicationDashboard as applicationDashboardPath,
  serviceDashboard as serviceDashboardPth,
  endpointDashboard as endpointDashboardPath,
  subtraceDashboard as subtraceDashboardPath
} from 'in-applications/navigation/paths';
import {
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  syntheticCalls,
  subtraceId
} from 'in-applications/navigation/matrix';
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';

export const applicationDashboardUrlParameters = createApplicationServiceEndpointParameters(applicationDashboardPath);
export const serviceDashboardUrlParameters = createApplicationServiceEndpointParameters(serviceDashboardPth);
export const endpointDashboardUrlParameters = createApplicationServiceEndpointParameters(endpointDashboardPath);
export const subtraceDashboardUrlParameters = {
  subtraceId: createSimpleUrlParameters(subtraceDashboardPath, subtraceId)
};

export function createEndpointTypesUrlParameter(pathSegment: string, matrixPrefix: string) {
  return {
    path: pathSegment,
    name: `${matrixPrefix}endpointTypes`,
    as: 'endpointTypes',
    initialState: [],
    parser: buildJsonParser([]),
    serializer: buildJsonSerializer()
  };
}

export function createEndpointTechnologiesUrlParameter(pathSegment: string, matrixPrefix: string) {
  return {
    path: pathSegment,
    name: `${matrixPrefix}technologies`,
    as: 'technologies',
    initialState: [],
    parser: buildJsonParser([]),
    serializer: buildJsonSerializer()
  };
}

export function createQueryUrlParameter(pathSegment: string, matrixPrefix: string) {
  return {
    path: pathSegment,
    name: `${matrixPrefix}query`,
    as: 'query',
    initialState: ''
  };
}

export function createLogQueryUrlParameter(pathSegment: string, matrixPrefix: string) {
  return {
    path: pathSegment,
    name: `${matrixPrefix}query`,
    as: 'query',
    initialState: ''
  };
}

function createApplicationServiceEndpointParameters(path: string) {
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
    },
    syntheticCalls: {
      path,
      name: syntheticCalls
    }
  };
}

function createSimpleUrlParameters(path: string, name: string) {
  return { path, name };
}
