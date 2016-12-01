import LTRTreeLayouter from 'in-map/misc/logical/layoutingStrategies/vizceralResources/FlowLayouter';
import {
  transformNodes,
  transformEdges,
  applyPosition,
  centerNodes,
  applyRanks,
  calcRanks
} from 'in-map/misc/logical/layoutingStrategies/nodeHelper';


export default function applyLayout({nodes, edges}) {
  if (nodes.length === 0) {
    return;
  }

  const layouter = new LTRTreeLayouter();
  const N = transformNodes(nodes, edges);
  const E = transformEdges(edges);

  const positions = layouter.layout(
    N.slice(),
    E,
    { width: 1000, height: 1000 } // config
  );

  calcRanks(N, positions);
  applyRanks(N);
  centerNodes(N);
  applyPosition(N);
}

// - vertical node sorting
// - highlight subtree on highlight service/connection
