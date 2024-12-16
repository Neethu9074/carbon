/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Typography } from '@instana/components';

import { percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import { chartColors } from 'in-themes/chartColors';
import SparkChart from 'in-components/SparkChart';

export default {
  parameters: {
    storyshots: { disable: true }
  },
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
      metrics={[
        [0, 1],
        [10000, 1],
        [20000, 0],
        [30000, 2],
        [40000, 1],
        [50000, 2],
        [60000, 0.5]
      ]}
    />
  </>
);

export const OtherColor = {
  args: {
    rollup: 10000,
    timeConfig: { windowSize: 60000, to: 60000 },
    metrics: [
      [0, 1],
      [10000, 1],
      [20000, 0],
      [30000, 2],
      [40000, 1],
      [50000, 2],
      [60000, 0.5]
    ],
    strokeColor: chartColors.strokeColors100[2],
    fillColor: chartColors.strokeColors25[2]
  }
};

export const ChartSimpleTooltip = {
  args: {
    rollup: 10000,
    timeConfig: { windowSize: 60000, to: 60000 },
    metrics: [
      [0, 1],
      [10000, 1],
      [20000, 0],
      [30000, 2],
      [40000, 1],
      [50000, 2],
      [60000, 0.5]
    ],
    strokeColor: chartColors.strokeColors100[2],
    fillColor: chartColors.strokeColors25[2],
    customChartTooltip: 'custom tooltip'
  }
};

export const CharComponentTooltip = {
  args: {
    rollup: 10000,
    timeConfig: { windowSize: 60000, to: 60000 },
    metrics: [
      [0, 1],
      [10000, 1],
      [20000, 0],
      [30000, 2],
      [40000, 1],
      [50000, 2],
      [60000, 0.5]
    ],
    strokeColor: chartColors.strokeColors100[2],
    fillColor: chartColors.strokeColors25[2],
    customChartTooltip: (
      <>
        <Typography onDark variant="heading-02">
          Title
        </Typography>
        <div>
          <Typography onDark variant="body-01">
            First line
          </Typography>
        </div>
        <div>
          <Typography onDark variant="body-compact-01">
            Second line
          </Typography>
        </div>
      </>
    )
  }
};

export const WithMostlyZeroDataPointsAndASmallSpike = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[
      [0, 0],
      [10000, 0.1],
      [20000, 1],
      [30000, 0],
      [40000, 0],
      [50000, 0],
      [60000, 0]
    ]}
  />
);

export const WithMostlySimilarDataPoints = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[
      [0, 200],
      [10000, 192],
      [20000, 197],
      [30000, 220],
      [40000, 197],
      [50000, 200],
      [60000, 198]
    ]}
  />
);

export const WithMostlySimilarDataPointsAndADropToZero = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[
      [0, 200],
      [10000, 192],
      [20000, 197],
      [30000, 220],
      [40000, 197],
      [50000, 0],
      [60000, 198]
    ]}
  />
);

export const WithMostlySimilarDataPointsAndASharpSpike = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[
      [0, 200],
      [10000, 192],
      [20000, 197],
      [30000, 220],
      [40000, 197],
      [50000, 800],
      [60000, 198]
    ]}
  />
);

export const WithmostlySimilarDataPointsADropToZeroAndASharpSpike = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[
      [0, 200],
      [10000, 192],
      [20000, 0],
      [30000, 220],
      [40000, 197],
      [50000, 800],
      [60000, 198]
    ]}
  />
);

export const WithmostlySimilarDataPointsASharpDropNnotToZeroAndASharpSpike = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[
      [0, 200],
      [10000, 192],
      [20000, 20],
      [30000, 220],
      [40000, 197],
      [50000, 800],
      [60000, 198]
    ]}
  />
);

export const With30PercentAndA33PercentSpike = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[
      [0, 0.3],
      [10000, 0.3],
      [20000, 0.33],
      [30000, 0.3],
      [40000, 0.3],
      [50000, 0.3],
      [60000, 0.3]
    ]}
    tooltipFormatter={percentageTwoDecimalPlaces}
    percentageMetric
  />
);

export const With30PercentAndA90PercentSpike = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[
      [0, 0.3],
      [10000, 0.3],
      [20000, 0.9],
      [30000, 0.3],
      [40000, 0.3],
      [50000, 0.3],
      [60000, 0.3]
    ]}
    tooltipFormatter={percentageTwoDecimalPlaces}
    percentageMetric
  />
);

export const With30PercentAndA40PercentSpike = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[
      [0, 0.03],
      [10000, 0.03],
      [20000, 0.04],
      [30000, 0.03],
      [40000, 0.03],
      [50000, 0.03],
      [60000, 0.03]
    ]}
    tooltipFormatter={percentageTwoDecimalPlaces}
    percentageMetric
  />
);

export const With3PercentAndA10PercentSpike = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[
      [0, 0.03],
      [10000, 0.03],
      [20000, 0.1],
      [30000, 0.03],
      [40000, 0.03],
      [50000, 0.03],
      [60000, 0.03]
    ]}
    tooltipFormatter={percentageTwoDecimalPlaces}
    percentageMetric
  />
);

