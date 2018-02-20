import React from 'react';

import Button from 'in-components/Button';

// TODO Use in-new-components/TopList everywhere and delete this! There is no 1.0 TopList.

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
          return (
            <li key={i}>
              {renderLabel(renderProps)}
              &nbsp;
              {renderMetric ? renderMetric(renderProps) : formattedMetricValue}
            </li>
          );
        })}
      </ol>

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
