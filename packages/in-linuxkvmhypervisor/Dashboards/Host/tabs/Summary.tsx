/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error needs migration
import InfraMetricKpiCard from 'in-components/KpiCard/InfraMetricKpiCard';
import { kiloBytesTwoDecimalPlaces, percentage } from 'in-services/formatters/number';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

export interface SummaryData {
  timeConfig: TimeConfig;
  data: SnapshotData;
}

export default function Summary({ data: host }: SummaryData) {
  const snapshotId = host.id;
  return (
    <>
      <KpiGridRow sizes={[4, 4, 4]}>
        <KpiCard title={t('in-linuxkvmhypervisor:dashboards.address')} value={host.address || 'N/A'} />
        <KpiCard title={t('in-linuxkvmhypervisor:dashboards.os')} value={host.os || 'N/A'} />
        <KpiCard title={t('in-linuxkvmhypervisor:dashboards.numberOfVms')} value={host.numberOfVms || 'N/A'} />
      </KpiGridRow>
      <KpiGridRow sizes={[6, 6]}>
        <InfraMetricKpiCard
          title={t('in-linuxkvmhypervisor:dashboards.usedPhysicalMemory')}
          snapshotId={snapshotId}
          metric="memoryUsage"
          formatter={kiloBytesTwoDecimalPlaces}
        />
        <InfraMetricKpiCard
          title={t('in-linuxkvmhypervisor:dashboards.cpuUsage')}
          snapshotId={snapshotId}
          metric="cpuUsage"
          formatter={percentage.compact}
        />
      </KpiGridRow>
    </>
  );
}
