import * as ro from 'reactive-observables';
import immutable from 'immutable';

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
    const node = wiringGraph.nodes[processStrId];

    const layers = getSourceNodes(wiringGraph, processStrId, forgeConsts.rels.availableThrough)
      .map(strId => wiringGraph.nodes[strId]);

    const getConnectionsObservable = ro.create({emitLatestOnSubscribe: true});
    getConnectionsObservable.emit(getConnectedCoordinates(node));

    return {
      // To be defined
      group: null,
      node,
      layers,
      connections: getConnectionsObservable
    };
  });
}


// CONNECTS TO
export function getConnectedCoordinates(snapshot) {

  if (!snapshot) {
    completeWiring.map(() => []);
  }

  const connections = {
    incoming: [],
    outgoing: []
  };

  // create a new observable by mapping completeWiring to another subset
  return completeWiring.map(wiringGraph => {

    wiringGraph.edges.forEach(edge => {
      // filter all relations that are not connectsTo-relations
      if (edge.relation !== forgeConsts.rels.connectsTo) {
        return;
      }

      const id = snapshot.get('id');

      // if the snapshot is weather inside source or destination
      if (edge.source !== id && edge.destination !== id) {
        return;
      }

      if (edge.source === id) {
        connections.outgoing.push(wiringGraph.nodes[edge.destination]);
      } else {
        connections.incoming.push(wiringGraph.nodes[edge.source]);
      }

    });

    return immutable.fromJS(connections);
  });
}
