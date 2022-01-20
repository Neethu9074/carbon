/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default (() => {
  let worker = null;

  function call(layouter, data, onFinished) {
    disposeRunning();
    worker = new Worker(new URL('in-applications/ApplicationMap/misc/layouting/layout.worker', import.meta.url), {
      name: 'layoutingWorker'
    });
    worker.onmessage = function(e) {
      worker.hasReturned = true;
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

function cloneData(originalData) {
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
