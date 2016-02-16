import * as ro from 'reactive-observables';

import * as forgeConsts from 'in-forge/constants';

import SnapshotsConveyer from '../conveyer/SnapshotsConveyer';
import {alwaysNull, alwaysEmptyArray} from '../fixedStreams';
import WiringConveyer from '../conveyer/WiringConveyer';
import {getFullSnapshot} from '../snapshots';
import {create} from '../conveyer';
import * as views from '../views';
import {
  getDestinationNode,
  getDestinationNodes,
  getSourceNodes,
  getLeafNodes,
  getNodesWithPluginId,
  getAllNodesTillOsNode,
  loadFullSnapshotsForNodeStructure
} from './helpers';


const completeWiring = create(WiringConveyer)
  .nextFrame()
  .throttle(15000);

export const physicalHostsViewWiring = completeWiring
  .map(mapWiringGraphToPhysicalHostsViewGraph)
  .flatMap(addNodesFromSnapshotsWhichDoesNotAppearInWiring);

export const fullPhysicalHostsViewWiring = physicalHostsViewWiring.transform({
  emitLatestOnSubscribe: true,

  transform(viewStructure) {
    return ro.combineLatest(viewStructure.map(loadFullSnapshotsForNodeStructure));
  }
})
.nextFrame()
.throttle(15000);


function mapWiringGraphToPhysicalHostsViewGraph(wiringGraph) {
  return getNodesWithPluginId(wiringGraph, forgeConsts.plugins.os)
    .map(osNodeStrId => {
      const hardwareIds = getDestinationNodes(wiringGraph, osNodeStrId, forgeConsts.rels.runsOn);
      let group;

      if (hardwareIds.length > 0) {
        group = hardwareIds[0];
      }

      hardwareIds.forEach(hardwareId => {
        const pluginId = wiringGraph.nodes[hardwareId].get('pluginId');
        if (pluginId === forgeConsts.plugins.genericHardware) {
          group = hardwareId;
        }
      });

      if (group) {
        // find the clustering entity
        group = getSourceNodes(wiringGraph, group, forgeConsts.rels.clusters);
        group = wiringGraph.nodes[group];
      }

      const layers = getLeafNodes(wiringGraph, osNodeStrId, [forgeConsts.rels.runsOn])
        .map(strId => wiringGraph.nodes[strId]);

      return {
        group,
        node: wiringGraph.nodes[osNodeStrId],
        layers,
        connections: null
      };
    });
}

function addNodesFromSnapshotsWhichDoesNotAppearInWiring(viewStructure) {
  const LUT = {};
  viewStructure.forEach(vs => LUT[vs.node.get('id')] = vs.node);

  return create(SnapshotsConveyer, { pluginId: forgeConsts.plugins.os })
    .nextFrame()
    .throttle(15000)
    .map(snapshots => {
      snapshots.forEach(snapshot => {
        const snapshotIsInsideView = LUT[snapshot.get('id')];
        if (!snapshotIsInsideView) {
          viewStructure.push({
            group: null,
            node: snapshot,
            layers: [],
            connections: null
          });
        }
      });

      return viewStructure;
    });
}

export function getAllStepsBetweenNodeAndLeaf(snapshotCoordinates) {
  const originId = snapshotCoordinates.get('id');
  if (originId.indexOf(forgeConsts.plugins.os) === 0 ||
      originId.indexOf(forgeConsts.plugins.ec2) === 0) {
    return alwaysEmptyArray;
  }

  return completeWiring.map(wiringGraph => {
    const leafs = getLeafNodes(
      wiringGraph,
      originId,
      [forgeConsts.rels.runsOn]
    );
    const leafId = leafs.length === 0 ? originId : leafs[0];

    return getAllNodesTillOsNode(wiringGraph, leafId);
  });
}


export function getParentNode(view, childCoordinates) {
  if (view !== views.physical) {
    throw new Error('Unsupported view!', view);
  }

  // It is a common use case in the physical view to click on OS. OS nodes do not have a
  // parent node as far as this contract is concerned. The contract being that groups are not
  // considered nodes, but groups (see view- and node strcture).
  if (childCoordinates.get('pluginId') === forgeConsts.plugins.os) {
    return alwaysNull;
  }

  const leafId = childCoordinates.get('id');

  return completeWiring.map(wiringGraph => {
    let currentNodeId = leafId;

    while (currentNodeId) {
      if (currentNodeId.indexOf(forgeConsts.plugins.os) === 0) {
        return wiringGraph.nodes[currentNodeId];
      }

      currentNodeId = getDestinationNode(wiringGraph, currentNodeId, forgeConsts.rels.runsOn);
    }

    return null;
  });
}


export function getLayers(coords) {
  return completeWiring.map(wiringGraph => {
    return getLeafNodes(
        wiringGraph,
        coords.get('id'),
        [forgeConsts.rels.runsOn]
      )
      .map(leafNodeStr => {
        return wiringGraph.nodes[leafNodeStr];
      });
  });
}

export function getHostHardware(nodeCoords) {
  return completeWiring.map(wiringGraph => {
    const group = getDestinationNode(wiringGraph, nodeCoords.get('id'), forgeConsts.rels.runsOn);
    return wiringGraph.nodes[group];
  }).flatMap(group => getFullSnapshot(group));
}
