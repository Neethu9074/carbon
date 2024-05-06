/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import { bytes, percentagePlain, zeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import AppInstsTable from 'in-forge/plugins/tibcoBWAppNode/Dashboard/AppInstsTable';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function TibcoBWAppNodeDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const sensorConnectionStatus = snapshot.getIn(['data', 'sensorConnectionStatus'], 'OK');
  if (sensorConnectionStatus !== 'OK') {
    return <DashboardNotification type="info">{sensorConnectionStatus}</DashboardNotification>;
  }
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.tibcoBWAppNode.percMem')}>
          <MetricValue snapshotId={snapshotId} metric="percMem" formatter={percentagePlain.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.tibcoBWAppNode.percCPU')}>
          <MetricValue snapshotId={snapshotId} metric="percCPU" formatter={percentagePlain.detailed} />
        </KpiKeyValue>
      </KpiSection>
      <DashboardSection title={t('in-forge:plugins.tibcoBWAppNode.threads')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['threads'],
            labels: [t('in-forge:plugins.tibcoBWAppNode.threads')],
            type: 'line',
            formatter: zeroDecimalPlaces
          }}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.tibcoBWAppNode.memory')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['totMem', 'usedMem', 'freeMem'],
            labels: [
              t('in-forge:plugins.tibcoBWAppNode.total'),
              t('in-forge:plugins.tibcoBWAppNode.used'),
              t('in-forge:plugins.tibcoBWAppNode.free')
            ],
            type: 'line',
            formatter: bytes.detailedWithRaw
          }}
        />
      </DashboardSection>
      <AppInstsTable snapshot={snapshot} />
    </div>
  );
}
