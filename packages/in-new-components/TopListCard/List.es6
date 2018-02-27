import { chain } from 'lodash';
import React from 'react';

import Row from 'in-new-components/TopListCard/Row';

import locals from './List.mless';

export default function TopListPresenter(props) {
  const {
    result,
    selectedMetricFormatter,
    renderViewAll,
    renderLabel,
    renderMetric,
    getItemsFromResult = getItemsFromPaginatedResult,
    getMetricValueFromItem = getMetricValueFromItemWithMetricsHash
  } = props;

  const items = getItemsFromResult(result);
  const maxValue = chain(items)
    .map(getMetricValueFromItem)
    .max();

  return (
    <div className={locals.topListWrapper}>
      <ol className={locals.topList}>
        {items.map((item, i) => {
          const metricValue = getMetricValueFromItem(item);
          const formattedMetricValue = selectedMetricFormatter(metricValue);
          const renderProps = {
            ...props,
            item,
            metricValue,
            formattedMetricValue
          };
          const label = renderLabel(renderProps, item);
          const renderedMetric = renderMetric ? renderMetric(renderProps) : formattedMetricValue;
          return (
            <Row key={i} renderedMetric={renderedMetric} metricValue={metricValue} maxValue={maxValue} label={label} />
          );
        })}
      </ol>

      {renderViewAll && <div className={locals.viewAll}>{renderViewAll(props)}</div>}
    </div>
  );
}

function getItemsFromPaginatedResult(result) {
  return result.data.items;
}

function getMetricValueFromItemWithMetricsHash(item) {
  return item.metrics.metric[0][1];
}
