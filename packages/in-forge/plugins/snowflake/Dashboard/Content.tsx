/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

// @ts-expect-error
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import LongRunningQueries from 'in-forge/plugins/snowflake/Dashboard/LongestRunningQueries';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import WarehouseUsage from 'in-forge/plugins/snowflake/Dashboard/WarehouseUsage';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytes, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function SnowflakeDashboard({
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
        <KpiKeyValue label={t('in-forge:plugins.snowflake.dashboard.creditUsagePerHour')}>
          <MetricValue snapshotId={snapshotId} metric="credit.hourly_usage" formatter={number.detailed} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.snowflake.dashboard.totalStorageBytes')}>
          <MetricValue snapshotId={snapshotId} metric="storage.storage_bytes" formatter={bytes.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.snowflake.dashboard.averageBytesScanned')}>
          <MetricValue snapshotId={snapshotId} metric="query.bytes_scanned" formatter={bytes.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.snowflake.dashboard.totalQueries')}>
          <MetricValue snapshotId={snapshotId} metric="query.executed_count" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>
      <WarehouseUsage snapshotId={snapshotId} timeConfig={timeConfig} />
      <DashboardSection title={t('in-forge:plugins.snowflake.dashboard.storageUsage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            metrics: ['storage.total_storage_bytes', 'storage.total_stage_bytes', 'storage.total_failsafe_bytes'],
            labels: [
              t('in-forge:plugins.snowflake.dashboard.totalStorageBytes'),
              t('in-forge:plugins.snowflake.dashboard.totalStageBytes'),
              t('in-forge:plugins.snowflake.dashboard.totalFailSafeBytes')
            ],
            type: 'line',
            formatter: bytes.compact
          }}
        />
      </DashboardSection>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.snowflake.dashboard.avgByteSpilledToLocalStorage')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['storage.average_bytes_spilled_local_storage'],
              labels: [t('in-forge:plugins.snowflake.dashboard.bytesSpilled')],
              type: 'line',
              formatter: bytes.compact
            }}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.snowflake.dashboard.avgByteSpilledToRemoteStorage')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              metrics: ['storage.average_bytes_spilled_remote_storage'],
              labels: [t('in-forge:plugins.snowflake.dashboard.bytesSpilled')],
              type: 'line',
              formatter: bytes.compact
            }}
          />
        </DashboardSection>
      </Columize>
      <LongRunningQueries snapshotId={snapshotId} timeConfig={timeConfig} />
      <DashboardSection title={t('in-forge:plugins.snowflake.dashboard.loginAttempts')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['login.login_attempts.successful', 'login.login_attempts.failed'],
            labels: [
              t('in-forge:plugins.snowflake.dashboard.successful'),
              t('in-forge:plugins.snowflake.dashboard.failed')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
