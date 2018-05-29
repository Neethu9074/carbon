import React from 'react';

import { number } from 'in-services/formatters/number';
import Row from 'in-new-components/TopListCard/Row';

import locals from './List.mless';

export default function TopListPresenter(props) {
  const { result, selectedMetricFormatter } = props;
  return (
    <ol className={locals.topList}>
      {result.data.map((item, i) => (
        <Row
          key={i}
          label={`${item.endpoint.label} (${number.compact(item.traceCount)})`}
          metricValue={item.contributed}
          maxValue={item.total}
          renderedMetric={selectedMetricFormatter(item.total)}
          renderContributedItem={() => selectedMetricFormatter(item.contributed)}
        />
      ))}
    </ol>
  );
}
