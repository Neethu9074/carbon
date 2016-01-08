import Immutable from 'immutable';

import * as forgeConsts from 'in-forge/constants';

import WiringConveyer from '../conveyer/WiringConveyer';
import {getSourceNodes} from './helpers';
import {create} from '../conveyer';

/*
 * Strategy:
 * Groups: <Requirements unclear, to be defined>
 * Nodes:  Start at hosts and move to all source nodes thus finding the nodes
 * Layers: Start at nodes and find a source node for the "is deployed on" relation
 */


const completeWiring = create(WiringConveyer);
export const processViewWiring = completeWiring.map(mapWiringGraphToProcessViewGraph);
export const fullProcessViewWiring = processViewWiring;


function mapWiringGraphToProcessViewGraph() {
  return [
    {
      group: null,
      node: Immutable.fromJS({ id: 'h_s', hostId: 'h', pluginId: forgeConsts.plugins.jira, steadyId: 's' }),
      layers: [],
      connections: { incoming: [], outgoing: [] }
    }
  ];
}


// CONNECTS TO
export function getConnectedCoordinates(wiringGraph, id) {
  const connections = {
    incoming: [],
    outgoing: []
  };

  if (!wiringGraph || !id) {
    return connections;
  }

  wiringGraph.edges.forEach(edge => {
    // filter all relations that are not connectsTo-relations
    if (edge.relation !== forgeConsts.rels.connectsTo) {
      return;
    }

    if (edge.source === id) {
      connections.outgoing.push(wiringGraph.nodes[edge.destination]);
    } else if (edge.destination === id) {
      connections.incoming.push(wiringGraph.nodes[edge.source]);
    }
  });

  return connections;
}


export function getDeployedUnits(coords) {
  const snapshotId = coords.get('id');
  return completeWiring.map(wiringGraph => {
      return getSourceNodes(wiringGraph, snapshotId, forgeConsts.rels.availableThrough)
        .map(sourceNodeId => wiringGraph.nodes[sourceNodeId]);
    });
}
