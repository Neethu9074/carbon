import React from 'react';

import MetricValue from 'in-components/MetricValue';

import 'in-components/KPIList/KPIList.less';

const block = 'in-kpi-list';

export default function KPIList({ formatters, classname, metrics, labels, snapshot, timeWindowAggregations }) {
  const className = block + (classname ? ' ' + classname : '');

  return (
    <div className={className}>
      {metrics.map((metric, index) =>
        <span key={labels[index]} className={block + '__kpi'}>
          <MetricValue
            snapshotId={snapshot.get('id')}
            metric={metric}
            formatter={formatters[index]}
            optionalTimeWindowAggregation={timeWindowAggregations[index]}
          />
        </span>
      )}
    </div>
  );
}
