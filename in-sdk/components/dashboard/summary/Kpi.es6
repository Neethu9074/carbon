import React from 'react';

import DualValueBar from 'in-sdk/components/dashboard/summary/DualValueBar';
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

  const wrapperClass = renderedPercentages ? `${block}__value-wrapper-grow` : '';

  return (
    <div className={block}>
      <span className={`${block}__label`}>{label}</span>
      <div className={`${block}__value-wrapper ${wrapperClass}`}>
        <div className={`${block}__value`}>{children}</div>

        {!children ? (
          <MetricValue
            snapshotId={snapshotId}
            metric={metric}
            timeframe={timeframe}
            timeWindowAggregation={timeWindowAggregation}
            formatter={formatter}
            className={`${block}__value`}
            initialValue="––"
          />
        ) : null}
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
    return (
      <DualValueBar
        aValue={aValue}
        bValue={1 - aValue}
        formatter={percentages[0].formatter}
        aLabel={percentages[0].label}
        bLabel={percentages[1].label}
      />
    );
  }
);
