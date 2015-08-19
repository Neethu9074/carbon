import Immutable from 'immutable';
import {combineLatest} from 'reactive-observables';

import {create} from '../conveyer';
import WiringConveyer from '../conveyer/WiringConveyer';
import SnapshotConveyer from '../conveyer/SnapshotConveyer';

import {getIdString, only} from '../util/snapshots';

const completeWiring = create(WiringConveyer);

export function getWiring(snapshot) {
  const idString = getIdString(snapshot);

  return completeWiring.map(wiringGraph => {
      const outgoingConnections = wiringGraph.edges.filter(edge => edge.source === idString)
        .map(edge => wiringGraph.nodes[edge.destination]);
      return Immutable.List(outgoingConnections);
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
