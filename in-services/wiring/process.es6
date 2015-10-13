import * as ro from 'reactive-observables';

import * as forgeConsts from 'in-forge/constants';

import WiringConveyer from '../conveyer/WiringConveyer';
import {create} from '../conveyer';
import {
  getLeafNodes,
  getNodesWithPluginId,
  getSourceNodes,
  loadFullSnapshotsForNodeStructure
} from './helpers';

/*
 * Strategy:
 * Groups: <Requirements unclear, to be defined>
 * Nodes:  Start at hosts and move to all source nodes thus finding the nodes
 * Layers: Start at nodes and find a source node for the "is deployed on" relation
 */


const completeWiring = create(WiringConveyer);
export const processViewWiring = completeWiring.map(mapWiringGraphToProcessViewGraph);
export const fullProcessViewWiring = processViewWiring.transform({
  emitLatestOnSubscribe: true,

  transform(viewStructure) {
    return ro.combineLatest(viewStructure.map(loadFullSnapshotsForNodeStructure));
  }
});


function mapWiringGraphToProcessViewGraph(wiringGraph) {
  const allProcessesStrIds = getNodesWithPluginId(wiringGraph, forgeConsts.plugins.os)
    .reduce((_allProcessesStrIds, osNodeStrId) => {
      const processesOfHostStrIds = getLeafNodes(wiringGraph, osNodeStrId, forgeConsts.rels.runsOn);
      return _allProcessesStrIds.concat(processesOfHostStrIds);
    }, []);

  return allProcessesStrIds.map(processStrId => {
    const layers = getSourceNodes(wiringGraph, processStrId, forgeConsts.rels.availableThrough)
      .map(strId => wiringGraph.nodes[strId]);
    return {
      // To be defined
      group: null,
      node: wiringGraph.nodes[processStrId],
      layers
    };
  });
}
