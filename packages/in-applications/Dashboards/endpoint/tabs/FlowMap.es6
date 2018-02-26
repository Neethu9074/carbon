import React from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import getEndpointFlowNodes from 'in-subscription/application/getEndpointFlowNodes';
import getMetrics from 'in-subscription/application/getMetrics';
import { timeframe$ } from 'in-stores/timeline';
import FlowMap from 'in-components/FlowMap';

export default function EndpointFlowMap({ data, applicationId, serviceId, timeframe }) {
  return (
    <FullHeightWrapper
      render={height => (
        <FlowMap
          customHeight={height}
          createDataFetchingService={() => createDataFetchingService(data, applicationId, serviceId, timeframe)}
        />
      )}
    />
  );
}

function createDataFetchingService(rootNodeData, applicationId, serviceId, timeframe) {
  return {
    getIncomingDataForNodeId,
    getOutgoingDataForNodeId,
    fetchMetricsForNodeId,
    getRootNodeData
  };

  function getRootNodeData() {
    return rootNodeData;
  }

  function getIncomingDataForNodeId(id, path) {
    return timeframe$.flatMap(timeframe => getNodeData(id, path, 'INCOMING', timeframe));
  }

  function getOutgoingDataForNodeId(id, path) {
    return timeframe$.flatMap(timeframe => getNodeData(id, path, 'OUTGOING', timeframe));
  }

  function fetchMetricsForNodeId(nodeId) {
    return getMetrics({
      filter: {
        application: applicationId,
        service: serviceId,
        endpoint: nodeId,
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
