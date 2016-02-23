import createZoneObservable from 'in-services/subscription/zone';

export function getZone(snapshotId) {
  return createZoneObservable(snapshotId);
}
