/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import ServerFlowMapSimplified from 'in-applications/ServerFlowMap/ServerFlowMapSimplified';
import { hideUpstream, hideDownstream } from 'in-applications/navigation/matrix';
import getServices from 'in-applications/subscriptions/getServices';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import getMetrics from 'in-applications/subscriptions/getMetrics';
import { boundaryScopes } from 'in-applications/constants';
import useUrlState from 'in-hooks/useUrlState';

const urlStateDefinition = {
  bind: [
    {
      path: '/simplifiedFlowMap',
      name: hideUpstream
    },
    {
      path: '/simplifiedFlowMap',
      name: hideDownstream
    }
  ]
};

export default function ServiceFlowMapSimplified({ data, applicationId, serviceId, endpointId, timeConfig }) {
  useDisabledBodyScroll();

  const [{ hideUpstream, hideDownstream }] = useUrlState(urlStateDefinition);
  const metricValues = useObservable(getMetricsObservable, [applicationId, serviceId, endpointId, timeConfig]);

  if (!metricValues) {
    return null;
  }

  return (
    <FullHeightWrapper
      render={height => (
        <ServerFlowMapSimplified
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
          getFlowNodes={getServices}
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
