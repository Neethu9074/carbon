import React from 'react';

import getServiceFlowNodes from 'in-subscription/application/getServiceFlowNodes';
import { timeframe$ } from 'in-stores/timeline';
import FlowMap from 'in-components/FlowMap';
import connectTo from 'in-hoc/connectTo';

export default connectTo({ timeframe: timeframe$ }, function ServiceFlowMap({ data }) {
  return (
    <FlowMap
      rootNodeId={data.id}
      createDataFetchingService={createNodeCallback => createDataFetchingService(createNodeCallback, data)}
    />
  );
});

function createDataFetchingService(createNodeCallback, rootNodeData) {
  return {
    init,
    getDataForNode,
    disposeDataForNode,
    dispose
  };

  function init() {
    const rootNode = createNodeCallback(rootNodeData);
    rootNode.expandRight();
    rootNode.expandLeft();
  }

  function getDataForNode(id, direction) {
    console.log('fetch data for', id, direction);
  }

  function disposeDataForNode(id) {
    console.log('dispose open subscriptions for', id);
  }

  function dispose() {}
}

function getNodeData({ nodeId, query, timeframe }) {
  return getServiceFlowNodes({
    metrics: {
      endpoints: {
        metric: 'endpoints',
        aggregation: 'MEAN'
      },
      callsAgg: {
        metric: 'calls',
        aggregation: 'SUM'
      },
      latencyAgg: {
        metric: 'latency',
        aggregation: 'MEAN'
      },
      errorsAgg: {
        metric: 'errors',
        aggregation: 'MEAN'
      }
    },
    filter: {
      label: query,
      timeframe
    },

    traversal: {
      maxDepth: 1
    },

    path: [nodeId],

    direction: 'INCOMING'
  });
}