export const With0PercentAndA5PercentSpike = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[
      [0, 0.0],
      [10000, 0.0],
      [20000, 0.05],
      [30000, 0.0],
      [40000, 0.0],
      [50000, 0.0],
      [60000, 0.0]
    ]}
    tooltipFormatter={percentageTwoDecimalPlaces}
    percentageMetric
  />
);

export const With0PercentAndA90PercentSpike = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[
      [0, 0.0],
      [10000, 0.0],
      [20000, 0.9],
      [30000, 0.0],
      [40000, 0.0],
      [50000, 0.0],
      [60000, 0.0]
    ]}
    tooltipFormatter={percentageTwoDecimalPlaces}
    percentageMetric
  />
);

export const MissingDatapoints = () => (
  <SparkChart
    rollup={1000}
    timeConfig={{ windowSize: 8000, to: 8000 }}
    metrics={[
      [0, 1],
      [1000, 1],
      [4000, 1],
      [5000, 2],
      [8000, 1]
    ]}
  />
);

export const WithHorizontalMetricValue = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[
      [0, 1],
      [10000, 1],
      [20000, 0],
      [30000, 2],
      [40000, 1],
      [50000, 2],
      [60000, 0.5]
    ]}
    horizontalMetricValue="12,435"
  />
);

export const WithHorizontalMetricValueAndLabel = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[
      [0, 200],
      [10000, 192],
      [20000, 197],
      [30000, 220],
      [40000, 197],
      [50000, 800],
      [60000, 198]
    ]}
    horizontalMetricValue="12,345"
    label="Label Here"
  />
);

export const WithVerticalMetricValue = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 60000, to: 60000 }}
    metrics={[
      [0, 1],
      [10000, 1],
      [20000, 0],
      [30000, 2],
      [40000, 1],
      [50000, 2],
      [60000, 0.5]
    ]}
    verticalMetricValue="12,345"
  />
);

export const WithSingleBlocks = () => (
  <SparkChart
    rollup={10000}
    timeConfig={{ windowSize: 600000, to: 1648561425408 }}
    metrics={[
      [1648560840000, 5],
      [1648560880000, 5],
      [1648560890000, 5],
      [1648560920000, 1],
      [1648560940000, 1],
      [1648560970000, 1],
      [1648560990000, 1],
      [1648561020000, 1],
      [1648561050000, 1],
      [1648561060000, 1],
      [1648561100000, 20],
      [1648561130000, 1],
      [1648561180000, 1],
      [1648561230000, 20],
      [1648561280000, 20],
      [1648561300000, 23],
      [1648561310000, 15],
      [1648561350000, 5],
      [1648561360000, 2]
    ]}
  />
);

export const Sizes = () => (
  <>
    <SparkChart
      rollup={10000}
      timeConfig={{ windowSize: 60000, to: 60000 }}
      metrics={[
        [0, 1],
        [10000, 1],
        [20000, 0],
        [30000, 2],
        [40000, 1],
        [50000, 2],
        [60000, 0.5]
      ]}
    />
    <SparkChart
      rollup={10000}
      timeConfig={{ windowSize: 60000, to: 60000 }}
      metrics={[
        [0, 1],
        [10000, 1],
        [20000, 0],
        [30000, 2],
        [40000, 1],
        [50000, 2],
        [60000, 0.5]
      ]}
      width={200}
      height={100}
    />
  </>
);

const dataSeriesWithGapBeforeLastDataPoint = [
  [1650893700000, 0],
  [1650893760000, 0],
  [1650893820000, 0],
  [1650893880000, 0],
  [1650893940000, 0],
  [1650894000000, 0],
  [1650894060000, 0],
  [1650894120000, 0],
  [1650894180000, 0],
  [1650894240000, 0],
  [1650894300000, 0],
  [1650894360000, 0],
  [1650894420000, 0],
  [1650894480000, 0],
  [1650894540000, 0],
  [1650894600000, 0],
  [1650894660000, 0],
  [1650894720000, 0],
  [1650894780000, 0],
  [1650894840000, 0],
  [1650894900000, 0],
  [1650894960000, 0],
  [1650895020000, 0],
  [1650895080000, 0],
  [1650895140000, 0],
  [1650895200000, 0],
  [1650895260000, 0],
  [1650895320000, 0],
  [1650895380000, 0],
  [1650895440000, 0],
  [1650895500000, 0],
  [1650895560000, 0],
  [1650895620000, 0],
  [1650895680000, 0],
  [1650895740000, 0],
  [1650895800000, 0],
  [1650895860000, 0],
  [1650895920000, 0],
  [1650895980000, 0],
  [1650896400000, 0],
  [1650897240000, 1]
];

export const DataWithGap = () => (
  <>
    <div>
      <SparkChart
        rollup={60000}
        timeConfig={{ windowSize: 3600000, to: 1650897300000, focusedMoment: 1650897300000 }}
        metrics={dataSeriesWithGapBeforeLastDataPoint}
        width={216}
        height={72}
      />
    </div>
  </>
);
