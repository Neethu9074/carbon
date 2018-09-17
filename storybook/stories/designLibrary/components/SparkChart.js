import { storiesOf } from '@storybook/react';
import React from 'react';

import SparkChart from 'in-components/SparkChart';

import Section from '../../_helpers/Section';
import Root from '../../_helpers/Root';

storiesOf('designLibrary/Components/Spark Chart', module).add('SparkChart', () => <SparkChartStory />);

function SparkChartStory() {
  const lotsOfMetrics = [];
  for (let i = 0; i < 20; i++) {
    lotsOfMetrics.push([i / 20 * 60000, Math.random() * 100]);
  }

  return (
    <Root>
      <Section title="Loading Data">
        <SparkChart timeConfig={{ windowSize: 60000, to: 60000 }} />
      </Section>

      <Section title="Missing Data">
        <SparkChart timeConfig={{ windowSize: 60000, to: 60000 }} metrics={[]} />
        <SparkChart timeConfig={{ windowSize: 60000, to: 60000 }} metrics={[]} horizontalMetricValue="12,435" />
        <SparkChart timeConfig={{ windowSize: 60000, to: 60000 }} metrics={[]} verticalMetricValue="12,435" />
      </Section>

      <Section title="With Data">
        <SparkChart
          rollup={10000}
          timeConfig={{ windowSize: 60000, to: 60000 }}
          metrics={[[0, 1], [10000, 1], [20000, 0], [30000, 2], [40000, 1], [50000, 2], [60000, 0.5]]}
        />
        <SparkChart rollup={5000} timeConfig={{ windowSize: 60000, to: 60000 }} metrics={lotsOfMetrics} />
      </Section>

      <Section title="Missing Datapoints">
        <SparkChart
          rollup={1000}
          timeConfig={{ windowSize: 8000, to: 8000 }}
          metrics={[[0, 1], [1000, 1], [4000, 1], [5000, 2], [8000, 1]]}
        />
      </Section>

      <Section title="With Horizontal Metric Value">
        <SparkChart
          rollup={10000}
          timeConfig={{ windowSize: 60000, to: 60000 }}
          metrics={[[0, 1], [10000, 1], [20000, 0], [30000, 2], [40000, 1], [50000, 2], [60000, 0.5]]}
          horizontalMetricValue="12,435"
        />
      </Section>
      <Section title="With Vertical Metric Value">
        <SparkChart
          rollup={10000}
          timeConfig={{ windowSize: 60000, to: 60000 }}
          metrics={[[0, 1], [10000, 1], [20000, 0], [30000, 2], [40000, 1], [50000, 2], [60000, 0.5]]}
          verticalMetricValue="12,345"
        />
      </Section>

      <Section title="Sizes">
        <SparkChart
          rollup={10000}
          timeConfig={{ windowSize: 60000, to: 60000 }}
          metrics={[[0, 1], [10000, 1], [20000, 0], [30000, 2], [40000, 1], [50000, 2], [60000, 0.5]]}
        />
        <SparkChart
          rollup={10000}
          timeConfig={{ windowSize: 60000, to: 60000 }}
          metrics={[[0, 1], [10000, 1], [20000, 0], [30000, 2], [40000, 1], [50000, 2], [60000, 0.5]]}
          width={200}
          height={100}
        />
      </Section>
    </Root>
  );
}
