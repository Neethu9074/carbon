import getProcessCompanionsInternal from 'in-subscription/getProcessCompanions';
import getHostCompanionsInternal from 'in-subscription/getHostCompanions';
import { focusedMoment$ } from 'in-stores/timeline';

export function getHostCompanions(snapshotId) {
  return focusedMoment$.flatMap(time => getHostCompanionsInternal({ time, snapshotId }));
}

export function getProcessCompanions(snapshotId) {
  return focusedMoment$.flatMap(time => getProcessCompanionsInternal({ time, snapshotId }));
}
