/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import { useObservable } from '@instana/hooks';

import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import getApplicationMetrics from 'in-applications/subscriptions/getApplicationMetrics';
import getEndpointFlowNodes from 'in-applications/subscriptions/getEndpointFlowNodes';
import { joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { hideUpstream, hideDownstream } from 'in-applications/navigation/matrix';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { DESTINATION } from 'in-components/QueryBuilder/tagFilter/entities';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import getService from 'in-applications/subscriptions/getService';
import { boundaryScopes } from 'in-applications/constants';
import ServerFlowMap from 'in-applications/ServerFlowMap';
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
  const { trackFlowMapClicked, trackFlowMapLevelExpanded } = useApplicationTracker();
  useEffect(() => {
    trackFlowMapClicked({ entity: 'endpoint' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          trackFlowMapLevelExpanded={trackFlowMapLevelExpanded}
        />
      )}
    />
  );
}

function getMetricsObservable([applicationId, endpointId, timeConfig]) {
  var expressions = [];
  if (applicationId) {
    expressions.push(tagFilter('application.id', EQUALS, applicationId, null, DESTINATION));
  }
  if (endpointId) {
    expressions.push(tagFilter('endpoint.id', EQUALS, endpointId, null, DESTINATION));
  }
  return getApplicationMetrics({
    tagFilterExpression: toBackendQueryModel(joinExpressions({ expressions })),
    timeConfig,
    includeInternal: false,
    includeSynthetic: false,
    timeShift: { offset: 0 },
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
