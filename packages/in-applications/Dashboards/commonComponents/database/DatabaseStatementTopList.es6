import React, { Fragment } from 'react';

import getDatabaseStatementTopList from 'in-subscription/application/getDatabaseStatementTopList';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { millis, number } from 'in-services/formatters/number';
import { shorten } from 'in-services/util/string';
import Link from 'in-components/Link';

const metrics = ['latency', 'calls', 'errors'];
const labels = ['Latency', 'Calls', 'Error Rate'];
const aggregations = ['MEAN', 'MEAN', 'MEAN'];
const formatters = [millis.fixedCompact, number.compact, number.compact];

export default function DatabaseStatementTopList({ applicationId, serviceId, endpointId, timeConfig }) {
  return (
    <TopList
      title="Top Statements"
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
      timeConfig={timeConfig}
      applicationId={applicationId}
      serviceId={serviceId}
      endpointId={endpointId}
    />
  );
}

function getItemsFromResult(result) {
  return result.data;
}

function getMetricValueFromItem(metricId, item) {
  return item.metricValue;
}

function getList({ applicationId, serviceId, endpointId, timeConfig, selectedMetric, selectedMetricAggregation }) {
  return getDatabaseStatementTopList({
    metric: {
      metric: selectedMetric,
      aggregation: selectedMetricAggregation
    },
    filter: {
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      timeConfig
    }
  });
}

function Label({ item }, _item, className) {
  return (
    <Fragment>
      <Link
        className={className}
        href$={getModifiedUrlStream(params => {
          params.pathname += `/database/statements/${item.id}`;
        })}
        onClick={() => trackTopListNavigation()}
      >
        {shorten(item.statement, 64)}
      </Link>
    </Fragment>
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}
