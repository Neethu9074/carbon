import React from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import getEndpointFlowNodes from 'in-subscription/application/getEndpointFlowNodes';
import { timeframe$ } from 'in-stores/timeline';
import FlowMap from 'in-components/FlowMap';

export default function EndpointFlowMap({ data }) {
  return (
    <FullHeightWrapper
      render={height => (
        <FlowMap customHeight={height} rootNodeData={data} createDataFetchingService={createDataFetchingService} />
      )}
    />
  );
}

function createDataFetchingService() {
  return {
    getIncomingDataForNodeId,
    getOutgoingDataForNodeId
  };

  function getIncomingDataForNodeId(id, path) {
    return timeframe$.flatMap(timeframe => getNodeData(id, path, 'INCOMING', timeframe));
  }

  function getOutgoingDataForNodeId(id, path) {
    return timeframe$.flatMap(timeframe => getNodeData(id, path, 'OUTGOING', timeframe));
  }
}

function getNodeData(nodeId, path, direction, timeframe) {
  return getEndpointFlowNodes({
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

    path,
    direction
  });
}
