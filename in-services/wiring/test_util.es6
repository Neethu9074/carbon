/* eslint-env node */

import fs from 'fs';
import path from 'path';
import Immutable from 'immutable';


export function getGraph(fileName) {
  const contents = fs.readFileSync(
    path.join(__dirname, 'testGraphs', fileName + '.json'),
    {encoding: 'utf8'}
  );

  const graph = JSON.parse(contents);

  // ensure that the node id objects are immutable (as done by the WiringConveyer)
  Object.keys(graph.nodes).forEach(nodeKey => {
    graph.nodes[nodeKey] = Immutable.fromJS(graph.nodes[nodeKey]);
  });

  return graph;
}
