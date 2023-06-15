/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

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
