/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import { number, hitRate } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function ibmcloudLoadBalancerDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Active Connections">
          <MetricValue snapshotId={snapshotId} metric="active_connection" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Connection Rate">
          <MetricValue snapshotId={snapshotId} metric="connection_rate" formatter={hitRate.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Throughput">
          <MetricValue snapshotId={snapshotId} metric="throughput" formatter={hitRate.compact} />
        </KpiKeyValue>
      </KpiSection>
    </div>
  );
}
