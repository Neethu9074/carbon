/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { actionDetails, policies, policiesDetails, actionCatalog } from 'in-automation/navigation/paths';
import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
import { ParameterDefinition } from 'in-stores/navigation/types';

export const policyDetailsUrlParameters = {
  id: createIdUrlParameter(policies),
  op: createOpParameter(policiesDetails)
};

export const actionDetailsUrlParameters = {
  id: createIdUrlParameter(actionDetails),
  op: createOpParameter(actionDetails)
};

export const actionCatalogUrlParameters = {
  view: createTabTypeUrlParameter(actionCatalog)
};

export function createIdUrlParameter(pathSegment: string, matrixPrefix: string = ''): ParameterDefinition<string> {
  return {
    path: pathSegment,
    name: `${matrixPrefix}id`,
    as: 'id'
  };
}

export function createOpParameter(pathSegment: string, matrixPrefix: string = ''): ParameterDefinition<string> {
  return {
    path: pathSegment,
    name: `${matrixPrefix}op`,
    as: 'op'
  };
}

export function createTagsUrlParameter(pathSegment: string, matrixPrefix: string = ''): ParameterDefinition<string[]> {
  return {
    path: pathSegment,
    name: `${matrixPrefix}tags`,
    as: 'tags',
    initialState: [],
    parser: buildJsonParser([]),
    serializer: buildJsonSerializer()
  };
}

export function createTypeUrlParameter(pathSegment: string, matrixPrefix: string = ''): ParameterDefinition<string[]> {
  return {
    path: pathSegment,
    name: `${matrixPrefix}types`,
    as: 'types',
    initialState: [],
    parser: buildJsonParser([]),
    serializer: buildJsonSerializer()
  };
}

export function createPolicyTypeUrlParameter(
  pathSegment: string,
  matrixPrefix: string = ''
): ParameterDefinition<string> {
  return {
    path: pathSegment,
    name: `${matrixPrefix}type`,
    as: 'type'
  };
}

export function createTabTypeUrlParameter(pathSegment: string, matrixPrefix: string = ''): ParameterDefinition<string> {
  return {
    path: pathSegment,
    name: `${matrixPrefix}view`,
    as: 'view'
  };
}
