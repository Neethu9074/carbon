import React from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import getServiceFlowNodes from 'in-subscription/application/getServiceFlowNodes';
import getMetrics from 'in-subscription/application/getMetrics';
import FlowMap from 'in-components/FlowMap';

export default function ServiceFlowMap({ data, applicationId, endpointId, timeframe }) {
  return (
    <FullHeightWrapper
      render={height => (
        <FlowMap
          customHeight={height}
          rootNodeData={data}
          createDataFetchingService={() => createDataFetchingService(applicationId, endpointId, timeframe)}
        />
      )}
    />
  );
}

function createDataFetchingService(applicationId, endpointId, timeframe) {
  return {
    getIncomingDataForNodeId,
    getOutgoingDataForNodeId,
    fetchMetricsForNodeId
  };

  function getIncomingDataForNodeId(id, path) {
    return getNodeData(id, path, 'INCOMING', timeframe);
  }

  function getOutgoingDataForNodeId(id, path) {
    return getNodeData(id, path, 'OUTGOING', timeframe);
  }

  function fetchMetricsForNodeId(nodeId) {
    return getMetrics({
      filter: {
        application: applicationId,
        service: nodeId,
        endpoint: endpointId,
        timeframe
      },
      metrics: {
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
      }
    });
  }
}

function getNodeData(nodeId, path, direction, timeframe) {
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

    path,
    direction
  });
}
