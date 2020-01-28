import React, { Fragment } from 'react';

import getDatabaseStatementTopList from 'in-subscription/application/getDatabaseStatementTopList';
import TopListCardPresenter from 'in-new-components/TopListCard/TopListCardPresenter';
import TopList, { trackTopListNavigation } from 'in-new-components/TopList';
import { millis, number } from 'in-services/formatters/number';
import { getModifiedUrlStream } from 'in-stores/navigation';
import { shorten } from 'in-services/util/string';
import Link from 'in-components/Link';
import theme from 'in-themes';

const metrics = ['latency', 'calls', 'errors'];
const labels = ['Latency', 'Calls', 'Erroneous Calls'];
const aggregations = ['MEAN', 'SUM', 'SUM'];
const formatters = [millis.fixedCompact, number.compact, number.compact];
const colors = [null, null, theme.lib.colors.failure];

export default function DatabaseStatementTopList({ applicationId, serviceId, endpointId, boundaryScope, timeConfig }) {
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
      boundaryScope={boundaryScope}
      colors={colors}
    />
  );
}

function getItemsFromResult(result) {
  return result.data;
}

function getMetricValueFromItem(metricId, item) {
  return item.metricValue;
}

function getList({
  applicationId,
  serviceId,
  endpointId,
  boundaryScope,
  timeConfig,
  selectedMetric,
  selectedMetricAggregation
}) {
  return getDatabaseStatementTopList({
    metric: {
      metric: selectedMetric,
      aggregation: selectedMetricAggregation
    },
    filter: {
      application: applicationId,
      service: serviceId,
      endpoint: endpointId,
      applicationBoundaryScope: boundaryScope,
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
