import React from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import getServiceFlowNodes from 'in-subscription/application/getServiceFlowNodes';
import getMetrics from 'in-subscription/application/getMetrics';
import ServerFlowMap from 'in-components/ServerFlowMap';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ applicationId, serviceId, endpointId, timeframe }) => ({
    metricValues: getMetrics({
      filter: {
        application: applicationId,
        service: serviceId,
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
    }).map(result => {
      if (result.data) {
        return result.data;
      }
      if (result.errors && result.errors.length > 0) {
        return {};
      }
      return null;
    })
  }),
  function ServiceFlowMap({ data, applicationId, serviceId, endpointId, timeframe, metricValues }) {
    if (!metricValues) {
      return null;
    }
    return (
      <FullHeightWrapper
        render={height => (
          <ServerFlowMap
            height={height}
            rootNodeData={{
              id: data.id,
              service: data,
              metricValues
            }}
            serviceId={serviceId}
            applicationId={applicationId}
            endpointId={endpointId}
            timeframe={timeframe}
            getFlowNodes={getServiceFlowNodes}
          />
        )}
      />
    );
  }
);
