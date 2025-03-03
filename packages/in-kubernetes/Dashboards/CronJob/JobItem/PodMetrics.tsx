/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { KeyValue } from '@instana/components';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { getHistoricMetric } from 'in-stores/metric';
import useTimeConfig from 'in-hooks/useTimeConfig';

interface PodMetricsProps {
  snapshotId: string;
  metric: string;
  label: string;
}

export default function PodMetrics({ snapshotId, metric, label }: PodMetricsProps) {
  const timeConfig = useTimeConfig();
  const podsPending = useObservable(
    getHistoricMetric({
      snapshotId,
      metric: metric,
      timeConfig: timeConfig
    })
      .map(v => v[1])
      .distinct(),
    []
  );
  // @ts-expect-error
  return <KeyValue label={label} value={podsPending || valueMissingPlaceholder} theme="blue" accentuated />;
}
