import React from 'react';

import {
  zeroDecimalPlaces,
  msZeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';

import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import MetricValue from 'in-components/MetricValue';

export default function ClusterSummary({snapshot}) {
  const snapshotId = snapshot.get('id');
  const data = snapshot.get('data');
  return (
    <KpiSection>
      <KpiHeading>{data.get('groupId')}</KpiHeading>
      <KpiKeyValue label='Average Messages In'>
        <MetricValue snapshotId={snapshotId}
                     metric='broker.messagesIn'
                     formatter={zeroDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label='Rejected Traffic'>
        <MetricValue snapshotId={snapshotId}
                     metric='broker.bytesRejected'
                     formatter={bytesTwoDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label='Fetch Consumer Latency'>
        <MetricValue snapshotId={snapshotId}
                     metric='broker.totalTimeFetchConsumer'
                     formatter={msZeroDecimalPlaces} />
      </KpiKeyValue>
      <KpiKeyValue label='Fetch Follower Latency'>
        <MetricValue snapshotId={snapshotId}
                     metric='broker.totalTimeFetchFollower'
                     formatter={msZeroDecimalPlaces} />
      </KpiKeyValue>
    </KpiSection>
  );
}
