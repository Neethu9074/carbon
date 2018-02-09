import React from 'react';

import getServiceFlowNodes from 'in-subscription/application/getServiceFlowNodes';
import { timeframe$ } from 'in-stores/timeline';
import FlowMap from 'in-components/FlowMap';

export default function ServiceFlowMap({ data }) {
  return <FlowMap rootNodeData={data} createDataFetchingService={createDataFetchingService} />;
}

function createDataFetchingService() {
  return {
    getIncomingDataForNodeId,
    getOutgoingDataForNodeId,
    dispose
  };

  function getIncomingDataForNodeId(id) {
    return timeframe$.flatMap(timeframe => getNodeData(id, 'INCOMING', timeframe));
  }

  function getOutgoingDataForNodeId(id) {
    return timeframe$.flatMap(timeframe => getNodeData(id, 'OUTGOING', timeframe));
  }

  function dispose() {}
}

function getNodeData(nodeId, direction, timeframe) {
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
      label: '',
      timeframe
    },

    traversal: {
      maxDepth: 1
    },

    path: [nodeId],

    direction
  });
}
