import { chain, get } from 'lodash';
import React from 'react';

import ViewAllWrapper from 'in-new-components/TopListCard/ViewAllWrapper';
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
          const renderedMetric = renderMetric ? renderMetric(renderProps) : formattedMetricValue;
          return (
            <Row
              key={i}
              renderedMetric={renderedMetric}
              metricValue={metricValue}
              maxValue={maxValue}
              label={renderLabel(renderProps, item, locals.label)}
            />
          );
        })}
      </ol>

      {renderViewAll && <ViewAllWrapper {...props} />}
    </div>
  );
}

function getItemsFromPaginatedResult(result) {
  return result.data.items;
}

function getMetricValueFromItemWithMetricsHash(metricId, item) {
  return get(item, ['metrics', metricId, 0, 1]);
}
