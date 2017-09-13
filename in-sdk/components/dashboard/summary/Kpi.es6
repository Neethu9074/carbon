import React from 'react';

import { getTimeWindowBasedMetricAggregation } from 'in-stores/metric';
import MetricValue from 'in-components/MetricValue';
import connectTo from 'in-hoc/connectTo';

import './Kpi.less';

const block = 'in-dash-sum-kpi';

export default function Kpi({
  snapshotId,
  timeframe,
  metric,
  timeWindowAggregation,
  formatter,
  label,
  percentages,
  children
}) {
  let renderedPercentages = null;
  if (percentages != null && percentages.length === 2) {
    renderedPercentages = <DualPercentage percentages={percentages} snapshotId={snapshotId} timeframe={timeframe} />;
  } else if (percentages != null && percentages.length === 1 && __DEV__) {
    throw new Error('Single percentage rendering not yet supported.');
  }

  return (
    <div className={block}>
      <span className={`${block}__label`}>
        {label}
      </span>
      <div className={`${block}__value-wrapper`}>
        <div className={`${block}__value`}>
          {children}
        </div>

        {!children
          ? <MetricValue
              snapshotId={snapshotId}
              metric={metric}
              timeframe={timeframe}
              timeWindowAggregation={timeWindowAggregation}
              formatter={formatter}
              className={`${block}__value`}
              initialValue="––"
            />
          : null}

        {!children && renderedPercentages}
      </div>
    </div>
  );
}

const DualPercentage = connectTo(
  props => {
    return {
      aValue: getTimeWindowBasedMetricAggregation({
        snapshotId: props.snapshotId,
        metric: props.percentages[0].metric,
        timeWindowAggregation: props.percentages[0].timeWindowAggregation,
        timeframe: props.timeframe
      })
    };
  },
  function DualPercentage({ aValue, percentages }) {
    if (aValue == null || aValue < 0) {
      return null;
    }
    const width = aValue == null ? '0%' : `${(aValue * 100) | 0}%`;

    return (
      <div className={`${block}__percentage2`}>
        <div className={`${block}__percentage2-bar`}>
          <div className={`${block}__percentage2-fill`} style={{ width }} />
        </div>

        <span className={`${block}__percentage2-a`}>
          {aValue != null ? percentages[0].formatter(aValue) : '––'} {percentages[0].label}
        </span>
        <span className={`${block}__percentage2-b`}>
          {percentages[1].label} {aValue != null ? percentages[1].formatter(1 - aValue) : '––'}
        </span>
      </div>
    );
  }
);
