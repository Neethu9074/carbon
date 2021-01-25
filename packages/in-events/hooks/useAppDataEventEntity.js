/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { just } from '@instana/observables';

import getApplication from 'in-subscription/application/getApplication';
import useObservable from 'in-hooks/useObservable';

export default function useAppDataEventEntity(event) {
  return useObservable(
    ([event]) => {
      if (!event) {
        return;
      }

      const entityId = event.get('entityId');
      const entityType = event.get('entityType');
      const metadata = event.get('metadata');
      const entityLabel = metadata.get('entityLabel'); // TODO entityLabel is sometimes missing? Fallback handling needed?
      const applicationId = metadata.get('applicationId');

      if ('App20' === entityType) {
        return just({
          applicationId: entityId,
          applicationName: entityLabel
        });
      }

      if ('Service20' === entityType) {
        return getApplication({
          id: applicationId
        })
          .filter(response => response.progress.loading || response.errors.length === 0)
          .map(response => response.data)
          .map(data => {
            return {
              applicationId: data.id,
              applicationName: data.label,
              serviceId: entityId,
              serviceName: entityLabel
            };
          });
      }

      if ('Endpoint20' === entityType) {
        // TODO implement full handling of endpoints, as soon as we start implementing Per-Endpoint Smart Alerts
        return just({
          applicationId: entityId,
          applicationName: entityLabel
        });
      }

      throw new Error('Event type unknown: ' + entityType);
    },
    [event]
  );
}
