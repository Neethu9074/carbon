import createConnectedEntitiesObservable from 'in-services/subscription/connectedEntities';
import {focusedMoment$} from 'in-stores/timeline';


export function getConnectedEntities(snapshotId) {
  return focusedMoment$.flatMap(focusedMoment => createConnectedEntitiesObservable({
    snapshotId, time: focusedMoment
  }));
}
