/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import {
  percentagePlainZeroDecimalPlaces,
  timeByMillisTwoDecimalPlaces,
  zeroDecimalPlaces
} from 'in-services/formatters/number';
// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AzureKeyVault({ snapshot, timeConfig }: { snapshot: SnapshotData; timeConfig: TimeConfig }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.azureKeyVault.kpi.labelAvailability')}>
          <MetricValue snapshotId={snapshotId} metric="availability" formatter={percentagePlainZeroDecimalPlaces} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.azureKeyVault.kpi.labelServiceApiLatency')}>
          <MetricValue snapshotId={snapshotId} metric="serviceApiLatency" formatter={timeByMillisTwoDecimalPlaces} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureKeyVault.dashboard.labelAvailability')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainZeroDecimalPlaces,
              metrics: ['availability'],
              labels: [t('in-forge:plugins.azureKeyVault.dashboard.labelAvailability')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.azureKeyVault.dashboard.labelSaturationShoeBox')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: percentagePlainZeroDecimalPlaces,
              metrics: ['saturationShoebox'],
              labels: [t('in-forge:plugins.azureKeyVault.dashboard.labelSaturationShoeBox')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.azureKeyVault.dashboard.labelServiceAPI')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              metrics: ['serviceApiHit', 'serviceApiResult'],
              labels: [
                t('in-forge:plugins.azureKeyVault.dashboard.labelHit'),
                t('in-forge:plugins.azureKeyVault.dashboard.labelResult')
              ],
              type: 'line',
              min: 0
            }}
            y2={{
              formatter: timeByMillisTwoDecimalPlaces,
              metrics: ['serviceApiLatency'],
              labels: [t('in-forge:plugins.azureKeyVault.dashboard.labelLatency')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
    </div>
  );
}
