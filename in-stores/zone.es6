import createZoneObservable from 'in-services/subscription/zone';
import {focusedMoment$} from 'in-stores/timeline';

export function getZone(snapshotId) {
  return focusedMoment$.flatMap(focusedMoment =>
    createZoneObservable({snapshotId, time: focusedMoment}));
}
