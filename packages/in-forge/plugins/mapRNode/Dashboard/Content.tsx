/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import MetricValue from 'in-components/MetricValue';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number, percentagePlain } from 'in-services/formatters/number';
import { t } from 'in-i18n';

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
        <KpiKeyValue label={t('in-forge:plugins.maprNode.disks')}>
          <MetricValue snapshotId={snapshotId} metric="metrics.disk.disks" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.maprNode.cpus')}>
          <MetricValue snapshotId={snapshotId} metric="metrics.cpus" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>

      <DashboardSection title={t('in-forge:plugins.maprNode.utilization')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['metrics.disk.utilization'],
            labels: [
              t('in-forge:plugins.maprNode.utilization')
            ],
            type: 'line',
            formatter: percentagePlain.compact
          }}
        />
      </DashboardSection>
    </div>
  );
}
