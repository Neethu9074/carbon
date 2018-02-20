import React from 'react';
import { chain } from 'lodash';

import Button from 'in-components/Button';
import TopListRow from './TopListRow';

import locals from './TopListPresenter.mless';

export default function TopListPresenter(props) {
  const {
    result,
    metrics,
    labels,
    onChangeMetric,
    selectedMetric,
    selectedMetricFormatter,
    renderViewAll,
    renderLabel,
    renderMetric,
    getItemsFromResult = getItemsFromPaginatedResult,
    getMetricValueFromItem = getMetricValueFromItemWithMetricsHash
  } = props;

  if (result.progress.loading) {
    return <span>Loading…</span>;
  } else if (result.errors.length > 0) {
    return <span>Errors…</span>;
  } else if (result.data.totalHits === 0) {
    return <span>Nothing found…</span>;
  }

  const maxValue = chain(getItemsFromResult(result))
    .map(getMetricValueFromItem)
    .max();

  return (
    <div>
      <ul>
        {metrics.map((metric, i) => (
          <li key={metric}>
            <Button
              size="xs"
              kind={selectedMetric === metric ? 'primary' : 'secondary'}
              onClick={() => onChangeMetric(metric)}
            >
              {labels[i]}
            </Button>
          </li>
        ))}
      </ul>

      <div className={locals.topList}>
        <ol>
          {getItemsFromResult(result).map((item, i) => {
            const metricValue = getMetricValueFromItem(item);
            const formattedMetricValue = selectedMetricFormatter(metricValue);
            const renderProps = {
              ...props,
              item,
              metricValue,
              formattedMetricValue
            };
            const label = renderLabel(renderProps);
            const renderedMetric = renderMetric ? renderMetric(renderProps) : formattedMetricValue;
            return (
              <TopListRow
                key={i}
                renderedMetric={renderedMetric}
                metricValue={metricValue}
                maxValue={maxValue}
                label={label}
              />
            );
          })}
        </ol>
      </div>

      {renderViewAll && renderViewAll(props)}
    </div>
  );
}

function getItemsFromPaginatedResult(result) {
  return result.data.items;
}

function getMetricValueFromItemWithMetricsHash(item) {
  return item.metrics.metric[0][1];
}
