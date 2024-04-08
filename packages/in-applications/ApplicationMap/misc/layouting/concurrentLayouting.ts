/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { APMapEdge, APMapNode, ApplicationMapNodePosition } from 'in-applications/types';

type Layouter = 'flow' | 'force';
interface ExtendedWorker extends Worker {
  hasReturned?: boolean;
}
interface GraphStructure {
  nodes: Map<string, APMapNode>;
  edges: Map<string, APMapEdge>;
  positionsMap: Map<string, ApplicationMapNodePosition>;
}
export default (() => {
  let worker: ExtendedWorker | null = null;

  function call(layouter: Layouter, data: GraphStructure, onFinished: (arg0: any) => void) {
    disposeRunning();
    worker = new Worker(new URL('in-applications/ApplicationMap/misc/layouting/layout.worker', import.meta.url), {
      name: 'layoutingWorker'
    });
    worker.onmessage = function (e: MessageEvent) {
      if (worker) {
        worker.hasReturned = true;
      }
      disposeRunning();
      onFinished(e.data);
    };
    worker.hasReturned = false;
    worker.postMessage([layouter, cloneData(data)]);
  }

  function disposeRunning() {
    if (worker) {
      try {
        worker.terminate();
        worker = null;
      } catch (e) {
        worker = null;
      }
    }
  }

  return { call, disposeRunning };
})();

function cloneData(originalData: GraphStructure): GraphStructure {
  const clonedNodes = new Map();
  const nodeIds = originalData.nodes.keys();
  for (const id of nodeIds) {
    clonedNodes.set(id, {
      id,
      x: 0,
      y: 0
    });
  }

  const clonedEdges = new Map();
  const edges = originalData.edges.values();
  for (const edge of edges) {
    clonedEdges.set(edge.id, {
      from: {
        id: edge.from.id
      },
      to: {
        id: edge.to.id
      }
    });
  }

  return {
    nodes: clonedNodes,
    edges: clonedEdges,
    positionsMap: originalData.positionsMap
  };
}
