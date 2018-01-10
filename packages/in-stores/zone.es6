import createZoneObservable from 'in-subscription/zone';
import { focusedMoment$ } from 'in-stores/timeline';

export function getZone(snapshotId, time) {
  if (time) {
    return createZoneObservable({ snapshotId, time });
  }
  return focusedMoment$.flatMap(focusedMoment => createZoneObservable({ snapshotId, time: focusedMoment }));
}
