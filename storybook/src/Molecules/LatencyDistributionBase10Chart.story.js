import { withKnobs, number } from '@storybook/addon-knobs';
import { just } from 'reactive-observables';
import React from 'react';

import LatencyDistributionBase10Chart from 'in-new-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import { millis } from 'in-services/formatters/number';

export default {
  title: 'Molecules/LatencyDistributionBase10Chart',
  component: LatencyDistributionBase10Chart,
  decorators: [withKnobs]
};

const mockSubscription = {
  data: {
    buckets: [
      { from: 0, to: 1, calls: 51880, tickMark: true },
      { from: 1, to: 2, calls: 119719, tickMark: false },
      { from: 2, to: 3, calls: 26471, tickMark: false },
      { from: 3, to: 4, calls: 13724, tickMark: false },
      { from: 4, to: 5, calls: 13035, tickMark: false },
      { from: 5, to: 6, calls: 7261, tickMark: false },
      { from: 6, to: 7, calls: 5240, tickMark: false },
      { from: 7, to: 8, calls: 5197, tickMark: false },
      { from: 8, to: 10, calls: 4810, tickMark: false },
      { from: 10, to: 11, calls: 6737, tickMark: true },
      { from: 11, to: 13, calls: 3029, tickMark: false },
      { from: 13, to: 15, calls: 1874, tickMark: false },
      { from: 15, to: 18, calls: 1615, tickMark: false },
      { from: 18, to: 21, calls: 722, tickMark: false },
      { from: 21, to: 25, calls: 511, tickMark: false },
      { from: 25, to: 29, calls: 403, tickMark: false },
      { from: 29, to: 34, calls: 461, tickMark: false },
      { from: 34, to: 39, calls: 422, tickMark: false },
      { from: 39, to: 46, calls: 454, tickMark: false },
      { from: 46, to: 54, calls: 506, tickMark: false },
      { from: 54, to: 63, calls: 416, tickMark: false },
      { from: 63, to: 73, calls: 288, tickMark: false },
      { from: 73, to: 85, calls: 270, tickMark: false },
      { from: 85, to: 100, calls: 307, tickMark: false },
      { from: 100, to: 116, calls: 245, tickMark: true },
      { from: 116, to: 135, calls: 180, tickMark: false },
      { from: 135, to: 158, calls: 189, tickMark: false },
      { from: 158, to: 184, calls: 204, tickMark: false },
      { from: 184, to: 215, calls: 165, tickMark: false },
      { from: 215, to: 251, calls: 128, tickMark: false },
      { from: 251, to: 292, calls: 152, tickMark: false },
      { from: 292, to: 341, calls: 128, tickMark: false },
      { from: 341, to: 398, calls: 109, tickMark: false },
      { from: 398, to: 464, calls: 107, tickMark: false },
      { from: 464, to: 541, calls: 64, tickMark: false },
      { from: 541, to: 630, calls: 38, tickMark: false },
      { from: 630, to: 735, calls: 89, tickMark: false },
      { from: 735, to: 857, calls: 54, tickMark: false },
      { from: 857, to: 1000, calls: 34, tickMark: false },
      { from: 1000, to: 1165, calls: 53, tickMark: true },
      { from: 1165, to: 1359, calls: 38, tickMark: false },
      { from: 1359, to: 1584, calls: 30, tickMark: false },
      { from: 1584, to: 1847, calls: 18, tickMark: false },
      { from: 1847, to: 2154, calls: 3, tickMark: false },
      { from: 2154, to: 2511, calls: 2, tickMark: false },
      { from: 2511, to: 2928, calls: 4, tickMark: false },
      { from: 2928, to: 3414, calls: 1, tickMark: false },
      { from: 3414, to: 3981, calls: 4, tickMark: false },
      { from: 3981, to: 4641, calls: 372, tickMark: false },
      { from: 4641, to: 5411, calls: 172, tickMark: false },
      { from: 5411, to: 6309, calls: 169, tickMark: false },
      { from: 6309, to: 7356, calls: 171, tickMark: false },
      { from: 7356, to: 8576, calls: 37, tickMark: false },
      { from: 8576, to: 10000, calls: 2, tickMark: true },
      { from: 10000, to: 11659, calls: 0, tickMark: false },
      { from: 11659, to: 13593, calls: 0, tickMark: false },
      { from: 13593, to: 15848, calls: 0, tickMark: false },
      { from: 15848, to: 18478, calls: 0, tickMark: false },
      { from: 18478, to: 21544, calls: 0, tickMark: false },
      { from: 21544, to: 25118, calls: 0, tickMark: false },
      { from: 25118, to: 29286, calls: 0, tickMark: false },
      { from: 29286, to: 34145, calls: 0, tickMark: false },
      { from: 34145, to: 39810, calls: 0, tickMark: false },
      { from: 39810, to: 46415, calls: 0, tickMark: false },
      { from: 46415, to: 54116, calls: 0, tickMark: false },
      { from: 54116, to: 60000, calls: 0, tickMark: false },
      { from: 60000, calls: 0, tickMark: true }
    ],
    percentiles: [
      { percentile: 50, latency: 0 },
      { percentile: 90, latency: 6 },
      { percentile: 95, latency: 10 },
      { percentile: 99, latency: 122 }
    ]
  },
  time: 1582718129565,
  adjustedWindowSize: null,
  errors: [],
  progress: { percentage: null, loading: false, note: null }
};

