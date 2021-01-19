/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import LTRTreeLayouter from 'in-applications/ApplicationMap/misc/layouting/vizceralResources/FlowLayouter';
import {
  translateNodesY,
  transformNodes,
  transformEdges,
  applyPosition,
  centerNodesX,
  applyRanks,
  calcRanks
} from 'in-applications/ApplicationMap/misc/layouting/nodeHelper';

export default {
  applyLayout,
  getCameraPositionByDimensions
};

function applyLayout({ nodes, edges }) {
  if (nodes.size === 0) {
    return;
  }

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
  applyRanks(N, nodes.LUT, E, edges.LUT);
  centerNodesX(N);
  translateNodesY(N, -35);
  applyPosition(N);
}

function getCameraPositionByDimensions({ targetCameraSize, minX, minY, maxY }) {
  const cameraWidth = targetCameraSize;
  const xOffset = cameraWidth * 0.1;
  return { x: -xOffset + minX + cameraWidth / 2, y: (maxY + minY) / 2 };
}
