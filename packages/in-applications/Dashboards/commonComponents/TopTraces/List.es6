import React from 'react';

import { number } from 'in-services/formatters/number';
import Row from 'in-new-components/TopListCard/Row';
import Tooltip from 'in-components/Tooltip';

import locals from './List.mless';

export default function TopListPresenter(props) {
  const { result, selectedMetricFormatter } = props;
  return (
    <ol className={locals.topList}>
      {result.data.map((item, i) => (
        <Row
          key={i}
          metricValue={item.contributed}
          maxValue={item.total}
          label={`${item.endpoint.label} (${number.compact(item.traceCount)})`}
          renderedMetric={selectedMetricFormatter(item.total)}
          renderedContributedItem={selectedMetricFormatter(item.contributed)}
          wrapLabel={label => <Tooltip content="Trace entry">{label}</Tooltip>}
          wrapContributedItem={item => <Tooltip content="Average time contributed to trace.">{item}</Tooltip>}
        />
      ))}
    </ol>
  );
}
