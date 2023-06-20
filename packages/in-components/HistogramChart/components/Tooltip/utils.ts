/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Bucket } from 'in-components/HistogramChart/components/HistogramChartPresenter/types';
import { t } from 'in-i18n';

export function getRangeLabel(buckets: Bucket[]) {
  const from = buckets[0].from && buckets[0].from;
  const to = buckets[buckets.length - 1].to && buckets[buckets.length - 1].to;

  let rangeLabel = t('in-components:histogram.rangeLabel', {
    from: from,
    to: to
  });

  if (to == null) {
    rangeLabel = `> ${from}`;
  } else if (from == null) {
    rangeLabel = `< ${to}`;
  }

  return rangeLabel;
}
