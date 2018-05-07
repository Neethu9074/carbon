import createConnectedEntitiesObservable from 'in-subscription/connectedEntities';
import { timeConfig$ } from 'in-stores/time/config';

// TODO change callers
export function getConnectedEntities(snapshotId, timeConfig) {
  if (arguments.length === 1) {
    return timeConfig$.flatMap(timeConfig =>
      createConnectedEntitiesObservable({
        snapshotId,
        timeConfig
      })
    );
  }

  return createConnectedEntitiesObservable({ snapshotId, timeConfig });
}
