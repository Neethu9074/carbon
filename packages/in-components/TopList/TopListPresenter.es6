import React from 'react';

import Button from 'in-components/Button';

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
    renderMetric
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
        {result.data.items.map((item, i) => {
          const metricValue = item.metrics.metric[0][1];
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
