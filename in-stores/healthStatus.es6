import createHealthStatusObservable from 'in-services/subscription/healthStatus';

export function getHealthStatus(snapshotId) {
  return createHealthStatusObservable(snapshotId);
}
