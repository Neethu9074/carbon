/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
import { serviceLevelsObjective } from 'in-service-levels/navigation/path';
import { ParameterDefinition } from 'in-stores/navigation/types';

export const defaultServiceLevelObjectiveUrlParameters = {
  sloId: createSloIdUrlParameter(serviceLevelsObjective)
};

export function createSloIdUrlParameter(pathSegment: string, matrixPrefix: string = ''): ParameterDefinition<string> {
  return {
    path: pathSegment,
    name: `${matrixPrefix}sloId`,
    as: 'sloId'
  };
}

export function createEntityIdUrlParameter(
  pathSegment: string,
  matrixPrefix: string = ''
): ParameterDefinition<string> {
  return {
    path: pathSegment,
    name: `${matrixPrefix}entityType`,
    as: 'entityType'
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
