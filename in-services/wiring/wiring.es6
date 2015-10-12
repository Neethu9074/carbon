import Immutable from 'immutable';
import * as ro from 'reactive-observables';

import * as forgeConsts from 'in-forge/constants';

import WiringConveyer from '../conveyer/WiringConveyer';
import {create} from '../conveyer';
import {getFullSnapshot} from '../snapshots';
import * as views from '../views';

import {
  processViewWiring,
  fullProcessViewWiring
} from './process';
import {
  physicalHostsViewWiring,
  fullPhysicalHostsViewWiring
} from './physical';
export {
  getAllStepsBetweenNodeAndLeaf,
  getParentNode,
  getLayers
} from './physical';

const completeWiring = create(WiringConveyer);


export function getWiring(snapshot) {
  const idString = snapshot.get('id');

  return completeWiring.map(wiringGraph => {
      const outgoingConnections = wiringGraph.edges.filter(edge => {
          return edge.destination === idString &&
            edge.relation === forgeConsts.rels.runsOn;
        })
        .map(edge => wiringGraph.nodes[edge.source]);
      return Immutable.List(outgoingConnections);
    });
}


export function getWiringWithFullSnapshots(sourceSnapshot) {
  return getWiring(sourceSnapshot)
    .transform({
      emitLatestOnSubscribe: true,

      shouldRetransform(previousWiredSnapshotCoords, currentWiredSnapshotCoords) {
        return !Immutable.is(previousWiredSnapshotCoords, currentWiredSnapshotCoords);
      },

      transform(wiredSnapshotCoords) {
        const datasources = wiredSnapshotCoords.toArray().map(wiredSnapshotCoord => {
          return getFullSnapshot(wiredSnapshotCoord);
        });

        return ro.combineLatest(datasources)
          // let the whole result be immutable for consistency sake
          .map(a => Immutable.Set(a));
      }
    });
}


export function getStructure(view, full = false) {
  if (view === views.physical.hosts) {
    return full ? fullPhysicalHostsViewWiring : physicalHostsViewWiring;
  } else if (view === views.process) {
    return full ? fullProcessViewWiring : processViewWiring;
  }

  throw new Error('Unsupported view type ' + view);
}
