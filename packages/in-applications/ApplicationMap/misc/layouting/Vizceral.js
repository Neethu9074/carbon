/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  translateNodesY,
  transformNodes,
  transformEdges,
  applyPosition,
  centerNodesX,
  applyRanks,
  calcRanks
} from 'in-applications/ApplicationMap/misc/layouting/nodeHelper';
import LTRTreeLayouter from 'in-applications/ApplicationMap/misc/layouting/vizceralResources/FlowLayouter';

export default {
  applyLayout,
  getCameraPositionByDimensions
};

function applyLayout({ nodes, edges }) {
  if (nodes.size === 0) {
    return;
  }
  removeSameNodeEdges(edges);
  nodes = transformNodes(nodes, edges);
  edges = transformEdges(edges);

  const N = nodes.list;
  const E = edges.list;

  const layouter = new LTRTreeLayouter();
  const positions = layouter.layout(
    N.slice(),
    E,
    { width: 1000, height: 1000 } // config
  );

  calcRanks(N, positions);
  applyRanks(N, nodes.LUT, edges.LUT);
  centerNodesX(N);
  translateNodesY(N, -35);
  applyPosition(N);
}

function removeSameNodeEdges(edges) {
  edges.forEach((edge, key) => {
    if (edge.from.id === edge.to.id) {
      edges.delete(key);
    }
  });
}

function getCameraPositionByDimensions({ targetCameraSize, minX, minY, maxY }) {
  const cameraWidth = targetCameraSize;
  const xOffset = cameraWidth * 0.1;
  return { x: -xOffset + minX + cameraWidth / 2, y: (maxY + minY) / 2 };
}
