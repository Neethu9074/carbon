import createConnectedEntitiesObservable from 'in-subscription/connectedEntities';
import { timeConfig$ } from 'in-stores/time/config';

export function getConnectedEntities(snapshotId) {
  return timeConfig$.flatMap(timeConfig =>
    createConnectedEntitiesObservable({
      snapshotId,
      timeConfig
    })
  );
}
