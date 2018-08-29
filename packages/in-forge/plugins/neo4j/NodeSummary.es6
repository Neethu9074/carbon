import React from 'react';

import { KpiSection, KpiHeading, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { percentage, number } from 'in-services/formatters/number';
import MetricValue from 'in-components/MetricValue';

export default function NodeSummary({ snapshot }) {
  const snapshotId = snapshot.get('id');

  return (
    <KpiSection>
      <KpiHeading>{snapshot.getIn(['label'])}</KpiHeading>

      <KpiKeyValue label="Usage Ratio">
        <MetricValue snapshotId={snapshotId} metric="pageCache.usageRatio" formatter={percentage.detailed} />
      </KpiKeyValue>

      <KpiKeyValue label="Hit Ratio">
        <MetricValue snapshotId={snapshotId} metric="pageCache.hitRatio" formatter={percentage.detailed} />
      </KpiKeyValue>

      <KpiKeyValue label="Last Transaction ID">
        <MetricValue snapshotId={snapshotId} metric="transactions.lastCommittedTxId" formatter={number.compact} />
      </KpiKeyValue>

      <KpiKeyValue label="Peak Concurrent Transactions">
        <MetricValue
          snapshotId={snapshotId}
          metric="transactions.peakConcurrentTransactions"
          formatter={number.compact}
        />
      </KpiKeyValue>
    </KpiSection>
  );
}
