/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import getEndpointFlowNodes from 'in-applications/subscriptions/getEndpointFlowNodes';
import { hideUpstream, hideDownstream } from 'in-applications/navigation/matrix';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import getMetrics from 'in-subscription/application/getMetrics';
import getService from 'in-subscription/application/getService';
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

export default function EndpointFlowMap({ data, applicationId, serviceId, endpointId, timeConfig }) {
  useDisabledBodyScroll();

  const [{ hideUpstream, hideDownstream }] = useUrlState(urlStateDefinition);
  const service = useObservable(getServiceObservable, [serviceId, timeConfig]);
  const metricValues = useObservable(getMetricsObservable, [applicationId, endpointId, timeConfig]);

  if (!service || !metricValues) {
    return null;
  }

  return (
    <FullHeightWrapper
      render={height => (
        <ServerFlowMap
          height={height}
          rootNodeData={{
            id: serviceId,
            applicationContext: applicationId,
            applicationBoundaryScope: boundaryScopes.all,
            service,
            endpoint: data,
            metricValues
          }}
          serviceId={serviceId}
          applicationId={applicationId}
          endpointId={endpointId}
          timeConfig={timeConfig}
          getFlowNodes={getEndpointFlowNodes}
          collapseLeft={hideUpstream}
          collapseRight={hideDownstream}
        />
      )}
    />
  );
}

function getMetricsObservable([applicationId, endpointId, timeConfig]) {
  return getMetrics({
    filter: {
      application: applicationId,
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

function getServiceObservable([id, timeConfig]) {
  if (!id) {
    return null;
  }

  return getService({
    id,
    filter: {
      service: id,
      timeConfig
    }
  }).map(result => result.data);
}
