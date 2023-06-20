/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { millis, number, bytes, percentage, latency, siPrefix } from 'in-services/formatters/number';
import { Bucket } from 'in-components/HistogramChart/components/HistogramChartPresenter/types';
import { FormatterFn } from 'in-stores/metric/formatters';
import { t } from 'in-i18n';

export function getMaxCallCount(buckets: Bucket[]) {
  let max = 0;

  for (let bucket of buckets) {
    if (bucket.calls > max) {
      max = bucket.calls;
    }
  }

  return max;
}

interface GetHistogramHeaderTitleProps {
  minHistogramValue: number;
  maxHistogramValue: number;
  total: number;
  applyFormatter: FormatterFn;
}

export function getHistogramHeaderTitle({
  minHistogramValue,
  maxHistogramValue,
  total,
  applyFormatter
}: GetHistogramHeaderTitleProps) {
  const metricName = t('in-components:histogram.metricLabel');
  const totalLabel = total ? `- ${t('in-components:histogram.total')} ${total}` : '';

  if (!minHistogramValue && !maxHistogramValue) {
    return `${metricName} ${totalLabel}`;
  }

  const minAndMaxLabels = `(${t('in-components:histogram.min')}: ${applyFormatter(minHistogramValue)} - ${t(
    'in-components:histogram.max'
  )}: ${applyFormatter(maxHistogramValue)})`;

  return `${metricName} ${totalLabel} ${minAndMaxLabels}`;
}

export const formatters = {
  percentage: percentage,
  number: number,
  bytes: bytes,
  millis: millis,
  latency: latency,
  siPrefix: siPrefix
};
