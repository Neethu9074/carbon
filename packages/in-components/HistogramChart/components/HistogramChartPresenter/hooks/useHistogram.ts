/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { HistogramMetricResult, Result } from '@instana/types';

import {
  Bins,
  createBinsArrayObject,
  formatBins,
  getMaxLabelCharsCount,
  groupBinsByFormattedValue
} from 'in-components/HistogramChart/components/HistogramChartPresenter/hooks/utils';
import { FormatterFn } from 'in-stores/metric/formatters';

interface Props {
  result: Result<HistogramMetricResult[]>;
  chartWidth: number;
  applyFormatter: FormatterFn;
}

const bucketLabelWidth = 5;
const defaultMaxLabelCharsCount = 15;

export default function useHistogram({ result, chartWidth, applyFormatter }: Props) {
  const histogramData = result?.data?.[0];
  const hasError = result.errors.length > 0;
  const isLoading = result.progress.loading;

  if (!histogramData) {
    return {
      buckets: [],
      isBucketsEmpty: true,
      hasError,
      isLoading,
      total: 0,
      min: 0,
      max: 0
    };
  }

  const { values, count: total, min, max } = histogramData;

  const isBucketsEmpty = values?.reduce((acc, currentValue) => acc + currentValue[1], 0) === 0;

  // Get formatted bins
  const formattedBins = formatBins(values as Bins, applyFormatter);

  // Group bins and remove duplicates
  const groupedBins = groupBinsByFormattedValue(formattedBins);

  // Define buckets sizing
  const bucketWidth = Math.max(4, chartWidth / groupedBins.length);
  const bucketCenter = Math.floor(bucketWidth / 2);

  const maxLabelCharsCount = getMaxLabelCharsCount(groupedBins);

  const labelWidth = Math.max(defaultMaxLabelCharsCount, maxLabelCharsCount) * bucketLabelWidth;

  const maxVisibleLabels = Math.floor(chartWidth / labelWidth);

  // Format bin tuple to have chart format
  const buckets =
    groupedBins && groupedBins?.length > 0
      ? createBinsArrayObject({
          bins: groupedBins,
          maxVisibleLabels
        })
      : [];

  return {
    bucketWidth,
    bucketCenter,
    buckets,
    isBucketsEmpty,
    hasError,
    isLoading,
    total,
    min,
    max
  };
}
