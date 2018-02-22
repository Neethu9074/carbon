import React, { Fragment } from 'react';

import getDatabaseStatementTopList from 'in-subscription/application/getDatabaseStatementTopList';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { ms, number } from 'in-services/formatters/number';
import TopList from 'in-new-components/TopList';
import Link from 'in-components/Link';

const metrics = ['latency', 'calls', 'errors'];
const labels = ['Latency', 'Calls', 'Error Rate'];
const aggregations = ['MEAN', 'MEAN', 'MEAN'];
const formatters = [ms.compact, number.compact, number.compact];

export default function DatabaseStatementTopList({ applicationId, serviceId, endpointId, timeframe }) {
  return (
    <TopList
      title="Slow Statements"
      metrics={metrics}
      labels={labels}
      aggregations={aggregations}
      formatters={formatters}
      getList={getList}
      getItemsFromResult={getItemsFromResult}
      getMetricValueFromItem={getMetricValueFromItem}
      render={TopListCardPresenter}
      renderLabel={Label}
      renderMetric={Metric}
      timeframe={timeframe}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
    />
  );
}

function getItemsFromResult(result) {
  return result.data;
}

function getMetricValueFromItem(item) {
  return item.metricValue;
}

function getList({ applicationId, serviceId, endpointId, timeframe, selectedMetric, selectedMetricAggregation }) {
  return getDatabaseStatementTopList({
    metric: {
      metric: selectedMetric,
      aggregation: selectedMetricAggregation
    },
    filter: {
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      timeframe
    }
  });
}

function Label({ item }) {
  return (
    <Fragment>
      <Link
        href$={getModifiedUrlStream(params => {
          params.pathname += `/database/statements/${item.id}`;
        })}
      >
        {item.statement}
      </Link>
    </Fragment>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
