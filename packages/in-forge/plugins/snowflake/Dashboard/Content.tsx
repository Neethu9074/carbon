/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import WarehouseUsage from 'in-forge/plugins/snowflake/Dashboard/WarehouseUsage';
import { bytes, number } from 'in-services/formatters/number';
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
    </div>
  );
}
