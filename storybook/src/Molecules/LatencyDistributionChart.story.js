import React from 'react';

import LatencyDistributionChartPresenter from 'in-new-components/LatencyDistributionChart/LatencyDistributionChartPresenter';

export default {
  title: 'Molecules|LatencyDistChart',
  component: LatencyDistributionChartPresenter
};

const mockSubscription = {
  data: [
    { from: 1.0, to: 769.1, calls: 10076 },
    { from: 1537.2, to: 2305.3, calls: 100 },
    { from: 2305.3, to: 3073.4, calls: 400 },
    { from: 3841.5, to: 4609.6, calls: 500 },
    { from: 4609.6, to: 5377.700000000001, calls: 1000 },
    { from: 5377.7, to: 6145.8, calls: 5000 },
    { from: 6145.8, to: 6913.900000000001, calls: 3000 },
    { from: 6913.900000000001, to: 7682.000000000001, calls: 8000 }
  ],
  time: 1582718129565,
  adjustedWindowSize: null,
  errors: [],
  progress: { percentage: null, loading: false, note: null }
};

const mockSubscription2 = {
  data: [
    { from: 0, to: 0.3, calls: 6124 },
    { from: 0.8999999999999999, to: 1.2, calls: 3666 },
    { from: 1.7999999999999998, to: 2.0999999999999996, calls: 92 }
  ],
  time: 1583417899531,
  adjustedWindowSize: null,
  errors: [],
  progress: { percentage: null, loading: false, note: null }
};

const mockSubscription3 = {
  data: [
    { from: 0, to: 0.3, calls: 6124 },
    { from: 0.6, to: 0.7, calls: 5024 },
    { from: 0.8999999999999999, to: 1.2, calls: 3666 },
    { from: 1.7999999999999998, to: 2.0999999999999996, calls: 92 }
  ],
  time: 1583417899531,
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

export const standard = () => (
  <LatencyDistributionChartPresenter subscription={mockSubscription} height={154} width={410} />
);

export const damned = () => (
  <LatencyDistributionChartPresenter subscription={mockSubscription2} height={154} width={410} />
);

export const fack = () => (
  <LatencyDistributionChartPresenter subscription={mockSubscription3} height={154} width={410} />
);

export const loading = () => <LatencyDistributionChartPresenter subscription={loadingMock} height={154} width={410} />;
