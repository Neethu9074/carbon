/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { zeroDecimalPlaces } from 'in-services/formatters/number';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import MetricValue from 'in-components/MetricValue';

export default function NodeSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiKeyValue label="SQL Connections">
        <MetricValue snapshotId={snapshotId} metric="sql.conns" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label="SQL Reads">
        <MetricValue snapshotId={snapshotId} metric="sql.select.count" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label="SQL Writes">
        <MetricValue snapshotId={snapshotId} metric="sql.write.count" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label="Total Ranges">
        <MetricValue snapshotId={snapshotId} metric="ranges.count" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label="Underreplicated Ranges">
        <MetricValue snapshotId={snapshotId} metric="ranges.underreplicated.total" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>

      <KpiKeyValue label="Unavailable Ranges">
        <MetricValue snapshotId={snapshotId} metric="ranges.unavailable.total" formatter={zeroDecimalPlaces} />
      </KpiKeyValue>
    </KpiSection>
  );
}
