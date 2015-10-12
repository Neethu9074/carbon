import * as ro from 'reactive-observables';

import * as forgeConsts from 'in-forge/constants';

import * as views from '../views';

import WiringConveyer from '../conveyer/WiringConveyer';
import {create} from '../conveyer';
import {alwaysNullObservable} from '../fixedStreams';
import {
  getDestinationNode,
  getLeafNodes,
  getNodesWithPluginId,
  getAllNodesTillOsNode,
  loadFullSnapshotsForNodeStructure
} from './helpers';


const completeWiring = create(WiringConveyer);
export const physicalHostsViewWiring = completeWiring.map(mapWiringGraphToPhysicalHostsViewGraph);
export const fullPhysicalHostsViewWiring = physicalHostsViewWiring.transform({
  emitLatestOnSubscribe: true,

  transform(viewStructure) {
    return ro.combineLatest(viewStructure.map(loadFullSnapshotsForNodeStructure));
  }
});


export function mapWiringGraphToPhysicalHostsViewGraph(wiringGraph) {
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
