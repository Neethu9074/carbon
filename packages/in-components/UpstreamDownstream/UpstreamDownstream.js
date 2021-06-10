/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import UpstreamDownstreamPresenter from 'in-components/UpstreamDownstream/UpstreamDownstreamPresenter';
import { relationships } from 'in-components/UpstreamDownstream/constants';
import getApplications from 'in-subscription/application/getApplications';
import { getSparkChartGranularity } from 'in-applications/metrics';
import getServices from 'in-subscription/application/getServices';
import { entityTypes } from 'in-analyze/applicationFilter';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ applicationId, serviceId, endpointId, timeConfig, tagFilters }) => ({
    upstream: getStreamData({
      timeConfig,
      applicationId,
      serviceId,
      endpointId,
      contextScope: relationships.UPSTREAM,
      tagFilters,
      tagFilterEntity: entityTypes.DESTINATION
    }),
    downstream: getStreamData({
      timeConfig,
      applicationId,
      serviceId,
      endpointId,
      contextScope: relationships.DOWNSTREAM,
      tagFilters,
      tagFilterEntity: entityTypes.SOURCE
    }),
    upstreamApplications: getStreamDataApplication({
      timeConfig,
      applicationId,
      serviceId,
      endpointId,
      contextScope: relationships.UPSTREAM,
      tagFilters,
      tagFilterEntity: entityTypes.DESTINATION
    }),
    downstreamApplications: getStreamDataApplication({
      timeConfig,
      applicationId,
      serviceId,
      endpointId,
      contextScope: relationships.DOWNSTREAM,
      tagFilters,
      tagFilterEntity: entityTypes.SOURCE
    })
  }),
  function UpstreamDownstream({
    timeConfig,
    serviceId,
    applicationId,
    endpointId,
    upstream,
    downstream,
    upstreamApplications,
    downstreamApplications,
    close,
    tagFilters,
    snapshotId,
    plugin
  }) {
    const [activeTabIndex, onTabSelect] = useState(0);

    const stream = activeTabIndex === 0 ? upstream : downstream;
    const streamApplications = activeTabIndex === 0 ? upstreamApplications : downstreamApplications;

    return (
      <UpstreamDownstreamPresenter
        result={stream}
        resultApplication={streamApplications}
        activeTabIndex={activeTabIndex}
        onTabSelect={onTabSelect}
        items={stream.data?.items}
        itemsApplication={streamApplications.data?.items}
        timeConfig={timeConfig}
        serviceId={serviceId}
        applicationId={applicationId}
        endpointId={endpointId}
        close={close}
        tagFilters={tagFilters}
        snapshotId={snapshotId}
        plugin={plugin}
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
  contextScope,
  tagFilters,
  tagFilterEntity
}) {
  let tagFiltersWithEntity;
  if (tagFilters) {
    tagFiltersWithEntity = tagFilters.map(tagFilter => ({
      ...tagFilter,
      entity: tagFilterEntity,
      stringValue: tagFilter.value
    }));
  }

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
    tagFilters: tagFilters ? [...tagFiltersWithEntity] : null,
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

function getStreamDataApplication({
  query = '',
  page = 1,
  pageSize = 5,
  orderBy = 'callsAgg',
  orderDirection = 'DESC',
  applicationId,
  serviceId,
  endpointId,
  timeConfig,
  contextScope,
  tagFilters,
  tagFilterEntity
}) {
  let tagFiltersWithEntity;
  if (tagFilters) {
    tagFiltersWithEntity = tagFilters.map(tagFilter => ({
      ...tagFilter,
      entity: tagFilterEntity,
      stringValue: tagFilter.value
    }));
  }

  const granularity = getSparkChartGranularity(timeConfig);
  return getApplications({
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
    tagFilters: tagFilters ? [...tagFiltersWithEntity] : null,
    filter: {
      label: query,
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      timeConfig
    },
    contextScope
  });
}
