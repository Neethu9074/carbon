import Immutable from 'immutable';
import {combineLatest} from 'reactive-observables';

import * as forgeConsts from 'in-forge/constants';

import * as views from '../views';
import {create} from '../conveyer';
import WiringConveyer from '../conveyer/WiringConveyer';
import SnapshotsConveyer from '../conveyer/SnapshotsConveyer';
import {getIdString, only} from '../snapshots';


/*
  This is what the wiring graph looks like as far as the runs-on relation
  is concerned. While this structure can be displayed to the user, we
  are not doing it in the 3D map. Instead we are showing the following items
  in the physical map: HostHardware, Host and Leaf nodes. Leaf nodes are special
  in this case and harder to identify. Leaf nodes in the example below: App 1-4
  and MySQL.

   ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
   │ HostHardware 1 │   │ HostHardware 2 │   │ HostHardware 3 │
   └───────▲────────┘   └───────▲────────┘   └────────▲───────┘
     ┌─────┴─────┐        ┌─────┴─────┐         ┌─────┴─────┐
     │  Host 1   │        │  Host 2   │         │  Host 3   │
     └─────▲─────┘        └─────▲─────┘         └─────▲─────┘
     ┌─────┴─────┐        ┌─────┴─────┐         ┌─────┴─────┐
     │ Process 1 │        │ Process 2 │         │ Process 3 │
     └─────▲─────┘        └─────▲─────┘         └─────▲─────┘
     ┌─────┴─────┐        ┌─────┴─────┐         ┌─────┴─────┐
     │   JVM 1   │        │   MySQL   │         │   JVM 2   │
     └─────▲─────┘        └───────────┘         └─────▲─────┘
     ┌─────┴─────┐                              ┌─────┴─────┐
     │ Tomcat 1  │                              │ Tomcat 2  │
     └──▲─────▲──┘                              └─▲──────▲──┘
  ┌─────┴─┐ ┌─┴─────┐                        ┌────┴──┐ ┌─┴─────┐
  │ App 1 │ │ App 2 │                        │ App 3 │ │ App 4 │
  └───────┘ └───────┘                        └───────┘ └───────┘
*/

const completeWiring = create(WiringConveyer);
const physicalHostsViewWiring = completeWiring.map(mapWiringGraphToPhysicalHostsViewGraph);

export function getWiring(snapshot) {
  const idString = getIdString(snapshot);

  return completeWiring.map(wiringGraph => {
      const outgoingConnections = wiringGraph.edges.filter(edge => edge.destination === idString)
        .map(edge => wiringGraph.nodes[edge.source]);
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
              SnapshotsConveyer,
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

export function getStructure(view) {
  if (view === views.physical.hosts) {
    return physicalHostsViewWiring;
  }

  throw new Error('Unsupported view type ' + view);
}

function mapWiringGraphToPhysicalHostsViewGraph(wiringGraph) {
  return getNodesWithPluginId(wiringGraph, forgeConsts.plugins.os)
    .map(osNodeStrId => {
      let group = getDestinationNode(wiringGraph, osNodeStrId, forgeConsts.rels.runsOn);
      if (group) {
        group = wiringGraph.nodes[group];
      }

      const layers = getLeafNodes(wiringGraph, osNodeStrId, forgeConsts.rels.runsOn)
        .map(strId => wiringGraph.nodes[strId]);

      return {
        group,
        node: wiringGraph.nodes[osNodeStrId],
        layers
      };
    });
}

function getNodesWithPluginId(wiringGraph, pluginId) {
  // Caution, this solution depends on the way snapshot string IDs
  // are generated. It has the benefit of being very fast, but it is also
  // fragile and needs to be adapted when the snapshot ID generation
  // strategy changes (which should be never)!
  const query = pluginId + '#';
  return Object.keys(wiringGraph.nodes)
    .filter(strId => strId.indexOf(query) === 0);
}


function getDestinationNode(wiringGraph, source, relation) {
  for (let i = 0, len = wiringGraph.edges.length; i < len; i++) {
    const edge = wiringGraph.edges[i];
    if (edge.source === source && edge.relation === relation) {
      return edge.destination;
    }
  }
  return null;
}


function getSourceNodes(wiringGraph, destination, relation) {
  const sourceNodes = [];

  for (let i = 0, len = wiringGraph.edges.length; i < len; i++) {
    const edge = wiringGraph.edges[i];
    if (edge.destination === destination && edge.relation === relation) {
      sourceNodes.push(edge.source);
    }
  }

  return sourceNodes;
}


function getLeafNodes(wiringGraph, origin, relation) {
  let nodesToCheck = getSourceNodes(wiringGraph, origin, relation);
  const leafNodes = [];

  for (let currentNode = nodesToCheck.pop(); currentNode; currentNode = nodesToCheck.pop()) {
    const sources = getSourceNodes(wiringGraph, currentNode, relation);
    if (sources.length === 0) {
      leafNodes.push(currentNode);
    } else {
      nodesToCheck = nodesToCheck.concat(sources);
    }
  }

  return leafNodes;
}
