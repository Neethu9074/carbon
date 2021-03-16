/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PackagesTable from 'in-forge/plugins/ibmcloudFunctions/Dashboard/PackagesTable';
import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import { number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function ibmcloudFunctionsDashboard({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Concurrent Invocations">
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
