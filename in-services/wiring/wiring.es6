import Immutable from 'immutable';
import {combineLatest} from 'reactive-observables';

import {create} from '../conveyer';
import WiringConveyer from '../conveyer/WiringConveyer';
import SnapshotConveyer from '../conveyer/SnapshotConveyer';
import {getIdString, only} from '../util/snapshots';


/*
  This is what the wiring graph looks like as far as the runs-on relation
  is concerned. While this structure can be displayed to the user, we
  are not doing it in the 3D map. Instead we are showing the following items
  in the physical map: HostHardware, Host and Leaf nodes. Leaf nodes are special
  in this case and harder to identify. Leaf nodes in the example below: App 1-4
  and MySQL.

         ┌────────────────┐        ┌────────────────┐
         │ HostHardware 1 │        │ HostHardware 2 │
         └─▲───────────▲──┘        └────────▲───────┘
    ┌──────┴────┐  ┌───┴───────┐      ┌─────┴─────┐
    │  Host 1   │  │  Host 2   │      │  Host 3   │
    └─────▲─────┘  └─────▲─────┘      └─────▲─────┘
    ┌─────┴─────┐  ┌─────┴─────┐      ┌─────┴─────┐
    │ Process 1 │  │ Process 2 │      │ Process 3 │
    └─────▲─────┘  └─────▲─────┘      └─────▲─────┘
    ┌─────┴─────┐  ┌─────┴─────┐      ┌─────┴─────┐
    │   JVM 1   │  │   MySQL   │      │   JVM 2   │
    └─────▲─────┘  └───────────┘      └─────▲─────┘
    ┌─────┴─────┐                     ┌─────┴─────┐
    │ Tomcat 1  │                     │ Tomcat 2  │
    └──▲─────▲──┘                     └─▲──────▲──┘
 ┌─────┴─┐ ┌─┴─────┐               ┌────┴──┐ ┌─┴─────┐
 │ App 1 │ │ App 2 │               │ App 3 │ │ App 4 │
 └───────┘ └───────┘               └───────┘ └───────┘
*/

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

export const views = {
  physical: {
    hosts: 0,
    processes: 1
  }
};

// export function getGroups(view) {
//   if (view === views.physical.hosts) {
//     return getGroupsForPhysicalHostView();
//   }
//
//   throw new Error('Unsupported view type ' + view);
// }
//
// function getGroupsForPhysicalHostView() {
//   return completeWiring.map(wiringGraph => {
//     const osNodes = getNodesWithPluginId(wiringGraph, forgeConsts.plugins.os);
//
//   });
// }
//
// function getNodesWithPluginId(wiringGraph, pluginId) {
//   // Caution, this solution depends on the way snapshot string IDs
//   // are generated. It has the benefit of being very fast, but it is also
//   // fragile and needs to be adapted when the snapshot ID generation
//   // strategy changes (which should be never)!
//   const query = pluginId + '#';
//   return Object.keys(wiringGraph.nodes)
//     .filter(strId => strId.indexOf(query) === 0);
// }

// function getRelatedNodesOnSourceSide(nodes, relation) {
//   // body...
// }

// export function getNodesForGroup(view, groupSnapshot) {
  // body...
// }

// export function getLayerForNode(view, nodeSnapshot) {
  // body...
// }
