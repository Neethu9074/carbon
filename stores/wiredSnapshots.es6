'use strict';

import {getWiredSnapshots} from 'instana-ui-sdk/snapshot';
import {isIdEqual} from '../util/snapshots';

import {selectedSnapshot} from './selectedSnapshot';

export const wiredSnapshots = selectedSnapshot.transform({
  emitLatestOnSubscribe: true,

  shouldRetransform(previousSnapshot, newSnapshot) {
    return !isIdEqual(previousSnapshot, newSnapshot);
  },

  transform(snapshot) {
    return getWiredSnapshots(snapshot);
  }
});
