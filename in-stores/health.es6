import {health as healthStates} from 'in-services/health';

import {getSnapshot} from './snapshot';


export function getHealth(snapshotId) {
  return getSnapshot(snapshotId)
    .map(() => {
      return healthStates.unknown;
    });
}
