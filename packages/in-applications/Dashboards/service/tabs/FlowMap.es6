import React from 'react';

import getServiceFlowNodes from 'in-subscription/application/getServiceFlowNodes';
import { serviceDashboard } from 'in-applications/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import ServerFlowMap from 'in-components/FlowMap/ServerFlowMap';
import { serviceId } from 'in-applications/navigation/matrix';
import { timeframe$ } from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

export default connectTo({ timeframe: timeframe$ }, function FlowMap({ location, timeframe }) {
  const serviceID = getMatrixParameter(location, serviceDashboard, serviceId);
  return (
    <ServerFlowMap
      serviceId={serviceID}
      get={props => {
        return getTableData(props);
      }}
      timeframe={timeframe}
    />
  );
});

function getTableData({ serviceId, query, timeframe }) {
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
      maxDepth: 2
    },

    path: [serviceId],

    direction: 'INCOMING'
  });
}
