import React, { Fragment } from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import getServiceFlowNodes from 'in-subscription/application/getServiceFlowNodes';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import getMetrics from 'in-subscription/application/getMetrics';
import ServerFlowMap from 'in-components/ServerFlowMap';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ applicationId, serviceId, endpointId, timeConfig }) => ({
    metricValues: getMetrics({
      filter: {
        application: applicationId,
        service: serviceId,
        endpoint: endpointId,
        timeConfig
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
  function ServiceFlowMap({ data, applicationId, serviceId, endpointId, timeConfig, metricValues }) {
    if (!metricValues) {
      return null;
    }
    return (
      <Fragment>
        <FullHeightWrapper
          render={height => (
            <ServerFlowMap
              height={height}
              rootNodeData={{
                id: data.id,
                applicationContext: applicationId,
                service: data,
                metricValues
              }}
              serviceId={serviceId}
              applicationId={applicationId}
              endpointId={endpointId}
              timeConfig={timeConfig}
              getFlowNodes={getServiceFlowNodes}
            />
          )}
        />
        <DisabledBodyScroll />
      </Fragment>
    );
  }
);
