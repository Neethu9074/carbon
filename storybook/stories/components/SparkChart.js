import { storiesOf } from '@storybook/react';
import React from 'react';

import SparkChart from 'in-components/SparkChart';
import Root from '../_helpers/Root';

storiesOf('components/SparkChart', module)
  .add('Simple', () => <Simple />)
  .add('Missing Datapoints', () => <Missing />)
  .add('Sizes', () => <Sizes />);

function Simple() {
  const lotsOfMetrics = [];
  for (let i = 0; i < 20; i++) {
    lotsOfMetrics.push([i / 20 * 60000, Math.random() * 100]);
  }

  return (
    <Root>
      <SparkChart
        rollup={10000}
        timeframe={{ windowSize: 60000, to: 60000 }}
        metrics={[[0, 1], [10000, 1], [20000, 0], [30000, 2], [40000, 1], [50000, 2], [60000, 0.5]]}
      />
      <SparkChart rollup={5000} timeframe={{ windowSize: 60000, to: 60000 }} metrics={lotsOfMetrics} />
    </Root>
  );
}

function Missing() {
  return (
    <Root>
      <SparkChart
        rollup={1000}
        timeframe={{ windowSize: 8000, to: 8000 }}
        metrics={[[0, 1], [1000, 1], [4000, 1], [5000, 2], [8000, 1]]}
      />
    </Root>
  );
}

function Sizes() {
  return (
    <Root>
      <SparkChart
        rollup={10000}
        timeframe={{ windowSize: 60000, to: 60000 }}
        metrics={[[0, 1], [10000, 1], [20000, 0], [30000, 2], [40000, 1], [50000, 2], [60000, 0.5]]}
      />
      <SparkChart
        rollup={10000}
        timeframe={{ windowSize: 60000, to: 60000 }}
        metrics={[[0, 1], [10000, 1], [20000, 0], [30000, 2], [40000, 1], [50000, 2], [60000, 0.5]]}
        width={200}
        height={100}
      />
    </Root>
  );
}
