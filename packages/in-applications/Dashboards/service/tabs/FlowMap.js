import React, { Fragment } from 'react';
import { compose } from 'recompose';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import getServiceFlowNodes from 'in-applications/subscriptions/getServiceFlowNodes';
import { hideUpstream, hideDownstream } from 'in-applications/navigation/matrix';
import DisabledBodyScroll from 'in-components/DisabledBodyScroll';
import getMetrics from 'in-subscription/application/getMetrics';
import { boundaryScopes } from 'in-applications/constants';
import ServerFlowMap from 'in-components/ServerFlowMap';
import withUrlState from 'in-hoc/withUrlState';
import connectTo from 'in-hoc/connectTo';

export default compose(
  withUrlState({
    bind: [
      {
        path: '/flowMap',
        name: hideUpstream
      },
      {
        path: '/flowMap',
        name: hideDownstream
      }
    ]
  }),
  connectTo(({ applicationId, serviceId, endpointId, timeConfig }) => ({
    metricValues: getMetrics({
      filter: {
        application: applicationId,
        service: serviceId,
        endpoint: endpointId,
        timeConfig,
        applicationBoundaryScope: boundaryScopes.all
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
  }))
)(function ServiceFlowMap({
  data,
  applicationId,
  serviceId,
  endpointId,
  timeConfig,
  metricValues,
  hideUpstream,
  hideDownstream
}) {
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
            collapseLeft={hideUpstream}
            collapseRight={hideDownstream}
          />
        )}
      />
      <DisabledBodyScroll />
    </Fragment>
  );
});
