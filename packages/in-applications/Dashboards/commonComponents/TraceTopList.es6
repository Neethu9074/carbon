import React from 'react';
import { get } from 'lodash';

import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import { millis, percentage, number } from 'in-services/formatters/number';
import getTraceGroups from 'in-subscription/application/getTraceGroups';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import Link from 'in-components/Link';
import connect from 'in-hoc/connectTo';

const metrics = ['traces', 'latency', 'errors'];
const labels = ['Count', 'Latency', 'Errors'];
const aggregations = ['SUM', 'MEAN', 'MEAN'];
const formatters = [number.compact, millis.fixedCompact, percentage.detailed];

export default connect(({ applicationId, serviceId }) => {
  const observables = {};
  if (applicationId) {
    observables.applicationName = getApplication({ id: applicationId }).map(getLabel);
  }
  if (serviceId) {
    observables.serviceName = getServiceLabel({ id: serviceId }).map(getLabel);
  }
  return observables;
})(function TraceTopList({ applicationId, serviceId, endpointId, timeConfig, applicationName, serviceName }) {
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
    />
  );
});

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}

function getList({ applicationName, serviceName, endpointId, timeConfig, selectedMetric, selectedMetricAggregation }) {
  let tagFilters = [];
  if (applicationName != null) {
    tagFilters.push({ name: 'application.name', operator: 'EQUALS', stringValue: applicationName });
  }
  if (serviceName != null) {
    tagFilters.push({ name: 'service.name', operator: 'EQUALS', stringValue: serviceName });
  }
  if (endpointId != null) {
    tagFilters.push({ name: 'endpoint.name', operator: 'EQUALS', stringValue: endpointId });
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

function ViewAll({ applicationName, serviceName, endpointId: endpointName, selectedMetric }, className) {
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
      View All
    </Link>
  );
}

function Label({ item, applicationName, serviceName, endpointId: endpointName }, className) {
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
