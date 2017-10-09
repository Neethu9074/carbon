import React from 'react';

import { number } from 'in-services/formatters/number';
import Chart from 'in-components/Chart';

import './Charts.less';

const block = 'in-dev-panel-charts';

export default function Charts() {
  return (
    <div className={block}>
      <Chart
        snapshotId="P9wdg-O_QgPAOgiqtk_ErPIUAzs"
        timeframe={{ windowSize: 1000 * 60, to: Date.now() }}
        margins={{
          left: 60
        }}
        y1={{
          min: 0,
          formatter: number.detailed,
          metrics: ['count'],
          labels: ['Calls'],
          enableForecast: true,
          type: 'line'
        }}
      />
    </div>
  );
}