const mockSubscription2 = {
  data: {
    buckets: [
      { from: 0, to: 1, calls: 51880, tickMark: true },
      { from: 1, to: 2, calls: 119719, tickMark: false },
      { from: 2, to: 3, calls: 26471, tickMark: false },
      { from: 3, to: 4, calls: 13724, tickMark: false },
      { from: 4, to: 5, calls: 13035, tickMark: false },
      { from: 5, to: 6, calls: 7261, tickMark: false },
      { from: 6, to: 7, calls: 5240, tickMark: false },
      { from: 7, to: 8, calls: 5197, tickMark: false },
      { from: 8, to: 10, calls: 4810, tickMark: false },
      { from: 10, to: 11, calls: 6737, tickMark: true },
      { from: 11, to: 13, calls: 3029, tickMark: false },
      { from: 13, to: 15, calls: 1874, tickMark: false },
      { from: 15, to: 18, calls: 1615, tickMark: false },
      { from: 18, to: 21, calls: 722, tickMark: false },
      { from: 21, to: 25, calls: 511, tickMark: false },
      { from: 25, to: 29, calls: 403, tickMark: false },
      { from: 29, to: 34, calls: 461, tickMark: false },
      { from: 34, to: 39, calls: 422, tickMark: false },
      { from: 39, to: 46, calls: 454, tickMark: false },
      { from: 46, to: 54, calls: 506, tickMark: false },
      { from: 54, to: 63, calls: 416, tickMark: false },
      { from: 63, to: 73, calls: 288, tickMark: false },
      { from: 73, to: 85, calls: 270, tickMark: false },
      { from: 85, to: 100, calls: 307, tickMark: false },
      { from: 100, to: 116, calls: 245, tickMark: true },
      { from: 116, to: 135, calls: 180, tickMark: false },
      { from: 135, to: 158, calls: 189, tickMark: false },
      { from: 158, to: 184, calls: 204, tickMark: false },
      { from: 184, to: 215, calls: 165, tickMark: false },
      { from: 215, to: 251, calls: 128, tickMark: false },
      { from: 251, to: 292, calls: 152, tickMark: false },
      { from: 292, to: 341, calls: 128, tickMark: false },
      { from: 341, to: 398, calls: 109, tickMark: false },
      { from: 398, to: 464, calls: 107, tickMark: false },
      { from: 464, to: 541, calls: 64, tickMark: false },
      { from: 541, to: 630, calls: 38, tickMark: false },
      { from: 630, to: 735, calls: 89, tickMark: false },
      { from: 735, to: 857, calls: 54, tickMark: false },
      { from: 857, to: 1000, calls: 34, tickMark: false },
      { from: 1000, to: 1165, calls: 53, tickMark: true },
      { from: 1165, to: 1359, calls: 38, tickMark: false },
      { from: 1359, to: 1584, calls: 30, tickMark: false },
      { from: 1584, to: 1847, calls: 18, tickMark: false },
      { from: 1847, to: 2154, calls: 3, tickMark: false },
      { from: 2154, to: 2511, calls: 2, tickMark: false },
      { from: 2511, to: 2928, calls: 4, tickMark: false },
      { from: 2928, to: 3414, calls: 1, tickMark: false },
      { from: 3414, to: 3981, calls: 4, tickMark: false },
      { from: 3981, to: 4641, calls: 372, tickMark: false },
      { from: 4641, to: 5411, calls: 172, tickMark: false },
      { from: 5411, to: 6309, calls: 169, tickMark: false },
      { from: 6309, to: 7356, calls: 171, tickMark: false },
      { from: 7356, to: 8576, calls: 37, tickMark: false },
      { from: 8576, to: 10000, calls: 2, tickMark: true },
      { from: 10000, to: 11659, calls: 0, tickMark: false },
      { from: 11659, to: 13593, calls: 0, tickMark: false },
      { from: 13593, to: 15848, calls: 0, tickMark: false },
      { from: 15848, to: 18478, calls: 0, tickMark: false },
      { from: 18478, to: 21544, calls: 0, tickMark: false },
      { from: 21544, to: 25118, calls: 0, tickMark: false },
      { from: 25118, to: 29286, calls: 0, tickMark: false },
      { from: 29286, to: 34145, calls: 0, tickMark: false },
      { from: 34145, to: 39810, calls: 0, tickMark: false },
      { from: 39810, to: 46415, calls: 0, tickMark: false },
      { from: 46415, to: 54116, calls: 0, tickMark: false },
      { from: 54116, to: 60000, calls: 0, tickMark: false },
      { from: 60000, calls: 0, tickMark: true }
    ],
    percentiles: [
      { percentile: 50, latency: 0 },
      { percentile: 90, latency: 0 },
      { percentile: 95, latency: 60001 },
      { percentile: 99, latency: 60001 }
    ]
  },
  time: 1582718129565,
  adjustedWindowSize: null,
  errors: [],
  progress: { percentage: null, loading: false, note: null }
};

