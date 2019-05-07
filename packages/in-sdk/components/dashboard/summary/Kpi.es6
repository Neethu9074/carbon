import React from 'react';

import { valueMissingPlaceholder } from 'in-new-components/valueMissingPlaceholder';
import { getTimeWindowBasedMetricAggregation } from 'in-stores/metric';
import ErrorBar from 'in-sdk/components/dashboard/summary/ErrorBar';
import TwoValueBar from 'in-new-components/TwoValueBar';
import MetricValue from 'in-components/MetricValue';
import connectTo from 'in-hoc/connectTo';

import './Kpi.less';

const block = 'in-dash-sum-kpi';

export default function Kpi({
  snapshotId,
  timeConfig,
  metric,
  timeWindowAggregation,
  formatter,
  label,
  percentages,
  children,
  errorPercentage
}) {
  let renderedPercentages = null;
  if (percentages != null) {
    if (percentages.length === 2) {
      renderedPercentages = (
        <DualPercentage percentages={percentages} snapshotId={snapshotId} timeConfig={timeConfig} />
      );
    } else {
      throw new Error('Single percentage rendering not yet supported.');
    }
  } else if (errorPercentage != null) {
    renderedPercentages = <ErrorPercentage {...errorPercentage} />;
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
            timeConfig={timeConfig}
            timeWindowAggregation={timeWindowAggregation}
            formatter={formatter}
            className={`${block}__value`}
            initialValue={valueMissingPlaceholder}
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
        timeConfig: props.timeConfig
      })
    };
  },
  function DualPercentage({ aValue, percentages }) {
    return (
      <div style={{ marginLeft: '1rem' }}>
        <TwoValueBar
          v1={aValue}
          v2={1 - aValue}
          formatter={percentages[0].formatter}
          v1Label={percentages[0].label}
          v2Label={percentages[1].label}
        />
      </div>
    );
  }
);

const ErrorPercentage = connectTo(props => {
  return {
    value: getTimeWindowBasedMetricAggregation({
      snapshotId: props.snapshotId,
      metric: props.metric,
      timeWindowAggregation: 'mean',
      timeConfig: props.timeConfig
    })
  };
}, ErrorBar);
