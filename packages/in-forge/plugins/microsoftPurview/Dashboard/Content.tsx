/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection/KpiSection';
import { bytesZeroDecimalPlaces, number, seconds } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function AzurePuviewDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId = snapshot.get('id');
  return (
    <>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.microsoftPurview.kpi.dataMapCapacityUnits')}>
          <MetricValue snapshotId={snapshotId} metric="dataMapCapacityUnits" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.microsoftPurview.kpi.scansFailed')}>
          <MetricValue snapshotId={snapshotId} metric="scanFailed" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.microsoftPurview.dashboard.labelDataMapCapacityUnits')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: number.compact,
              metrics: ['dataMapCapacityUnits'],
              labels: [t('in-forge:plugins.microsoftPurview.dashboard.labelDataMapUnits')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.microsoftPurview.dashboard.labelDataMapStorageSize')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              formatter: bytesZeroDecimalPlaces,
              metrics: ['dataMapStorageSize'],
              labels: [t('in-forge:plugins.microsoftPurview.dashboard.labelDataMapSize')],
              type: 'line',
              min: 0
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.microsoftPurview.labelScans')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: ['scanCompleted', 'scanFailed', 'scanCancelled'],
            labels: [
              t('in-forge:plugins.microsoftPurview.dashboard.labelScanCompleted'),
              t('in-forge:plugins.microsoftPurview.dashboard.labelScanFailed'),
              t('in-forge:plugins.microsoftPurview.dashboard.labelScanCancelled')
            ],
            type: 'line',
            min: 0
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.microsoftPurview.dashboard.labelScanTimeTaken')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            formatter: seconds.fixedCompact,
            metrics: ['scanTimeTaken'],
            labels: [t('in-forge:plugins.microsoftPurview.dashboard.labelScanTime')],
            type: 'line',
            min: 0
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </>
  );
}
