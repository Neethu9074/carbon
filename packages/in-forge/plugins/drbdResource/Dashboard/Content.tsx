/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import ConnectionsTable from 'in-forge/plugins/drbdResource/Dashboard/ConnectionsTable';
import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DevicesTable from 'in-forge/plugins/drbdResource/Dashboard/DevicesTable';
import PeersTable from 'in-forge/plugins/drbdResource/Dashboard/PeersTable';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { yesOrNo } from 'in-services/formatters/boolean';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { SnapshotData } from 'in-stores/snapshot';
import { t } from 'in-i18n';

export default function ResourceDashboard({
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
        <KpiKeyValue label={t('in-forge:plugins.drbdResource.resourceSuspended')}>
          <MetricValue snapshotId={snapshotId} metric="resourceSuspended" formatter={yesOrNo} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.drbdResource.resourceMayPromote')}>
          <MetricValue snapshotId={snapshotId} metric="resourceMayPromote" formatter={yesOrNo} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.drbdResource.resourceForceIOFailures')}>
          <MetricValue snapshotId={snapshotId} metric="resourceForceIOFailures" formatter={yesOrNo} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.drbdResource.resourcePromotionScore')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['resourcePromotionScore'],
              labels: [t('in-forge:plugins.drbdResource.resourcePromotionScore')],
              type: 'line',
              formatter: number.compact
            }}
          />
        </DashboardSection>
      </Columize>
      <DevicesTable snapshot={snapshot} />
      <ConnectionsTable snapshot={snapshot} />
      <PeersTable snapshot={snapshot} />
    </div>
  );
}
