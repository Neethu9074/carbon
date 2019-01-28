import React from 'react';
import { get } from 'lodash';

import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import getEndpointLabel from 'in-subscription/application/getEndpointLabel';
import { millis, percentage, number } from 'in-services/formatters/number';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getTraceGroups from 'in-subscription/application/getTraceGroups';
import getApplication from 'in-subscription/application/getApplication';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import Link from 'in-components/Link';
import connect from 'in-hoc/connectTo';

const metrics = ['traces', 'latency', 'errors'];
const labels = ['Count', 'Latency', 'Errors'];
const aggregations = ['SUM', 'MEAN', 'MEAN'];
const formatters = [number.compact, millis.fixedCompact, percentage.detailed];

export default connect(({ applicationId, serviceId, endpointId }) => {
  const observables = {};
  if (applicationId) {
    observables.applicationName = getApplication({ id: applicationId }).map(getLabel);
  }
  if (serviceId) {
    observables.serviceName = getServiceLabel({ id: serviceId }).map(getLabel);
  }
  if (endpointId) {
    observables.endpointName = getEndpointLabel({ id: endpointId }).map(getLabel);
  }
  return observables;
})(function TraceTopList({
  applicationId,
  serviceId,
  endpointId,
  timeConfig,
  applicationName,
  serviceName,
  endpointName
}) {
  return (
    <TopList
      title="Top Traces"
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      getList={getList}
      render={TopListCardPresenter}
      renderViewAll={ViewAll}
      renderLabel={Label}
      renderMetric={Metric}
      timeConfig={timeConfig}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      applicationName={applicationName}
      serviceName={serviceName}
      endpointName={endpointName}
    />
  );
});

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}

function getList({
  applicationName,
  serviceName,
  endpointName,
  timeConfig,
  selectedMetric,
  selectedMetricAggregation
}) {
  let tagFilters = [];
  if (applicationName != null) {
    tagFilters.push({ name: 'application.name', operator: 'EQUALS', stringValue: applicationName });
  }
  if (serviceName != null) {
    tagFilters.push({ name: 'service.name', operator: 'EQUALS', stringValue: serviceName });
  }
  if (endpointName != null) {
    tagFilters.push({ name: 'endpoint.name', operator: 'EQUALS', stringValue: endpointName });
  }
  tagFilters.push({ name: 'call.is_synthetic', operator: 'EQUALS', booleanValue: false });

  return getTraceGroups({
    pagination: {
      retrievalSize: 5
    },
    order: {
      by: selectedMetric,
      direction: 'DESC'
    },
    metrics: {
      [selectedMetric]: {
        metric: selectedMetric,
        aggregation: selectedMetricAggregation
      }
    },
    filter: {
      timeConfig
    },
    tagFilters,
    group: {
      groupbyTag: 'trace.endpoint.name'
    }
  });
}

function ViewAll({ applicationName, serviceName, endpointName, selectedMetric }, className) {
  return (
    <Link
      className={className}
      href$={getLinkToAnalyze({
        applicationName,
        serviceName,
        endpointName,
        dataSource: 'traces',
        orderBy: `${selectedMetric}Agg`,
        orderDirection: 'DESC'
      })}
    >
      View all traces
    </Link>
  );
}

function Label({ item, applicationName, serviceName, endpointName }, className) {
  return (
    <Link
      className={className}
      href$={getLinkToAnalyze({
        applicationName,
        serviceName,
        endpointName,
        groupByTag: {},
        dataSource: 'traces',
        filters: [{ name: 'trace.endpoint.name', value: item.name }]
      })}
      onClick={() => trackTopListNavigation()}
    >
      {item.name}
    </Link>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
