import { storiesOf } from '@storybook/react';
import React from 'react';

import SparkChart from 'in-components/SparkChart';
import Root from '../_helpers/Root';

storiesOf('components/SparkChart', module)
  .add('simple', () => <Simple />)
  .add('missing datapoints', () => <Missing />);

function Simple() {
  const lotsOfMetrics = [];
  for (let i = 0; i < 40; i++) {
    lotsOfMetrics.push([i / 40 * 6000, Math.random() * 100]);
  }

  return (
    <Root>
      <SparkChart
        timeframe={{ windowSize: 6000, to: 6000 }}
        metrics={[[0, 1], [1000, 1], [2000, 0], [3000, 2], [4000, 1], [5000, 2], [6000, 0.5]]}
      />
      <SparkChart timeframe={{ windowSize: 6000, to: 6000 }} metrics={lotsOfMetrics} />
    </Root>
  );
}

function Missing() {
  return (
    <Root>
      <SparkChart
        rollup={1000}
        timeframe={{ windowSize: 6000, to: 6000 }}
        metrics={[[0, 1], [1000, 1], [3000, 1], [5000, 2], [6000, 1]]}
      />
    </Root>
  );
}
