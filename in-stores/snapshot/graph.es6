import getHostCompanionsInternal from 'in-services/subscription/getHostCompanions';
import getProcessCompanionsInternal from 'in-services/subscription/getProcessCompanions';
import {focusedMoment$} from 'in-stores/timeline';

export function getHostCompanions(snapshotId) {
  return focusedMoment$.flatMap(time => getHostCompanionsInternal({time, snapshotId}));
}

export function getProcessCompanions(snapshotId) {
  return focusedMoment$.flatMap(time => getProcessCompanionsInternal({time, snapshotId}));
}
