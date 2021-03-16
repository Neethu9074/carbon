/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import HistoricMetricSparkChart from 'in-components/SparkChart/HistoricMetricSparkChart';
import MetricValue from 'in-components/MetricValue';

import locals from './SparkChartsSection.mless';

export default function SparkChartsSection({ snapshot, metrics, renderPostChartContent }) {
  return (
    <div className={locals.section}>
      {metrics.map(metric => (
        <LabeledSparkChart
          key={metric.metric + metric.aggregation}
          snapshotId={snapshot.get('id')}
          metric={metric}
          renderPostChartContent={renderPostChartContent}
        />
      ))}
    </div>
  );
}

function LabeledSparkChart({ snapshotId, metric, renderPostChartContent }) {
  const { label, formatter, aggregation } = metric;
  const metricName = metric.metric;

  return (
    <div className={locals.chartWrapper}>
      <HistoricMetricSparkChart
        width={140}
        snapshotId={snapshotId}
        metric={metricName}
        tooltipFormatter={formatter.detailed}
        aggregation={aggregation}
        renderPostChartContent={renderPostChartContent}
      />
      <div className={locals.description}>
        <span className={locals.label}>{label}</span>
        <MetricValue
          className={locals.value}
          snapshotId={snapshotId}
          metric={metricName}
          formatter={formatter.compact}
          timeWindowAggregation={aggregation}
        />
      </div>
    </div>
  );
}
