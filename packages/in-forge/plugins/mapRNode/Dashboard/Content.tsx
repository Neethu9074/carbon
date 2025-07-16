/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import MetricValue from 'in-components/MetricValue';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';

import CPUUtilizationChart from 'in-forge/plugins/mapRNode/Dashboard/Charts/CPUUtilizationChart';
import DiskUsageChart from 'in-forge/plugins/mapRNode/Dashboard/Charts/DiskUsageChart';
import DiskReadWriteChart from 'in-forge/plugins/mapRNode/Dashboard/Charts/DiskReadWriteChart';
import DiskListTable from 'in-forge/plugins/mapRNode/Dashboard/Tables/DiskListTable';

export default function MapRNodeDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.maprNode.mapRFSDisks')}>
          <MetricValue snapshotId={snapshotId} metric="metrics.disk.mapRFSDisks" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.maprNode.failedDisks')}>
          <MetricValue snapshotId={snapshotId} metric="metrics.disk.failedDisks" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.maprNode.disks')}>
          <MetricValue snapshotId={snapshotId} metric="metrics.disk.disks" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.maprNode.cpus')}>
          <MetricValue snapshotId={snapshotId} metric="metrics.cpus" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>

      <CPUUtilizationChart snapshot={snapshot} timeConfig={timeConfig} />
      <DashboardSection title={t('in-forge:plugins.maprNode.diskDetails')}>
        <Columize>
          <DiskUsageChart snapshot={snapshot} timeConfig={timeConfig} />
          <DiskReadWriteChart snapshot={snapshot} timeConfig={timeConfig} />
        </Columize>
        <DiskListTable snapshot={snapshot} timeConfig={timeConfig} />
      </DashboardSection>
    </div>
  );
}
