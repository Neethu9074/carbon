import React, { Fragment } from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import getEndpointFlowNodes from 'in-subscription/application/getEndpointFlowNodes';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import getMetrics from 'in-subscription/application/getMetrics';
import getService from 'in-subscription/application/getService';
import ServerFlowMap from 'in-components/ServerFlowMap';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ applicationId, serviceId, endpointId, timeframe }) => ({
    service: getService({
      id: serviceId,
      filter: {
        service: serviceId,
        timeframe
      }
    }).map(result => result.data),
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
  function EndpointFlowMap({ data, applicationId, serviceId, endpointId, timeframe, service, metricValues }) {
    if (!service || !metricValues) {
      return null;
    }

    return (
      <Fragment>
        <FullHeightWrapper
          render={height => (
            <ServerFlowMap
              height={height}
              rootNodeData={{
                id: serviceId,
                service,
                endpoint: data,
                metricValues
              }}
              serviceId={serviceId}
              applicationId={applicationId}
              endpointId={endpointId}
              timeframe={timeframe}
              getFlowNodes={getEndpointFlowNodes}
            />
          )}
        />
        <DisabledBodyScroll />
      </Fragment>
    );
  }
);
