/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import PackagesTable from 'in-forge/plugins/iBMCloudFunctions/Dashboard/PackagesTable';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function iBMCloudFunctionsDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.iBMCloudFunctions.labelConcurrentInvocations')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="ibm_functions_concurrent-invocations"
            formatter={number.compact}
          />
        </KpiKeyValue>
      </KpiSection>
      <PackagesTable snapshot={snapshot} timeConfig={timeConfig} />
    </div>
  );
}
