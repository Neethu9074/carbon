import LTRTreeLayouter from  'in-map/misc/logical/layoutingStrategies/vizceralResources/ltrTreeLayouter';
import {
  transformNodes,
  transformEdges,
  applyPosition,
  centerNodes,
  applyRanks,
  sortNodes,
  rankNodes,
  setRanks
} from 'in-map/misc/logical/layoutingStrategies/nodeHelper';


export default function applyLayout({nodes, edges}) {
  if (nodes.length === 0) {
    return;
  }

  const layouter = new LTRTreeLayouter();
  const N = transformNodes(nodes, edges);
  rankNodes(N);
  sortNodes(N);

  const E = transformEdges(edges);

  const positions = layouter.layout(
    N,
    E,
    { width: 1000, height: 1000 }, // config
    N[0].inNode.id // starting node
  );

  setRanks(N, positions);
  applyRanks(N);
  centerNodes(N);
  applyPosition(N);
}
