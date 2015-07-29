'use strict';

import Immutable from 'immutable';
import {combineLatest} from 'reactive-observables';

import {create} from '../conveyer';
import WiringConveyer from '../conveyer/WiringConveyer';
import SnapshotConveyer from '../conveyer/SnapshotConveyer';

import {only, extractId} from '../util/snapshots';

// default value when there are no wirings for a cetain snapshot
const emptySet = Immutable.Set();

export function getWiring(pluginId) {
  if (typeof pluginId === 'string') {
    return create(WiringConveyer, {pluginId});
  }

  // function is overloaded and optionally accepts a snapshot a parameter
  const sourceSnapshotId = extractId(pluginId);

  return create(WiringConveyer, {pluginId: sourceSnapshotId.get('pluginId')})
    .map(wiring => {
      // we are only interest in the wiring of the source snapshot
      return wiring.get(sourceSnapshotId, emptySet);
    });
}

export function getWiringWithFullSnapshots(sourceSnapshot) {
  return getWiring(sourceSnapshot)
    .transform({
      emitLatestOnSubscribe: true,

      shouldRetransform(previousWiredSnapshotIds, currentWiredSnapshotIds) {
        return !Immutable.is(previousWiredSnapshotIds, currentWiredSnapshotIds);
      },

      transform(wiredSnapshotIds) {
        const datasources = wiredSnapshotIds.map(wiredSnapshotId => {
          return only(
            create(
              SnapshotConveyer,
              {pluginId: wiredSnapshotId.get('pluginId')}
            ),
            wiredSnapshotId
          );
        });

        return combineLatest(datasources.toArray())
          // let the whole result be immutable for consistency sake
          .map(a => Immutable.Set(a));
      }
    });
}
