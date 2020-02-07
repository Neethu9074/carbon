import { get } from 'lodash';
import React from 'react';

import UpstreamDownstreamPresenter from 'in-new-components/UpstreamDownstream/UpstreamDownstreamPresenter';
import { relationships } from 'in-new-components/UpstreamDownstream/constants';
import { getSparkChartGranularity } from 'in-applications/metrics';
import getServices from 'in-subscription/application/getServices';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ applicationId, serviceId, endpointId, timeConfig }) => ({
    upstream: getStreamData({ timeConfig, applicationId, serviceId, endpointId, contextScope: relationships.UPSTREAM }),
    downstream: getStreamData({
      timeConfig,
      applicationId,
      serviceId,
      endpointId,
      contextScope: relationships.DOWNSTREAM
    })
  }),
  function UpstreamDownstream({
    activeTabIndex,
    onTabSelect,
    timeConfig,
    serviceId,
    applicationId,
    endpointId,
    upstream,
    downstream,
    dashboard
  }) {
    const stream = activeTabIndex === 0 ? upstream : downstream;
    return (
      <UpstreamDownstreamPresenter
        result={stream}
        activeTabIndex={activeTabIndex}
        onTabSelect={onTabSelect}
        items={get(stream, ['data', 'items'], [])}
        timeConfig={timeConfig}
        serviceId={serviceId}
        applicationId={applicationId}
        endpointId={endpointId}
        dashboard={dashboard}
      />
    );
  }
);

function getStreamData({
  query = '',
  page = 1,
  pageSize = 5,
  orderBy = 'callsAgg',
  orderDirection = 'DESC',
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  endpointTypes = [],
  technologies = [],
  timeConfig,
  contextScope
}) {
  const granularity = getSparkChartGranularity(timeConfig);
  return getServices({
    pagination: { page, pageSize },
    order: { by: orderBy, direction: orderDirection },
    metrics: {
      callsAgg: { metric: 'calls', aggregation: 'SUM' },
      calls: { metric: 'calls', aggregation: 'SUM', granularity },
      latencyAgg: { metric: 'latency', aggregation: 'MEAN' },
      latency: { metric: 'latency', aggregation: 'MEAN', granularity },
      erroneousCallsAgg: {
        metric: 'erroneousCalls',
        aggregation: 'SUM'
      },
      erroneousCalls: {
        metric: 'erroneousCalls',
        aggregation: 'SUM',
        granularity
      },
      errorsAgg: { metric: 'errors', aggregation: 'MEAN' },
      errors: { metric: 'errors', aggregation: 'MEAN', granularity },
      maxSeverity: { metric: 'maxSeverity', aggregation: 'MAX' }
    },
    filter: {
      label: query,
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      applicationBoundaryScope: boundaryScope,
      endpointTypes,
      technologies,
      timeConfig
    },
    contextScope
  });
}
