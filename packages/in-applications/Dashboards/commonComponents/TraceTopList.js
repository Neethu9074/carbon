import theme from 'in-themes';
import { get } from 'lodash';
import React from 'react';

import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { meanLatencyFixed, number, percentage } from 'in-services/formatters/number';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getTraceGroups from 'in-subscription/application/getTraceGroups';
import getApplication from 'in-subscription/application/getApplication';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { boundaryScopes } from 'in-applications/constants';
import { hours } from 'in-services/time';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './TraceTopList.mless';

const metrics = ['latency', 'traces', 'erroneousCalls'];
const labels = ['Latency', 'Count', 'Erroneous Calls'];
const aggregations = ['MEAN', 'SUM', 'SUM'];
const formatters = [meanLatencyFixed.compact, number.compact, number.compact];
const companionMetrics = [null, null, 'errors'];
const companionAggregations = [null, null, 'MEAN'];
const companionFormatters = [null, null, percentage.detailed];
const colors = [null, null, theme.lib.colors.failure];

export default connect(({ applicationId, serviceId, endpointId }) => {
  const observables = {};
  if (applicationId) {
    observables.applicationName = getApplication({ id: applicationId }).map(getLabel);
  }
  if (serviceId) {
    observables.serviceName = getServiceLabel({ id: serviceId }).map(getLabel);
  }
  if (endpointId) {
    observables.endpointName = getEndpointInfo({ id: endpointId }).map(getLabel);
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
      companionMetrics={companionMetrics}
      companionAggregations={companionAggregations}
      companionFormatters={companionFormatters}
      getList={getList}
      render={TopListCardPresenter}
      renderViewAll={ViewAll}
      renderLabel={Label}
      renderMetric={Metric}
      renderCompanionMetric={RenderCompanionMetric}
      timeConfig={timeConfig}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
      applicationName={applicationName}
      serviceName={serviceName}
      endpointName={endpointName}
      colors={colors}
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
  selectedMetricAggregation,
  selectedCompanionMetric,
  selectedCompanionMetricAggregation
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

  const metrics = {
    [selectedMetric]: {
      metric: selectedMetric,
      aggregation: selectedMetricAggregation
    }
  };
  if (selectedCompanionMetric) {
    metrics[selectedCompanionMetric] = {
      metric: selectedCompanionMetric,
      aggregation: selectedCompanionMetricAggregation
    };
  }
  return getTraceGroups({
    pagination: {
      retrievalSize: 5
    },
    order: {
      by: selectedMetric,
      direction: 'DESC'
    },
    metrics: metrics,
    filter: {
      timeConfig,
      useLongTermDataOnly: timeConfig.windowSize > hours.toMillis(1) // query long term data when window size > 1h
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
        boundaryScope: boundaryScopes.all,
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
        boundaryScope: boundaryScopes.all,
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

function RenderCompanionMetric({ formattedCompanionMetric }) {
  return <span className={locals.companion}>({formattedCompanionMetric})</span>;
}
