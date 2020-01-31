import React from 'react';

import { percentageZeroDecimalPlaces, time } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

import locals from './ProfileChart.mless';

export default function ProfileChart({ timeConfig, jvmSnapshot, processId }) {
  // const profileTimestamps = profile.profileGraph.map(childNode => childNode.timestamp);

  let chart;
  const y1 = {
    metrics: ['cpu.user', 'cpu.sys'],
    labels: ['User', 'System'],
    formatter: percentageZeroDecimalPlaces,
    type: 'line'
  };
  if (jvmSnapshot) {
    const collectors = jvmSnapshot.getIn(['data', 'jvm.collectors']).toArray();
    if (collectors.indexOf('ParNew') >= 0) {
      chart = (
        <Chart
          key={1}
          timeConfig={timeConfig}
          snapshotId={processId}
          y1={y1}
          y2={{
            snapshotId: jvmSnapshot.get('id'),
            metrics: ['gc.ParNew.time'],
            labels: ['ParNew Time'],
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
      {/* <div className={locals.profilesIndicatorWrapper}>
        <span className={locals.profilesLabel}>Profiles</span>
        <div className={locals.profilesIndicators} />
      </div> */}
    </div>
  );
}
