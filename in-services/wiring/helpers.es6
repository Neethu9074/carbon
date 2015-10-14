import * as ro from 'reactive-observables';

import * as forgeConsts from 'in-forge/constants';

import {alwaysNullObservable} from '../fixedStreams';
import {getFullSnapshot} from '../snapshots';

export function getDestinationNode(wiringGraph, source, relation) {
  for (let i = 0, len = wiringGraph.edges.length; i < len; i++) {
    const edge = wiringGraph.edges[i];
    if (edge.source === source && edge.relation === relation) {
      return edge.destination;
    }
  }
  return null;
}


export function getSourceNodes(wiringGraph, destination, relation) {
  const sourceNodes = [];

  for (let i = 0, len = wiringGraph.edges.length; i < len; i++) {
    const edge = wiringGraph.edges[i];
    if (edge.destination === destination && edge.relation === relation) {
      sourceNodes.push(edge.source);
    }
  }

  return sourceNodes;
}


export function getAllNodesTillOsNode(wiringGraph, leafId) {
  const nodes = [];

  let current = leafId;
  while(current) {
    nodes.push(wiringGraph.nodes[current]);

    if (current.indexOf(forgeConsts.plugins.os) === 0) {
      break;
    }

    current = getDestinationNode(wiringGraph, current, forgeConsts.rels.runsOn);
  }

  // if the array contains only one element, it's the selected and so the array
  // can be cleared. Otherwise it is nessessary to collect all nodes in their correct order
  if (nodes.length === 1) {
    return [];
  }

  return nodes;
}


export function getLeafNodes(wiringGraph, origin, relation) {
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


export function getNodesWithPluginId(wiringGraph, pluginId) {
  // Caution, this solution depends on the way snapshot string IDs
  // are generated. It has the benefit of being very fast, but it is also
  // fragile and needs to be adapted when the snapshot ID generation
  // strategy changes (which should be never)!
  const query = pluginId + '#';
  return Object.keys(wiringGraph.nodes)
    .filter(strId => strId.indexOf(query) === 0);
}


export function loadFullSnapshotsForNodeStructure(nodeStructure) {
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
