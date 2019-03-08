import React, { Fragment } from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import getEndpointFlowNodes from 'in-subscription/application/getEndpointFlowNodes';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import getMetrics from 'in-subscription/application/getMetrics';
import getService from 'in-subscription/application/getService';
import ServerFlowMap from 'in-components/ServerFlowMap';

import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ applicationId, serviceId, endpointId, timeConfig }) => {
    const observables = {
      metricValues: getMetrics({
        filter: {
          application: applicationId,
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
    };

    if (serviceId) {
      observables.service = getService({
        id: serviceId,
        filter: {
          service: serviceId,
          timeConfig
        }
      }).map(result => result.data);
    }

    return observables;
  },
  function EndpointFlowMap({ data, applicationId, serviceId, endpointId, timeConfig, service, metricValues }) {
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
                applicationContext: applicationId,
                service,
                endpoint: data,
                metricValues
              }}
              serviceId={serviceId}
              applicationId={applicationId}
              endpointId={endpointId}
              timeConfig={timeConfig}
              getFlowNodes={getEndpointFlowNodes}
            />
          )}
        />
        <DisabledBodyScroll />
      </Fragment>
    );
  }
);
