import LTRTreeLayouter from 'in-map/misc/logical/layoutingStrategies/vizceralResources/FlowLayouter';
import {
  translateNodesY,
  transformNodes,
  transformEdges,
  applyPosition,
  centerNodesX,
  applyRanks,
  calcRanks
} from 'in-map/misc/logical/layoutingStrategies/nodeHelper';

export default function applyLayout({ nodes, edges }) {
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
// - highlight subtree on highlight service/connection
