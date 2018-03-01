import { chain } from 'lodash';
import React from 'react';

import Row from 'in-new-components/TopListCard/Row';

import locals from './List.mless';

export default function TopListPresenter(props) {
  const {
    result,
    selectedMetric,
    selectedMetricFormatter,
    renderViewAll,
    renderLabel,
    renderMetric,
    getItemsFromResult = getItemsFromPaginatedResult,
    getMetricValueFromItem = getMetricValueFromItemWithMetricsHash
  } = props;

  const items = getItemsFromResult(result);
  const maxValue = chain(items)
    .map(getMetricValueFromItem.bind(null, selectedMetric))
    .max();

  return (
    <div className={locals.topListWrapper}>
      <ol className={locals.topList}>
        {items.map((item, i) => {
          let metricValue = getMetricValueFromItem(selectedMetric, item);
          let formattedMetricValue;
          if (metricValue != null) {
            formattedMetricValue = selectedMetricFormatter(metricValue);
          } else {
            metricValue = 0;
            formattedMetricValue = '––';
          }
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

function getMetricValueFromItemWithMetricsHash(metricId, item) {
  if (item.metrics[metricId]) {
    return item.metrics[metricId][0][1];
  } else {
    return null;
  }
}
