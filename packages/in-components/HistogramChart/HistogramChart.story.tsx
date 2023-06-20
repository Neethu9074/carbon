/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  demo,
  minAndMax,
  emptyBins,
  sample1,
  sample2,
  manyBuckets,
  largeDataset,
  error
} from 'in-components/HistogramChart/fixture';
import HistogramChart from 'in-components/HistogramChart/HistogramChart';

export default {
  component: HistogramChart
};

const config = { formatter: 'percentage.compact' };

const args = {
  height: 200,
  width: 900
};

interface Story {
  width: number;
  height: number;
}

export const dashboard = ({ height, width }: Story) => (
  <HistogramChart
    customWidth={width}
    customHeight={height}
    config={config}
    result={demo}
    width={width}
    height={height}
    showLegend
  />
);
dashboard.args = args;

export const withMinAndMax = ({ height, width }: Story) => (
  <HistogramChart
    customWidth={width}
    customHeight={height}
    config={config}
    result={minAndMax}
    width={width}
    height={height}
    showLegend
  />
);
withMinAndMax.args = args;

export const withEmptyBins = ({ height, width }: Story) => (
  <HistogramChart
    customWidth={width}
    customHeight={height}
    config={config}
    result={emptyBins}
    width={width}
    height={height}
    showLegend
  />
);
withEmptyBins.args = args;

export const example1 = ({ height, width }: Story) => (
  <HistogramChart
    customWidth={width}
    customHeight={height}
    config={config}
    result={sample1}
    width={width}
    height={height}
    showLegend
  />
);
example1.args = args;

export const example2 = ({ height, width }: Story) => (
  <HistogramChart
    customWidth={width}
    customHeight={height}
    config={config}
    result={sample2}
    width={width}
    height={height}
    showLegend
  />
);
example2.args = args;

export const withManyBuckets = ({ height, width }: Story) => (
  <HistogramChart
    customWidth={width}
    customHeight={height}
    config={config}
    result={manyBuckets}
    width={width}
    height={height}
    showLegend
  />
);
withManyBuckets.args = args;

export const withNumberFormatter = ({ height, width }: Story) => (
  <HistogramChart
    customWidth={width}
    customHeight={height}
    config={{ formatter: 'number.detailed' }}
    result={manyBuckets}
    width={width}
    height={height}
    showLegend
  />
);
withNumberFormatter.args = args;

export const withLargeDataset = ({ height, width }: Story) => (
  <HistogramChart
    customWidth={width}
    customHeight={height}
    config={{ formatter: 'number.detailed' }}
    result={largeDataset}
    width={width}
    height={height}
    showLegend
  />
);
withLargeDataset.args = args;

export const withLoading = ({ height, width }: Story) => {
  const loading = {
    errors: [],
    progress: {
      loading: true
    }
  };

  return (
    <HistogramChart
      customWidth={width}
      customHeight={height}
      config={{ formatter: 'number.detailed' }}
      result={loading}
      width={width}
      height={height}
      showLegend
    />
  );
};
withLargeDataset.args = args;

export const withError = ({ height, width }: Story) => {
  return (
    <HistogramChart
      customWidth={width}
      customHeight={height}
      config={{ formatter: 'number.detailed' }}
      result={error}
      width={width}
      height={height}
      showLegend
    />
  );
};
withError.args = args;
