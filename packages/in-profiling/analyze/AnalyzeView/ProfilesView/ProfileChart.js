import React from 'react';

import { percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

import locals from './ProfileChart.mless';

export default function ProfileChart({ timeConfig, processId }) {
  // const profileTimestamps = profile.profileGraph.map(childNode => childNode.timestamp);

  return (
    <div className={locals.chartWrapper}>
      <Chart
        snapshotIds={[processId, processId]}
        timeConfig={timeConfig}
        y1={{
          metrics: ['cpu.user', 'cpu.sys'],
          labels: ['User', 'System'],
          formatter: percentageZeroDecimalPlaces,
          type: 'line'
        }}
      />
      <div className={locals.profilesIndicatorWrapper}>
        <span className={locals.profilesLabel}>Profiles</span>
        <div className={locals.profilesIndicators} />
      </div>
    </div>
  );
}
