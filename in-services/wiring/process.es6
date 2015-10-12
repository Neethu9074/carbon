import * as forgeConsts from 'in-forge/constants';

import WiringConveyer from '../conveyer/WiringConveyer';
import {create} from '../conveyer';
import {
  getDestinationNode,
  getLeafNodes,
  getNodesWithPluginId
} from './helpers';

/*
 * Strategy:
 * Groups: <Requirements unclear, to be defined>
 * Nodes:  Start at hosts and move to all source nodes thus finding the nodes
 * Layers: Start at nodes and find a source node for the "is deployed on" relation
 */


const completeWiring = create(WiringConveyer);
export const processViewWiring = completeWiring.map(mapWiringGraphToProcessViewGraph);


function mapWiringGraphToProcessViewGraph(wiringGraph) {
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
