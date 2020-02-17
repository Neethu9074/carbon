import React from 'react';

import SparkChart from 'in-components/SparkChart';

export default {
  title: 'Atoms|Spark Chart',
  component: SparkChart
};

export const Loading = () => <SparkChart loading />;

export const MissingData = () => (
  <>
    <SparkChart timeConfig={{ windowSize: 60000, to: 60000 }} metrics={[]} />
    <SparkChart timeConfig={{ windowSize: 60000, to: 60000 }} metrics={[]} horizontalMetricValue="12,435" />
    <SparkChart timeConfig={{ windowSize: 60000, to: 60000 }} metrics={[]} verticalMetricValue="12,435" />
  </>
);

export const Default = () => (
  <>
    <SparkChart
      rollup={10000}
      timeConfig={{ windowSize: 60000, to: 60000 }}
      metrics={[[0, 1], [10000, 1], [20000, 0], [30000, 2], [40000, 1], [50000, 2], [60000, 0.5]]}
    />
  </>
);

export const WithMostlyZeroDataPointsAndASmallSpike = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[[0, 0], [10000, 0], [20000, 1], [30000, 0], [40000, 0], [50000, 0], [60000, 0]]}
  />
);

export const WithMostlySimilarDataPoints = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[[0, 200], [10000, 192], [20000, 197], [30000, 220], [40000, 197], [50000, 200], [60000, 198]]}
  />
);

export const WithMostlySimilarDataPointsAndADropToZero = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[[0, 200], [10000, 192], [20000, 197], [30000, 220], [40000, 197], [50000, 0], [60000, 198]]}
  />
);

export const WithMostlySimilarDataPointsAndASharpSpike = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[[0, 200], [10000, 192], [20000, 197], [30000, 220], [40000, 197], [50000, 800], [60000, 198]]}
  />
);

export const WithmostlySimilarDataPointsADropToZeroAndASharpSpike = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[[0, 200], [10000, 192], [20000, 0], [30000, 220], [40000, 197], [50000, 800], [60000, 198]]}
  />
);

export const WithmostlySimilarDataPointsASharpDropNnotToZeroAndASharpSpike = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[[0, 200], [10000, 192], [20000, 20], [30000, 220], [40000, 197], [50000, 800], [60000, 198]]}
  />
);

export const MissingDatapoints = () => (
  <SparkChart
    rollup={1000}
    timeConfig={{ windowSize: 8000, to: 8000 }}
    metrics={[[0, 1], [1000, 1], [4000, 1], [5000, 2], [8000, 1]]}
  />
);

export const WithHorizontalMetricValue = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[[0, 1], [10000, 1], [20000, 0], [30000, 2], [40000, 1], [50000, 2], [60000, 0.5]]}
    horizontalMetricValue="12,435"
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

export const WithVerticalMetricValue = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[[0, 1], [10000, 1], [20000, 0], [30000, 2], [40000, 1], [50000, 2], [60000, 0.5]]}
    verticalMetricValue="12,345"
  />
);

export const Sizes = () => (
  <>
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
  </>
);
