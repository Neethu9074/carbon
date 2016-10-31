import React from 'react';

import {KpiSection, KpiHeading, KpiKeyValue} from 'in-sdk/components/dashboard/KpiSection';
import MetricValue from 'in-components/MetricValue';

import {
  withSiPrefixZeroDecimalPlaces
} from 'in-services/formatters/number';

export default function ClusterSummary({snapshot}) {
  const snapshotId = snapshot.get('id');
  const data = snapshot.get('data');
  return (
    <KpiSection>
      <KpiHeading>{data.get('groupId')}</KpiHeading>
      <KpiKeyValue label='Nodes'>
        <MetricValue snapshotId={snapshotId}
                     metric='nodeCount'
                     formatter={withSiPrefixZeroDecimalPlaces} />
      </KpiKeyValue>
    </KpiSection>
  );
}
