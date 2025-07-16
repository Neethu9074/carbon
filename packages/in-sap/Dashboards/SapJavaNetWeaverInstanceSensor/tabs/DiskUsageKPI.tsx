/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { getMetricForFocusedMoment } from 'in-stores/metric/metric';
import KpiCard from 'in-components/KpiCard/KpiCard';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { SnapshotData } from 'in-stores/snapshot';
import { t } from 'in-i18n';

export default function DiskUsageKPI({ data }: { data: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = data.id;

  const total =
    useObservable(
      snapshotId
        ? () =>
            getMetricForFocusedMoment({
              snapshotId,
              metric: 'customMetrics.disk.totalDiskSpace'
            }).map((v: [number, number]) => v[1])
        : undefined,
      [snapshotId, timeConfig]
    ) ?? 0;

  const free =
    useObservable(
      snapshotId
        ? () =>
            getMetricForFocusedMoment({
              snapshotId,
              metric: 'customMetrics.disk.freeDiskSpace'
            }).map((v: [number, number]) => v[1])
        : undefined,
      [snapshotId, timeConfig]
    ) ?? 0;

  const diskUsagePercent = total > 0 ? ((total - free) / total) * 100 : 0;
  const formattedValue = `${diskUsagePercent.toFixed(2)}%`;

  return <KpiCard title={t('in-sap:dashboards.diskUsageKpi')} value={formattedValue} raw />;
}
