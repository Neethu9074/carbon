/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import { Nullish } from 'in-types';

export default function useInfraEventEntity(event: any | Nullish) {
  return useObservable(
    ([event]) => {
      if (!event) {
        return;
      }

      const entityId = event.get('entityId');
      const entityType = event.get('entityType');
      const metadata = event.get('metadata');
      const entityLabel = metadata.get('entityLabel');

      switch (entityType) {
        case 'Entity10':
          return getInfraAppEntity(entityId, entityLabel);
        default:
          throw new Error('Event type unknown: ' + entityType);
      }
    },
    [event]
  );
}

function getInfraAppEntity(entityId: string, entityLabel: string) {
  return just({
    infraId: entityId,
    infraName: entityLabel
  });
}