const mockSubscription3 = {
  data: {
    buckets: [
      { from: 0, to: 1, calls: 51880, tickMark: true },
      { from: 1, to: 2, calls: 119719, tickMark: false },
      { from: 2, to: 3, calls: 26471, tickMark: false },
      { from: 3, to: 4, calls: 13724, tickMark: false },
      { from: 4, to: 5, calls: 13035, tickMark: false },
      { from: 5, to: 6, calls: 7261, tickMark: false },
      { from: 6, to: 7, calls: 5240, tickMark: false },
      { from: 7, to: 8, calls: 5197, tickMark: false },
      { from: 8, to: 10, calls: 4810, tickMark: false },
      { from: 10, to: 11, calls: 6737, tickMark: true },
      { from: 11, to: 13, calls: 3029, tickMark: false },
      { from: 13, to: 15, calls: 1874, tickMark: false },
      { from: 15, to: 18, calls: 1615, tickMark: false },
      { from: 18, to: 21, calls: 722, tickMark: false },
      { from: 21, to: 25, calls: 511, tickMark: false },
      { from: 25, to: 29, calls: 403, tickMark: false },
      { from: 29, to: 34, calls: 461, tickMark: false },
      { from: 34, to: 39, calls: 422, tickMark: false },
      { from: 39, to: 46, calls: 454, tickMark: false },
      { from: 46, to: 54, calls: 506, tickMark: false },
      { from: 54, to: 63, calls: 416, tickMark: false },
      { from: 63, to: 73, calls: 288, tickMark: false },
      { from: 73, to: 85, calls: 270, tickMark: false },
      { from: 85, to: 100, calls: 307, tickMark: false },
      { from: 100, to: 116, calls: 245, tickMark: true },
      { from: 116, to: 135, calls: 180, tickMark: false },
      { from: 135, to: 158, calls: 189, tickMark: false },
      { from: 158, to: 184, calls: 204, tickMark: false },
      { from: 184, to: 215, calls: 165, tickMark: false },
      { from: 215, to: 251, calls: 128, tickMark: false },
      { from: 251, to: 292, calls: 152, tickMark: false },
      { from: 292, to: 341, calls: 128, tickMark: false },
      { from: 341, to: 398, calls: 109, tickMark: false },
      { from: 398, to: 464, calls: 107, tickMark: false },
      { from: 464, to: 541, calls: 64, tickMark: false },
      { from: 541, to: 630, calls: 38, tickMark: false },
      { from: 630, to: 735, calls: 89, tickMark: false },
      { from: 735, to: 857, calls: 54, tickMark: false },
      { from: 857, to: 1000, calls: 34, tickMark: false },
      { from: 1000, to: 1165, calls: 53, tickMark: true },
      { from: 1165, to: 1359, calls: 38, tickMark: false },
      { from: 1359, to: 1584, calls: 30, tickMark: false },
      { from: 1584, to: 1847, calls: 18, tickMark: false },
      { from: 1847, to: 2154, calls: 3, tickMark: false },
      { from: 2154, to: 2511, calls: 2, tickMark: false },
      { from: 2511, to: 2928, calls: 4, tickMark: false },
      { from: 2928, to: 3414, calls: 1, tickMark: false },
      { from: 3414, to: 3981, calls: 4, tickMark: false },
      { from: 3981, to: 4641, calls: 372, tickMark: false },
      { from: 4641, to: 5411, calls: 172, tickMark: false },
      { from: 5411, to: 6309, calls: 169, tickMark: false },
      { from: 6309, to: 7356, calls: 171, tickMark: false },
      { from: 7356, to: 8576, calls: 37, tickMark: false },
      { from: 8576, to: 10000, calls: 2, tickMark: true },
      { from: 10000, to: 11659, calls: 0, tickMark: false },
      { from: 11659, to: 13593, calls: 0, tickMark: false },
      { from: 13593, to: 15848, calls: 0, tickMark: false },
      { from: 15848, to: 18478, calls: 0, tickMark: false },
      { from: 18478, to: 21544, calls: 0, tickMark: false },
      { from: 21544, to: 25118, calls: 0, tickMark: false },
      { from: 25118, to: 29286, calls: 0, tickMark: false },
      { from: 29286, to: 34145, calls: 0, tickMark: false },
      { from: 34145, to: 39810, calls: 0, tickMark: false },
      { from: 39810, to: 46415, calls: 0, tickMark: false },
      { from: 46415, to: 54116, calls: 0, tickMark: false },
      { from: 54116, to: 60000, calls: 0, tickMark: false },
      { from: 60000, calls: 0, tickMark: true }
    ],
    percentiles: [
      { percentile: 50, latency: 0 },
      { percentile: 90, latency: 0 },
      { percentile: 95, latency: 0 },
      { percentile: 99, latency: 122 }
    ]
  },
  time: 1582718129565,
  adjustedWindowSize: null,
  errors: [],
  progress: { percentage: null, loading: false, note: null }
};

