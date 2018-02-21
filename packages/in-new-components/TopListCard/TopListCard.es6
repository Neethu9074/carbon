import React from 'react';

import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator';
import TopListPresenter from './TopListPresenter';
import Button from 'in-components/Button';
import Card from 'in-new-components/Card';

import locals from './TopListCard.mless';

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
      <ul className={locals.topListCardActions}>
        <span>
          {metrics.map((metric, i) => (
            <li key={metric}>
              <Button
                onClick={() => onChangeMetric(metric)}
                className={locals.tabLikeButton}
                style={selectedMetric === metric ? { textDecoration: 'underline' } : { textDecoration: 'none' }}
              >
                {labels[i]}
              </Button>
            </li>
          ))}
        </span>
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
  return <div className={locals.noDataFound}>No data available.</div>;
}
