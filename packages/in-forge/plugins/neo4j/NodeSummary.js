/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { hitRate, number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

import isAtLeastMinorVersion from './Neo4jVersion.js';

export default function NodeSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');
  const version = snapshot.getIn(['data', 'version']);
  const hasTransactions = isAtLeastMinorVersion(version, 3, 3);

  return (
    <KpiSection>
      <KpiKeyValue label="Usage Ratio">
        <MetricValue snapshotId={snapshotId} metric="pageCache.usageRatio" formatter={hitRate.detailed} />
      </KpiKeyValue>

      <KpiKeyValue label="Hit Ratio">
        <MetricValue snapshotId={snapshotId} metric="pageCache.hitRatio" formatter={hitRate.detailed} />
      </KpiKeyValue>

      {hasTransactions && (
        <KpiKeyValue label="Last Transaction ID">
          <MetricValue snapshotId={snapshotId} metric="transactions.lastCommittedTxId" />
        </KpiKeyValue>
      )}

      {hasTransactions && (
        <KpiKeyValue label="Peak Concurrent Transactions">
          <MetricValue
            snapshotId={snapshotId}
            metric="transactions.peakConcurrentTransactions"
            formatter={number.compact}
          />
        </KpiKeyValue>
      )}
    </KpiSection>
  );
}
