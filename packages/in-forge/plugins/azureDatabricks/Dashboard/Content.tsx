/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

// @ts-expect-error Module needs to be translated to TS
import MetricValue from 'in-components/MetricValue';
import ExecutorsTable from 'in-forge/plugins/azureDatabricks/Dashboard/ExecutorsTable';
import ClustersTable from 'in-forge/plugins/azureDatabricks/Dashboard/ClustersTable';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function AzureDatabricksDashboard({ snapshot }: { snapshot: SnapshotData }) {
  const snapshotId = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.azureDatabricks.labelTriggerExecutionCount')}>
          <MetricValue snapshotId={snapshotId} metric="triggerExecutionCount" formatter={number.compact} />
        </KpiKeyValue>
      </KpiSection>

      <ClustersTable snapshot={snapshot} />
      <ExecutorsTable snapshot={snapshot} />
    </div>
  );
}
