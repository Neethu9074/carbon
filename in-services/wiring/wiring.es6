import Immutable from 'immutable';
import * as ro from 'reactive-observables';

import * as forgeConsts from 'in-forge/constants';

import WiringConveyer from '../conveyer/WiringConveyer';
import {getFullSnapshot} from '../snapshots';
import {create} from '../conveyer';
import * as views from '../views';

// This observable can be used for cases where we want to emit always null.
const alwaysNullObservable = ro.create({emitLatestOnSubscribe: true});
alwaysNullObservable.emit(null);

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
const fullPhysicalHostsViewWiring = physicalHostsViewWiring.transform({
  emitLatestOnSubscribe: true,

  transform(viewStructure) {
    return ro.combineLatest(viewStructure.map(loadFullSnapshotsForNodeStructure));
  }
});

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


function loadFullSnapshotsForNodeStructure(nodeStructure) {
  const subObservables = [];

  // index 0: group data
  if (nodeStructure.group) {
    subObservables.push(getFullSnapshot(nodeStructure.group));
  } else {
    subObservables.push(alwaysNullObservable);
  }

  // index 1: node data
  subObservables.push(getFullSnapshot(nodeStructure.node));

  // index 2: layer data
  subObservables.push(ro.combineLatest(nodeStructure.layers.map(getFullSnapshot)));

  // now combine all these observables back to a single observable.
  return ro.combineLatest(subObservables)
    .map(vals => {
      return {
        group: vals[0],
        node: vals[1],
        layers: vals[2]
      };
    });
}

export function getAllStepsBetweenNodeAndLeaf(view, snapshotCoordinates) {
  if (view !== views.physical.hosts) {
    throw new Error('Unsupported view!', view, snapshotCoordinates);
  }

  const originId = snapshotCoordinates.get('id');
  if (originId.indexOf(forgeConsts.plugins.os) === 0) {
    return completeWiring.map(() => []);
  }

  return completeWiring.map(wiringGraph => {
    const leafs = getLeafNodes(wiringGraph, originId, forgeConsts.rels.runsOn);
    const leafId = leafs.length === 0 ? originId : leafs[0];

    return getAllNodesTillOsNode(wiringGraph, leafId);
  });
}

function getAllNodesTillOsNode(wiringGraph, leafId) {
  const nodes = [];

  let current = leafId;
  while(current) {
    if (current.indexOf(forgeConsts.plugins.os) === 0) {
      break;
    }

    // id -> coords
    nodes.push(wiringGraph.nodes[current]);
    current = getDestinationNode(wiringGraph, current, forgeConsts.rels.runsOn);
  }

  // if the array contains only one element, it's the selected and so the array
  // can be cleared. Otherwise it is nessessary to collect all nodes in their correct order
  if (nodes.length === 1) {
    return [];
  }

  return nodes;
}


export function getParentNode(view, childCoordinates) {
  if (view !== views.physical.hosts) {
    throw new Error('Unsupported view!', view);
  }

  // It is a common use case in the physical view to click on OS. OS nodes do not have a
  // parent node as far as this contract is concerned. The contract being that groups are not
  // considered nodes, but groups (see view- and node strcture).
  if (childCoordinates.get('pluginId') === forgeConsts.plugins.os) {
    return alwaysNullObservable;
  }

  const leafId = childCoordinates.get('id');

  return completeWiring.map(wiringGraph => {
    let currentNodeId = leafId;

    while(currentNodeId) {
      if (currentNodeId.indexOf(forgeConsts.plugins.os) === 0) {
        return wiringGraph.nodes[currentNodeId];
      }

      currentNodeId = getDestinationNode(wiringGraph, currentNodeId, forgeConsts.rels.runsOn);
    }

    return null;
  });
}
