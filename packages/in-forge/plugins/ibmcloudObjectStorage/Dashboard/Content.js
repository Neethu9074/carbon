/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiKeyValue, KpiSection } from 'in-sdk/components/dashboard/KpiSection';
import { number, bytes } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function ibmcloudObjectStorageDashboard({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <KpiSection>
        <KpiKeyValue label="Total Object Count">
          <MetricValue snapshotId={snapshotId} metric="object_count_total" formatter={number.compact} />
        </KpiKeyValue>
        <KpiKeyValue label="Total Used Bytes">
          <MetricValue snapshotId={snapshotId} metric="used_bytes_total" formatter={bytes.detailed} />
        </KpiKeyValue>
      </KpiSection>
    </div>
  );
}
