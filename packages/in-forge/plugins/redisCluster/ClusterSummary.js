/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { hitRateZeroDecimalPlaces, number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function RedisClusterSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');
  return (
    <KpiSection>
      <KpiKeyValue label="Throughput">
        <MetricValue snapshotId={snapshotId} metric="throughput" formatter={number.compact} />
      </KpiKeyValue>
      <KpiKeyValue label="Hit Rate">
        <MetricValue snapshotId={snapshotId} metric="hit_rate" formatter={hitRateZeroDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label="Keys Evicted">
        <MetricValue snapshotId={snapshotId} metric="evicted_keys" />
      </KpiKeyValue>
      <KpiKeyValue label="Connections">
        <MetricValue snapshotId={snapshotId} metric="connected_clients" />
      </KpiKeyValue>
    </KpiSection>
  );
}
