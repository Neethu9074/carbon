/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { t } from 'in-i18n'; // Assuming you're using the `t` function for translations
import { getMetricForFocusedMoment } from 'in-stores/metric/metric';
import { SnapshotData } from 'in-stores/snapshot';
import KpiCard from 'in-components/KpiCard/KpiCard';
import useTimeConfig from 'in-hooks/useTimeConfig';

function getUpTime(uptime: number): string {
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = uptime % 60;

  if (days > 0) {
    return days === 1 ? `${days} Day` : `${days} Days`;
  } else if (hours > 0) {
    return hours === 1 ? `${hours} Hour` : `${hours} Hours`;
  } else if (minutes > 0) {
    return minutes === 1 ? `${minutes} Minute` : `${minutes} Minutes`;
  } else {
    return seconds === 1 ? `${seconds} Second` : `${seconds} Seconds`;
  }
}

export default function UpTimeKPI({ data }: { data: SnapshotData }) {
  const timeConfig = useTimeConfig();
  const snapshotId = data.id;

  const upTimeValue =
    useObservable(
      snapshotId
        ? () =>
            getMetricForFocusedMoment({
              snapshotId,
              metric: 'customMetrics.kpi.uptime'
            }).map((v: [number, number]) => v[1])
        : undefined,
      [snapshotId, timeConfig]
    ) ?? 0;

  const upTime = getUpTime(upTimeValue / 1000);

  return <KpiCard title={t('in-sap:dashboards.upTime')} value={upTime} raw />;
}
