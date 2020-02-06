import React from 'react';

import SparkChart from 'in-components/SparkChart';

export default {
  title: 'Atoms|Sparkchart',
  component: SparkChart
};

export const Default = () => (
  <>
    <SparkChart
      rollup={10000}
      timeConfig={{ windowSize: 60000, to: 60000 }}
      metrics={[[0, 1], [10000, 1], [20000, 0], [30000, 2], [40000, 1], [50000, 2], [60000, 0.5]]}
    />
  </>
);

export const WithHorizontalMetricValue = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[[0, 200], [10000, 192], [20000, 197], [30000, 220], [40000, 197], [50000, 800], [60000, 198]]}
    horizontalMetricValue="12,345"
  />
);

export const WithVerticalMetricValue = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[[0, 200], [10000, 192], [20000, 197], [30000, 220], [40000, 197], [50000, 800], [60000, 198]]}
    verticalMetricValue="12,345"
  />
);

export const WithHorizontalMetricValueAndLabel = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[[0, 200], [10000, 192], [20000, 197], [30000, 220], [40000, 197], [50000, 800], [60000, 198]]}
    horizontalMetricValue="12,345"
    label="Label Here"
  />
);
