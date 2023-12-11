/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
import { policies, policiesDetails } from 'in-automation/navigation/paths';
import { ParameterDefinition } from 'in-stores/navigation/types';

export const defaultPolicyUrlParameters = {
  policyId: createPolicyUrlParameter(policies)
};

export const detailsPolicyUrlParameters = {
  op: createPolicyOpParameter(policiesDetails)
};

export function createPolicyUrlParameter(pathSegment: string, matrixPrefix: string = ''): ParameterDefinition<string> {
  return {
    path: pathSegment,
    name: `${matrixPrefix}policyId`,
    as: 'policyId'
  };
}

export function createPolicyOpParameter(pathSegment: string, matrixPrefix: string = ''): ParameterDefinition<string> {
  return {
    path: pathSegment,
    name: `${matrixPrefix}op`,
    as: 'op'
  };
}

export function createTriggerUrlParameter(pathSegment: string, matrixPrefix: string = ''): ParameterDefinition<string> {
  return {
    path: pathSegment,
    name: `${matrixPrefix}trigger`,
    as: 'trigger'
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
