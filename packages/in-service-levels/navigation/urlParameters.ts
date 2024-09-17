/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { serviceLevelsObjective, serviceLevelsAlertDetailsSegment } from 'in-service-levels/navigation/path';
import { buildJsonParser, buildJsonSerializer, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { Location, ParameterDefinition } from 'in-stores/navigation/types';
import { AvailableTimeWindowTypes } from 'in-service-levels/types';

export interface SloUrlState {
  sloId: string;
  alertId: string;
  timeWindowType: string;
}

export const defaultServiceLevelObjectiveUrlParameters = {
  sloId: createSloUrlParameter('sloId', serviceLevelsObjective),
  timeWindowType: createSloUrlParameter('timeWindowType', serviceLevelsObjective)
};

export const sloSmartAlertDetailsUrlParameters = {
  alertId: createSloUrlParameter('alertId', serviceLevelsAlertDetailsSegment),
  alertCreated: createSloUrlParameter('alertCreated', serviceLevelsAlertDetailsSegment)
};

export function setTimeWindowTypeUrlParameter(
  location: Location,
  timeWindowType: AvailableTimeWindowTypes,
  timeWindowTypeParameterDefinition?: ParameterDefinition<string>
): void {
  if (!timeWindowTypeParameterDefinition) {
    return setOrDeleteMatrixKey(
      location,
      defaultServiceLevelObjectiveUrlParameters.timeWindowType.path ?? '',
      defaultServiceLevelObjectiveUrlParameters.timeWindowType.name,
      timeWindowType
    );
  }

  setOrDeleteMatrixKey(
    location,
    timeWindowTypeParameterDefinition.path ?? '',
    timeWindowTypeParameterDefinition.name,
    timeWindowType
  );
}

export function createEntityIdUrlParameter(
  pathSegment: string,
  matrixPrefix: string = ''
): ParameterDefinition<string> {
  return createSloUrlParameter('entityType', pathSegment, matrixPrefix);
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

export function createSloUrlParameter(
  parameterName: string,
  pathSegment: string,
  matrixPrefix: string = ''
): ParameterDefinition<string> {
  return {
    path: pathSegment,
    name: `${matrixPrefix}${parameterName}`,
    as: parameterName
  };
}
