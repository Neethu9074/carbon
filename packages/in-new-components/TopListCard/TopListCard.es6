import React from 'react';

import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator';
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
  let withoutPadding = true;
  if (result.progress.loading) {
    content = <HorizontalIndicator progress={result.progress} />;
  } else if (result.errors.length > 0) {
    content = <ErroneousResultPresenter errors={result.errors} />;
    withoutPadding = false;
  } else if (result.data.totalHits === 0) {
    content = <NoDataFoundState {...props} />;
  } else {
    content = <DataFoundState {...props} />;
  }

  return (
    <Card title={title} withoutPadding={withoutPadding}>
      {content}
    </Card>
  );
}

function NoDataFoundState() {
  return <div>No data…</div>;
}

function DataFoundState() {
  return <div>Got data!</div>;
}
