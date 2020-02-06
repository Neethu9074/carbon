import React from 'react';

import ProfilesInTimeIndicator from 'in-profiling/analyze/AnalyzeView/ProfilesView/ProfilesInTimeIndicator';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { percentage, time } from 'in-services/formatters/number';

import locals from './ProfileChart.mless';

export default function ProfileChart({ profile, timeConfig, jvmSnapshot, processId }) {
  let chart;
  const y1 = {
    metrics: ['cpu.user', 'cpu.sys'],
    labels: ['User', 'System'],
    formatter: percentage,
    type: 'line'
  };
  if (jvmSnapshot) {
    const collectors = jvmSnapshot.getIn(['data', 'jvm.collectors']).toArray();
    if (collectors.length > 0) {
      chart = (
        <Chart
          key={1}
          timeConfig={timeConfig}
          snapshotId={processId}
          y1={y1}
          y2={{
            snapshotId: jvmSnapshot.get('id'),
            metrics: collectors.map(name => 'gc.' + name + '.time'),
            labels: collectors.map(name => name + ' Time'),
            formatter: time,
            type: 'line'
          }}
        />
      );
    }
  }
  if (!chart) {
    chart = <Chart key={2} snapshotId={processId} timeConfig={timeConfig} y1={y1} />;
  }

  return (
    <div className={locals.chartWrapper}>
      {chart}
      <ProfilesInTimeIndicator timeConfig={timeConfig} profile={profile} />
    </div>
  );
}
