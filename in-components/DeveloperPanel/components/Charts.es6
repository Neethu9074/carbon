import React from 'react';

import { number } from 'in-services/formatters/number';
import { timeframe$ } from 'in-stores/timeline';
import Chart from 'in-components/Chart';

import './Charts.less';

const block = 'in-dev-panel-charts';

export default function Charts() {
  return (
    <div className={block}>
      <Chart
        snapshotId="P9wdg-O_QgPAOgiqtk_ErPIUAzs"
        timeframe$={timeframe$}
        margins={{
          left: 60
        }}
        y1={{
          formatter: number.detailed,
          metrics: ['count'],
          labels: ['Calls'],
          type: 'line',
          enableForecast: true
        }}
      />
    </div>
  );
}
