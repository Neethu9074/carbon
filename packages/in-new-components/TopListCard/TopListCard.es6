import React from 'react';

import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import TopListPresenter from 'in-new-components/TopListCard/TopListPresenter';
import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator';
import { evaluateClassNames } from 'in-services/util/classnames';
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
      <ul className={locals.metrics}>
        {metrics.map((metric, i) => (
          <li key={metric} className={locals.metric}>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                onChangeMetric(metric);
              }}
              className={evaluateClassNames({
                [locals.metricLink]: true,
                [locals.active]: selectedMetric === metric
              })}>
              {labels[i]}
            </a>
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
  return <div className={locals.noDataFound}>No data available.</div>;
}
