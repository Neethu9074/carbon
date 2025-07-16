/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { kiloBytes } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';
import { number } from 'in-services/formatters/number';

export default function DiskReadWriteChart({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');
  return (
    <DashboardSection title={t('in-forge:plugins.maprNode.diskReadWrite')}>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          metrics: ['metrics.disk.diskReads', 'metrics.disk.diskWrites'],
          labels: [t('in-forge:plugins.maprNode.diskReads'), t('in-forge:plugins.maprNode.diskWrites')],
          type: 'line',
          formatter: number.compact
        }}
        y2={{
          metrics: ['metrics.disk.diskReadKB', 'metrics.disk.diskWriteKB'],
          labels: [t('in-forge:plugins.maprNode.diskReadKB'), t('in-forge:plugins.maprNode.diskWriteKB')],
          type: 'line',
          formatter: kiloBytes.detailed
        }}
      />
    </DashboardSection>
  );
}
