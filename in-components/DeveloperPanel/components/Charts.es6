import React from 'react';

import { percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';

import './Charts.less';

const block = 'in-dev-panel-charts';

export default function Charts() {
  return (
    <div className={block}>
      <Chart
        snapshotId="wQb3rE752dKH0Lgy8MDP0tTLGiY"
        timeframe={{ windowSize: 1000 * 60, to: Date.now() }}
        margins={{
          left: 60
        }}
        y1={{
          min: 0,
          max: 1,
          formatter: percentageZeroDecimalPlaces,
          metrics: ['cpu.user', 'cpu.sys', 'cpu.wait', 'cpu.nice', 'cpu.steal'],
          labels: ['User', 'System', 'Wait', 'Nice', 'Steal'],
          type: 'bar'
        }}
      />
    </div>
  );
}
