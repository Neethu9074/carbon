import getHostCompanionsInternal from 'in-services/subscription/getHostCompanions';
import {focusedMoment$} from 'in-stores/timeline';

export function getHostCompanions(snapshotId) {
  return focusedMoment$.flatMap(time => getHostCompanionsInternal({time, snapshotId}));
}
