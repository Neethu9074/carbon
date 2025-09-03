/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import DiskReadWriteOperationsChart from 'in-forge/plugins/mapRNode/Dashboard/Charts/DiskReadWriteOperationsChart';
import DiskReadWriteThroughputChart from 'in-forge/plugins/mapRNode/Dashboard/Charts/DiskReadWriteThroughputChart';
import CPUUtilizationChart from 'in-forge/plugins/mapRNode/Dashboard/Charts/CPUUtilizationChart';
import Notification from 'in-forge/plugins/mapRNode/Dashboard/Notification/Notification';
import DiskUsageChart from 'in-forge/plugins/mapRNode/Dashboard/Charts/DiskUsageChart';
import DiskListTable from 'in-forge/plugins/mapRNode/Dashboard/Tables/DiskListTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

export default function MapRNodeDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  return (
    <div>
      <Notification snapshot={snapshot} />
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.maprNode.mapRFSDisks')}>
          {getDataFromSnapshotData(snapshot, 'mapRFSDisks')}
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.maprNode.failedDisks')}>
          {getDataFromSnapshotData(snapshot, 'failedDisks')}
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.maprNode.disks')}>
          {getDataFromSnapshotData(snapshot, 'disks')}
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.maprNode.cpus')}>
          {getDataFromSnapshotData(snapshot, 'cpus')}
        </KpiKeyValue>
      </KpiSection>

      <CPUUtilizationChart snapshot={snapshot} timeConfig={timeConfig} />
      <DashboardSection title={t('in-forge:plugins.maprNode.diskDetails')}>
        <Columize>
          <DiskUsageChart snapshot={snapshot} timeConfig={timeConfig} />
          <DiskReadWriteOperationsChart snapshot={snapshot} timeConfig={timeConfig} />
          <DiskReadWriteThroughputChart snapshot={snapshot} timeConfig={timeConfig} />
        </Columize>
        <DiskListTable snapshot={snapshot} timeConfig={timeConfig} />
      </DashboardSection>
    </div>
  );
}

function getDataFromSnapshotData(snapshot: SnapshotData, key: String) {
  const data = snapshot.get('data');
  var value = data.get(key);
  return String(value);
}
