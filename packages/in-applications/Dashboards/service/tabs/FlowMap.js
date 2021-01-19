/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import getServiceFlowNodes from 'in-applications/subscriptions/getServiceFlowNodes';
import { hideUpstream, hideDownstream } from 'in-applications/navigation/matrix';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import getMetrics from 'in-subscription/application/getMetrics';
import { boundaryScopes } from 'in-applications/constants';
import ServerFlowMap from 'in-applications/ServerFlowMap';
import useObservable from 'in-hooks/useObservable';
import useUrlState from 'in-hooks/useUrlState';

const urlStateDefinition = {
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
};

export default function ServiceFlowMap({ data, applicationId, serviceId, endpointId, timeConfig }) {
  useDisabledBodyScroll();

  const [{ hideUpstream, hideDownstream }] = useUrlState(urlStateDefinition);
  const metricValues = useObservable(getMetricsObservable, [applicationId, serviceId, endpointId, timeConfig]);

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
            applicationContext: applicationId,
            applicationBoundaryScope: boundaryScopes.all,
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
  );
}

function getMetricsObservable([applicationId, serviceId, endpointId, timeConfig]) {
  return getMetrics({
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
  });
}
