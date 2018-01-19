import { storiesOf } from '@storybook/react';
import React from 'react';

import SparkChart from 'in-components/SparkChart';
import Root from '../_helpers/Root';

storiesOf('components/SparkChart', module).add('simple', () => <Simple />);

function Simple() {
  const lotsOfMetrics = [];
  for (let i = 0; i < 40; i++) {
    lotsOfMetrics.push([i / 40 * 60000, Math.random() * 100]);
  }

  return (
    <Root>
      <SparkChart
        timeframe={{ windowSize: 60000, to: 60000 }}
        metrics={[[0, 1], [10000, 1], [20000, 0], [30000, 2], [60000, 0.5]]}
      />
      <SparkChart
        timeframe={{ windowSize: 60000, to: 60000 }}
        metrics={[[10000, 1], [20000, 0], [30000, 2], [60000, 0.5]]}
      />
      <SparkChart timeframe={{ windowSize: 60000, to: 60000 }} metrics={[[0, 1], [10000, 1], [20000, 0], [30000, 2]]} />
      <SparkChart timeframe={{ windowSize: 60000, to: 60000 }} metrics={[[10000, 1], [20000, 0], [30000, 2]]} />
      <SparkChart timeframe={{ windowSize: 60000, to: 60000 }} metrics={lotsOfMetrics} />
    </Root>
  );
}
