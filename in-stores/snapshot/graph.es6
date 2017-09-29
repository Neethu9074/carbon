import getDockerSnapshotIdByContainerIdInternal from 'in-services/subscription/getDockerSnapshotIdByContainerId';
import getProcessCompanionsInternal from 'in-services/subscription/getProcessCompanions';
import getHostCompanionsInternal from 'in-services/subscription/getHostCompanions';
import { focusedMoment$, timeframe$ } from 'in-stores/timeline';

export function getHostCompanions(snapshotId) {
  return focusedMoment$.flatMap(time => getHostCompanionsInternal({ time, snapshotId }));
}

export function getProcessCompanions(snapshotId) {
  return focusedMoment$.flatMap(time => getProcessCompanionsInternal({ time, snapshotId }));
}

export function getDockerSnapshotIdByContainerId(containerId) {
  return timeframe$.flatMap(timeframe => getDockerSnapshotIdByContainerIdInternal({ timeframe, containerId }));
}