const mockEmptySubscription = {
  data: {
    buckets: [
      { from: 0, to: 1, calls: 0, tickMark: true },
      { from: 1, to: 60000, calls: 0, tickMark: false },
      { from: 60000, calls: 0, tickMark: true }
    ],
    percentiles: [
      { percentile: 50, latency: 0 },
      { percentile: 90, latency: 0 },
      { percentile: 95, latency: 0 },
      { percentile: 99, latency: 0 }
    ]
  },
  time: 1582718129565,
  adjustedWindowSize: null,
  errors: [],
  progress: { percentage: null, loading: false, note: null }
};

const loadingMock = {
  time: 1583417899531,
  adjustedWindowSize: null,
  errors: [],
  progress: { percentage: 0.2, loading: true, note: null }
};

const noDataMock = {
  time: 1583417899531,
  adjustedWindowSize: null,
  errors: ['error'],
  progress: { percentage: null, loading: false, note: null }
};

const chartDefinition = {
  formatter: millis.forcedCompactOnMs
};

let latencySelection;

export const dashboard = () => (
  <LatencyDistributionBase10Chart
    subscription={just(mockSubscription)}
    chartDefinition={chartDefinition}
    cheight={number('Height', 182)}
    cwidth={number('Width', 552)}
    showLegend
    selectionMenuItems={[
      {
        name: 'analyze',
        icon: 'lib_analyze',
        label: 'View in Analyze',
        onClick: () => alert(`Selected latency range: ${latencySelection?.from} - ${latencySelection?.to}`)
      }
    ]}
    onSelectionChanged={e => (latencySelection = e)}
  />
);

export const unboundedAnalytics = () => (
  <LatencyDistributionBase10Chart
    subscription={just(mockSubscription)}
    chartDefinition={chartDefinition}
    cheight={number('Height', 172)}
    showPercentileMenu
    selectionAdjustable
  />
);

export const stackedUp2Percentiles = () => (
  <LatencyDistributionBase10Chart
    subscription={just(mockSubscription2)}
    chartDefinition={chartDefinition}
    cheight={number('Height', 130)}
    cwidth={number('Width', 872)}
  />
);

export const stackedUp3Percentiles = () => (
  <LatencyDistributionBase10Chart
    subscription={just(mockSubscription3)}
    chartDefinition={chartDefinition}
    cheight={number('Height', 130)}
    cwidth={number('Width', 872)}
  />
);

export const loading = () => (
  <LatencyDistributionBase10Chart
    subscription={just(loadingMock)}
    chartDefinition={chartDefinition}
    cheight={number('Height', 130)}
    cwidth={number('Width', 1300)}
  />
);

export const noDataAvailable = () => (
  <LatencyDistributionBase10Chart
    subscription={just(noDataMock)}
    chartDefinition={chartDefinition}
    cheight={number('Height', 130)}
    cwidth={number('Width', 1300)}
  />
);

export const noDataToDisplay = () => (
  <LatencyDistributionBase10Chart
    subscription={just(mockEmptySubscription)}
    chartDefinition={chartDefinition}
    cheight={number('Height', 130)}
    cwidth={number('Width', 1300)}
  />
);
