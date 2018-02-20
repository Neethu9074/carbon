import React from 'react';

import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator';
import TopListPresenter from './TopListPresenter';
import Button from 'in-components/Button';
import Card from 'in-new-components/Card';

// Usage
// <TopListCard result,
//   metrics,
//   labels,
//   onChangeMetric,
//   selectedMetric,
//   selectedMetricFormatter,
//   renderViewAll,
//   renderLabel,
//   renderMetric,
//   getItemsFromResult,
//   getMetricValueFromItem />

export default function TopListCard(props) {
  const { result, title } = props;
  let content;
  let metricSelection;
  let withoutPadding = true;
  if (result.progress.loading) {
    content = <HorizontalIndicator progress={result.progress} />;
  } else if (result.errors.length > 0) {
    content = <ErroneousResultPresenter errors={result.errors} />;
    withoutPadding = false;
  } else if (result.data.totalHits === 0) {
    content = <NoDataFoundState {...props} />;
  } else {
    const { metrics, labels, onChangeMetric, selectedMetric } = props;
    metricSelection = (
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
    );
    content = <TopListPresenter {...props} />;
  }

  return (
    <Card title={title} withoutPadding={withoutPadding} header={metricSelection}>
      {content}
    </Card>
  );
}

function NoDataFoundState() {
  // TODO Fix
  return <div>No data…</div>;
}
