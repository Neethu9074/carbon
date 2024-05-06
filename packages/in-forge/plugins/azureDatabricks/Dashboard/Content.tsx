/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import ExecutorsTable from 'in-forge/plugins/azureDatabricks/Dashboard/ExecutorsTable';
import ClustersTable from 'in-forge/plugins/azureDatabricks/Dashboard/ClustersTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { megaBytes, number } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import UnityCatalog from './UnityCatalog';
import { t } from 'in-i18n';

export default function AzureDatabricksDashboard({ snapshot }: { snapshot: SnapshotData }) {
  const snapshotId = snapshot.get('id');
  const configuredLogAnalytics = snapshot.getIn(['data', 'configuredLogAnalytics'], 'OK');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.azureDatabricks.labelTotalExecutorCount')}>
          <MetricValue snapshotId={snapshotId} metric="totalExecutorCount" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.azureDatabricks.labelTotalJobCount')}>
          <MetricValue snapshotId={snapshotId} metric="totalJobCount" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.azureDatabricks.labelTotalMemoryMb')}>
          <MetricValue snapshotId={snapshotId} metric="totalMemoryMb" formatter={megaBytes.compact} />
        </KpiKeyValue>
      </KpiSection>
      <ClustersTable snapshot={snapshot} configuredLogAnalytics={configuredLogAnalytics} />
      <ExecutorsTable snapshot={snapshot} configuredLogAnalytics={configuredLogAnalytics} />
      <UnityCatalog snapshot={snapshot} configuredLogAnalytics={configuredLogAnalytics} />
    </div>
  );
}
