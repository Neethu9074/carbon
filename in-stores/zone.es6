import createZoneObservable from 'in-services/subscription/zone';
import {alwaysNull} from 'in-services/fixedStreams';


export function getZone(snapshotId) {
  if (snapshotId) {
    return createZoneObservable(snapshotId);
  }
  return alwaysNull;
}
