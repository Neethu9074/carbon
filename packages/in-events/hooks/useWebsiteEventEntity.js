/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

export default function useWebsiteEventEntity(event) {
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
        case 'Website':
          return getWebsiteEntity(entityId, entityLabel);
        default:
          throw new Error('Event type unknown: ' + entityType);
      }
    },
    [event]
  );
}

function getWebsiteEntity(entityId, entityLabel) {
  return just({
    websiteId: entityId,
    websiteName: entityLabel
  });
}
