import React from 'react';

import { getTimeWindowBasedMetricAggregation } from 'in-stores/metric';
import MetricValue from 'in-components/MetricValue';
import connectTo from 'in-hoc/connectTo';

import './Kpi.less';

const block = 'in-dash-sum-kpi';

export default function Kpi({ snapshotId, timeframe, metric, timeWindowAggregation, formatter, label, percentages }) {
  return (
    <div className={block}>
      <span className={`${block}__label`}>
        {label}
      </span>
      <div className={`${block}__value-wrapper`}>
        <MetricValue
          snapshotId={snapshotId}
          metric={metric}
          timeframe={timeframe}
          timeWindowAggregation={timeWindowAggregation}
          formatter={formatter}
          className={`${block}__value`}
        />

        {percentages &&
          percentages.map(percentage =>
            <Percentage key={percentage.metric} snapshotId={snapshotId} timeframe={timeframe} {...percentage} />
          )}
      </div>
    </div>
  );
}

const Percentage = connectTo(
  props => {
    return {
      value: getTimeWindowBasedMetricAggregation({
        snapshotId: props.snapshotId,
        metric: props.metric,
        timeWindowAggregation: props.timeWindowAggregation,
        timeframe: props.timeframe
      })
    };
  },
  function Percentage({ formatter, label, value }) {
    const width = value == null ? '0%' : `${(value * 100) | 0}%`;

    return (
      <div className={`${block}__percentage`}>
        <div className={`${block}__percentage-fill`} style={{ width }} />
        <span className={`${block}__percentage-value`}>{value != null ? formatter(value) : '––'}</span>
        <span className={`${block}__percentage-label`}>
          {label}
        </span>
      </div>
    );
  }
);
