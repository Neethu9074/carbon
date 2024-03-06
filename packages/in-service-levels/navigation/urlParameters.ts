/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { buildJsonParser, buildJsonSerializer, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { serviceLevelsObjective } from 'in-service-levels/navigation/path';
import { Location, ParameterDefinition } from 'in-stores/navigation/types';
import { AvailableTimeWindowTypes } from 'in-service-levels/types';

export const defaultServiceLevelObjectiveUrlParameters = {
  sloId: createSloIdUrlParameter(serviceLevelsObjective),
  timeWindowType: createTimeWindowTypeUrlParameter(serviceLevelsObjective),
};

export function setTimeWindowTypeUrlParameter(location: Location, timeWindowType: AvailableTimeWindowTypes) {
  setOrDeleteMatrixKey(location, defaultServiceLevelObjectiveUrlParameters.timeWindowType.path ?? '', defaultServiceLevelObjectiveUrlParameters.timeWindowType.name, timeWindowType)
}

export function createTimeWindowTypeUrlParameter(pathSegment: string, matrixPrefix: string = ''): ParameterDefinition<string> {
  return {
    path: pathSegment,
    name: `${matrixPrefix}timeWindowType`,
    as: 'timeWindowType'
  };
}

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
