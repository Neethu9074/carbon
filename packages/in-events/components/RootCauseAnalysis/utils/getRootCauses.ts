/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 * 

*/

import { get, has, isEmpty, isNull } from 'lodash';

import { RootCause } from 'in-events/components/RootCauseAnalysis/utils/types';
import { Event } from 'in-types';

export const getRootCauses = (incident: Event): RootCause[] => {
  const path = has(incident, 'metadata.rootCause.currentRootCause')
    ? 'metadata.rootCause.currentRootCause'
    : 'metadata.rootCause';

  const rootCauses: RootCause[] = get(incident, path, []);
  return rootCauses
    .sort((a, b) => b.probFailure - a.probFailure)
    .filter(rootCause => {
      if (isEmpty(rootCause) || isNull(rootCause) || !has(rootCause, 'explainability')) {
        return false;
      }
      return rootCause.explainability.some(ex => ex.connectedServiceId === 'all' && ex.percentageFailedThroughRC !== 0);
    });
};
