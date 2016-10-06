import createConnectedEntitiesObservable from 'in-services/subscription/connectedEntities';
import {focusedMoment$} from 'in-stores/timeline';


export function getConnectedEntities(snapshotId, time) {
  if (arguments.length === 1) {
    return focusedMoment$.flatMap(focusedMoment => createConnectedEntitiesObservable({
      snapshotId, time: focusedMoment
    }));
  }

  return createConnectedEntitiesObservable({snapshotId, time});
}
