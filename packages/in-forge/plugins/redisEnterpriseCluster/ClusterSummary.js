/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import MetricValue from 'in-components/MetricValue';

export default function RedisClusterSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiKeyValue label="Key Hits">
        <MetricValue snapshotId={snapshotId} metric="key_hits" />
      </KpiKeyValue>
      <KpiKeyValue label="Evicted Objects">
        <MetricValue snapshotId={snapshotId} metric="evicted_objects" />
      </KpiKeyValue>
      <KpiKeyValue label="Connections">
        <MetricValue snapshotId={snapshotId} metric="conns" />
      </KpiKeyValue>
    </KpiSection>
  );
}
